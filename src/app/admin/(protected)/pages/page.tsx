import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { getPages } from "@/lib/data/store";
import { PageEditor } from "@/components/admin/PageEditor";
import { adminRu as t } from "@/messages/admin.ru";

export default async function AdminPagesPage() {
  const pages = await getPages();

  return (
    <div className="mx-auto max-w-5xl px-6 py-12">
      <Link
        href="/admin"
        className="mb-6 inline-flex items-center gap-2 text-sm text-rose-300/50 hover:text-rose-200"
      >
        <ArrowLeft className="h-4 w-4" /> {t.backToDashboard}
      </Link>
      <h1 className="mb-8 font-display text-3xl font-bold gradient-text">
        {t.pages.pages}
      </h1>
      <div className="space-y-8">
        {pages.map((page) => (
          <PageEditor key={page.slug} page={page} />
        ))}
      </div>
    </div>
  );
}
