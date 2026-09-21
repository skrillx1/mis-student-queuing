import { pool } from "../../utils/db";

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, "id");
  const body = await readBody(event);
  const { code, description, assigned_user_id } = body;

  if (!id || !code || !assigned_user_id) {
    throw createError({
      statusCode: 400,
      statusMessage: "Station ID, code, and assigned user are required.",
    });
  }

  try {
    const assignedUser = await pool.query(
      "SELECT id, full_name FROM users WHERE id = $1 AND is_active = TRUE",
      [assigned_user_id],
    );
    if (assignedUser.rowCount === 0) {
      throw createError({
        statusCode: 400,
        statusMessage: "Assigned user was not found or is inactive.",
      });
    }

    const fullName = assignedUser.rows[0].full_name?.trim() || "";
    const lastName = fullName.split(/\s+/).at(-1)?.toUpperCase();
    if (!lastName) {
      throw createError({
        statusCode: 400,
        statusMessage: "Assigned user must have a full name.",
      });
    }

    const query = `
      UPDATE stations
      SET code = $1, name = $2, description = $3, created_by = $4,
          updated_at = CURRENT_TIMESTAMP
      WHERE id = $5
      RETURNING id, code, name, description, created_by, created_at, updated_at
    `;
    const values = [
      code.trim(),
      `MR. ${lastName}`,
      description ? description.trim() : null,
      assigned_user_id,
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
