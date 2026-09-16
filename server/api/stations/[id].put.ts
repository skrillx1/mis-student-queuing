import { pool } from "../../utils/db";

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, "id");
  const body = await readBody(event);
  const { code, name, description } = body;

  if (!id || !code || !name) {
    throw createError({
      statusCode: 400,
      statusMessage: "Station ID, code, and name are required.",
    });
  }

  try {
    const query = `
      UPDATE stations
      SET code = $1, name = $2, description = $3, updated_at = CURRENT_TIMESTAMP
      WHERE id = $4
      RETURNING id, code, name, description, created_by, created_at, updated_at
    `;
    const values = [
      code.trim(),
      name.trim(),
      description ? description.trim() : null,
      id,
    ];

    const result = await pool.query(query, values);

    if (result.rowCount === 0) {
      throw createError({
        statusCode: 404,
        statusMessage: "Station not found.",
      });
    }

    return result.rows[0];
  } catch (error: any) {
    if (error.code === "23505") {
      throw createError({
        statusCode: 409,
        statusMessage: "Station code already exists.",
      });
    }
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.message || "Failed to update station",
    });
  }
});
