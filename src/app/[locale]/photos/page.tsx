import { getTranslations, setRequestLocale } from "next-intl/server";
import { PageHeader } from "@/components/ui/PageHeader";
import { EmptyState } from "@/components/ui/EmptyState";
import { PageContainer } from "@/components/layout/PageContainer";
import { Reveal } from "@/components/ui/Reveal";
import { PhotoGallery } from "@/components/ui/PhotoGallery";
import { getMedia } from "@/lib/data/store";
import { localized } from "@/lib/i18n/content";
import type { Locale } from "@/i18n/routing";

export default async function PhotosPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("photos");
  const photos = await getMedia("photos");

  const items = photos.map((p) => ({
    id: p.id,
    media_url: p.media_url,
    title: localized(p, "title", locale as Locale),
  }));

  return (
    <PageContainer>
      <Reveal>
        <PageHeader title={t("title")} subtitle={t("subtitle")} />
      </Reveal>
      {items.length === 0 ? (
        <Reveal>
          <EmptyState message={t("empty")} />
        </Reveal>
      ) : (
        <PhotoGallery photos={items} />
      )}
    </PageContainer>
  );
}
