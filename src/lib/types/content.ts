export interface MediaItem {
  id: string;
  title_en: string;
  title_ru: string;
  description_en: string;
  description_ru: string;
  media_url: string;
  sort_order: number;
  published: boolean;
  created_at: string;
}

export interface NewsItem {
  id: string;
  title_en: string;
  title_ru: string;
  content_en: string;
  content_ru: string;
  featured_image?: string;
  published: boolean;
  created_at: string;
}

export interface PageContent {
  slug: string;
  title_en: string;
  title_ru: string;
  subtitle_en: string;
  subtitle_ru: string;
  content_en: string;
  content_ru: string;
}

export interface SocialLink {
  id: string;
  label: string;
  url: string;
}

export interface SiteSettings {
  email: string;
  socials: SocialLink[];
}

export type MediaType = "videos" | "photos" | "audio";

export interface ContactMessage {
  id: string;
  name: string;
  message: string;
  read: boolean;
  created_at: string;
}
