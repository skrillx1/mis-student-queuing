import { pool } from "../../utils/db";

export default defineEventHandler(async () => {
  try {
    const result = await pool.query(
      `SELECT id, code, name, description, created_by, created_at, updated_at 
       FROM stations 
       ORDER BY id DESC`,
    );
    return result.rows;
  } catch (error: any) {
    throw createError({
      statusCode: 500,
      statusMessage: error.message || "Failed to fetch stations",
    });
  }
});
