import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Sparkles, Play, Heart } from "lucide-react";
import { getLatestMedia, getLatestNews, getPage } from "@/lib/data/store";
import { localized } from "@/lib/i18n/content";
import type { Locale } from "@/i18n/routing";
import { Reveal } from "@/components/ui/Reveal";
import { MediaCard } from "@/components/ui/MediaCard";
import { FeaturedPhotos } from "@/components/ui/FeaturedPhotos";
import { FeaturedNews } from "@/components/ui/FeaturedNews";

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("home");
  const nav = await getTranslations("nav");
  const home = await getPage("home");
  const loc = locale as Locale;
  const heroTitle = home ? localized(home, "title", loc) : t("heroTitle");
  const heroSubtitle = home
    ? localized(home, "subtitle", loc)
    : t("heroSubtitle");
  const heroIntro = home ? localized(home, "content", loc) : t("heroIntro");
  const videos = await getLatestMedia("videos", 3);
  const photos = (await getLatestMedia("photos", 3)).map((p) => ({
      id: p.id,
      media_url: p.media_url,
      title: localized(p, "title", locale as Locale),
    }));
  const news = (await getLatestNews(3)).map((n) => ({
      id: n.id,
      title: localized(n, "title", locale as Locale),
      content: localized(n, "content", locale as Locale),
      featured_image: n.featured_image,
    }));

  return (
    <>
      <section className="relative overflow-hidden px-4 py-24 md:py-40">
        <div className="hero-glow pointer-events-none absolute inset-0" />
        <div className="relative mx-auto max-w-4xl text-center">
          <div className="badge animate-hero-badge mb-8 inline-flex items-center gap-2 rounded-full px-5 py-2 text-sm">
            <Sparkles className="h-4 w-4 text-rose-400" />
            {heroSubtitle}
          </div>

          <h1 className="animate-hero-title font-display text-5xl font-bold leading-tight tracking-tight md:text-7xl lg:text-8xl">
            <span className="gradient-text">{heroTitle}</span>
          </h1>

          {heroIntro && (
            <Reveal delay={150} className="mt-8 md:mt-10">
              <div className="glass glass-hover mx-auto max-w-2xl rounded-2xl px-6 py-5 md:px-8 md:py-6">
                <p className="text-sm leading-relaxed text-rose-200/75 md:text-base">
                  {heroIntro}
                </p>
              </div>
            </Reveal>
          )}

          <div className="animate-hero-cta mt-10 flex flex-wrap items-center justify-center gap-4 md:mt-12">
            <Link
              href="/videos"
              className="btn-primary inline-flex items-center gap-2.5 rounded-full px-9 py-4 font-semibold text-white"
            >
              <Play className="h-4 w-4 fill-white" />
              {t("heroCta")}
            </Link>
            <Link
              href="/donate"
              className="btn-secondary inline-flex items-center gap-2.5 rounded-full px-9 py-4 font-semibold text-rose-200"
            >
              <Heart className="h-4 w-4 text-rose-400" />
              {nav("donate")}
            </Link>
          </div>
        </div>
      </section>

      {videos.length > 0 && (
        <section className="mx-auto max-w-6xl px-4 pb-24">
          <Reveal>
            <h2 className="section-title mb-12 text-center text-2xl font-bold md:text-3xl">
              {t("featuredVideos")}
            </h2>
          </Reveal>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {videos.map((v, i) => (
              <Reveal key={v.id} delay={i * 100}>
                <MediaCard
                  footer={
                    <p className="text-sm text-rose-200/80">
                      {localized(v, "title", locale as Locale)}
                    </p>
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
          <Reveal delay={200} className="mt-12 text-center">
            <Link
              href="/videos"
              className="link-arrow text-sm font-medium text-rose-400 hover:text-rose-300"
            >
              {t("viewAll")} →
            </Link>
          </Reveal>
        </section>
      )}

      <FeaturedPhotos
        photos={photos}
        title={t("featuredPhotos")}
        viewAllLabel={t("viewAll")}
      />

      <FeaturedNews
        items={news}
        title={t("featuredNews")}
        viewAllLabel={t("viewAll")}
      />
    </>
  );
}
