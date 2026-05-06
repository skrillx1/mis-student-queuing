import { pool } from "../../utils/db";

export default defineEventHandler(async () => {
  // ✅ mark current serving as done FIRST
  await pool.query(`
    UPDATE queue_tickets
    SET status = 'done'
    WHERE status = 'serving'
  `);

  // ✅ get next waiting
  const res = await pool.query(`
    SELECT * FROM queue_tickets
    WHERE status = 'waiting'
    ORDER BY id ASC
    LIMIT 1
  `);

  const ticket = res.rows[0];

  if (!ticket) {
    return { current: "---" };
  }

  // ✅ mark as serving
  await pool.query(
    `UPDATE queue_tickets SET status = 'serving' WHERE id = $1`,
    [ticket.id],
  );

  return { current: ticket.ticketnumber };
});
