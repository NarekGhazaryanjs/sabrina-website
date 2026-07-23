import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth/require";
import { deleteMessage, markMessageRead } from "@/lib/data/store";
import { adminRu as t } from "@/messages/admin.ru";

export async function PATCH(request: Request) {
  const denied = await requireAuth();
  if (denied) return denied;

  const id = new URL(request.url).searchParams.get("id");
  if (!id) {
    return NextResponse.json({ error: t.errors.invalidRequest }, { status: 400 });
  }

  const item = await markMessageRead(id);
  if (!item) {
    return NextResponse.json({ error: t.errors.notFound }, { status: 404 });
  }

  return NextResponse.json(item);
}

export async function DELETE(request: Request) {
  const denied = await requireAuth();
  if (denied) return denied;

  const id = new URL(request.url).searchParams.get("id");
  if (!id) {
    return NextResponse.json({ error: t.errors.invalidRequest }, { status: 400 });
  }

  const removed = await deleteMessage(id);
  if (!removed) {
    return NextResponse.json({ error: t.errors.notFound }, { status: 404 });
  }

  return NextResponse.json({ ok: true });
}
