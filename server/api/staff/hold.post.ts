import { pool } from "../../utils/db";
import { broadcastQueueUpdate } from "../../utils/queue-events";

export default defineEventHandler(async (event) => {
  const { id, ticket } = await readBody(event);
  let res;

  if (id) {
    res = await pool.query(
      `UPDATE queue_tickets
       SET status = 'onhold'
       WHERE id = $1
       RETURNING ticketnumber, idnumber`,
      [id],
    );
  } else if (ticket) {
    // Manual fallback: update the currently serving one with that number
    res = await pool.query(
      `UPDATE queue_tickets
       SET status = 'hold'
       WHERE ticketnumber = $1 AND status = 'serving'
       ORDER BY id ASC
       LIMIT 1
       RETURNING ticketnumber, idnumber`,
      [ticket],
    );
  }

  const heldRecord = res?.rows[0];
  const heldTicket = heldRecord?.ticketnumber || ticket;

  broadcastQueueUpdate({
    type: "hold",
    ticket: heldTicket,
  });

  return {
    success: true,
  };
});
