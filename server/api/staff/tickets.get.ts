import { pool } from "../../utils/db";

const getUserId = (event) => {
  const token = getHeader(event, "authorization")?.replace("Bearer ", "");
  return token?.startsWith("session-token-")
    ? token.replace("session-token-", "")
    : null;
};

export default defineEventHandler(async (event) => {
  const userId = getUserId(event);
  if (!userId)
    throw createError({ statusCode: 401, statusMessage: "Unauthorized." });

  const stationResult = await pool.query(
    `SELECT id, code, name FROM stations WHERE created_by = $1 ORDER BY id DESC LIMIT 1`,
    [userId],
  );
  const station = stationResult.rows[0] || null;
  if (!station) return { station: null, tickets: [] };

  const ticketResult = await pool.query(
    `SELECT id, ticketnumber, fullname, servicetype, status, station
     FROM queue_tickets
     WHERE station = $1 AND status IN ('serving', 'onhold')
     ORDER BY CASE WHEN status = 'serving' THEN 1 ELSE 2 END, id ASC`,
    [station.code],
  );
  return { station, tickets: ticketResult.rows };
});
