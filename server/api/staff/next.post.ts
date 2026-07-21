import { pool } from "../../utils/db";
import { broadcastQueueUpdate } from "../../utils/queue-events";

export default defineEventHandler(async (event) => {
  const body = await readBody(event).catch(() => ({}));
  const { id: activeId, id_picture_filename } = body || {};

  // 1. If an ID picture filename was passed for the active ticket, update id_applications
  if (id_picture_filename && activeId) {
    // Get the student's idnumber from the active queue ticket first
    const ticketRes = await pool.query(
      `SELECT idnumber FROM queue_tickets WHERE id = $1`,
      [activeId],
    );
    const idNumber = ticketRes.rows[0]?.idnumber;

    if (idNumber) {
      await pool.query(
        `UPDATE id_applications
         SET id_picture_filename = $1
         WHERE studid = $2`,
        [id_picture_filename, idNumber],
      );
    }
  }

  // 2. Mark current serving ticket(s) as done
  await pool.query(`
    UPDATE queue_tickets
    SET status = 'done'
    WHERE status = 'serving'
  `);

  // 3. Get next waiting ticket
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

  // 4. Set next ticket status to serving
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
