import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth/require";
import { updateSettings } from "@/lib/data/store";
import { revalidatePublicContent } from "@/lib/data/revalidate-public";

export async function PUT(request: Request) {
  const denied = await requireAuth();
  if (denied) return denied;

  const body = await request.json();
  const settings = await updateSettings(body);

  revalidatePublicContent(["contact"]);

  return NextResponse.json(settings);
}
