import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const SESSION_COOKIE_NAME = "session_token";

/**
 * Next.js Middleware runs at the Edge layer.
 * Performs a fast verification check of the session token cookie presence
 * to intercept unauthorized access to admin dashboard routes.
 */
export function proxy(request: NextRequest) {
  const path = request.nextUrl.pathname;

  // Protect all /admin routes except for /admin/login and /admin/register
  if (
    path.startsWith("/admin") &&
    !path.startsWith("/admin/login") &&
    !path.startsWith("/admin/register")
  ) {
    const sessionToken = request.cookies.get(SESSION_COOKIE_NAME)?.value;

    if (!sessionToken) {
      loggerMessage("Unauthenticated admin access attempt, redirecting to login");
      const loginUrl = new URL("/admin/login", request.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

// Console logger helper for Edge runtime environment
function loggerMessage(msg: string) {
  console.log(`[Middleware] 🛡️ ${msg}`);
}

export const config = {
  matcher: ["/admin/:path*"],
};
