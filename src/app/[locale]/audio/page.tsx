import { getTranslations, setRequestLocale } from "next-intl/server";
import { PageHeader } from "@/components/ui/PageHeader";
import { EmptyState } from "@/components/ui/EmptyState";
import { PageContainer } from "@/components/layout/PageContainer";
import { Reveal } from "@/components/ui/Reveal";
import { getMedia } from "@/lib/data/store";
import { localized } from "@/lib/i18n/content";
import type { Locale } from "@/i18n/routing";

export default async function AudioPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("audio");
  const items = await getMedia("audio");

  return (
    <PageContainer narrow>
      <Reveal>
        <PageHeader title={t("title")} subtitle={t("subtitle")} />
      </Reveal>
      {items.length === 0 ? (
        <Reveal>
          <EmptyState message={t("empty")} />
        </Reveal>
      ) : (
        <div className="space-y-4">
          {items.map((a, i) => (
            <Reveal key={a.id} delay={i * 80}>
              <div className="card p-5 transition-transform duration-300 hover:-translate-y-0.5">
                <p className="mb-3 font-medium text-rose-200">
                  {localized(a, "title", locale as Locale)}
                </p>
                <audio src={a.media_url} controls className="w-full" />
                {localized(a, "description", locale as Locale) && (
                  <p className="mt-3 text-sm text-rose-300/50">
                    {localized(a, "description", locale as Locale)}
                  </p>
                )}
              </div>
            </Reveal>
          ))}
        </div>
      )}
    </PageContainer>
  );
}
