import Link from "next/link";
import { LogoutButton } from "./LogoutButton";
import { adminRu as t } from "@/messages/admin.ru";

export function AdminHeader() {
  return (
    <header className="border-b border-rose-400/8 bg-plum-light/50">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
        <Link href="/admin" className="font-display text-lg gradient-text">
          {t.siteName}
        </Link>
        <LogoutButton />
      </div>
    </header>
  );
}
