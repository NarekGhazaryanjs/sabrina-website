import { promises as fs } from "fs";
import path from "path";
import type {
  ContactMessage,
  MediaItem,
  MediaType,
  NewsItem,
  PageContent,
  SiteSettings,
  SocialLink,
} from "@/lib/types/content";

const DATA_DIR = path.join(process.cwd(), "data");

async function readJson<T>(filename: string, fallback: T): Promise<T> {
  try {
    const raw = await fs.readFile(path.join(DATA_DIR, filename), "utf-8");
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

async function writeJson<T>(filename: string, data: T): Promise<void> {
  await fs.mkdir(DATA_DIR, { recursive: true });
  await fs.writeFile(
    path.join(DATA_DIR, filename),
    JSON.stringify(data, null, 2),
    "utf-8"
  );
}

export async function getMedia(type: MediaType): Promise<MediaItem[]> {
  const items = await readJson<MediaItem[]>(`${type}.json`, []);
  return items
    .filter((item) => item.published)
    .sort((a, b) => b.created_at.localeCompare(a.created_at));
}

export async function getLatestMedia(
  type: MediaType,
  limit = 3
): Promise<MediaItem[]> {
  const items = await getMedia(type);
  return items.slice(0, limit);
}

export async function getMediaItem(
  type: MediaType,
  id: string
): Promise<MediaItem | null> {
  const items = await readJson<MediaItem[]>(`${type}.json`, []);
  return items.find((i) => i.id === id) ?? null;
}

export async function addMedia(
  type: MediaType,
  item: MediaItem
): Promise<MediaItem> {
  const items = await readJson<MediaItem[]>(`${type}.json`, []);
  items.unshift(item);
  await writeJson(`${type}.json`, items);
  return item;
}

export async function deleteMedia(
  type: MediaType,
  id: string
): Promise<MediaItem | null> {
  const items = await readJson<MediaItem[]>(`${type}.json`, []);
  const index = items.findIndex((i) => i.id === id);
  if (index === -1) return null;
  const [removed] = items.splice(index, 1);
  await writeJson(`${type}.json`, items);
  return removed;
}

export async function updateMedia(
  type: MediaType,
  id: string,
  data: Partial<Omit<MediaItem, "id">>
): Promise<MediaItem | null> {
  const items = await readJson<MediaItem[]>(`${type}.json`, []);
  const index = items.findIndex((i) => i.id === id);
  if (index === -1) return null;
  items[index] = { ...items[index], ...data };
  await writeJson(`${type}.json`, items);
  return items[index];
}

export async function getNews(): Promise<NewsItem[]> {
  const items = await readJson<NewsItem[]>("news.json", []);
  return items
    .filter((item) => item.published)
    .sort((a, b) => b.created_at.localeCompare(a.created_at));
}

export async function getLatestNews(limit = 3): Promise<NewsItem[]> {
  const items = await getNews();
  return items.slice(0, limit);
}

export async function addNews(item: NewsItem): Promise<NewsItem> {
  const items = await readJson<NewsItem[]>("news.json", []);
  items.unshift(item);
  await writeJson("news.json", items);
  return item;
}

export async function deleteNews(id: string): Promise<NewsItem | null> {
  const items = await readJson<NewsItem[]>("news.json", []);
  const index = items.findIndex((i) => i.id === id);
  if (index === -1) return null;
  const [removed] = items.splice(index, 1);
  await writeJson("news.json", items);
  return removed;
}

export async function updateNews(
  id: string,
  data: Partial<Omit<NewsItem, "id">>
): Promise<NewsItem | null> {
  const items = await readJson<NewsItem[]>("news.json", []);
  const index = items.findIndex((i) => i.id === id);
  if (index === -1) return null;
  items[index] = { ...items[index], ...data };
  await writeJson("news.json", items);
  return items[index];
}

const defaultPages: PageContent[] = [
  {
    slug: "home",
    title_en: "Queen Sabrina",
    title_ru: "Королева Сабрина",
    subtitle_en: "Streamer · Creator · Dreamer",
    subtitle_ru: "Стример · Креатор · Мечтательница",
    content_en:
      "Welcome to my corner of the internet — streams, videos, photos and everything I love sharing with you. Pull up a chair and stay awhile.",
    content_ru:
      "Добро пожаловать в мой уголок интернета — стримы, видео, фото и всё, чем я люблю делиться с вами. Устраивайся поудобнее и оставайся.",
  },
  {
    slug: "about",
    title_en: "About Me",
    title_ru: "Обо мне",
    subtitle_en: "",
    subtitle_ru: "",
    content_en: "",
    content_ru: "",
  },
  {
    slug: "contact",
    title_en: "Contact",
    title_ru: "Контакт",
    subtitle_en: "Get in touch with me",
    subtitle_ru: "Свяжись со мной",
    content_en: "",
    content_ru: "",
  },
  {
    slug: "donate",
    title_en: "Donate",
    title_ru: "Донат",
    subtitle_en: "",
    subtitle_ru: "",
    content_en: "",
    content_ru: "",
  },
];

function normalizePage(
  page: Partial<PageContent> & { slug: string }
): PageContent {
  const fallback =
    defaultPages.find((p) => p.slug === page.slug) ??
    defaultPages.find((p) => p.slug === "about")!;

  return {
    slug: page.slug,
    title_en: page.title_en ?? fallback.title_en,
    title_ru: page.title_ru ?? fallback.title_ru,
    subtitle_en: page.subtitle_en ?? fallback.subtitle_en,
    subtitle_ru: page.subtitle_ru ?? fallback.subtitle_ru,
    content_en: page.content_en ?? fallback.content_en,
    content_ru: page.content_ru ?? fallback.content_ru,
  };
}

export async function getPages(): Promise<PageContent[]> {
  const stored = await readJson<Partial<PageContent>[]>("pages.json", []);
  const slugs = defaultPages.map((p) => p.slug);
  return slugs.map((slug) => {
    const item = stored.find((p) => p.slug === slug);
    return normalizePage({ slug, ...item });
  });
}

export async function getPage(slug: string): Promise<PageContent | null> {
  const pages = await getPages();
  return pages.find((p) => p.slug === slug) ?? null;
}

export async function updatePage(
  slug: string,
  data: Partial<PageContent>
): Promise<PageContent> {
  const pages = await getPages();
  const index = pages.findIndex((p) => p.slug === slug);
  if (index === -1) throw new Error("Page not found");
  pages[index] = { ...pages[index], ...data, slug };
  await writeJson("pages.json", pages);
  return pages[index];
}

const defaultSettings: SiteSettings = {
  email: "",
  socials: [],
};

const legacySocialLabels: Record<string, string> = {
  telegram: "Telegram",
  tiktok: "TikTok",
  instagram: "Instagram",
  youtube: "YouTube",
  discord: "Discord",
  x: "X",
  beacons: "Beacons",
};

function normalizeSettings(stored: Record<string, unknown>): SiteSettings {
  if (Array.isArray(stored.socials)) {
    return {
      email: typeof stored.email === "string" ? stored.email : "",
      socials: (stored.socials as SocialLink[])
        .filter((s) => s && typeof s.url === "string" && s.url.trim())
        .map((s) => ({
          id: s.id || crypto.randomUUID(),
          label: s.label?.trim() || "Link",
          url: s.url.trim(),
        })),
    };
  }

  const socials: SocialLink[] = [];
  for (const [key, label] of Object.entries(legacySocialLabels)) {
    const url = stored[key];
    if (typeof url === "string" && url.trim()) {
      socials.push({ id: key, label, url: url.trim() });
    }
  }

  return {
    email: typeof stored.email === "string" ? stored.email : "",
    socials,
  };
}

export async function getSettings(): Promise<SiteSettings> {
  const stored = await readJson<Record<string, unknown>>(
    "settings.json",
    defaultSettings as unknown as Record<string, unknown>
  );
  return normalizeSettings(stored);
}

export async function updateSettings(
  data: Partial<SiteSettings>
): Promise<SiteSettings> {
  const current = await getSettings();
  const updated = { ...current, ...data };
  await writeJson("settings.json", updated);
  return updated;
}

export async function getMessages(): Promise<ContactMessage[]> {
  const items = await readJson<ContactMessage[]>("messages.json", []);
  return items.sort((a, b) => b.created_at.localeCompare(a.created_at));
}

export async function addMessage(
  item: ContactMessage
): Promise<ContactMessage> {
  const items = await readJson<ContactMessage[]>("messages.json", []);
  items.unshift(item);
  await writeJson("messages.json", items);
  return item;
}

export async function markMessageRead(
  id: string
): Promise<ContactMessage | null> {
  const items = await readJson<ContactMessage[]>("messages.json", []);
  const index = items.findIndex((i) => i.id === id);
  if (index === -1) return null;
  items[index] = { ...items[index], read: true };
  await writeJson("messages.json", items);
  return items[index];
}

export async function deleteMessage(
  id: string
): Promise<ContactMessage | null> {
  const items = await readJson<ContactMessage[]>("messages.json", []);
  const index = items.findIndex((i) => i.id === id);
  if (index === -1) return null;
  const [removed] = items.splice(index, 1);
  await writeJson("messages.json", items);
  return removed;
}

export async function deleteUploadedFile(publicUrl: string): Promise<void> {
  if (!publicUrl.startsWith("/uploads/")) return;
  const filePath = path.join(process.cwd(), "public", publicUrl);
  try {
    await fs.unlink(filePath);
  } catch {
    // file may already be gone
  }
}
