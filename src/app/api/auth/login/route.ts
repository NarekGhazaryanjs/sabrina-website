import { NextResponse } from "next/server";
import { validateCredentials } from "@/lib/auth/users";
import { createSessionToken } from "@/lib/auth/session";
import { setSessionCookie } from "@/lib/auth/middleware";
import { adminRu as t } from "@/messages/admin.ru";
import { clientIp, rateLimit } from "@/lib/rate-limit";

export async function POST(request: Request) {
  try {
    const ip = clientIp(request);
    const limited = rateLimit(`login:${ip}`, {
      limit: 10,
      windowMs: 15 * 60_000,
    });
    if (!limited.ok) {
      return NextResponse.json(
        { error: "Too many login attempts. Try again later." },
        {
          status: 429,
          headers: { "Retry-After": String(limited.retryAfterSec) },
        }
      );
    }

    const { login, password } = await request.json();    if (!login || !password) {
      return NextResponse.json({ error: t.login.required }, { status: 400 });
    }
    if (!validateCredentials(login, password)) {
      return NextResponse.json({ error: t.login.wrongCredentials }, { status: 401 });
    }
    const token = await createSessionToken();
    const response = NextResponse.json({ ok: true });
    setSessionCookie(response, token);
    return response;
  } catch {
    return NextResponse.json({ error: t.login.failed }, { status: 500 });
  }
}
