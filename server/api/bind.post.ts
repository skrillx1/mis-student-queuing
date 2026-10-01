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

  // Upsert into csuccmisqueuing database
  const query = `
    INSERT INTO public.students (studid, rfidnumber, fullname)
    VALUES ($1, $2, $3)
    ON CONFLICT (studid) 
    DO UPDATE SET 
      rfidnumber = COALESCE(NULLIF(EXCLUDED.rfidnumber, ''), public.students.rfidnumber),
      fullname = EXCLUDED.fullname
    RETURNING studid, rfidnumber, fullname;
  `;

  const result = await pool.query(query, [studid, rfid || "", fullname]);

  return {
    status: "bound",
    student: result.rows[0],
  };
});
