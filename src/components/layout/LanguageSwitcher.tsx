"use client";

import { useLocale } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import { routing, type Locale } from "@/i18n/routing";
import { cn } from "@/lib/utils";

const localeLabels: Record<Locale, string> = {
  en: "EN",
  ru: "RU",
};

export function LanguageSwitcher({ className }: { className?: string }) {
  const locale = useLocale() as Locale;
  const router = useRouter();
  const pathname = usePathname();

  function switchLocale(nextLocale: Locale) {
    if (nextLocale === locale) return;
    router.replace(pathname, { locale: nextLocale });
  }

  return (
    <div
      className={cn(
        "flex items-center gap-0.5 rounded-full glass p-1",
        className
      )}
    >
      {routing.locales.map((loc) => (
        <button
          key={loc}
          onClick={() => switchLocale(loc)}
          className={cn(
            "rounded-full px-3.5 py-1 text-xs font-semibold tracking-wider transition-all duration-200",
            locale === loc
              ? "bg-gradient-to-r from-rose-400 to-lilac-400 text-white shadow-sm shadow-rose-400/30"
              : "text-rose-200/75 hover:text-rose-100"
          )}
        >
          {localeLabels[loc]}
        </button>
      ))}
    </div>
  );
}
