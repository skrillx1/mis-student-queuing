import { pool } from "../../utils/db";

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const { name, email } = body || {};
  const authHeader = getHeader(event, "authorization");
  const token = authHeader?.replace("Bearer ", "");
  const id = token?.startsWith("session-token-")
    ? token.replace("session-token-", "")
    : null;

  if (!id || !name?.trim() || !email?.trim()) {
    throw createError({
      statusCode: 401,
      statusMessage: "Authorization, name, and email are required.",
    });
  }

  try {
    const result = await pool.query(
      `
        UPDATE users
        SET full_name = $1, email = $2
        WHERE id = $3 AND is_active = TRUE
        RETURNING id, username, email, full_name, role
      `,
      [name.trim(), email.trim(), id],
    );

    if (result.rowCount === 0) {
      throw createError({ statusCode: 404, statusMessage: "User not found." });
    }

    const user = result.rows[0];
    return {
      id: user.id,
      username: user.username,
      email: user.email,
      name: user.full_name,
      role: user.role,
    };
  } catch (error: any) {
    if (error.statusCode) throw error;
    if (error.code === "23505") {
      throw createError({
        statusCode: 409,
        statusMessage: "Email already exists.",
      });
    }
    throw createError({
      statusCode: 500,
      statusMessage: "Unable to update profile.",
    });
  }
});
