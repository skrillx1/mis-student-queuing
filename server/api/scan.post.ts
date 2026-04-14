import { pool } from "../utils/db";

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const { rfid } = body;

  // 1. Check if RFID exists
  const result = await pool.query(
    "SELECT * FROM students WHERE rfidnumber = $1",
    [rfid],
  );

  if (result.rows.length > 0) {
    return {
      status: "found",
      student: result.rows[0],
    };
  }

  // RFID not found
  return {
    status: "not_found",
  };
});
