import { pool } from "../../../utils/db";

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const { currentPassword, newPassword } = body || {};
  const token = getHeader(event, "authorization")?.replace("Bearer ", "");
  const id = token?.startsWith("session-token-")
    ? token.replace("session-token-", "")
    : null;

  if (!id || !currentPassword || !newPassword) {
    throw createError({
      statusCode: 400,
      statusMessage:
        "Authorization, current password, and new password are required.",
    });
  }

  if (newPassword.length < 8) {
    throw createError({
      statusCode: 400,
      statusMessage: "New password must be at least 8 characters.",
    });
  }

  try {
    const result = await pool.query(
      `
        UPDATE users
        SET password_hash = crypt($1, gen_salt('bf'))
        WHERE id = $2
          AND is_active = TRUE
          AND password_hash = crypt($3, password_hash)
        RETURNING id
      `,
      [newPassword, id, currentPassword],
    );

    if (result.rowCount === 0) {
      throw createError({
        statusCode: 401,
        statusMessage: "Current password is incorrect.",
      });
    }

    return { success: true };
  } catch (error: any) {
    if (error.statusCode) throw error;
    throw createError({
      statusCode: 500,
      statusMessage: "Unable to change password.",
    });
  }
});
