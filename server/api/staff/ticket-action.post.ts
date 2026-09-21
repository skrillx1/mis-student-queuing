import { pool } from "../../utils/db";
import { broadcastQueueUpdate } from "../../utils/queue-events";

const getUserId = (event) => {
  const token = getHeader(event, "authorization")?.replace("Bearer ", "");
  return token?.startsWith("session-token-")
    ? token.replace("session-token-", "")
    : null;
};

export default defineEventHandler(async (event) => {
  const userId = getUserId(event);
  const { ticketId, status } = await readBody(event);
  if (!userId || !ticketId || !["done", "onhold"].includes(status)) {
    throw createError({
      statusCode: 400,
      statusMessage: "Invalid ticket action.",
    });
  }

  const result = await pool.query(
    `UPDATE queue_tickets AS q
     SET status = $1
     FROM stations AS s
     WHERE q.id = $2 AND q.station = s.code AND s.created_by = $3
       AND q.status IN ('serving', 'onhold')
     RETURNING q.id, q.ticketnumber, q.station, q.status`,
    [status, ticketId, userId],
  );
  if (result.rowCount === 0) {
    throw createError({
      statusCode: 403,
      statusMessage: "This ticket is not assigned to your station.",
    });
  }

  const updated = result.rows[0];
  broadcastQueueUpdate({
    type: status === "done" ? "done" : "hold",
    ticket: updated.ticketnumber,
    station: updated.station,
    status: updated.status,
  });
  return { success: true, ticket: updated };
});
