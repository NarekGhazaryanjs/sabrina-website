"use client";

import { useTranslations } from "next-intl";
import { Heart, Sparkles } from "lucide-react";
import { Reveal } from "@/components/ui/Reveal";

export function Footer() {
  const t = useTranslations("footer");
  const year = new Date().getFullYear();

  return (
    <footer className="relative mt-auto border-t border-rose-400/12">
      <Reveal>
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-rose-400/30 to-transparent" />
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-4 px-4 py-12 text-center">
        <div className="flex items-center gap-2.5 transition-transform duration-300 hover:scale-[1.02]">
          <Sparkles className="h-4 w-4 text-lilac-400 transition-transform duration-500 hover:rotate-12" />
          <span className="font-display text-xl gradient-text">Sabrina</span>
          <Sparkles className="h-4 w-4 text-rose-400 transition-transform duration-500 hover:-rotate-12" />
        </div>
        <p className="flex items-center gap-1.5 text-sm text-rose-300/50">
          {t("madeWith")}
          <Heart className="h-3.5 w-3.5 fill-rose-400 text-rose-400" />
        </p>
        <p className="text-xs text-rose-400/30">
          © {year} Sabrina. {t("rights")}
        </p>
        </div>
      </Reveal>
    </footer>
  );
}
