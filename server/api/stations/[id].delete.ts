import { pool } from "../../utils/db";

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, "id");

  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: "Station ID is required.",
    });
  }

  try {
    const query = `DELETE FROM stations WHERE id = $1 RETURNING id`;
    const result = await pool.query(query, [id]);

    if (result.rowCount === 0) {
      throw createError({
        statusCode: 404,
        statusMessage: "Station not found.",
      });
    }

    return { success: true, id };
  } catch (error: any) {
    // Foreign key constraint violation check
    if (error.code === "23503") {
      throw createError({
        statusCode: 409,
        statusMessage:
          "Cannot delete station because it is referenced elsewhere in the system.",
      });
    }

    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.message || "Failed to delete station",
    });
  }
});
