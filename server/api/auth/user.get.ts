import { pool } from "../../utils/db";

export default defineEventHandler(async (event) => {
  // Retrieve authorization header
  const authHeader = getHeader(event, "authorization");
  if (!authHeader) {
    throw createError({ statusCode: 401, statusMessage: "Unauthorized" });
  }

  // Extract user ID or token (adjust according to your session logic)
  const token = authHeader.replace("Bearer ", "");
  const userId = token.replace("session-token-", "");

  const { rows } = await pool.query(
    "SELECT id, username, email, full_name, role FROM users WHERE id = $1 AND is_active = TRUE",
    [userId],
  );

  if (rows.length === 0) {
    throw createError({ statusCode: 401, statusMessage: "User not found" });
  }

  const user = rows[0];
  return {
    id: user.id,
    username: user.username,
    email: user.email,
    name: user.full_name,
    role: user.role,
  };
});
