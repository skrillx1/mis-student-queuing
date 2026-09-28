import { pool } from "../../utils/db";

export default defineEventHandler(async () => {
  try {
    const [summary, queue, categories, hourly, counters] = await Promise.all([
      pool.query(`
        SELECT COUNT(*)::int AS total_today,
          COUNT(*) FILTER (WHERE status = 'done')::int AS completed_today,
          COUNT(*) FILTER (WHERE status IN ('rejected', 'skipped'))::int AS skipped_today,
          COUNT(*) FILTER (WHERE status IN ('waiting', 'serving', 'onhold'))::int AS active_today,
          COUNT(*) FILTER (WHERE status = 'serving')::int AS serving_now,
          COUNT(*) FILTER (WHERE status IN ('waiting', 'onhold'))::int AS waiting_now,
          COALESCE(ROUND(AVG(EXTRACT(EPOCH FROM (CURRENT_TIMESTAMP - created_at)) / 60)
            FILTER (WHERE status IN ('waiting', 'onhold'))), 0)::int AS average_wait_minutes
        FROM queue_tickets WHERE created_at >= CURRENT_DATE;
      `),
      pool.query(`
        SELECT id, ticketnumber, idnumber, fullname, servicetype, status, station,
          created_at, ROUND(EXTRACT(EPOCH FROM (CURRENT_TIMESTAMP - created_at)) / 60)::int AS waiting_minutes
        FROM queue_tickets WHERE created_at >= CURRENT_DATE
        ORDER BY CASE WHEN status = 'serving' THEN 1 WHEN status IN ('waiting', 'onhold') THEN 2 ELSE 3 END,
          created_at ASC, id ASC;
      `),
      pool.query(`
        SELECT servicetype, COUNT(*) FILTER (WHERE status = 'done')::int AS done,
          COUNT(*) FILTER (WHERE status IN ('waiting', 'serving', 'onhold'))::int AS active
        FROM queue_tickets WHERE created_at >= CURRENT_DATE AND servicetype IS NOT NULL
        GROUP BY servicetype ORDER BY done DESC, servicetype ASC;
      `),
      pool.query(`
        SELECT EXTRACT(HOUR FROM created_at)::int AS hour, COUNT(*)::int AS total,
          COUNT(*) FILTER (WHERE status = 'done')::int AS completed
        FROM queue_tickets WHERE created_at >= CURRENT_DATE
        GROUP BY EXTRACT(HOUR FROM created_at) ORDER BY hour ASC;
      `),
      pool.query(`
        SELECT s.id, s.code, s.name, s.created_by, u.full_name AS assigned_user_name,
          qt.ticketnumber AS current_ticket, qt.created_at AS current_ticket_created_at,
          CASE WHEN qt.id IS NULL THEN 'Available' ELSE 'Serving' END AS status,
          COUNT(done.id)::int AS served_today
        FROM stations s LEFT JOIN users u ON u.id = s.created_by
        LEFT JOIN queue_tickets qt ON qt.station = s.code AND qt.status = 'serving'
        LEFT JOIN queue_tickets done ON done.station = s.code AND done.status = 'done'
          AND done.created_at >= CURRENT_DATE
        GROUP BY s.id, s.code, s.name, s.created_by, u.full_name,
          qt.id, qt.ticketnumber, qt.created_at ORDER BY s.code ASC;
      `),
    ]);

    const overview = summary.rows[0] || {};
    const tickets = queue.rows;
    const next = tickets.find((ticket) =>
      ["waiting", "onhold"].includes(ticket.status),
    );

    return {
      overview: {
        totalToday: Number(overview.total_today || 0),
        completedToday: Number(overview.completed_today || 0),
        skippedToday: Number(overview.skipped_today || 0),
        activeToday: Number(overview.active_today || 0),
        servingNow: Number(overview.serving_now || 0),
        waitingNow: Number(overview.waiting_now || 0),
        averageWaitMinutes: Number(overview.average_wait_minutes || 0),
        estimatedWaitMinutes: Number(overview.waiting_now || 0) * 5,
      },
      current: tickets.find((ticket) => ticket.status === "serving") || null,
      next: next || null,
      tickets,
      categories: categories.rows,
      hourly: hourly.rows,
      counters: counters.rows,
    };
  } catch (error: any) {
    throw createError({
      statusCode: 500,
      statusMessage: `Database Query Failed: ${error.message}`,
    });
  }
});
