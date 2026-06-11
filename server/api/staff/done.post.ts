import { pool } from "../../utils/db";
import { broadcastQueueUpdate } from "../../utils/queue-events";

export default defineEventHandler(async (event) => {
  const { ticket } = await readBody(event);

  await pool.query(
    `UPDATE queue_tickets
     SET status = 'done'
     WHERE ticketnumber = $1`,
    [ticket],
  );

  broadcastQueueUpdate({
    type: "done",
    ticket,
  });

  return {
    success: true,
  };
});
