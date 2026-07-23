import Link from "next/link";
import {
  Video,
  Image,
  Music,
  Newspaper,
  FileText,
  Settings,
  Mail,
} from "lucide-react";
import { adminRu as t } from "@/messages/admin.ru";

const sections = [
  { href: "/admin/videos", key: "videos" as const, icon: Video },
  { href: "/admin/photos", key: "photos" as const, icon: Image },
  { href: "/admin/audio", key: "audio" as const, icon: Music },
  { href: "/admin/news", key: "news" as const, icon: Newspaper },
  { href: "/admin/messages", key: "messages" as const, icon: Mail },
  { href: "/admin/pages", key: "pages" as const, icon: FileText },
  { href: "/admin/settings", key: "settings" as const, icon: Settings },
];

export default function AdminDashboard() {
  return (
    <div className="mx-auto max-w-5xl px-6 py-12">
      <h1 className="mb-2 font-display text-3xl font-bold gradient-text">
        {t.dashboard.title}
      </h1>
      <p className="mb-10 text-rose-300/50">{t.dashboard.subtitle}</p>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {sections.map(({ href, key, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className="group rounded-2xl glass p-6 transition-colors card-hover"
          >
            <div className="mb-3 inline-flex rounded-xl bg-rose-400/8 p-3">
              <Icon className="h-5 w-5 text-rose-400" />
            </div>
            <p className="font-medium text-rose-200">
              {t.sections[key].label}
            </p>
            <p className="mt-1 text-sm text-rose-300/40">
              {t.sections[key].desc}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
