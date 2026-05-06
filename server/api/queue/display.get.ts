import { pool } from "../../utils/db";

export default defineEventHandler(async () => {
  try {
    const result = await pool.query(
      `SELECT ticketnumber
       FROM queue_tickets
       ORDER BY id DESC
       LIMIT 2`,
    );

    const rows = result.rows;

    return {
      current: rows[0]?.ticketnumber || "---",
      next: rows[1]?.ticketnumber || "---",
    };
  } catch (err) {
    console.error(err);
    return {
      current: "---",
      next: "---",
    };
  }
});
