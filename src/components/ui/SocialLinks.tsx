import type { SocialLink } from "@/lib/types/content";

export function SocialLinks({ socials }: { socials: SocialLink[] }) {
  const items = socials.filter((s) => s.url.trim());

  if (items.length === 0) return null;

  return (
    <div className="flex flex-wrap justify-center gap-3">
      {items.map((s, i) => (
        <a
          key={s.id}
          href={s.url}
          target="_blank"
          rel="noopener noreferrer"
          className="social-pill btn-secondary rounded-full px-6 py-2.5 text-sm font-medium text-rose-200"
          style={{ animationDelay: `${i * 50}ms` }}
        >
          {s.label}
        </a>
      ))}
    </div>
  );
}
