import type { Metadata, Viewport } from "next";
import { Playfair_Display, Nunito } from "next/font/google";
import { ThemeScript } from "@/components/layout/ThemeScript";
import "./globals.css";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

const playfair = Playfair_Display({
  subsets: ["latin", "cyrillic"],
  variable: "--font-playfair",
  display: "swap",
});

const nunito = Nunito({
  subsets: ["latin", "cyrillic"],
  variable: "--font-nunito",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Sabrina",
    template: "%s | Sabrina",
  },
  description: "Sabrina — official website. Streams, videos, photos, news and more.",
  metadataBase: process.env.SITE_URL
    ? new URL(process.env.SITE_URL)
    : undefined,
  openGraph: {
    title: "Sabrina",
    description: "Sabrina — official website",
    type: "website",
    locale: "en_US",
    alternateLocale: ["ru_RU"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      data-theme="dark"
      suppressHydrationWarning
      className={`${playfair.variable} ${nunito.variable}`}
    >
      <head>
        <ThemeScript />
      </head>
      <body className="gradient-bg min-h-screen antialiased">{children}</body>
    </html>
  );
}
