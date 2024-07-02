import pg from "pg";
import dotenv from "dotenv";
dotenv.config();
const { Pool } = pg;

const config = {
  connectionString: process.env.DATABASE_URL,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
};

export const pool = new Pool(config);
