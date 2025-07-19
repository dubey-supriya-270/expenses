// utils/redisClient.ts
import { createClient, RedisClientType } from "redis";
import { Result } from "../interfaces/result";
import logger from "./logger";

const CACHE_URL = process.env.CACHE_URL!;
const CACHE_TTL_SECONDS = Number(process.env.CACHE_TTL_SECONDS) || 3600;

let redisClient: RedisClientType | null = null;

/**
 * Connects to the Redis server.
 * Throws an error if the connection fails.
 */
const connectRedis = async () => {
  try {
    logger.info("Connecting to Redis client");

    // For development (with URL and password)
    redisClient = createClient({
      url: CACHE_URL,
      socket: {
        connectTimeout: 30000,
        reconnectStrategy: 10000,
      },
    });

    // Handle Redis client errors
    redisClient.on("error", (err) => {
      logger.error("Redis Client Error", err);
    });

    // Connect to Redis
    await redisClient.connect();

    // Ping Redis to verify the connection
    const pingResult = await redisClient.ping();
    logger.info(`Connected to Redis client with ping result => ${pingResult}`);
  } catch (err) {
    logger.error("Could not connect to Redis", err);
    throw err; // Propagate the error to handle it during server startup
  }
};

const disconnectRedis = async () => {
  try {
    if (redisClient && redisClient.isOpen) {
      await redisClient.disconnect();
      logger.info("Disconnected from Redis successfully.");
    } else {
      logger.info("Redis client is not open or already disconnected.");
    }
  } catch (error) {
    logger.error("Error disconnecting Redis:", error);
  }
};

/**
 * Sets a value in the Redis cache.
 */
const setToCache = async (
  key: string,
  data: string,
  ttl: {
    is_ttl_set: boolean;
    seconds?: number;
  } = {
    is_ttl_set: true,
    seconds: CACHE_TTL_SECONDS,
  },
): Promise<Result<string>> => {
  try {
    if (!redisClient) throw new Error("Redis client not initialized");

    if (!ttl.is_ttl_set) {
      await redisClient.set(key, data);
    } else {
      await redisClient.set(key, data, {
        EX: ttl.seconds,
      });
    }

    return Result.ok("Key stored successfully!");
  } catch (err: any) {
    logger.error("Failed to set key to cache", err);
    return Result.error(err.message);
  }
};

/**
 * Retrieves a value from the Redis cache.
 */
const getFromCache = async (key: string): Promise<Result<string>> => {
  try {
    if (!redisClient) throw new Error("Redis client not initialized");

    const data = await redisClient.get(key);

    if (data == null) {
      return Result.error("Cache miss");
    } else {
      return Result.ok(data);
    }
  } catch (err: any) {
    logger.error("Failed to get key from cache", err);
    return Result.error(err.message);
  }
};

/**
 * Removes a value from the Redis cache.
 */
const removeFromCache = async (key: string): Promise<Result<string>> => {
  try {
    if (!redisClient) throw new Error("Redis client not initialized");

    await redisClient.del(key);

    return Result.ok("Cache removed successfully!");
  } catch (error: any) {
    logger.error("Failed to remove key from cache", error);

    return Result.error(error.message ?? "Unknown error");
  }
};

/**
 * Utility function to remove multiple keys based on a pattern.
 */
const removeKeysByPattern = async (pattern: string) => {
  try {
    if (!redisClient) throw new Error("Redis client not initialized");

    const keys = await redisClient.keys(pattern);
    if (keys.length > 0) {
      await redisClient.del(keys);
    }
  } catch (err: any) {
    logger.error("Failed to remove keys by pattern", err);

    return Result.error(err.message ?? "Unknown error");
  }
};

/**
 * Getter to access the Redis client safely.
 */
const getRedisClient = async (): Promise<RedisClientType> => {
  if (!redisClient) {
    await connectRedis();
  }

  return redisClient!;
};

export {
  connectRedis,
  disconnectRedis,
  getFromCache,
  getRedisClient,
  removeFromCache,
  removeKeysByPattern,
  setToCache,
};
