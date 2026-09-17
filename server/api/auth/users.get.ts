import { pool } from "../../utils/db";

const getAuthorizedAdminId = (event) => {
  const token = getHeader(event, "authorization")?.replace("Bearer ", "");
  return token?.startsWith("session-token-")
    ? token.replace("session-token-", "")
    : null;
};

export default defineEventHandler(async (event) => {
  const adminId = getAuthorizedAdminId(event);
  if (!adminId)
    throw createError({ statusCode: 401, statusMessage: "Unauthorized." });

  const admin = await pool.query(
    "SELECT id FROM users WHERE id = $1 AND role = 'admin' AND is_active = TRUE",
    [adminId],
  );
  if (admin.rowCount === 0)
    throw createError({
      statusCode: 403,
      statusMessage: "Administrator access required.",
    });

  const result = await pool.query(
    "SELECT id, username, email, full_name AS name, role, is_active FROM users ORDER BY full_name NULLS LAST, username",
  );
  return result.rows;
});
