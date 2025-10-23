import type { Context, Next } from "hono";
import { verifyJWT } from "../utils/jwt.js";

export const authMiddleware = (role?: "admin" | "viewer") => {
  return async (c: Context, next: Next) => {
    const cookieHeader = c.req.header("Cookie");
    if (!cookieHeader) {
      return c.json({ message: "Missing authentication cookie" }, 401);
    }

    const token = cookieHeader
      .split(";")
      .map((c) => c.trim())
      .find((c) => c.startsWith("token="))
      ?.split("=")[1];

    if (!token) {
      return c.json({ message: "Token not found in cookie" }, 401);
    }

    try {
      const payload: any = verifyJWT(token);
      c.set("user", payload);

      if (role && payload.role !== role) {
        return c.json({ message: "Forbidden: insufficient role" }, 403);
      }

      await next();
    } catch (err) {
      return c.json({ message: "Invalid or expired token" }, 401);
    }
  };
};
