import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth/require";
import { updatePage } from "@/lib/data/store";
import { revalidateForPage } from "@/lib/data/revalidate-public";

export async function PUT(request: Request) {
  const denied = await requireAuth();
  if (denied) return denied;

  const body = await request.json();
  const {
    slug,
    title_en,
    title_ru,
    subtitle_en,
    subtitle_ru,
    content_en,
    content_ru,
  } = body;

  if (!slug) {
    return NextResponse.json({ error: "Slug required" }, { status: 400 });
  }

  const page = await updatePage(slug, {
    title_en: title_en ?? "",
    title_ru: title_ru ?? "",
    subtitle_en: subtitle_en ?? "",
    subtitle_ru: subtitle_ru ?? "",
    content_en: content_en ?? "",
    content_ru: content_ru ?? "",
  });

  revalidateForPage(slug);

  return NextResponse.json(page);
}
