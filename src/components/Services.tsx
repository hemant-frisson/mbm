"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";

interface Service {
  id: string;
  title: string;
  description: string | null;
  imageUrl: string;
  icon: string | null;
  sortOrder: number;
}

export default function Services({ data }: { data: Service[] }) {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (data.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("reveal-on-scroll");
          }
        });
      },
      { threshold: 0.1 }
    );

    const cards = sectionRef.current?.querySelectorAll(".service-card");
    cards?.forEach((card) => observer.observe(card));

    return () => observer.disconnect();
  }, [data.length]);

  return (
    <section id="services" className="py-32 relative overflow-hidden" ref={sectionRef}>
      {/* Background elements */}
      <div className="absolute inset-0 bg-[#0a0a0a]" />
      <div className="orb w-80 h-80 bg-[#c9a87c]/8 top-20 right-0" />
      <div className="orb w-60 h-60 bg-[#d4a0a0]/8 bottom-20 left-10" />

      <div className="relative max-w-7xl mx-auto px-6">
        {/* Section header */}
        <div className="text-center mb-20">
          <span className="inline-block text-xs tracking-[0.4em] text-[#c9a87c] uppercase font-medium mb-4">
            What We Offer
          </span>
          <h2 className="text-4xl md:text-6xl font-[family-name:var(--font-playfair)] font-semibold text-[#f5f0eb] mb-6">
            Our{" "}
            <span className="gradient-text">Services</span>
          </h2>
          <p className="text-[#a8a29e] max-w-xl mx-auto leading-relaxed">
            From your wedding day to every celebration in between, we bring
            professional artistry to every occasion.
          </p>
        </div>

        {/* Services grid */}
        <div className="grid md:grid-cols-3 gap-8">
          {data.map((service, index) => (
            <div
              key={service.id}
              className="service-card group relative overflow-hidden rounded-2xl glass-card glow-hover opacity-0"
              style={{ animationDelay: `${index * 0.15}s` }}
            >
              {/* Image */}
              <div className="aspect-[4/5] relative overflow-hidden">
                <Image
                  src={service.imageUrl}
                  alt={service.title}
                  fill
                  className="object-cover transition-all duration-700 group-hover:scale-110"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
                {/* Overlay gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/40 to-transparent" />

                {/* Icon */}
                <div className="absolute top-5 right-5 w-12 h-12 rounded-full bg-[#0a0a0a]/60 backdrop-blur-sm border border-white/10 flex items-center justify-center text-xl">
                  {service.icon}
                </div>

                {/* Content overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-7">
                  <h3 className="text-2xl font-[family-name:var(--font-playfair)] font-semibold text-[#f5f0eb] mb-3">
                    {service.title}
                  </h3>
                  <p className="text-[#a8a29e] text-sm leading-relaxed">
                    {service.description}
                  </p>
                </div>
              </div>

              {/* Bottom accent bar */}
              <div className="h-[2px] bg-gradient-to-r from-transparent via-[#c9a87c]/40 to-transparent transform scale-x-0 group-hover:scale-x-100 transition-transform duration-700" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
