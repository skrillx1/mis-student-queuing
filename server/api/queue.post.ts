import { pool } from "../utils/db";

export default defineEventHandler(async (event) => {
  const body = await readBody(event);

  const servicetype = body.service;
  const idnumber = body.studid || null;

  const fullname = [body.firstname, body.middlename, body.lastname]
    .filter(Boolean)
    .join(" ");

  try {
    // ✅ Get today's next number
    const result = await pool.query(`
      SELECT COUNT(*) + 1 AS next
      FROM queue_tickets
      WHERE DATE(created_at) = CURRENT_DATE
    `);

    const nextNumber = result.rows[0].next;
    const ticketnumber = String(nextNumber).padStart(3, "0");

    // ✅ Insert with created_at
    await pool.query(
      `INSERT INTO queue_tickets 
       (idnumber, fullname, servicetype, ticketnumber, status, created_at)
       VALUES ($1, $2, $3, $4, 'waiting', NOW())`,
      [idnumber, fullname, servicetype, ticketnumber],
    );

    return {
      status: "success",
      queueNumber: ticketnumber,
    };
  } catch (err) {
    console.error(err);
    return { status: "error" };
  }
});
