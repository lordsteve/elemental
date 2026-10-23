import path from 'path';
import "reflect-metadata";
import { DataSource } from "typeorm";

if (!process.env.DB_HOST) require("dotenv").config();

/**
 * The database is optional: without DB_HOST the server still runs, and
 * features that need it (like logging in) answer 503 instead.
 */
export const isDatabaseConfigured = !!process.env.DB_HOST;

export const AppDataSource = new DataSource({
    type: "mysql",
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT ?? "3306"),
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    // Schema changes go through migrations (npm run migration:generate)
    synchronize: false,
    logging: false,
    entities: [path.join(__dirname, '..', '..', 'services', 'database', 'entity', '*.{js,ts}')],
    migrations: [path.join(__dirname, '..', '..', 'services', 'database', 'migration', '*.{js,ts}')],
    subscribers: [],
})
