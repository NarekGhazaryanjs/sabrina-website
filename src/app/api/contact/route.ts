import { NextResponse } from "next/server";
import { addMessage } from "@/lib/data/store";
import { clientIp, rateLimit } from "@/lib/rate-limit";

export async function POST(request: Request) {
  const ip = clientIp(request);
  const limited = rateLimit(`contact:${ip}`, {
    limit: 5,
    windowMs: 60_000,
  });
  if (!limited.ok) {
    return NextResponse.json(
      { error: "Too many messages. Try again later." },
      {
        status: 429,
        headers: { "Retry-After": String(limited.retryAfterSec) },
      }
    );
  }

  const body = await request.json();
  const name = typeof body.name === "string" ? body.name.trim() : "";
  const message = typeof body.message === "string" ? body.message.trim() : "";

  if (!name || !message) {
    return NextResponse.json(
      { error: "Name and message are required" },
      { status: 400 }
    );
  }

  if (name.length > 100 || message.length > 2000) {
    return NextResponse.json({ error: "Message too long" }, { status: 400 });
  }

  await addMessage({
    id: crypto.randomUUID(),
    name,
    message,
    read: false,
    created_at: new Date().toISOString(),
  });

  return NextResponse.json({ ok: true });
}
