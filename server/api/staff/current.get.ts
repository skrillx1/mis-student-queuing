import { pool } from "../../utils/db";

export default defineEventHandler(async () => {
  const res = await pool.query(`
    SELECT ticketnumber FROM queue_tickets
    WHERE status = 'serving'
    LIMIT 1
  `);

  return {
    current: res.rows[0]?.ticketnumber || null,
  };
});
