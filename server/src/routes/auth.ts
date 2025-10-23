import { Hono } from "hono";
import { pool } from "../db/index.js";
import { hashPassword, comparePassword } from "../utils/hash.js";
import { signJWT } from "../utils/jwt.js";

export const authRoute = new Hono();

// SIGNUP
authRoute.post("/signup", async (c) => {
  const { username, password, role = "viewer" } = await c.req.json();

  if (!username || !password || !role) {
    return c.json({ message: "Missing required fields" }, 400);
  }

  if (!["admin", "viewer"].includes(role)) {
    return c.json({ message: "Invalid role" }, 400);
  }

  const hashed = await hashPassword(password);
  try {
    const result = await pool.query(
      "INSERT INTO users (username, password, role) VALUES ($1, $2, $3) RETURNING id, username, role",
      [username, hashed, role]
    );
    return c.json({ success: true, user: result.rows[0] }, 201);
  } catch (err: any) {
    if (err.code === "23505")
      return c.json({ message: "Username already exists" }, 409);
    console.error(err);
    return c.json({ message: "Server error" }, 500);
  }
});

// SIGNIN
authRoute.post("/signin", async (c) => {
  const { username, password } = await c.req.json();

  if (!username || !password)
    return c.json({ message: "Missing credentials" }, 400);

  const userRes = await pool.query("SELECT * FROM users WHERE username = $1", [
    username,
  ]);
  if (userRes.rows.length === 0)
    return c.json({ message: "User not found" }, 404);

  const user = userRes.rows[0];
  const valid = await comparePassword(password, user.password);
  if (!valid) return c.json({ message: "Invalid password" }, 401);

  const token = signJWT({
    id: user.id,
    username: user.username,
    role: user.role,
  });

  c.header(
    "Set-Cookie",
    `token=${token}; HttpOnly; Path=/; Max-Age=3600; SameSite=Lax`
  );

  return c.json({
    success: true,
    user: { id: user.id, username: user.username, role: user.role },
  });
});

// SIGNOUT
authRoute.post("/signout", async (c) => {
  c.header(
    "Set-Cookie",
    "token=; HttpOnly; Secure; Path=/; Max-Age=0; SameSite=Strict"
  );
  return c.json({ success: true, message: "Signed out successfully" });
});
