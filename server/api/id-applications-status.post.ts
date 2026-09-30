import { pool } from "../utils/db";

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);

    if (!body || !Array.isArray(body.ids) || body.ids.length === 0) {
      throw createError({
        statusCode: 400,
        statusMessage: "Invalid payload: 'ids' must be a non-empty array.",
      });
    }

    // Sanitize and extract positive integer IDs
    const ids = body.ids
      .map((id: unknown) => Number(id))
      .filter((id: number) => !isNaN(id) && Number.isInteger(id) && id > 0);

    if (ids.length === 0) {
      throw createError({
        statusCode: 400,
        statusMessage: "No valid application IDs provided.",
      });
    }

    // Parameterized PostgreSQL update for selected Pending Export records
    const query = `
      UPDATE public.id_applications
      SET status = 'Exported'
      WHERE id = ANY($1::int[])
        AND status = 'Pending Export'
      RETURNING id;
    `;

    const result = await pool.query(query, [ids]);
    const updatedIds = result.rows.map((row: { id: number }) => row.id);

    return {
      success: true,
      updatedIds,
      updatedCount: updatedIds.length,
    };
  } catch (err: any) {
    console.error("Failed to update ID applications status:", err);
    if (err.statusCode) {
      throw err;
    }
    throw createError({
      statusCode: 500,
      statusMessage: "Database update failed.",
    });
  }
});
