import { pool } from "../../utils/db";
import { broadcastQueueUpdate } from "../../utils/queue-events";

export default defineEventHandler(async (event) => {
  const {
    id,
    ticket,
    station: newStation,
    status: newStatus,
  } = await readBody(event);
  let res;

  if (id) {
    // Workspace or Drag-and-Drop Action: precisely target by unique ID
    // Dynamic query handles optional station assignment or default status update
    res = await pool.query(
      `UPDATE queue_tickets
       SET status = COALESCE($2, 'serving'),
           station = COALESCE($3, station)
       WHERE id = $1
       RETURNING id, ticketnumber, station, status`,
      [id, newStatus, newStation],
    );
  } else if (ticket) {
    // Manual entry fallback: target the oldest matching waiting ticket
    res = await pool.query(
      `UPDATE queue_tickets
       SET status = COALESCE($2, 'serving'),
           station = COALESCE($3, station)
       WHERE id = (
         SELECT id FROM queue_tickets 
         WHERE ticketnumber = $1 AND status = 'waiting' 
         ORDER BY id ASC 
         LIMIT 1
       )
       RETURNING id, ticketnumber, station, status`,
      [ticket, newStatus, newStation],
    );
  }

  // Extract result parameters safely
  const calledTicket = res?.rows?.[0]?.ticketnumber || "---";
  const assignedStation = res?.rows?.[0]?.station || null;
  const currentStatus = res?.rows?.[0]?.status || "serving";

  // Broadcast update over WebSockets/SSE
  broadcastQueueUpdate({
    type: "recall",
    ticket: calledTicket,
    station: assignedStation,
    status: currentStatus,
    timestamp: Date.now(),
  });

  return {
    success: true,
    current: calledTicket,
    station: assignedStation,
    status: currentStatus,
  };
});
