import { pool } from "../utils/db";

export default defineEventHandler(async (event) => {
  const body = await readBody(event);

  const {
    firstname,
    middlename,
    lastname,
    studid,
    course,
    contact_name,
    contact_number,
    contact_address,
  } = body;

  try {
    await pool.query(
      `INSERT INTO id_applications 
      (firstname, middlename, lastname, studid, course, contact_name, contact_number, contact_address)
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8)`,
      [
        firstname,
        middlename,
        lastname,
        studid,
        course,
        contact_name,
        contact_number,
        contact_address,
      ],
    );

    return { status: "submitted" };
  } catch (err) {
    console.error(err);
    return { status: "error" };
  }
});
