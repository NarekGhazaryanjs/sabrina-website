import { NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/auth/session";

export async function requireAuth(): Promise<NextResponse | null> {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return null;
}
