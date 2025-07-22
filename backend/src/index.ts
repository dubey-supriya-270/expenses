
import 'dotenv/config'      // uses .env.local automatically

// import './config/instrumentation'; 
import cors from "cors";
import express, { Request, Response } from "express";
import helmet from "helmet";

import { createHttpTerminator } from "http-terminator";
import morgan from "morgan";

import STATUS from "./constants/status-code";
import { destroyAllKnexInstances } from "./db/db";
import error from "./middlewares/error";
import healthcheck from "./routes/healthcheck";
import logger, { httpLogger } from "./utils/logger";
import { connectRedis, disconnectRedis } from "./utils/redis";

import user from "./routes/user";
import expense from "./routes/expense";
import cookieParser from 'cookie-parser';
import "./scripts/createAdmin"

declare module "express" {
  interface Request {
    user?: any;
    userId?: number
  }
}


// Create an instance of express
const app = express();

app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  credentials: true,
}));
app.use(cookieParser());
// Define the shutdown flag in a scope accessible by middleware and shutdown handler
let isShuttingDown = false;

// Block all unwanted headers using helmet
app.use(helmet());
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: false }));

app.set("trust proxy", true);

// Disable x-powered-by header separately
app.disable("x-powered-by");

app.disable("etag"); // Disables caching

morgan.token("remote-addr", (req: Request) => {
  return req.header("X-Real-IP") ?? req.ip;
});

app.use(
  morgan("common", {
    stream: {
      write: (message) => httpLogger.http(message.trim()),
    },
    // Add this skip function
    skip: function (req: Request, res: Response): boolean {
      // Check if the request path starts with /healthcheck
      // Using startsWith is slightly more robust than === if there are potential variations like /healthcheck?param=...
      return req.originalUrl?.includes("/healt  hcheck") || false;
    },
  }),
);

app.use("/healthcheck", (_req, res, next) => {
  if (isShuttingDown) {
    // If shutting down, return 503 immediately
    logger.warn("Health check called during shutdown. Responding 503.");

    res.status(503).json({
      // Standard code for Service Unavailable
      status: STATUS.SERVICE_UNAVAILABLE,
      success: false, // Explicitly indicate not operational
      message: "Server is shutting down.",
    });

    // End response here, don't call next()
  } else {
    // If not shutting down, pass control to the actual health check router

    next();
  }
});

app.use("/healthcheck", healthcheck);

app.use("/api/user", user);
app.use("/api/expense", expense);

// Express error middleware
app.use(error);

// If the environment is test, do not start the express server
if (process.env.NODE_ENV !== "test") {
  (async () => {
    let httpTerminator: ReturnType<typeof createHttpTerminator> | null = null;
    let server: import("http").Server | null = null;

    try {
      // --- Startup ---
      logger.info("Starting application...");

      await connectRedis();

      logger.info("Redis connected during startup.");

      // --- Start Server ---
      server = app.listen(parseInt(process.env.PORT!.toString()), "0.0.0.0", () => {
        logger.info(`Server is listening on port ${process.env.PORT}`);
      });

      httpTerminator = createHttpTerminator({ server });

      server.on("error", (err: any) => {
        logger.error(`Failed to start server: ${JSON.stringify(err)}`);

        // Attempt cleanup even on startup error before exiting
        Promise.allSettled([disconnectRedis(), destroyAllKnexInstances()]).then(() => {
          process.exit(1);
        });
      });

      // --- Graceful Shutdown Logic ---
      const gracefulShutdown = async (signal: string) => {
        if (isShuttingDown) {
          logger.warn("Shutdown already in progress. Ignoring signal.");
          return;
        }

        logger.info(`Received ${signal}. Starting graceful shutdown...`);
        isShuttingDown = true; // Set flag for healthcheck

        const shutdownTimeout = setTimeout(() => {
          logger.error("Graceful shutdown timed out after 30 seconds. Forcing exit.");

          process.exit(1); // Force exit after timeout
        }, 30000); // 30-second timeout

        // 1.Stop accepting new connections and wait for existing ones
        if (httpTerminator) {
          try {
            await httpTerminator.terminate();

            logger.info("Server connections closed gracefully (http-terminator).");
          } catch (error) {
            logger.error("Error during http-terminator shutdown:", error);
            // Continue cleanup even if termination has issues, but log it.
          }
        } else {
          logger.warn("HttpTerminator not available. Cannot guarantee connection termination.");

          // Fallback: close the server directly if httpTerminator failed to init
          if (server) {
            server.close((err) => {
              if (err) logger.error("Error closing server directly:", err);
              else logger.info("Server closed directly (fallback).");
            });
          }
        }

        // 2.Perform Cleanup (Redis, Knex, pg-promise)
        logger.info("Starting resource cleanup...");

        try {
          await disconnectRedis(); // disconnectRedis handles check if client exists/is open

          await destroyAllKnexInstances(); // Calls instance.destroy() on all in map

          logger.info("pg-promise connections shut down.");
        } catch (cleanupError) {
          logger.error("Error during resource cleanup:", cleanupError);

          // Exit with error code if cleanup fails critically
          clearTimeout(shutdownTimeout); // Clear timeout before exiting

          process.exit(1);
        }

        // 3. Exit Cleanly
        clearTimeout(shutdownTimeout); // Important: clear timeout on successful shutdown
        logger.info("Graceful shutdown complete. Exiting.");
        process.exit(0);
      };

      // --- Register Signal Handlers ---
      process.on("SIGINT", () => gracefulShutdown("SIGINT"));
      process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));

      // --- Unhandled Error Handlers (Last Resort) ---
      process.on("uncaughtException", (err, origin) => {
        logger.error(`Uncaught Exception. Origin: ${origin}`, err);

        // Optionally attempt minimal cleanup before forced exit
        process.exit(1); // Exit immediately - state is unknown
      });

      process.on("unhandledRejection", (reason, promise) => {
        logger.error("Unhandled Rejection at:", promise, "reason:", reason);

        process.exit(1); // Exit immediately - state is unknown
      });
    } catch (startupError) {
      logger.error(`Fatal startup error. Server not started. Error: ${startupError}`);

      // Attempt cleanup even on startup failure
      try {
        logger.info("Attempting cleanup after startup failure...");

        await disconnectRedis();
        await destroyAllKnexInstances();

        logger.info("Cleanup attempt finished after startup failure.");
      } catch (cleanupError) {
        logger.error("Error during cleanup after startup failure:", cleanupError);
      } finally {
        process.exit(1); // Exit with failure code
      }
    }
  })();
}

export default app;
