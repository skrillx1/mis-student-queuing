import { pool } from "../../utils/db";

export default defineEventHandler(async () => {
  try {
    const result = await pool.query(
      `SELECT s.id, s.code, s.name, s.description, s.created_by, s.created_at,
          s.updated_at, u.full_name AS assigned_user_name
       FROM stations s
       LEFT JOIN users u ON u.id = s.created_by
      ORDER BY s.id DESC`,
    );
    return result.rows;
  } catch (error: any) {
    throw createError({
      statusCode: 500,
      statusMessage: error.message || "Failed to fetch stations",
    });
  }
});
