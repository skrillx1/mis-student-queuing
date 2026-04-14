import { pool } from "../utils/db";

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const { studid } = body;

  const result = await pool.query("SELECT * FROM students WHERE studid = $1", [
    studid,
  ]);

  if (result.rows.length > 0) {
    return {
      status: "found",
      student: result.rows[0],
    };
  }

  return { status: "not_found" };
});
