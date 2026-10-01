import { Pool } from "pg";

// Write database (csuccmisqueuing)
export const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: parseInt(process.env.DB_PORT || "5432"),
});

// Read-only database (enrolment)
export const enrolmentPool = new Pool({
  user: process.env.READ_DB_USER,
  host: process.env.READ_DB_HOST,
  database: process.env.READ_DB_NAME,
  password: process.env.READ_DB_PASSWORD,
  port: parseInt(process.env.READ_DB_PORT || "5432"),
});

/**
 * Formats name parts into "Firstname Middlename Lastname Extname"
 */
export function formatFullname(student: {
  firstname?: string | null;
  middlename?: string | null;
  lastname?: string | null;
  extname?: string | null;
}): string {
  return [
    student.firstname,
    student.middlename,
    student.lastname,
    student.extname,
  ]
    .filter((part) => part && part.trim() !== "")
    .join(" ")
    .replace(/\s+/g, " ")
    .trim();
}
