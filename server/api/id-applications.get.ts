import { pool } from "../utils/db";

export default defineEventHandler(async () => {
  try {
    const result = await pool.query(
      `SELECT 
        id, 
        fullname,
        studid, 
        course, 
        contact_name, 
        contact_number, 
        contact_address, 
        created_at, 
        id_picture_filename,
        status
      FROM public.id_applications
      ORDER BY created_at DESC`,
    );

    return {
      success: true,
      applications: result.rows,
    };
  } catch (err) {
    console.error("Failed to fetch ID applications:", err);
    throw createError({
      statusCode: 500,
      statusMessage: "Database query failed.",
    });
  }
});
