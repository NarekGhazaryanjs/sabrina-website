"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Check, Trash2 } from "lucide-react";
import type { ContactMessage } from "@/lib/types/content";
import { adminRu as t } from "@/messages/admin.ru";

function formatDate(iso: string) {
  return new Date(iso).toLocaleString("ru-RU", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function MessagesManager({ items }: { items: ContactMessage[] }) {
  const router = useRouter();
  const [loadingId, setLoadingId] = useState<string | null>(null);

  async function markRead(id: string) {
    setLoadingId(id);
    await fetch(`/api/admin/messages?id=${id}`, { method: "PATCH" });
    setLoadingId(null);
    router.refresh();
  }

  async function handleDelete(id: string) {
    if (!confirm(t.messages.deleteConfirm)) return;
    setLoadingId(id);
    await fetch(`/api/admin/messages?id=${id}`, { method: "DELETE" });
    setLoadingId(null);
    router.refresh();
  }

  if (items.length === 0) {
    return (
      <p className="rounded-2xl glass px-6 py-10 text-center text-rose-300/50">
        {t.messages.empty}
      </p>
    );
  }

  return (
    <div className="space-y-4">
      {items.map((item) => (
        <article
          key={item.id}
          className={`rounded-2xl glass p-6 transition-colors ${
            item.read ? "opacity-75" : "border-rose-400/25"
          }`}
        >
          <div className="mb-3 flex flex-wrap items-start justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <p className="font-medium text-rose-200">{item.name}</p>
                {!item.read && (
                  <span className="rounded-full bg-rose-400/20 px-2 py-0.5 text-xs text-rose-300">
                    {t.messages.unread}
                  </span>
                )}
              </div>
              <p className="mt-1 text-xs text-rose-300/45">
                {formatDate(item.created_at)}
              </p>
            </div>
            <div className="flex gap-2">
              {!item.read && (
                <button
                  type="button"
                  onClick={() => markRead(item.id)}
                  disabled={loadingId === item.id}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-rose-400/10 px-3 py-1.5 text-xs text-rose-300 transition-colors hover:bg-rose-400/20 disabled:opacity-50"
                >
                  <Check className="h-3.5 w-3.5" />
                  {t.messages.markRead}
                </button>
              )}
              <button
                type="button"
                onClick={() => handleDelete(item.id)}
                disabled={loadingId === item.id}
                className="inline-flex items-center gap-1.5 rounded-lg bg-red-500/10 px-3 py-1.5 text-xs text-red-300 transition-colors hover:bg-red-500/20 disabled:opacity-50"
              >
                <Trash2 className="h-3.5 w-3.5" />
                {t.messages.delete}
              </button>
            </div>
          </div>
          <p className="whitespace-pre-wrap leading-relaxed text-rose-300/70">
            {item.message}
          </p>
        </article>
      ))}
    </div>
  );
}
