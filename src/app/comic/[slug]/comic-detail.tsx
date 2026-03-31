"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { getComicBySlug, getAdjacentComics, comics } from "@/lib/comics-data";
import { useSwipe } from "@/hooks/use-swipe";

gsap.registerPlugin(ScrollTrigger);

function timestampToSeconds(ts: string): number {
  const parts = ts.split(":").map(Number);
  return parts[0] * 3600 + parts[1] * 60 + parts[2];
}

export default function ComicDetail({ slug }: { slug: string }) {
  const comic = getComicBySlug(slug);
  const { prev, next } = getAdjacentComics(slug);
  const containerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Swipe left → next comic, swipe right → previous comic
  useSwipe({
    onSwipeLeft: () => {
      if (next) router.push(`/comic/${next.slug}`);
    },
    onSwipeRight: () => {
      if (prev) router.push(`/comic/${prev.slug}`);
    },
  });

  // Keyboard navigation: ← → arrow keys
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === "ArrowLeft" && prev) router.push(`/comic/${prev.slug}`);
      if (e.key === "ArrowRight" && next) router.push(`/comic/${next.slug}`);
    }
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [prev, next, router]);

  useEffect(() => {
    if (!comic || !containerRef.current) return;

    const ctx = gsap.context(() => {
      // Animate the quote
      gsap.from(".detail-quote", {
        y: 40,
        opacity: 0,
        duration: 0.8,
        ease: "power3.out",
      });

      // Animate meta info
      gsap.from(".detail-meta", {
        y: 20,
        opacity: 0,
        duration: 0.6,
        delay: 0.2,
        ease: "power2.out",
      });

      // Parallax panels — stagger in with slight rotations
      gsap.utils.toArray<HTMLElement>(".panel-item").forEach((panel, i) => {
        const rotation = (i % 2 === 0 ? -2 : 2) + (Math.random() - 0.5);

        gsap.from(panel, {
          scrollTrigger: {
            trigger: panel,
            start: "top 95%",
            toggleActions: "play none none none",
          },
          y: 50,
          opacity: 0,
          rotation,
          scale: 0.97,
          duration: 0.6,
          ease: "power2.out",
        });

        // Subtle parallax on scroll (desktop only)
        if (window.innerWidth >= 768) {
          gsap.to(panel, {
            scrollTrigger: {
              trigger: panel,
              start: "top bottom",
              end: "bottom top",
              scrub: 1,
            },
            y: -15 * (i % 2 === 0 ? 1 : -1),
          });
        }
      });
    }, containerRef);

    return () => ctx.revert();
  }, [comic]);

  if (!comic) {
    return (
      <main className="flex-1 flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="font-handwritten text-4xl mb-4">Comic not found 😢</h1>
          <Link href="/" className="text-accent underline">
            ← Back to Gallery
          </Link>
        </div>
      </main>
    );
  }

  const panelNumbers = Array.from({ length: comic.panels }, (_, i) => i + 1);

  return (
    <main ref={containerRef} className="flex-1 animate-page-in">
      {/* Back nav */}
      <nav className="max-w-5xl mx-auto px-6 pt-8 flex items-center justify-between">
        <Link
          href="/"
          className="inline-flex items-center gap-1 text-sm hover:text-accent transition-colors"
          style={{ color: "var(--text-muted)" }}
        >
          ← Back to Gallery
        </Link>
        <span className="text-xs font-medium" style={{ color: "var(--text-muted)" }}>
          {comics.findIndex((c) => c.slug === slug) + 1} / {comics.length}
        </span>
      </nav>

      {/* Quote hero */}
      <section className="max-w-4xl mx-auto px-6 pt-12 pb-8 text-center">
        <blockquote className="detail-quote font-handwritten text-3xl sm:text-4xl md:text-5xl lg:text-6xl leading-tight">
          <span className="quote-highlight">
            &ldquo;{comic.quote}&rdquo;
          </span>
        </blockquote>

        <div className="detail-meta mt-6 space-y-2">
          <p className="text-lg font-medium">— {comic.speaker}</p>
          <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
            {comic.episode_title}
          </p>
          {comic.youtube_url && (
            <a
              href={`${comic.youtube_url}${comic.timestamp !== "00:00:00" ? `&t=${timestampToSeconds(comic.timestamp)}` : ""}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 mt-2 px-4 py-2 rounded-full text-sm font-medium text-white transition-transform hover:scale-105"
              style={{ background: "var(--accent-warm)" }}
            >
              🎧 Listen on YouTube @ {comic.timestamp}
            </a>
          )}
        </div>
      </section>

      {/* Panels — scattered layout */}
      <section className="max-w-5xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
          {panelNumbers.map((num, i) => (
            <div
              key={num}
              className={`panel-item ${
                i % 2 === 0 ? "md:translate-y-0" : "md:translate-y-8"
              }`}
            >
              <div
                className="comic-panel bg-white"
                style={{
                  transform: `rotate(${i % 2 === 0 ? -1.5 : 1.5}deg)`,
                }}
              >
                <div className="relative aspect-[4/3]">
                  <Image
                    src={`/comics/${comic.comic_id}/panel_${num}.webp`}
                    alt={`${comic.comic_id} panel ${num}`}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-contain bg-white"
                    priority={num <= 2}
                  />
                </div>
              </div>
              <p
                className="mt-2 text-center text-xs font-medium"
                style={{ color: "var(--text-muted)" }}
              >
                Panel {num}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Prev / Next navigation */}
      <section className="max-w-5xl mx-auto px-6 py-12">
        {/* Mobile swipe hint */}
        <p className="text-center text-xs mb-6 md:hidden" style={{ color: "var(--text-muted)" }}>
          ← Swipe to navigate →
        </p>

        <div className="flex items-center justify-between gap-4">
          {prev ? (
            <Link
              href={`/comic/${prev.slug}`}
              className="group flex-1 p-4 rounded-xl border transition-colors hover:border-[var(--accent-warm)]"
              style={{ borderColor: "var(--border-soft)" }}
            >
              <span className="text-xs" style={{ color: "var(--text-muted)" }}>
                ← Previous
              </span>
              <p className="font-handwritten text-lg mt-1 group-hover:text-accent transition-colors line-clamp-1">
                &ldquo;{prev.quote}&rdquo;
              </p>
            </Link>
          ) : (
            <div className="flex-1" />
          )}

          {next ? (
            <Link
              href={`/comic/${next.slug}`}
              className="group flex-1 p-4 rounded-xl border text-right transition-colors hover:border-[var(--accent-warm)]"
              style={{ borderColor: "var(--border-soft)" }}
            >
              <span className="text-xs" style={{ color: "var(--text-muted)" }}>
                Next →
              </span>
              <p className="font-handwritten text-lg mt-1 group-hover:text-accent transition-colors line-clamp-1">
                &ldquo;{next.quote}&rdquo;
              </p>
            </Link>
          ) : (
            <div className="flex-1" />
          )}
        </div>
      </section>
    </main>
  );
}
