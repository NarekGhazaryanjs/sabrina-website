import createIntlMiddleware from "next-intl/middleware";
import { type NextRequest } from "next/server";
import { routing } from "./i18n/routing";
import { handleAdminAuth } from "./lib/auth/middleware";

const intlMiddleware = createIntlMiddleware(routing);

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/admin") || pathname.startsWith("/api/admin")) {
    return handleAdminAuth(request);
  }

  return intlMiddleware(request);
}

export const config = {
  matcher: ["/", "/(en|ru)/:path*", "/admin/:path*", "/api/admin/:path*"],
};
