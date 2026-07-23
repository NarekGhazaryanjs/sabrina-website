import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { getMedia } from "@/lib/data/store";
import { MediaManager } from "@/components/admin/MediaManager";
import { adminRu as t } from "@/messages/admin.ru";

export default async function AdminAudioPage() {
  const items = await getMedia("audio");

  return (
    <div className="mx-auto max-w-5xl px-6 py-12">
      <Link
        href="/admin"
        className="mb-6 inline-flex items-center gap-2 text-sm text-rose-300/50 hover:text-rose-200"
      >
        <ArrowLeft className="h-4 w-4" /> {t.backToDashboard}
      </Link>
      <h1 className="mb-8 font-display text-3xl font-bold gradient-text">
        {t.pages.audio}
      </h1>
      <MediaManager
        type="audio"
        label={t.media.audio}
        pluralLabel={t.media.audioFiles}
        accept="audio/*"
        items={items}
      />
    </div>
  );
}
