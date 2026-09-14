import { pool } from "../../utils/db";

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, "id");
  const body = await readBody(event);
  const { name, description } = body;

  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: "Station ID is required.",
    });
  }

  if (!name) {
    throw createError({
      statusCode: 400,
      statusMessage: "Station name cannot be empty.",
    });
  }

  try {
    const query = `
      UPDATE stations
      SET name = $1, description = $2, updated_at = CURRENT_TIMESTAMP
      WHERE id = $3
      RETURNING id, name, description, created_by, created_at, updated_at
    `;
    const values = [name.trim(), description ? description.trim() : null, id];

    const result = await pool.query(query, values);

    if (result.rowCount === 0) {
      throw createError({
        statusCode: 404,
        statusMessage: "Station not found.",
      });
    }

    return result.rows[0];
  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.message || "Failed to update station",
    });
  }
});
