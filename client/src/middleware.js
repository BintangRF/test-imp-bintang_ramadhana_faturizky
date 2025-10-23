import { requireAuth } from "@/middleware/AuthMiddleware";
import { NextResponse } from "next/server";

export function middleware(req) {
  if (req.nextUrl.pathname.startsWith("/dashboard")) {
    return requireAuth(req);
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*"],
};
