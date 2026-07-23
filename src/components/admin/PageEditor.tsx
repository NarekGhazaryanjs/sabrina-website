"use client";

import { useState } from "react";
import { BilingualInput } from "./BilingualInput";
import type { PageContent } from "@/lib/types/content";
import { adminRu as t } from "@/messages/admin.ru";

const pageNames: Record<string, string> = {
  home: t.pages.home,
  about: t.pages.about,
  contact: t.pages.contact,
  donate: t.pages.donate,
};

export function PageEditor({ page }: { page: PageContent }) {
  const [titleEn, setTitleEn] = useState(page.title_en);
  const [titleRu, setTitleRu] = useState(page.title_ru);
  const [subtitleEn, setSubtitleEn] = useState(page.subtitle_en);
  const [subtitleRu, setSubtitleRu] = useState(page.subtitle_ru);
  const [contentEn, setContentEn] = useState(page.content_en);
  const [contentRu, setContentRu] = useState(page.content_ru);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setSaved(false);

    await fetch("/api/admin/pages", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        slug: page.slug,
        title_en: titleEn,
        title_ru: titleRu,
        subtitle_en: subtitleEn,
        subtitle_ru: subtitleRu,
        content_en: contentEn,
        content_ru: contentRu,
      }),
    });

    setLoading(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <form onSubmit={handleSave} className="space-y-4 rounded-2xl glass p-6">
      <div>
        <h2 className="font-medium text-rose-200">
          {pageNames[page.slug] ?? page.slug}
        </h2>
        {t.pageHints[page.slug as keyof typeof t.pageHints] && (
          <p className="mt-1 text-sm text-rose-300/45">
            {t.pageHints[page.slug as keyof typeof t.pageHints]}
          </p>
        )}
      </div>

      <BilingualInput
        labelEn={t.form.pageTitleEn}
        labelRu={t.form.pageTitleRu}
        nameEn="title_en"
        nameRu="title_ru"
        valueEn={titleEn}
        valueRu={titleRu}
        onChangeEn={setTitleEn}
        onChangeRu={setTitleRu}
        required
      />

      <BilingualInput
        labelEn={t.form.pageSubtitleEn}
        labelRu={t.form.pageSubtitleRu}
        nameEn="subtitle_en"
        nameRu="subtitle_ru"
        valueEn={subtitleEn}
        valueRu={subtitleRu}
        onChangeEn={setSubtitleEn}
        onChangeRu={setSubtitleRu}
      />

      <BilingualInput
        labelEn={t.form.contentEn}
        labelRu={t.form.contentRu}
        nameEn="content_en"
        nameRu="content_ru"
        valueEn={contentEn}
        valueRu={contentRu}
        onChangeEn={setContentEn}
        onChangeRu={setContentRu}
        multiline
      />

      <div className="flex items-center gap-4">
        <button
          type="submit"
          disabled={loading}
          className="btn-primary rounded-xl px-6 py-2.5 text-sm font-medium text-pearl disabled:opacity-50"
        >
          {loading ? t.form.saving : t.form.save}
        </button>
        {saved && (
          <span className="text-sm text-rose-400/80">{t.form.saved}</span>
        )}
      </div>
    </form>
  );
}
