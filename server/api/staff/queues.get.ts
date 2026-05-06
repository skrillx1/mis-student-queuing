import { pool } from "../../utils/db";

export default defineEventHandler(async (event) => {
  const { type, search, date } = getQuery(event);

  let sql = `SELECT * FROM queue_tickets WHERE 1=1`;
  const values: any[] = [];
  let i = 1;

  // ACTIVE = serving + waiting
  if (type === "active") {
    sql += ` AND status IN ('waiting', 'serving')`;
  }

  // DONE only
  if (type === "done") {
    sql += ` AND status = 'done'`;
  }

  if (search) {
    sql += ` AND LOWER(fullname) LIKE LOWER($${i++})`;
    values.push(`%${search}%`);
  }

  if (date) {
    sql += ` AND DATE(created_at) = $${i++}`;
    values.push(date);
  }

  sql += `
    ORDER BY 
      CASE 
        WHEN status = 'serving' THEN 1
        WHEN status = 'waiting' THEN 2
        WHEN status = 'done' THEN 3
      END,
      id ASC
  `;

  const result = await pool.query(sql, values);
  return result.rows;
});
