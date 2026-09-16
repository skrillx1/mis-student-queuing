import { pool } from "../../utils/db";

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const { code, name, description, created_by } = body;

  if (!code || !name || !created_by) {
    throw createError({
      statusCode: 400,
      statusMessage: "Station code, name, and created_by are required.",
    });
  }

  try {
    const query = `
      INSERT INTO stations (code, name, description, created_by)
      VALUES ($1, $2, $3, $4)
      RETURNING id, code, name, description, created_by, created_at, updated_at
    `;
    const values = [
      code.trim(),
      name.trim(),
      description ? description.trim() : null,
      created_by,
    ];

    const result = await pool.query(query, values);
    return result.rows[0];
  } catch (error: any) {
    if (error.code === "23505") {
      throw createError({
        statusCode: 409,
        statusMessage: "Station code already exists.",
      });
    }
    throw createError({
      statusCode: 500,
      statusMessage: error.message || "Failed to create station",
    });
  }
});
