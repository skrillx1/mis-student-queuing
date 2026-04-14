import { pool } from "../utils/db";

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const { studid, rfid } = body;

  // Check if student exists
  const student = await pool.query("SELECT * FROM students WHERE studid = $1", [
    studid,
  ]);

  if (student.rows.length === 0) {
    return { status: "invalid_id" };
  }

  const s = student.rows[0];

  // Bind RFID
  await pool.query("UPDATE students SET rfidnumber = $1 WHERE studid = $2", [
    rfid,
    studid,
  ]);

  return {
    status: "bound",
    student: s,
  };
});
