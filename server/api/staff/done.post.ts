import { pool } from "../../utils/db";
import { broadcastQueueUpdate } from "../../utils/queue-events";

export default defineEventHandler(async (event) => {
  const { id, ticket, id_picture_filename } = await readBody(event);
  let res;

  if (id) {
    res = await pool.query(
      `UPDATE queue_tickets
       SET status = 'done'
       WHERE id = $1
       RETURNING ticketnumber, idnumber`,
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
       RETURNING ticketnumber, idnumber`,
      [ticket],
    );
  }

  const finishedRecord = res?.rows[0];
  const finishedTicket = finishedRecord?.ticketnumber || ticket;
  const idNumber = finishedRecord?.idnumber;

  // Save filename to id_applications matching studid = idnumber
  if (id_picture_filename && idNumber) {
    await pool.query(
      `UPDATE id_applications
       SET id_picture_filename = $1
       WHERE studid = $2`,
      [id_picture_filename, idNumber],
    );
  }

  broadcastQueueUpdate({
    type: "done",
    ticket: finishedTicket,
  });

  return {
    success: true,
  };
});
