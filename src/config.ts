import { MigrationConfig } from "drizzle-orm/migrator";

type config = {
  api: APIConfig;
  db: DBconfig;
}
type APIConfig = {
  fileServerHits: number;
  port: number
};

type DBconfig = {
  url: string;
  migrationConfig: MigrationConfig;
}

process.loadEnvFile();

function envOrThrow(key: string) {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Environment variable ${key} is not set`);
  }
  return value;
}

const migrationConfig: MigrationConfig = {
  migrationsFolder: "./src/db/migration"
}

export const config: config = {
  api: {
    fileServerHits: 0,
    port: Number(envOrThrow("PORT"))
  },
  db: {
    url: envOrThrow("DB_URL"),
    migrationConfig: migrationConfig,
  }
};

