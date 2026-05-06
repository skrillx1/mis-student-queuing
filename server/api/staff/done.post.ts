import { pool } from "../../utils/db";

export default defineEventHandler(async (event) => {
  const { ticket } = await readBody(event);

  await pool.query(
    `UPDATE queue_tickets
     SET status = 'done'
     WHERE ticketnumber = $1`,
    [ticket],
  );

  return { success: true };
});
