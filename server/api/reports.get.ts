// server/api/reports.get.ts
import { pool } from "../utils/db";

export default defineEventHandler(async (event) => {
  const queryParams = getQuery(event);
  const filterType = (queryParams.filterType as string) || "monthly";
  const startDateParam = queryParams.startDate as string;
  const endDateParam = queryParams.endDate as string;

  let timeFilterClause = "";
  const queryArgs: any[] = [];

  // Calculate Date Filters
  if (startDateParam && endDateParam) {
    timeFilterClause =
      "AND created_at >= $1::date AND created_at < ($2::date + INTERVAL '1 day')";
    queryArgs.push(startDateParam, endDateParam);
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

    timeFilterClause = "AND created_at >= $1";
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
        AND servicetype IS NOT NULL
        AND TRIM(servicetype) <> ''
        ${timeFilterClause}
      GROUP BY servicetype
      ORDER BY done_count DESC, servicetype ASC;
    `;

    const result = await pool.query(query, queryArgs);

    const ticketsResult = await pool.query(
      `
        SELECT id, ticketnumber, idnumber, fullname, servicetype, created_at
        FROM queue_tickets
        WHERE status = 'done'
          AND servicetype IS NOT NULL
          AND TRIM(servicetype) <> ''
          ${timeFilterClause}
        ORDER BY created_at DESC, id DESC;
      `,
      queryArgs,
    );

    const summaryResult = await pool.query(
      `
        SELECT
          COUNT(*)::int AS total_tickets,
          COUNT(*) FILTER (WHERE status = 'done')::int AS completed_tickets,
          COUNT(*) FILTER (WHERE status IN ('rejected', 'skipped'))::int AS skipped_tickets,
          COUNT(*) FILTER (WHERE status IN ('waiting', 'serving', 'onhold'))::int AS queued_tickets
        FROM queue_tickets
        WHERE 1 = 1
          ${timeFilterClause};
      `,
      queryArgs,
    );

    const reportData = result.rows.map((row) => ({
      servicetype: row.servicetype,
      count: parseInt(row.done_count, 10),
    }));

    return {
      categories: reportData,
      tickets: ticketsResult.rows,
      summary: summaryResult.rows[0],
    };
  } catch (error: any) {
    throw createError({
      statusCode: 500,
      statusMessage: `Database Query Failed: ${error.message}`,
    });
  }
});
