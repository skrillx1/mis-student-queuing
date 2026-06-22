import { pool } from "../../utils/db";
import { broadcastQueueUpdate } from "../../utils/queue-events";

export default defineEventHandler(async () => {
  await pool.query(`
    UPDATE queue_tickets
    SET status = 'done'
    WHERE status = 'serving'
  `);

  const res = await pool.query(`
    SELECT *
    FROM queue_tickets
    WHERE status = 'waiting'
    ORDER BY id ASC
    LIMIT 1
  `);

  const ticket = res.rows[0];

  if (!ticket) {
    return {
      current: "---",
    };
  }

  await pool.query(
    `UPDATE queue_tickets
     SET status = 'serving'
     WHERE id = $1`,
    [ticket.id],
  );

  broadcastQueueUpdate({
    type: "serving",
    ticket: ticket.ticketnumber,
    timestamp: Date.now(),
  });

  return {
    current: ticket.ticketnumber,
  };
});
