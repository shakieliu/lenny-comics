import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "https://lenny-comics.vercel.app"
  ),
  title: "Lenny Comics — PM Wisdom in 4 Panels",
  description:
    "Product management golden quotes from Lenny's Podcast, illustrated as 4-panel comics.",
  openGraph: {
    title: "Lenny Comics",
    description: "PM golden quotes × everyday life scenes — in 4 panels.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
