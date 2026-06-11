import { pool } from "../../utils/db";
import { broadcastQueueUpdate } from "../../utils/queue-events";

export default defineEventHandler(async (event) => {
  const { ticket } = await readBody(event);

  const res = await pool.query(
    `UPDATE queue_tickets
     SET status = 'serving'
     WHERE ticketnumber = $1
     RETURNING ticketnumber`,
    [ticket],
  );

  // broadcastQueueUpdate({
  //   type: "call",
  //   ticket,
  // });

  broadcastQueueUpdate({
    type: "serving",
    ticket,
  });

  return {
    current: res.rows[0]?.ticketnumber || "---",
  };
});
