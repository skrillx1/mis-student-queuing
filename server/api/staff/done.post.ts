import { pool } from "../../utils/db";
import { broadcastQueueUpdate } from "../../utils/queue-events";

export default defineEventHandler(async (event) => {
  const { id, ticket } = await readBody(event);
  let res;

  if (id) {
    res = await pool.query(
      `UPDATE queue_tickets
       SET status = 'done'
       WHERE id = $1
       RETURNING ticketnumber`,
      [id],
    );
  } else if (ticket) {
    // Manual fallback: update the currently serving one with that number
    res = await pool.query(
      `UPDATE queue_tickets
       SET status = 'done'
       WHERE ticketnumber = $1 AND status = 'serving'
       ORDER BY id ASC
       LIMIT 1
       RETURNING ticketnumber`,
      [ticket],
    );
  }

  const finishedTicket = res?.rows[0]?.ticketnumber || ticket;

  broadcastQueueUpdate({
    type: "done",
    ticket: finishedTicket,
  });

  return {
    success: true,
  };
});
