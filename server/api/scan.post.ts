import { pool } from "../utils/db";

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const { rfid } = body;

  if (!rfid) {
    return { status: "not_found" };
  }

  // Look for existing student bound to this RFID in csuccmisqueuing DB
  const result = await pool.query(
    "SELECT studid, rfidnumber, fullname FROM public.students WHERE rfidnumber = $1 LIMIT 1",
    [rfid],
  );

  if (result.rows.length > 0) {
    return {
      status: "found",
      student: result.rows[0],
    };
  }

  return {
    status: "not_found",
  };
});
