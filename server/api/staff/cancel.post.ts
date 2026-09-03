import { pool } from "../../utils/db";
import { broadcastQueueUpdate } from "../../utils/queue-events";

export default defineEventHandler(async (event) => {
  const { id, ticket, status = "rejected" } = await readBody(event);
  let res;

  if (id) {
    res = await pool.query(
      `UPDATE queue_tickets
       SET status = $1
       WHERE id = $2
       RETURNING ticketnumber, idnumber`,
      [status, id],
    );
  } else if (ticket) {
    // Fallback if passing ticket number directly
    res = await pool.query(
      `UPDATE queue_tickets
       SET status = $1
       WHERE ticketnumber = $2 AND status = 'waiting'
       ORDER BY id ASC
       LIMIT 1
       RETURNING ticketnumber, idnumber`,
      [status, ticket],
    );
  }

  const cancelledRecord = res?.rows[0];
  const cancelledTicket = cancelledRecord?.ticketnumber || ticket;

  // Broadcast WebSocket/SSE event to sync real-time clients
  broadcastQueueUpdate({
    type: "cancel",
    ticket: cancelledTicket,
  });

  return {
    success: true,
  };
});
