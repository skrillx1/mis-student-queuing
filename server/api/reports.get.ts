// server/api/reports.get.ts
import { pool } from "../utils/db";

export default defineEventHandler(async (event) => {
  const queryParams = getQuery(event);
  const filterType = (queryParams.filterType as string) || "monthly";
  const startDateParam = queryParams.startDate as string;
  const endDateParam = queryParams.endDate as string;

  const categories = [
    "ID Processing",
    "Re-ID",
    "Account Problem",
    "Clearance Signing",
    "Inquiry",
  ];

  let timeFilterClause = "";
  const queryArgs: any[] = [categories];

  // Calculate Date Filters
  if (filterType === "custom" && startDateParam && endDateParam) {
    timeFilterClause = "AND created_at >= $2 AND created_at <= $3";
    queryArgs.push(startDateParam, `${endDateParam}T23:59:59`);
  } else {
    const now = new Date();
    let startDate = new Date();

    if (filterType === "daily") {
      startDate.setDate(now.getDate() - 7); // Last 7 days
    } else if (filterType === "weekly") {
      startDate.setDate(now.getDate() - 28); // Last 4 weeks
    } else if (filterType === "monthly") {
      startDate.setMonth(now.getMonth() - 6); // Last 6 months
    }

    timeFilterClause = "AND created_at >= $2";
    queryArgs.push(startDate.toISOString());
  }

  try {
    // Aggregates completed count per service category
    const query = `
      SELECT 
        servicetype,
        COUNT(*)::int AS done_count
      FROM queue_tickets
      WHERE status = 'done'
        AND servicetype = ANY($1)
        ${timeFilterClause}
      GROUP BY servicetype;
    `;

    const result = await pool.query(query, queryArgs);

    // Ensure all 5 categories are always present even if count is 0
    const reportData = categories.map((cat) => {
      const row = result.rows.find((r) => r.servicetype === cat);
      return {
        servicetype: cat,
        count: row ? parseInt(row.done_count, 10) : 0,
      };
    });

    return {
      categories: reportData,
    };
  } catch (error: any) {
    throw createError({
      statusCode: 500,
      statusMessage: `Database Query Failed: ${error.message}`,
    });
  }
});
