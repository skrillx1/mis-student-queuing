import { Pool } from "pg";

export const readPool = new Pool({
  user: process.env.READ_DB_USER,
  host: process.env.READ_DB_HOST,
  database: process.env.READ_DB_NAME,
  password: process.env.READ_DB_PASSWORD,
  port: parseInt(process.env.READ_DB_PORT || "5432"),
});
