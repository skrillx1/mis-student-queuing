import { pool } from "../../utils/db";
import { broadcastQueueUpdate } from "../../utils/queue-events";

export default defineEventHandler(async (event) => {
  const { id, ticket } = await readBody(event);
  let res;

  if (id) {
    // Workspace action: precisely target by unique ID
    res = await pool.query(
      `UPDATE queue_tickets
       SET status = 'serving'
       WHERE id = $1
       RETURNING ticketnumber`,
      [id],
    );
  } else if (ticket) {
    // Manual entry fallback: only target the oldest ticket that is 'waiting'
    res = await pool.query(
      `UPDATE queue_tickets
       SET status = 'serving'
       WHERE id = (
         SELECT id FROM queue_tickets 
         WHERE ticketnumber = $1 AND status = 'waiting' 
         ORDER BY id ASC 
         LIMIT 1
       )
       RETURNING ticketnumber`,
      [ticket],
    );
  }

  // Use optional chaining safely to avoid crash if no records matched
  const calledTicket = res?.rows?.[0]?.ticketnumber || "---";

  broadcastQueueUpdate({
    type: "recall",
    ticket: calledTicket,
    timestamp: Date.now(),
  });

  return {
    current: calledTicket,
  };
});
