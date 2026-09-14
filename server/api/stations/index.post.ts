import { pool } from "../../utils/db";

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const { name, description, created_by } = body;

  if (!name || !created_by) {
    throw createError({
      statusCode: 400,
      statusMessage: "Station name and created_by user ID are required.",
    });
  }

  try {
    const query = `
      INSERT INTO stations (name, description, created_by)
      VALUES ($1, $2, $3)
      RETURNING id, name, description, created_by, created_at, updated_at
    `;
    const values = [
      name.trim(),
      description ? description.trim() : null,
      created_by,
    ];

    const result = await pool.query(query, values);
    return result.rows[0];
  } catch (error: any) {
    throw createError({
      statusCode: 500,
      statusMessage: error.message || "Failed to create station",
    });
  }
});
