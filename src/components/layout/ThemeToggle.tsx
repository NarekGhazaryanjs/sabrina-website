"use client";

import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import { applyTheme, getStoredTheme, saveTheme, type Theme } from "@/lib/theme";

export function ThemeToggle({ className }: { className?: string }) {
  const t = useTranslations("common");
  const [theme, setTheme] = useState<Theme>("dark");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const stored = getStoredTheme();
    const current =
      stored ??
      (document.documentElement.getAttribute("data-theme") as Theme | null) ??
      "dark";
    setTheme(current === "light" ? "light" : "dark");
    setMounted(true);
  }, []);

  function toggle() {
    const next: Theme = theme === "dark" ? "light" : "dark";
    applyTheme(next);
    saveTheme(next);
    setTheme(next);
  }

  const showSun = !mounted || theme === "dark";

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={theme === "dark" ? t("lightMode") : t("darkMode")}
      className={cn(
        "theme-toggle flex h-11 w-11 items-center justify-center rounded-full border border-rose-400/20 glass transition-all duration-300 hover:scale-105 hover:border-rose-400/35 hover:bg-rose-400/10",
        className
      )}
    >
      {showSun ? (
        <Sun className="h-[18px] w-[18px] text-amber-300" />
      ) : (
        <Moon className="h-[18px] w-[18px] text-indigo-300" />
      )}
    </button>
  );
}
