import { pool } from "../../utils/db";

export default defineEventHandler(async () => {
  try {
    const servingResult = await pool.query(`
      SELECT ticketnumber
      FROM queue_tickets
      WHERE status = 'serving'
      ORDER BY id DESC
      LIMIT 1
    `);

    const waitingResult = await pool.query(`
      SELECT ticketnumber
      FROM queue_tickets
      WHERE status = 'waiting'
      ORDER BY id ASC
      LIMIT 1
    `);

    const historyResult = await pool.query(`
      SELECT ticketnumber
      FROM queue_tickets
      WHERE status = 'done'
      ORDER BY id DESC
      LIMIT 5
    `);

    return {
      current: servingResult.rows[0]?.ticketnumber || "---",
      next: waitingResult.rows[0]?.ticketnumber || "---",
      history: historyResult.rows.map((r) => r.ticketnumber),
    };
  } catch (err) {
    console.error(err);

    return {
      current: "---",
      next: "---",
      history: [],
    };
  }
});
