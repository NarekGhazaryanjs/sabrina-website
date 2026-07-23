import { setRequestLocale } from "next-intl/server";
import { PageHeader } from "@/components/ui/PageHeader";
import { EmptyState } from "@/components/ui/EmptyState";
import { PageContainer } from "@/components/layout/PageContainer";
import { Reveal } from "@/components/ui/Reveal";
import { getPage } from "@/lib/data/store";
import { localized } from "@/lib/i18n/content";
import type { Locale } from "@/i18n/routing";

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const page = await getPage("about");
  const loc = locale as Locale;
  const title = page ? localized(page, "title", loc) : "About";
  const subtitle = page ? localized(page, "subtitle", loc) : "";
  const content = page ? localized(page, "content", loc) : "";

  if (!content) {
    return (
      <PageContainer narrow>
        <Reveal>
          <PageHeader title={title} subtitle={subtitle || undefined} />
        </Reveal>
        <Reveal delay={100}>
          <EmptyState message="Content coming soon." />
        </Reveal>
      </PageContainer>
    );
  }

  return (
    <PageContainer narrow>
      <Reveal>
        <PageHeader title={title} subtitle={subtitle || undefined} />
      </Reveal>
      <Reveal delay={150}>
        <div className="card px-8 py-10">
          <p className="whitespace-pre-wrap text-lg leading-relaxed text-rose-300/70">
            {content}
          </p>
        </div>
      </Reveal>
    </PageContainer>
  );
}
