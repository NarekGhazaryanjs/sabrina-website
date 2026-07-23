import { revalidatePath } from "next/cache";
import { routing } from "@/i18n/routing";
import type { MediaType } from "@/lib/types/content";

type RevalidateTarget =
  | "home"
  | "about"
  | "contact"
  | "donate"
  | "videos"
  | "photos"
  | "news"
  | "audio";

function revalidateLocalePaths(locale: string, targets: RevalidateTarget[]) {
  for (const target of targets) {
    if (target === "home") {
      revalidatePath(`/${locale}`);
    } else {
      revalidatePath(`/${locale}/${target}`);
    }
  }
}

export function revalidatePublicContent(targets: RevalidateTarget[]) {
  for (const locale of routing.locales) {
    revalidateLocalePaths(locale, targets);
  }
}

export function revalidateForMediaType(type: MediaType) {
  if (type === "videos") {
    revalidatePublicContent(["home", "videos"]);
    return;
  }
  if (type === "photos") {
    revalidatePublicContent(["home", "photos"]);
    return;
  }
  revalidatePublicContent(["audio"]);
}

const pageSlugTargets: Record<string, RevalidateTarget[]> = {
  home: ["home"],
  about: ["about"],
  contact: ["contact"],
  donate: ["donate"],
};

export function revalidateForPage(slug: string) {
  const targets = pageSlugTargets[slug];
  if (targets) revalidatePublicContent(targets);
}
