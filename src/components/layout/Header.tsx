"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { ThemeToggle } from "./ThemeToggle";
import { Menu, X, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { key: "home", href: "/" },
  { key: "about", href: "/about" },
  { key: "videos", href: "/videos" },
  { key: "photos", href: "/photos" },
  { key: "audio", href: "/audio" },
  { key: "news", href: "/news" },
  { key: "contact", href: "/contact" },
  { key: "donate", href: "/donate" },
] as const;

export function Header() {
  const t = useTranslations("nav");
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isActive = (href: string) =>
    pathname === href || (href !== "/" && pathname.startsWith(href));

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!mobileOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [mobileOpen]);

  return (
    <header className="animate-header-in sticky top-0 z-50 glass border-b border-rose-400/15">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3.5">
        <Link href="/" className="logo-glow group flex min-w-0 items-center gap-2.5">
          <div className="shrink-0 rounded-full bg-rose-400/15 p-1.5 transition-all duration-300 group-hover:scale-110 group-hover:bg-rose-400/25">
            <Sparkles className="h-4 w-4 text-rose-400 transition-transform duration-300 group-hover:rotate-12" />
          </div>
          <span className="truncate font-display text-xl font-bold gradient-text">
            Sabrina
          </span>
        </Link>

        <nav className="hidden items-center gap-0.5 lg:flex">
          {navItems.map(({ key, href }) => (
            <Link
              key={key}
              href={href}
              className={cn(
                "rounded-full px-3.5 py-1.5 text-sm font-medium transition-all duration-200",
                isActive(href)
                  ? "nav-active"
                  : "nav-link text-rose-200/75 hover:bg-rose-400/8 hover:text-rose-100"
              )}
            >
              {t(key)}
            </Link>
          ))}
        </nav>

        <div className="flex shrink-0 items-center gap-2 sm:gap-3">
          <ThemeToggle />
          <LanguageSwitcher className="hidden sm:flex" />
          <button
            type="button"
            onClick={() => setMobileOpen(!mobileOpen)}
            className="flex h-11 w-11 items-center justify-center rounded-full text-rose-300 transition-colors hover:bg-rose-400/10 lg:hidden"
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <nav className="border-t border-rose-400/12 px-4 py-4 lg:hidden">
          <div className="mb-4 flex justify-center sm:hidden">
            <LanguageSwitcher />
          </div>
          <div className="flex max-h-[70vh] flex-col gap-1 overflow-y-auto">
            {navItems.map(({ key, href }) => (
              <Link
                key={key}
                href={href}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  "rounded-xl px-4 py-3.5 text-base font-medium transition-all",
                  isActive(href)
                    ? "nav-active"
                    : "nav-link text-rose-200/60 hover:bg-rose-400/8 hover:text-rose-200"
                )}
              >
                {t(key)}
              </Link>
            ))}
          </div>
        </nav>
      )}
    </header>
  );
}
