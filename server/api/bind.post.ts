import { pool } from "../utils/db";

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const { studid, rfid, fullname } = body;

  if (!studid || !fullname) {
    throw createError({
      statusCode: 400,
      statusMessage: "Missing required student information.",
    });
  }

  // Convert empty string/falsy rfid to null
  const rfidValue = rfid && rfid.trim() !== "" ? rfid.trim() : null;

  // Upsert into csuccmisqueuing database
  const query = `
    INSERT INTO public.students (studid, rfidnumber, fullname)
    VALUES ($1, $2, $3)
    ON CONFLICT (studid) 
    DO UPDATE SET 
      rfidnumber = COALESCE(EXCLUDED.rfidnumber, public.students.rfidnumber),
      fullname = EXCLUDED.fullname
    RETURNING studid, rfidnumber, fullname;
  `;

  const result = await pool.query(query, [studid, rfidValue, fullname]);

  return {
    status: "bound",
    student: result.rows[0],
  };
});
