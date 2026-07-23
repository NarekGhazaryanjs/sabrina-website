import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth/require";
import {
  addNews,
  deleteNews,
  deleteUploadedFile,
  getNews,
  updateNews,
} from "@/lib/data/store";
import { saveUpload } from "@/lib/data/upload";
import { revalidatePublicContent } from "@/lib/data/revalidate-public";
import { adminRu as t } from "@/messages/admin.ru";

export async function POST(request: Request) {
  const denied = await requireAuth();
  if (denied) return denied;

  const form = await request.formData();
  const title_en = (form.get("title_en") as string) || "";
  const title_ru = (form.get("title_ru") as string) || "";
  const content_en = (form.get("content_en") as string) || "";
  const content_ru = (form.get("content_ru") as string) || "";
  const image = form.get("image") as File | null;

  if (!title_en.trim() || !title_ru.trim()) {
    return NextResponse.json(
      { error: t.errors.titleBothRequired },
      { status: 400 }
    );
  }

  let featured_image: string | undefined;
  if (image && image.size > 0) {
    featured_image = await saveUpload(image, "news");
  }

  const item = await addNews({
    id: crypto.randomUUID(),
    title_en: title_en.trim(),
    title_ru: title_ru.trim(),
    content_en: content_en.trim(),
    content_ru: content_ru.trim(),
    featured_image,
    published: true,
    created_at: new Date().toISOString(),
  });

  revalidatePublicContent(["home", "news"]);

  return NextResponse.json(item);
}

export async function PUT(request: Request) {
  const denied = await requireAuth();
  if (denied) return denied;

  const id = new URL(request.url).searchParams.get("id");
  if (!id) {
    return NextResponse.json({ error: t.errors.invalidRequest }, { status: 400 });
  }

  const form = await request.formData();
  const title_en = (form.get("title_en") as string) || "";
  const title_ru = (form.get("title_ru") as string) || "";
  const content_en = (form.get("content_en") as string) || "";
  const content_ru = (form.get("content_ru") as string) || "";
  const image = form.get("image") as File | null;
  const removeImage = form.get("remove_image") === "true";

  if (!title_en.trim() || !title_ru.trim()) {
    return NextResponse.json(
      { error: t.errors.titleBothRequired },
      { status: 400 }
    );
  }

  const updates: Parameters<typeof updateNews>[1] = {
    title_en: title_en.trim(),
    title_ru: title_ru.trim(),
    content_en: content_en.trim(),
    content_ru: content_ru.trim(),
  };

  const existing = (await getNews()).find((n) => n.id === id);
  if (!existing) {
    return NextResponse.json({ error: t.errors.notFound }, { status: 404 });
  }

  if (removeImage && existing.featured_image) {
    await deleteUploadedFile(existing.featured_image);
    updates.featured_image = undefined;
  }

  if (image && image.size > 0) {
    if (existing.featured_image) {
      await deleteUploadedFile(existing.featured_image);
    }
    updates.featured_image = await saveUpload(image, "news");
  }

  const item = await updateNews(id, updates);
  if (!item) {
    return NextResponse.json({ error: t.errors.notFound }, { status: 404 });
  }

  revalidatePublicContent(["home", "news"]);

  return NextResponse.json(item);
}

export async function DELETE(request: Request) {
  const denied = await requireAuth();
  if (denied) return denied;

  const id = new URL(request.url).searchParams.get("id");
  if (!id) {
    return NextResponse.json({ error: t.errors.invalidRequest }, { status: 400 });
  }

  const removed = await deleteNews(id);
  if (!removed) {
    return NextResponse.json({ error: t.errors.notFound }, { status: 404 });
  }

  if (removed.featured_image) {
    await deleteUploadedFile(removed.featured_image);
  }

  revalidatePublicContent(["home", "news"]);

  return NextResponse.json({ ok: true });
}
