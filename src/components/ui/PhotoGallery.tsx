"use client";

import { useCallback, useEffect, useState } from "react";
import { X } from "lucide-react";
import { Reveal } from "@/components/ui/Reveal";

interface Photo {
  id: string;
  media_url: string;
  title: string;
}

interface PhotoGalleryProps {
  photos: Photo[];
}

export function PhotoGallery({ photos }: PhotoGalleryProps) {
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

  return (
    <>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 lg:gap-5">
        {photos.map((p, i) => (
          <Reveal key={p.id} delay={(i % 4) * 80}>
            <button
              type="button"
              onClick={() => setActive(p)}
              className="photo-item w-full cursor-zoom-in text-left"
            >
              <img
                src={p.media_url}
                alt={p.title}
                className="aspect-square w-full object-cover"
              />
              <p className="p-2.5 text-center text-xs text-rose-300/60">
                {p.title}
              </p>
            </button>
          </Reveal>
        ))}
      </div>

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
