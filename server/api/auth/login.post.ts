import { pool } from "../../utils/db";
export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const { username, password } = body;

  if (!username || !password) {
    throw createError({
      statusCode: 400,
      statusMessage: "Username and password are required",
    });
  }

  try {
    // Query database and verify password using PostgreSQL's crypt function
    const query = `
      SELECT id, username, email, full_name, role, is_active
      FROM users
      WHERE username = $1 
        AND password_hash = crypt($2, password_hash)
        AND is_active = TRUE
    `;
    const { rows } = await pool.query(query, [username, password]);

    if (rows.length === 0) {
      throw createError({
        statusCode: 401,
        statusMessage: "Invalid username or password",
      });
    }

    const user = rows[0];

    // Update last login timestamp asynchronously
    await pool.query("UPDATE users SET last_login_at = NOW() WHERE id = $1", [
      user.id,
    ]);

    // Return user payload and a access token or session data
    return {
      token: `session-token-${user.id}`, // Replace with a proper JWT token if using JWT
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        name: user.full_name,
        role: user.role,
      },
    };
  } catch (error: any) {
    if (error.statusCode) throw error;

    throw createError({
      statusCode: 500,
      statusMessage: "Internal server authentication error",
    });
  }
});
