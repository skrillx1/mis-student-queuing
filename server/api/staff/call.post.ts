import { pool } from "../../utils/db";

export default defineEventHandler(async (event) => {
  const { ticket } = await readBody(event);

  const res = await pool.query(
    `UPDATE queue_tickets
     SET status = 'serving'
     WHERE ticketnumber = $1
     RETURNING ticketnumber`,
    [ticket],
  );

  await pool.query(
    `UPDATE queue_tickets
    SET status = 'serving'
    WHERE ticketnumber = $1`,
    [ticket],
  );

  return {
    current: res.rows[0]?.ticketnumber || "---",
  };
});
