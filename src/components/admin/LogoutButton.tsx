"use client";

import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { adminRu as t } from "@/messages/admin.ru";

export function LogoutButton() {
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <button
      onClick={handleLogout}
      className="inline-flex items-center gap-2 rounded-xl border border-rose-400/10 px-4 py-2 text-sm text-rose-300/80 hover:bg-rose-400/5"
    >
      <LogOut className="h-4 w-4" />
      {t.logout}
    </button>
  );
}
