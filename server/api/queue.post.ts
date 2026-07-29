import { pool } from "../utils/db";

export default defineEventHandler(async (event) => {
  const body = await readBody(event);

  const servicetype = body.service;
  const idnumber = body.studid || null;

  const fullname = [body.firstname, body.middlename, body.lastname]
    .filter(Boolean)
    .join(" ");

  try {
    // 1️⃣ Generate daily prefix letter (A-Z) based on day of the year
    const now = new Date();
    const startOfYear = new Date(now.getFullYear(), 0, 0);
    const diff = now.getTime() - startOfYear.getTime();
    const oneDay = 1000 * 60 * 60 * 24;
    const dayOfYear = Math.floor(diff / oneDay); // Day 1, 2, 3...

    // Map day to A-Z (0 = A, 1 = B, ..., 25 = Z, 26 = A...)
    const letterIndex = (dayOfYear - 1) % 26;
    const prefixLetter = String.fromCharCode(65 + letterIndex);

    // 2️⃣ Check today's latest ticket sequence
    const todayCheck = await pool.query(`
      SELECT ticketnumber 
      FROM queue_tickets 
      WHERE created_at >= CURRENT_DATE
      ORDER BY created_at DESC 
      LIMIT 1
    `);

    let sequenceNumber = 1;

    if (todayCheck.rows.length > 0) {
      // Extract numeric suffix from existing ticket (e.g., "A-012" -> 12)
      const lastTicket = todayCheck.rows[0].ticketnumber;
      const match = lastTicket.match(/\d+$/);
      if (match) {
        sequenceNumber = parseInt(match[0], 10) + 1;
      }
    }

    // 3️⃣ Format ticket number (e.g., A-001, A-002, B-001)
    const formattedSequence = String(sequenceNumber).padStart(3, "0");
    const ticketnumber = `${prefixLetter}-${formattedSequence}`;

    // 4️⃣ Insert ticket into database
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
    console.error("Queue Generation Error:", err);
    return { status: "error" };
  }
});
