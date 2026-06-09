import { pool } from "../utils/db";

export default defineEventHandler(async (event) => {
  const body = await readBody(event);

  const servicetype = body.service;
  const idnumber = body.studid || null;

  const fullname = [body.firstname, body.middlename, body.lastname]
    .filter(Boolean)
    .join(" ");

  try {
    // 1️⃣ Check if there are waiting tickets
    const waitingCheck = await pool.query(`
      SELECT COUNT(*) AS count
      FROM queue_tickets
      WHERE status = 'waiting'
    `);

    const hasWaiting = parseInt(waitingCheck.rows[0].count) > 0;

    let ticketnumber: string;

    if (hasWaiting) {
      // 2️⃣ Continue from latest ticket number
      const last = await pool.query(`
        SELECT ticketnumber
        FROM queue_tickets
        ORDER BY created_at DESC
        LIMIT 1
      `);

      const lastNumber = parseInt(last.rows[0]?.ticketnumber || "0", 10);
      ticketnumber = String(lastNumber + 1).padStart(3, "0");
    } else {
      // 3️⃣ Reset to 001
      ticketnumber = "001";
    }

    // 4️⃣ Insert ticket
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
