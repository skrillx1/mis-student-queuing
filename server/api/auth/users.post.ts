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

  const body = await readBody(event);
  const { username, name, email, password, role } = body || {};
  const validRoles = ["admin", "staff"];
  if (
    !username?.trim() ||
    !name?.trim() ||
    !email?.trim() ||
    !password ||
    !validRoles.includes(role)
  ) {
    throw createError({
      statusCode: 400,
      statusMessage:
        "Username, name, email, password, and a valid role are required.",
    });
  }
  if (password.length < 8)
    throw createError({
      statusCode: 400,
      statusMessage: "Password must be at least 8 characters.",
    });

  try {
    const result = await pool.query(
      `INSERT INTO users (username, email, full_name, password_hash, role, is_active)
       VALUES ($1, $2, $3, crypt($4, gen_salt('bf')), $5, TRUE)
       RETURNING id, username, email, full_name AS name, role, is_active`,
      [username.trim(), email.trim(), name.trim(), password, role],
    );
    return result.rows[0];
  } catch (error: any) {
    if (error.code === "23505")
      throw createError({
        statusCode: 409,
        statusMessage: "Username or email already exists.",
      });
    throw createError({
      statusCode: 500,
      statusMessage: "Unable to create user.",
    });
  }
});
