import knex, { Knex } from "knex";
import logger from "../utils/logger";

const knexInstances: Map<string, Knex> = new Map();

const getKnexConfig = (): Knex.Config => {
  const env = process.env.NODE_ENV || "development";
  const connectionString = process.env.DATABASE_URL;
  const config: Knex.Config = {
    client: "pg",
    connection: connectionString,
    pool: {
      min: env === "development" ? 0 : 1,
      max: env === "development" ? 3 : 8,
      acquireTimeoutMillis: 30000, // How long to wait for a connection before timing out
      idleTimeoutMillis: 30000, // How long a connection can be idle before being released (must be less than pg bouncer idle timeout if used)
      reapIntervalMillis: 1000, // How often to check for idle connections
    },
    migrations: {
      tableName: "knex_migrations"
    },
  };

  return config;
};

export const getKnexInstance = (): Knex => {
  const env = process.env.NODE_ENV || "development";
  const key = `knex:${env}`;

  if (!knexInstances.has(key)) {
    logger.info(`Creating new Knex instance for key: ${key}`);

    const config = getKnexConfig();
    const instance = knex(config);
    knexInstances.set(key, instance);
  }

  return knexInstances.get(key)!;
};

/**
 * Optional: Function to gracefully shut down all Knex instances.
 * Call this during application shutdown if possible.
 */
export const destroyAllKnexInstances = async (): Promise<void> => {
  logger.info("Destroying all Knex instances...");

  const destroyPromises: Promise<void>[] = [];

  knexInstances.forEach((instance, key) => {
    logger.info(`Destroying Knex instance for key: ${key}`);

    destroyPromises.push(instance.destroy());
  });

  await Promise.all(destroyPromises);

  knexInstances.clear();

  logger.info("All Knex instances destroyed.");
};


export const knexInstance = getKnexInstance();