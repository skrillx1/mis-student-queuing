import { pool } from "../../utils/db";

export default defineEventHandler(async () => {
  const result = await pool.query(
    `SELECT ticketnumber
     FROM queue_tickets
     WHERE status = 'serving'
     ORDER BY id DESC
     LIMIT 1`,
  );

  return {
    current: result.rows[0]?.ticketnumber || "---",
  };
});
