import { pool } from "../../../utils/db";

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

  const userId = getRouterParam(event, "id");
  const { status } = (await readBody(event)) || {};
  const validStatuses = ["active", "inactive", "pending"];

  if (!userId || !validStatuses.includes(status))
    throw createError({
      statusCode: 400,
      statusMessage: "A valid user ID and account status are required.",
    });

  const result = await pool.query(
    "UPDATE users SET status = $1 WHERE id = $2 RETURNING id, status",
    [status, userId],
  );

  if (result.rowCount === 0)
    throw createError({ statusCode: 404, statusMessage: "User not found." });

  return result.rows[0];
});
