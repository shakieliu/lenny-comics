import type { Metadata } from "next";
import { comics, getComicBySlug } from "@/lib/comics-data";
import ComicDetail from "./comic-detail";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return comics.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const comic = getComicBySlug(slug);
  if (!comic) {
    return { title: "Comic Not Found — Lenny Comics" };
  }
  return {
    title: `"${comic.quote}" — ${comic.speaker} | Lenny Comics`,
    description: `${comic.quote} — From ${comic.episode_title}. A 4-panel comic inspired by Lenny's Podcast.`,
    openGraph: {
      title: `"${comic.quote}"`,
      description: `${comic.speaker} — ${comic.episode_title}`,
      images: [comic.cover],
    },
  };
}

export default async function Page({ params }: Props) {
  const { slug } = await params;
  return <ComicDetail slug={slug} />;
}
