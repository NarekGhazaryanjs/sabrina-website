import { setRequestLocale } from "next-intl/server";
import { PageHeader } from "@/components/ui/PageHeader";
import { PageContainer } from "@/components/layout/PageContainer";
import { Reveal } from "@/components/ui/Reveal";
import { getPage } from "@/lib/data/store";
import { localized } from "@/lib/i18n/content";
import type { Locale } from "@/i18n/routing";

export default async function DonatePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const page = await getPage("donate");
  const loc = locale as Locale;
  const title = page ? localized(page, "title", loc) : "Donate";
  const subtitle = page ? localized(page, "subtitle", loc) : "";
  const content = page ? localized(page, "content", loc) : "";

  return (
    <PageContainer narrow>
      <Reveal>
        <PageHeader title={title} subtitle={subtitle || undefined} />
      </Reveal>
      <Reveal delay={150}>
        <div className="card px-8 py-10 text-center">
          {content ? (
            <p className="whitespace-pre-wrap text-left text-lg leading-relaxed text-rose-300/70">
              {content}
            </p>
          ) : (
            <>
              <p className="text-4xl">💝</p>
              <p className="mt-4 text-rose-300/50">Donation info coming soon.</p>
            </>
          )}
        </div>
      </Reveal>
    </PageContainer>
  );
}
