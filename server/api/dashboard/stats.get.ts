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
    // Queries all done tickets grouped by servicetype without date restrictions
    const categoryStatsQuery = `
      SELECT 
        servicetype,
        COUNT(*) AS done_count
      FROM queue_tickets
      WHERE servicetype = ANY($1)
        AND status = 'done'
      GROUP BY servicetype;
    `;

    const result = await pool.query(categoryStatsQuery, [categories]);

    // Ensure all 5 categories are mapped, defaulting to 0 if no tickets found
    const categoryData = categories.map((cat) => {
      const row = result.rows.find((r) => r.servicetype === cat);
      return {
        servicetype: cat,
        done: parseInt(row?.done_count || "0", 10),
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
