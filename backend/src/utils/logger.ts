import winston from "winston";
import "winston-daily-rotate-file";

const { combine, timestamp, printf } = winston.format;

const customJsonFormat = printf(({ level, message, timestamp }) => {
  return JSON.stringify({
    timestamp,
    severity: level.toUpperCase(),
    message,
    service: "app-express-service",
  });
});

const devFormat = printf(({ message, timestamp, level }) => {
  return `${timestamp} [${level.toUpperCase()}] => ${typeof message === "string" ? message : JSON.stringify(message)}`;
});

// Create the base logger configuration
const logger = winston.createLogger({
  level: process.env.NODE_ENV === "production" ? "info" : "debug",
  transports: [
    new winston.transports.Console({
      format:
        process.env.NODE_ENV === "production"
          ? combine(timestamp({ format: "YYYY-MM-DDTHH:mm:ss:ms" }), customJsonFormat)
          : combine(timestamp({ format: "YYYY-MM-DDTHH:mm:ss:ms" }), devFormat),
    }),
  ],
  exitOnError: false, // Do not exit the application in case of an error
});

// HTTP Logger for capturing HTTP request logs using Morgan
const httpLogger = winston.createLogger({
  level: "http",
  transports: [
    new winston.transports.Console({
      format:
        process.env.NODE_ENV === "production"
          ? combine(timestamp({ format: "YYYY-MM-DDTHH:mm:ss:ms" }), customJsonFormat)
          : combine(timestamp({ format: "YYYY-MM-DDTHH:mm:ss:ms" }), devFormat),
    }),
  ],
});

// Optional: Daily Rotate File for production with JSON format (disabled by default)
if (process.env.NODE_ENV === "production" && process.env.ENABLE_FILE_LOGGING === "true") {
  const dailyRotateFileTransport = new winston.transports.DailyRotateFile({
    filename: "logs/app-%DATE%.log", // Log file pattern
    datePattern: "YYYY-MM-DD",
    zippedArchive: true, // Compress log files
    maxSize: "20m", // Maximum size of log file before rotation
    maxFiles: "30d", // Retain logs for 30 days
    level: "info",
    format: combine(timestamp({ format: "YYYY-MM-DDTHH:mm:ss:ms" }), customJsonFormat),
  });

  logger.add(dailyRotateFileTransport);
}

// Export the main logger and HTTP logger for use in other modules
export { httpLogger };
export default logger;
