"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { comics } from "@/lib/comics-data";

gsap.registerPlugin(ScrollTrigger);

/* ── Hero Section ── */
function Hero() {
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".hero-title", {
        y: 60,
        opacity: 0,
        duration: 1,
        ease: "power3.out",
      });
      gsap.from(".hero-tagline", {
        y: 40,
        opacity: 0,
        duration: 1,
        delay: 0.3,
        ease: "power3.out",
      });
      gsap.from(".hero-cta", {
        y: 30,
        opacity: 0,
        duration: 0.8,
        delay: 0.6,
        ease: "power3.out",
      });
    }, heroRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={heroRef}
      className="relative flex flex-col items-center justify-center min-h-[80vh] px-6 text-center overflow-hidden"
    >
      {/* Subtle paper texture dots */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(circle, var(--text-primary) 1px, transparent 1px)`,
          backgroundSize: '20px 20px',
        }}
      />

      <h1 className="hero-title font-handwritten text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-bold text-accent leading-none mb-4">
        Lenny Comics
      </h1>
      <p className="hero-tagline text-lg sm:text-xl md:text-2xl max-w-2xl leading-relaxed"
        style={{ color: 'var(--text-secondary)' }}>
        PM golden quotes × everyday life scenes — in 4 panels.
        <br />
        <span className="text-sm" style={{ color: 'var(--text-muted)' }}>
          Inspired by{" "}
          <a
            href="https://www.lennyspodcast.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-accent transition-colors"
          >
            Lenny&apos;s Podcast
          </a>
        </span>
      </p>
      <div className="hero-cta mt-8">
        <a
          href="#gallery"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-medium text-white transition-transform hover:scale-105"
          style={{ background: 'var(--accent-warm)' }}
        >
          Browse Comics ↓
        </a>
      </div>
    </section>
  );
}

/* ── Comic Card ── */
function ComicCard({ comic, index }: { comic: typeof comics[0]; index: number }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [imgLoaded, setImgLoaded] = useState(false);

  useEffect(() => {
    const el = cardRef.current;
    if (!el) return;

    const ctx = gsap.context(() => {
      gsap.from(el, {
        scrollTrigger: {
          trigger: el,
          start: "top 92%",
          toggleActions: "play none none none",
        },
        y: 40,
        opacity: 0,
        rotation: index % 2 === 0 ? -1.5 : 1.5,
        duration: 0.6,
        delay: (index % 3) * 0.08,
        ease: "power2.out",
      });

      // Ensure above-fold elements are visible
      ScrollTrigger.refresh();
    });

    return () => ctx.revert();
  }, [index]);

  return (
    <div ref={cardRef}>
      <Link href={`/comic/${comic.slug}`} className="block comic-card group">
        <div className="comic-panel bg-white relative">
          {/* Stacked card shadows */}
          <div className="absolute inset-0 rounded border-2 transition-transform duration-300 -z-10"
            style={{ borderColor: 'var(--border-soft)', background: 'var(--bg-cream-dark)', transform: 'rotate(2deg) translate(4px, 4px)' }}
          />
          <div className="absolute inset-0 rounded border-2 transition-transform duration-300 -z-20"
            style={{ borderColor: 'var(--border-soft)', background: 'var(--bg-cream-dark)', transform: 'rotate(4deg) translate(8px, 8px)', opacity: 0.7 }}
          />
          <div className="relative aspect-square">
            {!imgLoaded && <div className="absolute inset-0 img-placeholder" />}
            <Image
              src={comic.cover}
              alt={`${comic.comic_id} cover`}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className={`object-cover transition-opacity duration-300 ${imgLoaded ? 'opacity-100' : 'opacity-0'}`}
              onLoad={() => setImgLoaded(true)}
            />
          </div>
        </div>
        <div className="mt-3 px-1">
          <p className="font-handwritten text-xl md:text-2xl leading-snug line-clamp-2">
            &ldquo;{comic.quote}&rdquo;
          </p>
          <p className="mt-1 text-sm" style={{ color: 'var(--text-muted)' }}>
            — {comic.speaker}
          </p>
        </div>
      </Link>
    </div>
  );
}

/* ── Gallery Grid ── */
function Gallery() {
  const headerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = headerRef.current;
    if (!el) return;
    const ctx = gsap.context(() => {
      gsap.from(el, {
        scrollTrigger: {
          trigger: el,
          start: "top 92%",
          toggleActions: "play none none none",
        },
        y: 30,
        opacity: 0,
        duration: 0.6,
        ease: "power2.out",
      });
    });
    return () => ctx.revert();
  }, []);

  return (
    <section id="gallery" className="max-w-7xl mx-auto px-6 py-16">
      <div ref={headerRef} className="flex items-center justify-between mb-8">
        <h2 className="font-handwritten text-3xl md:text-4xl">All Comics</h2>
        <span className="text-sm px-3 py-1 rounded-full" style={{ background: 'var(--bg-cream-dark)', color: 'var(--text-secondary)' }}>
          {comics.length} comics · {comics.length * 4} panels
        </span>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
        {comics.map((comic, i) => (
          <ComicCard key={comic.comic_id} comic={comic} index={i} />
        ))}
      </div>
    </section>
  );
}

/* ── Footer ── */
function Footer() {
  return (
    <footer className="py-12 text-center space-y-2" style={{ color: 'var(--text-muted)' }}>
      <p className="text-sm">
        Made for the{" "}
        <a
          href="https://www.lennyspodcast.com/"
          target="_blank"
          rel="noopener noreferrer"
          className="underline hover:text-accent"
        >
          Lenny&apos;s Podcast
        </a>{" "}
        Comic Challenge 🎨
      </p>
      <p className="text-xs">
        Use ← → arrow keys or swipe to navigate between comics
      </p>
    </footer>
  );
}

/* ── Page ── */
export default function Home() {
  return (
    <main className="flex-1">
      <Hero />
      <Gallery />
      <Footer />
    </main>
  );
}
