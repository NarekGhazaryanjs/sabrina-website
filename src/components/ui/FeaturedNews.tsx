"use client";

import { useCallback, useEffect, useState } from "react";
import { X } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { Reveal } from "@/components/ui/Reveal";
import { MediaCard } from "@/components/ui/MediaCard";

interface NewsItem {
  id: string;
  title: string;
  content: string;
  featured_image?: string;
}

interface FeaturedNewsProps {
  items: NewsItem[];
  title: string;
  viewAllLabel: string;
}

function truncate(text: string, max = 100) {
  if (text.length <= max) return text;
  return text.slice(0, max).trim() + "…";
}

export function FeaturedNews({
  items,
  title,
  viewAllLabel,
}: FeaturedNewsProps) {
  const [active, setActive] = useState<NewsItem | null>(null);
  const close = useCallback(() => setActive(null), []);

  useEffect(() => {
    if (!active) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") close();
    }
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [active, close]);

  if (items.length === 0) return null;

  return (
    <>
      <section className="mx-auto max-w-6xl px-4 pb-24">
        <Reveal>
          <h2 className="section-title mb-12 text-center text-2xl font-bold md:text-3xl">
            {title}
          </h2>
        </Reveal>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item, i) => (
            <Reveal key={item.id} delay={i * 100}>
              <button
                type="button"
                onClick={() => setActive(item)}
                className="w-full cursor-pointer text-left"
              >
                <MediaCard
                  footer={
                    <div>
                      <p className="font-medium text-rose-200/90">{item.title}</p>
                      <p className="mt-1 line-clamp-2 text-xs text-rose-300/50">
                        {truncate(item.content, 80)}
                      </p>
                    </div>
                  }
                >
                  {item.featured_image ? (
                    <img
                      src={item.featured_image}
                      alt=""
                      className="aspect-video w-full object-cover"
                    />
                  ) : (
                    <div className="flex aspect-video w-full items-center justify-center bg-rose-400/5 text-3xl">
                      📰
                    </div>
                  )}
                </MediaCard>
              </button>
            </Reveal>
          ))}
        </div>
        <Reveal delay={200} className="mt-12 text-center">
          <Link
            href="/news"
            className="link-arrow text-sm font-medium text-rose-400 hover:text-rose-300"
          >
            {viewAllLabel} →
          </Link>
        </Reveal>
      </section>

      {active && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto bg-black/85 p-4 backdrop-blur-sm animate-backdrop-in"
          onClick={close}
        >
          <button
            type="button"
            onClick={close}
            className="fixed right-4 top-4 z-[101] flex h-11 w-11 items-center justify-center rounded-full bg-plum-card/80 text-rose-200 transition-colors hover:bg-rose-400/20 hover:text-white"
            aria-label="Close"
          >
            <X className="h-6 w-6" />
          </button>
          <article
            className="relative my-8 w-full max-w-2xl rounded-2xl glass p-6 md:p-8 animate-modal-in"
            onClick={(e) => e.stopPropagation()}
          >
            {active.featured_image && (
              <img
                src={active.featured_image}
                alt=""
                className="mb-6 w-full max-h-64 rounded-xl object-cover"
              />
            )}
            <h3 className="font-display text-2xl font-bold gradient-text">
              {active.title}
            </h3>
            <p className="mt-4 whitespace-pre-wrap leading-relaxed text-rose-300/70">
              {active.content}
            </p>
          </article>
        </div>
      )}
    </>
  );
}
