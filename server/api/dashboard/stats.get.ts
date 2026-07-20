import { pool } from "../../utils/db";

export default defineEventHandler(async () => {
  const categories = [
    "ID Processing",
    "Re-ID",
    "Account Problem",
    "Clearance Signing",
    "Inquiry",
  ];

  try {
    // Counts serving, waiting, and done tickets in a single database query
    const categoryStatsQuery = `
      SELECT 
        servicetype,
        COUNT(CASE WHEN status = 'done' THEN 1 END) AS done_count,
        COUNT(CASE WHEN status IN ('serving', 'called', 'in_progress') THEN 1 END) AS serving_count,
        COUNT(CASE WHEN status IN ('waiting', 'pending') THEN 1 END) AS waiting_count
      FROM queue_tickets
      WHERE servicetype = ANY($1)
      GROUP BY servicetype;
    `;

    const result = await pool.query(categoryStatsQuery, [categories]);

    // Map over categories and assign values for done, serving, and waiting
    const categoryData = categories.map((cat) => {
      const row = result.rows.find((r) => r.servicetype === cat);
      return {
        servicetype: cat,
        done: parseInt(row?.done_count || "0", 10),
        serving: parseInt(row?.serving_count || "0", 10),
        waiting: parseInt(row?.waiting_count || "0", 10),
      };
    });

    return {
      categories: categoryData,
    };
  } catch (error: any) {
    throw createError({
      statusCode: 500,
      statusMessage: `Database Query Failed: ${error.message}`,
    });
  }
});
