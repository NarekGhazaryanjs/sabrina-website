import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Админ — Sabrina",
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div lang="ru" className="min-h-screen bg-plum text-pearl">
      {children}
    </div>
  );
}
