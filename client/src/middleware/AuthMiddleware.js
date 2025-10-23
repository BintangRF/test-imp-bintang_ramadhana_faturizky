// src/middleware/AuthMiddleware.js
import { NextResponse } from "next/server";

export function requireAuth(req) {
  const token = req.cookies.get("token")?.value;

  if (!token) {
    return NextResponse.redirect(new URL("/signin", req.url));
  }

  return NextResponse.next();
}
