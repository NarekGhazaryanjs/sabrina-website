import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth/require";
import {
  addMedia,
  deleteMedia,
  deleteUploadedFile,
  getMediaItem,
  updateMedia,
} from "@/lib/data/store";
import { saveUpload } from "@/lib/data/upload";
import { revalidateForMediaType } from "@/lib/data/revalidate-public";
import type { MediaType } from "@/lib/types/content";
import { adminRu as t } from "@/messages/admin.ru";

function getType(request: Request): MediaType | null {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get("type");
  if (type === "videos" || type === "photos" || type === "audio") return type;
  return null;
}

export async function POST(request: Request) {
  const denied = await requireAuth();
  if (denied) return denied;

  const type = getType(request);
  if (!type) {
    return NextResponse.json({ error: t.errors.invalidRequest }, { status: 400 });
  }

  const form = await request.formData();
  const file = form.get("file") as File | null;
  const title_en = (form.get("title_en") as string) || "";
  const title_ru = (form.get("title_ru") as string) || "";
  const description_en = (form.get("description_en") as string) || "";
  const description_ru = (form.get("description_ru") as string) || "";

  if (!file || file.size === 0) {
    return NextResponse.json({ error: t.errors.fileRequired }, { status: 400 });
  }
  if (!title_en.trim() || !title_ru.trim()) {
    return NextResponse.json(
      { error: t.errors.titleBothRequired },
      { status: 400 }
    );
  }

  const media_url = await saveUpload(file, type);
  const item = await addMedia(type, {
    id: crypto.randomUUID(),
    title_en: title_en.trim(),
    title_ru: title_ru.trim(),
    description_en: description_en.trim(),
    description_ru: description_ru.trim(),
    media_url,
    sort_order: 0,
    published: true,
    created_at: new Date().toISOString(),
  });

  revalidateForMediaType(type);

  return NextResponse.json(item);
}

export async function PUT(request: Request) {
  const denied = await requireAuth();
  if (denied) return denied;

  const type = getType(request);
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (!type || !id) {
    return NextResponse.json({ error: t.errors.invalidRequest }, { status: 400 });
  }

  const form = await request.formData();
  const file = form.get("file") as File | null;
  const title_en = (form.get("title_en") as string) || "";
  const title_ru = (form.get("title_ru") as string) || "";
  const description_en = (form.get("description_en") as string) || "";
  const description_ru = (form.get("description_ru") as string) || "";

  if (!title_en.trim() || !title_ru.trim()) {
    return NextResponse.json(
      { error: t.errors.titleBothRequired },
      { status: 400 }
    );
  }

  const updates: Parameters<typeof updateMedia>[2] = {
    title_en: title_en.trim(),
    title_ru: title_ru.trim(),
    description_en: description_en.trim(),
    description_ru: description_ru.trim(),
  };

  if (file && file.size > 0) {
    const existing = await getMediaItem(type, id);
    if (!existing) {
      return NextResponse.json({ error: t.errors.notFound }, { status: 404 });
    }
    const newUrl = await saveUpload(file, type);
    await deleteUploadedFile(existing.media_url);
    updates.media_url = newUrl;
  }

  const item = await updateMedia(type, id, updates);
  if (!item) {
    return NextResponse.json({ error: t.errors.notFound }, { status: 404 });
  }

  revalidateForMediaType(type);

  return NextResponse.json(item);
}

export async function DELETE(request: Request) {
  const denied = await requireAuth();
  if (denied) return denied;

  const type = getType(request);
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (!type || !id) {
    return NextResponse.json({ error: t.errors.invalidRequest }, { status: 400 });
  }

  const removed = await deleteMedia(type, id);
  if (!removed) {
    return NextResponse.json({ error: t.errors.notFound }, { status: 404 });
  }

  await deleteUploadedFile(removed.media_url);
  revalidateForMediaType(type);
  return NextResponse.json({ ok: true });
}
