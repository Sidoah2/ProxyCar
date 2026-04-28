import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const session = request.cookies.get("session")?.value;
  const { pathname } = request.nextUrl;

  console.log(`Middleware running for: ${pathname} | Session: ${!!session}`);

  // Protect ALL /admin routes except for /admin/login
  if (pathname.startsWith("/admin") && pathname !== "/admin/login") {
    if (!session) {
      console.log("Redirecting to login...");
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin", "/admin/:path*"],
};
