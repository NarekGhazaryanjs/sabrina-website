import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { getNews } from "@/lib/data/store";
import { NewsManager } from "@/components/admin/NewsManager";
import { adminRu as t } from "@/messages/admin.ru";

export default async function AdminNewsPage() {
  const items = await getNews();

  return (
    <div className="mx-auto max-w-5xl px-6 py-12">
      <Link
        href="/admin"
        className="mb-6 inline-flex items-center gap-2 text-sm text-rose-300/50 hover:text-rose-200"
      >
        <ArrowLeft className="h-4 w-4" /> {t.backToDashboard}
      </Link>
      <h1 className="mb-8 font-display text-3xl font-bold gradient-text">
        {t.pages.news}
      </h1>
      <NewsManager items={items} />
    </div>
  );
}
