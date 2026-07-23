import { setRequestLocale } from "next-intl/server";
import { PageHeader } from "@/components/ui/PageHeader";
import { PageContainer } from "@/components/layout/PageContainer";
import { Reveal } from "@/components/ui/Reveal";
import { ContactForm } from "@/components/ui/ContactForm";
import { SocialLinks } from "@/components/ui/SocialLinks";
import { getPage, getSettings } from "@/lib/data/store";
import { localized } from "@/lib/i18n/content";
import type { Locale } from "@/i18n/routing";

export default async function ContactPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const page = await getPage("contact");
  const settings = await getSettings();
  const loc = locale as Locale;

  const title = page ? localized(page, "title", loc) : "Contact";
  const subtitle = page ? localized(page, "subtitle", loc) : "";
  const content = page ? localized(page, "content", loc) : "";

  return (
    <PageContainer narrow>
      <Reveal>
        <PageHeader title={title} subtitle={subtitle || undefined} />
      </Reveal>

      {content && (
        <Reveal delay={100}>
          <div className="card mb-8 px-6 py-6">
            <p className="whitespace-pre-wrap text-center leading-relaxed text-rose-300/70">
              {content}
            </p>
          </div>
        </Reveal>
      )}

      <Reveal delay={150}>
        <div className="mb-8">
          <ContactForm />
        </div>
      </Reveal>

      {settings.email && (
        <Reveal delay={200}>
          <div className="card mb-8 px-6 py-6 text-center">
            <p className="text-sm text-rose-400/60">Email</p>
            <a
              href={`mailto:${settings.email}`}
              className="mt-1 inline-block text-lg text-rose-200 transition-colors hover:text-rose-400"
            >
              {settings.email}
            </a>
          </div>
        </Reveal>
      )}

      {settings.socials.length > 0 && (
        <Reveal delay={250}>
          <SocialLinks socials={settings.socials} />
        </Reveal>
      )}

      {!settings.email && settings.socials.length === 0 && !content && (
        <Reveal delay={100}>
          <p className="text-center text-rose-300/40">
            Contact info coming soon.
          </p>
        </Reveal>
      )}
    </PageContainer>
  );
}
