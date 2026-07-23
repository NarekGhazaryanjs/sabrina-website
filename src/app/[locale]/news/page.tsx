import { getTranslations, setRequestLocale } from "next-intl/server";
import { PageHeader } from "@/components/ui/PageHeader";
import { EmptyState } from "@/components/ui/EmptyState";
import { PageContainer } from "@/components/layout/PageContainer";
import { Reveal } from "@/components/ui/Reveal";
import { getNews } from "@/lib/data/store";
import { localized } from "@/lib/i18n/content";
import type { Locale } from "@/i18n/routing";

export default async function NewsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("news");
  const items = await getNews();

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
        <div className="space-y-6">
          {items.map((n, i) => (
            <Reveal key={n.id} delay={i * 100}>
              <article className="card p-6 transition-transform duration-300 hover:-translate-y-1">
                {n.featured_image && (
                  <img
                    src={n.featured_image}
                    alt=""
                    className="mb-5 w-full max-h-72 rounded-xl object-cover"
                  />
                )}
                <h3 className="font-display text-xl font-bold gradient-text">
                  {localized(n, "title", locale as Locale)}
                </h3>
                <p className="mt-4 whitespace-pre-wrap leading-relaxed text-rose-300/60">
                  {localized(n, "content", locale as Locale)}
                </p>
              </article>
            </Reveal>
          ))}
        </div>
      )}
    </PageContainer>
  );
}
