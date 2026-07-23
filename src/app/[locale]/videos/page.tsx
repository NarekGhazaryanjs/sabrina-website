import { getTranslations, setRequestLocale } from "next-intl/server";
import { PageHeader } from "@/components/ui/PageHeader";
import { EmptyState } from "@/components/ui/EmptyState";
import { PageContainer } from "@/components/layout/PageContainer";
import { Reveal } from "@/components/ui/Reveal";
import { MediaCard } from "@/components/ui/MediaCard";
import { getMedia } from "@/lib/data/store";
import { localized } from "@/lib/i18n/content";
import type { Locale } from "@/i18n/routing";

export default async function VideosPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("videos");
  const videos = await getMedia("videos");

  return (
    <PageContainer>
      <Reveal>
        <PageHeader title={t("title")} subtitle={t("subtitle")} />
      </Reveal>
      {videos.length === 0 ? (
        <Reveal>
          <EmptyState message={t("empty")} />
        </Reveal>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {videos.map((v, i) => (
            <Reveal key={v.id} delay={i * 80}>
              <MediaCard
                footer={
                  <div>
                    <h3 className="font-medium text-rose-200">
                      {localized(v, "title", locale as Locale)}
                    </h3>
                    {localized(v, "description", locale as Locale) && (
                      <p className="mt-1 text-sm text-rose-300/50">
                        {localized(v, "description", locale as Locale)}
                      </p>
                    )}
                  </div>
                }
              >
                <video
                  src={v.media_url}
                  className="aspect-video w-full object-cover"
                  controls
                />
              </MediaCard>
            </Reveal>
          ))}
        </div>
      )}
    </PageContainer>
  );
}
