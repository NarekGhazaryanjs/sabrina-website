import type { Locale } from "@/i18n/routing";

export function localized(
  item: object,
  field: string,
  locale: Locale
): string {
  const key = `${field}_${locale}`;
  const record = item as Record<string, unknown>;
  return typeof record[key] === "string" ? record[key] : "";
}
