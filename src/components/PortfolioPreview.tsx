"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";

interface BookingImage {
  id: string;
  imageUrl: string;
  caption: string | null;
  sortOrder: number;
}

interface Booking {
  id: string;
  title: string;
  location: string;
  category: string;
  description: string | null;
  date: string;
  clientName: string | null;
  images: BookingImage[];
}

export default function PortfolioPreview({ data }: { data: Booking[] }) {
  const sectionRef = useRef<HTMLElement>(null);
  const [visibleCards, setVisibleCards] = useState<Set<number>>(new Set());
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  // Intersection observer for scroll-triggered reveal
  useEffect(() => {
    if (data.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const index = Number(entry.target.getAttribute("data-index"));
          if (entry.isIntersecting && !isNaN(index)) {
            setVisibleCards((prev) => new Set(prev).add(index));
          }
        });
      },
      {
        threshold: 0.15,
        rootMargin: "0px 0px -50px 0px",
      }
    );

    const cards = sectionRef.current?.querySelectorAll("[data-index]");
    cards?.forEach((card) => observer.observe(card));
    return () => observer.disconnect();
  }, [data.length]);

  // Mouse tracking for subtle parallax on revealed cards
  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!sectionRef.current) return;
    const rect = sectionRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
    setMousePos({ x, y });
  }, []);

  return (
    <section
      id="portfolio"
      ref={sectionRef}
      className="py-32 relative overflow-hidden"
      onMouseMove={handleMouseMove}
    >
      {/* Background */}
      <div className="absolute inset-0 bg-[#080808]" />

      {/* Ambient orbs */}
      <div
        className="absolute w-[500px] h-[500px] rounded-full blur-[120px] pointer-events-none"
        style={{
          background: "radial-gradient(circle, rgba(201,168,124,0.08) 0%, transparent 70%)",
          top: "5%",
          left: "15%",
          transform: `translate(${mousePos.x * 15}px, ${mousePos.y * 10}px)`,
          transition: "transform 1s ease-out",
        }}
      />
      <div
        className="absolute w-[400px] h-[400px] rounded-full blur-[100px] pointer-events-none"
        style={{
          background: "radial-gradient(circle, rgba(212,160,160,0.06) 0%, transparent 70%)",
          bottom: "10%",
          right: "10%",
          transform: `translate(${mousePos.x * -12}px, ${mousePos.y * -8}px)`,
          transition: "transform 1s ease-out",
        }}
      />

      <div className="relative max-w-7xl mx-auto px-6">
        {/* Section header */}
        <div className="text-center mb-20">
          <span className="inline-block text-xs tracking-[0.4em] text-[#c9a87c] uppercase font-medium mb-4">
            Portfolio
          </span>
          <h2 className="text-4xl md:text-6xl font-[family-name:var(--font-playfair)] font-semibold text-[#f5f0eb] mb-6">
            Our{" "}
            <span className="gradient-text">Journey</span>
          </h2>
          <p className="text-[#a8a29e] max-w-xl mx-auto leading-relaxed">
            Every transformation tells a story. Explore our work through
            moments of artistry, celebration, and timeless beauty.
          </p>
        </div>

        {/* 3D Perspective grid */}
        <div
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5"
          style={{
            perspective: "1400px",
            perspectiveOrigin: "50% 40%",
          }}
        >
          {data.map((item, index) => {
            const isVisible = visibleCards.has(index);

            // Stagger pattern: alternate between different 3D entry positions
            const patterns = [
              { rotateX: 25, rotateY: -15, rotateZ: -5, tx: -30, ty: 60, scale: 0.8 },
              { rotateX: -20, rotateY: 20, rotateZ: 3, tx: 40, ty: 50, scale: 0.85 },
              { rotateX: 30, rotateY: 10, rotateZ: -8, tx: -20, ty: 70, scale: 0.75 },
              { rotateX: -15, rotateY: -25, rotateZ: 5, tx: 30, ty: 45, scale: 0.9 },
              { rotateX: 20, rotateY: 15, rotateZ: -3, tx: -40, ty: 55, scale: 0.82 },
              { rotateX: -25, rotateY: -10, rotateZ: 7, tx: 20, ty: 65, scale: 0.78 },
              { rotateX: 15, rotateY: -20, rotateZ: -6, tx: -35, ty: 50, scale: 0.88 },
              { rotateX: -10, rotateY: 25, rotateZ: 4, tx: 25, ty: 60, scale: 0.83 },
            ];
            const p = patterns[index % patterns.length];

            // Slight tilt following mouse when visible
            const tiltX = isVisible ? mousePos.y * -1.5 : 0;
            const tiltY = isVisible ? mousePos.x * 1.5 : 0;

            const coverImage = item.images[0]?.imageUrl || "";

            return (
              <div
                key={item.id}
                data-index={index}
                className="group relative"
                style={{
                  transformStyle: "preserve-3d",
                  transform: isVisible
                    ? `perspective(1400px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) translateZ(0) scale(1)`
                    : `perspective(1400px) rotateX(${p.rotateX}deg) rotateY(${p.rotateY}deg) rotateZ(${p.rotateZ}deg) translate(${p.tx}px, ${p.ty}px) scale(${p.scale})`,
                  opacity: isVisible ? 1 : 0,
                  transition: `all ${0.8 + index * 0.08}s cubic-bezier(0.23, 1, 0.32, 1) ${index * 0.07}s`,
                  filter: isVisible ? "blur(0px)" : "blur(4px)",
                }}
              >
                <Link href="/portfolio">
                  <div
                    className="relative overflow-hidden rounded-2xl border transition-all duration-500 aspect-[4/5]"
                    style={{
                      borderColor: isVisible
                        ? "rgba(201,168,124,0.12)"
                        : "rgba(255,255,255,0.03)",
                      boxShadow: isVisible
                        ? "0 20px 50px rgba(0,0,0,0.4), 0 0 30px rgba(201,168,124,0.05), inset 0 1px 0 rgba(201,168,124,0.1)"
                        : "none",
                      transformStyle: "preserve-3d",
                    }}
                  >
                    {/* Image */}
                    {coverImage && (
                      <Image
                        src={coverImage}
                        alt={item.title}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                        sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                      />
                    )}

                    {/* Dark gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a]/90 via-[#0a0a0a]/20 to-transparent opacity-60 group-hover:opacity-90 transition-opacity duration-500" />

                    {/* Glass border highlight on top edge */}
                    <div
                      className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                      style={{
                        boxShadow:
                          "inset 0 1px 0 rgba(201,168,124,0.2), inset 0 0 20px rgba(201,168,124,0.05)",
                      }}
                    />

                    {/* Rose gold glow on hover */}
                    <div
                      className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"
                      style={{
                        background:
                          "radial-gradient(circle at 50% 100%, rgba(201,168,124,0.12) 0%, transparent 60%)",
                      }}
                    />

                    {/* Category badge (appears on hover) */}
                    <div className="absolute top-3 left-3 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-400">
                      <span className="px-2.5 py-1 text-[9px] uppercase tracking-widest font-semibold bg-[#c9a87c]/90 text-[#0a0a0a] rounded-full">
                        {item.category}
                      </span>
                    </div>

                    {/* Info overlay (bottom) */}
                    <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                      <h3 className="text-sm font-semibold text-[#f5f0eb] mb-1 line-clamp-1">
                        {item.title}
                      </h3>
                      <div className="flex items-center gap-1.5 text-xs text-[#c9a87c]">
                        <svg
                          className="w-3 h-3"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                          />
                        </svg>
                        <span>{item.location}</span>
                      </div>
                    </div>
                  </div>
                </Link>
              </div>
            );
          })}
        </div>

        {/* CTA */}
        <div className="text-center mt-16">
          <Link
            href="/portfolio"
            className="group inline-flex items-center gap-3 px-10 py-5 bg-[#c9a87c] text-[#0a0a0a] font-semibold rounded-full overflow-hidden transition-all duration-500 hover:shadow-[0_0_50px_rgba(201,168,124,0.35)] relative"
          >
            <span className="relative z-10 flex items-center gap-3">
              <svg
                className="w-5 h-5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              Explore Full Portfolio
              <svg
                className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 8l4 4m0 0l-4 4m4-4H3"
                />
              </svg>
            </span>
            <div className="absolute inset-0 bg-[#e8d5b7] transform scale-x-0 origin-left group-hover:scale-x-100 transition-transform duration-500" />
          </Link>
          <p className="mt-4 text-xs text-[#6b6560]">
            Interactive timeline · Browse by month · View all bookings
          </p>
        </div>
      </div>
    </section>
  );
}
