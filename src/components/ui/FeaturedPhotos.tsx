"use client";

import { useCallback, useEffect, useState } from "react";
import { X } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { Reveal } from "@/components/ui/Reveal";
import { MediaCard } from "@/components/ui/MediaCard";

interface Photo {
  id: string;
  media_url: string;
  title: string;
}

interface FeaturedPhotosProps {
  photos: Photo[];
  title: string;
  viewAllLabel: string;
}

export function FeaturedPhotos({
  photos,
  title,
  viewAllLabel,
}: FeaturedPhotosProps) {
  const [active, setActive] = useState<Photo | null>(null);
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

  if (photos.length === 0) return null;

  return (
    <>
      <section className="mx-auto max-w-6xl px-4 pb-24">
        <Reveal>
          <h2 className="section-title mb-12 text-center text-2xl font-bold md:text-3xl">
            {title}
          </h2>
        </Reveal>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {photos.map((p, i) => (
            <Reveal key={p.id} delay={i * 100}>
              <button
                type="button"
                onClick={() => setActive(p)}
                className="w-full cursor-zoom-in text-left"
              >
                <MediaCard
                  footer={
                    <p className="text-sm text-rose-200/80">{p.title}</p>
                  }
                >
                  <img
                    src={p.media_url}
                    alt={p.title}
                    className="aspect-square w-full object-cover"
                  />
                </MediaCard>
              </button>
            </Reveal>
          ))}
        </div>
        <Reveal delay={200} className="mt-12 text-center">
          <Link
            href="/photos"
            className="link-arrow text-sm font-medium text-rose-400 hover:text-rose-300"
          >
            {viewAllLabel} →
          </Link>
        </Reveal>
      </section>

      {active && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/85 p-4 backdrop-blur-sm animate-backdrop-in"
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
          <div
            className="relative max-h-[90vh] max-w-5xl"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={active.media_url}
              alt={active.title}
              className="max-h-[85vh] w-full rounded-xl object-contain shadow-2xl shadow-rose-500/10 animate-modal-in"
            />
            <p className="mt-4 text-center text-sm text-rose-200/80">
              {active.title}
            </p>
          </div>
        </div>
      )}
    </>
  );
}
