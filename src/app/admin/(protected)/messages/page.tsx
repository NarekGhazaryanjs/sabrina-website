import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { getMessages } from "@/lib/data/store";
import { MessagesManager } from "@/components/admin/MessagesManager";
import { adminRu as t } from "@/messages/admin.ru";

export default async function AdminMessagesPage() {
  const items = await getMessages();
  const unread = items.filter((m) => !m.read).length;

  return (
    <div className="mx-auto max-w-5xl px-6 py-12">
      <Link
        href="/admin"
        className="mb-6 inline-flex items-center gap-2 text-sm text-rose-300/50 hover:text-rose-200"
      >
        <ArrowLeft className="h-4 w-4" /> {t.backToDashboard}
      </Link>
      <div className="mb-8 flex flex-wrap items-center gap-3">
        <h1 className="font-display text-3xl font-bold gradient-text">
          {t.pages.messages}
        </h1>
        {unread > 0 && (
          <span className="rounded-full bg-rose-400/20 px-3 py-1 text-sm text-rose-300">
            {unread} {t.messages.unreadCount}
          </span>
        )}
      </div>
      <MessagesManager items={items} />
    </div>
  );
}
