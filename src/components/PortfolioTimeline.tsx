"use client";

import { useState, useCallback, useEffect, useMemo, useRef } from "react";
import Image from "next/image";
import Link from "next/link";

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

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

interface MonthData {
  month: number;
  monthName: string;
  year: number;
  bookings: Booking[];
  count: number;
}

type ViewState =
  | { view: "months" }
  | { view: "bookings"; monthData: MonthData }
  | { view: "images"; booking: Booking; monthData: MonthData };

// ── Main Component ────────────────────────────────────────────────────────
export default function PortfolioTimeline({ bookings }: { bookings: Booking[] }) {
  const [viewState, setViewState] = useState<ViewState>({ view: "months" });
  const [hoveredMonth, setHoveredMonth] = useState<string | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  const monthsData = useMemo(() => {
    const groups = new Map<string, MonthData>();
    bookings.forEach((b) => {
      const d = new Date(b.date);
      const month = d.getMonth();
      const year = d.getFullYear();
      const key = `${year}-${month}`;
      if (!groups.has(key)) {
        groups.set(key, { month, monthName: MONTHS[month], year, bookings: [], count: 0 });
      }
      const g = groups.get(key)!;
      g.bookings.push(b);
      g.count++;
    });
    return Array.from(groups.values()).sort((a, b) => b.year - a.year || b.month - a.month);
  }, [bookings]);

  // Track mouse for parallax
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
      const y = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
      setMousePos({ x, y });
    };
    const el = containerRef.current;
    el?.addEventListener("mousemove", handler);
    return () => el?.removeEventListener("mousemove", handler);
  }, []);

  const handleMonthClick = useCallback((monthData: MonthData) => {
    setViewState({ view: "bookings", monthData });
  }, []);

  const handleBookingClick = useCallback(
    (booking: Booking, monthData: MonthData) => {
      setViewState({ view: "images", booking, monthData });
    },
    []
  );

  const handleBack = useCallback(() => {
    if (viewState.view === "images") {
      setViewState({ view: "bookings", monthData: (viewState as any).monthData });
    } else {
      setViewState({ view: "months" });
    }
  }, [viewState]);

  return (
    <div ref={containerRef} className="min-h-screen bg-[#080808] relative overflow-hidden">
      {/* Background orbs */}
      <div
        className="absolute w-[600px] h-[600px] rounded-full blur-[120px] pointer-events-none opacity-20"
        style={{
          background: "radial-gradient(circle, rgba(201,168,124,0.15) 0%, transparent 70%)",
          top: "10%",
          left: "20%",
          transform: `translate(${mousePos.x * 20}px, ${mousePos.y * 15}px)`,
          transition: "transform 0.8s ease-out",
        }}
      />
      <div
        className="absolute w-[400px] h-[400px] rounded-full blur-[100px] pointer-events-none opacity-15"
        style={{
          background: "radial-gradient(circle, rgba(212,160,160,0.12) 0%, transparent 70%)",
          bottom: "15%",
          right: "10%",
          transform: `translate(${mousePos.x * -15}px, ${mousePos.y * -10}px)`,
          transition: "transform 0.8s ease-out",
        }}
      />

      {/* Floating particles (CSS) */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {Array.from({ length: 30 }).map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 rounded-full bg-[#c9a87c]"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              opacity: Math.random() * 0.3 + 0.05,
              animation: `float ${6 + Math.random() * 8}s ease-in-out infinite`,
              animationDelay: `${Math.random() * 5}s`,
            }}
          />
        ))}
      </div>

      {/* Header */}
      <header className="relative z-30 p-5 md:p-6">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="w-9 h-9 rounded-full border-2 border-[#c9a87c]/60 flex items-center justify-center group-hover:border-[#e8d5b7] transition-colors duration-300">
                <span className="text-xs font-bold tracking-wider text-[#c9a87c] group-hover:text-[#e8d5b7] transition-colors">M</span>
              </div>
              <span className="text-sm font-semibold tracking-[0.15em] text-[#f5f0eb] hidden md:block">MBM</span>
            </Link>

            <svg className="w-4 h-4 text-[#3a3530]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>

            {/* Breadcrumbs */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setViewState({ view: "months" })}
                className={`text-sm transition-colors duration-300 ${
                  viewState.view === "months" ? "text-[#f5f0eb] font-medium" : "text-[#6b6560] hover:text-[#a8a29e]"
                }`}
              >
                Timeline
              </button>
              {viewState.view !== "months" && "monthData" in viewState && (
                <>
                  <svg className="w-3 h-3 text-[#3a3530]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                  <button
                    onClick={() => {
                      if (viewState.view === "images") {
                        setViewState({ view: "bookings", monthData: (viewState as any).monthData });
                      }
                    }}
                    className={`text-sm transition-colors duration-300 ${
                      viewState.view === "bookings" ? "text-[#f5f0eb] font-medium" : "text-[#6b6560] hover:text-[#a8a29e]"
                    }`}
                  >
                    {(viewState as any).monthData.monthName} {(viewState as any).monthData.year}
                  </button>
                </>
              )}
              {viewState.view === "images" && (
                <>
                  <svg className="w-3 h-3 text-[#3a3530]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                  <span className="text-sm text-[#f5f0eb] font-medium truncate max-w-40">
                    {(viewState as any).booking.title}
                  </span>
                </>
              )}
            </div>
          </div>

          <Link
            href="/"
            className="px-4 py-2 text-xs border border-[rgba(255,255,255,0.08)] text-[#a8a29e] rounded-full hover:border-[#c9a87c]/30 hover:text-[#f5f0eb] transition-all duration-300"
          >
            ← Back to Site
          </Link>
        </div>
      </header>

      {/* Content area */}
      <div className="relative z-10">
        {viewState.view === "months" && (
          <MonthsGrid
            monthsData={monthsData}
            onMonthClick={handleMonthClick}
            hoveredMonth={hoveredMonth}
            onHover={setHoveredMonth}
            mousePos={mousePos}
          />
        )}
        {viewState.view === "bookings" && (
          <BookingsView
            monthData={viewState.monthData}
            onBookingClick={(b) => handleBookingClick(b, viewState.monthData)}
            onBack={handleBack}
          />
        )}
        {viewState.view === "images" && (
          <ImagesView booking={viewState.booking} onBack={handleBack} />
        )}
      </div>
    </div>
  );
}

// ── Collage component for month cards ─────────────────────────────────────
function BookingCollage({ monthBookings }: { monthBookings: Booking[] }) {
  // Get first image from each booking
  const images = monthBookings
    .map((b) => b.images[0]?.imageUrl)
    .filter(Boolean)
    .slice(0, 4);

  const count = images.length;

  if (count === 1) {
    return (
      <div className="absolute inset-0">
        <Image
          src={images[0]}
          alt=""
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-110"
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
        />
      </div>
    );
  }

  if (count === 2) {
    return (
      <div className="absolute inset-0 grid grid-cols-2 gap-[2px]">
        {images.map((src, i) => (
          <div key={i} className="relative overflow-hidden">
            <Image
              src={src}
              alt=""
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-110"
              sizes="(max-width: 640px) 25vw, 15vw"
            />
          </div>
        ))}
      </div>
    );
  }

  if (count === 3) {
    return (
      <div className="absolute inset-0 grid grid-cols-2 grid-rows-2 gap-[2px]">
        <div className="relative overflow-hidden row-span-2">
          <Image
            src={images[0]}
            alt=""
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-110"
            sizes="(max-width: 640px) 25vw, 15vw"
          />
        </div>
        <div className="relative overflow-hidden">
          <Image
            src={images[1]}
            alt=""
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-110"
            sizes="(max-width: 640px) 25vw, 15vw"
          />
        </div>
        <div className="relative overflow-hidden">
          <Image
            src={images[2]}
            alt=""
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-110"
            sizes="(max-width: 640px) 25vw, 15vw"
          />
        </div>
      </div>
    );
  }

  // 4+ images → 2x2 grid
  return (
    <div className="absolute inset-0 grid grid-cols-2 grid-rows-2 gap-[2px]">
      {images.slice(0, 4).map((src, i) => (
        <div key={i} className="relative overflow-hidden">
          <Image
            src={src}
            alt=""
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-110"
            sizes="(max-width: 640px) 25vw, 15vw"
          />
        </div>
      ))}
    </div>
  );
}

// ── Months Grid (3D CSS) ──────────────────────────────────────────────────
function MonthsGrid({
  monthsData,
  onMonthClick,
  hoveredMonth,
  onHover,
  mousePos,
}: {
  monthsData: MonthData[];
  onMonthClick: (m: MonthData) => void;
  hoveredMonth: string | null;
  onHover: (id: string | null) => void;
  mousePos: { x: number; y: number };
}) {
  // Group months by year for section headers
  const years = useMemo(() => {
    const map = new Map<number, MonthData[]>();
    monthsData.forEach((m) => {
      if (!map.has(m.year)) map.set(m.year, []);
      map.get(m.year)!.push(m);
    });
    return Array.from(map.entries()).sort((a, b) => b[0] - a[0]);
  }, [monthsData]);

  const showYearHeaders = monthsData.length >= 4;
  let globalIndex = 0;

  return (
    <div className="max-w-6xl mx-auto px-6 pt-12 pb-24">
      {/* Title */}
      <div className="text-center mb-16 animate-fade-up" style={{ animationDelay: "0s" }}>
        <span className="inline-block text-xs tracking-[0.4em] text-[#c9a87c] uppercase font-medium mb-4">
          Portfolio Timeline
        </span>
        <h1 className="text-4xl md:text-6xl font-[family-name:var(--font-playfair)] font-semibold text-[#f5f0eb] mb-4">
          Our <span className="gradient-text">Journey</span>
        </h1>
        <p className="text-[#a8a29e] max-w-md mx-auto">
          Click on a month to explore bookings and transformations
        </p>
      </div>

      {/* Year-grouped months */}
      {years.map(([year, months]) => (
        <div key={year} className="mb-16 last:mb-0">
          {/* Year header */}
          {showYearHeaders && (
            <div className="flex items-center gap-4 mb-8 animate-fade-up" style={{ animationDelay: "0.1s" }}>
              <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent to-[rgba(201,168,124,0.15)]" />
              <h2 className="text-3xl md:text-4xl font-[family-name:var(--font-playfair)] font-semibold gradient-text">
                {year}
              </h2>
              <div className="h-[1px] flex-1 bg-gradient-to-l from-transparent to-[rgba(201,168,124,0.15)]" />
              <span className="text-xs text-[#6b6560] whitespace-nowrap">
                {months.reduce((sum, m) => sum + m.count, 0)} bookings
              </span>
            </div>
          )}

          {/* Months grid */}
          <div
            className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5 md:gap-6"
            style={{
              perspective: "1200px",
              perspectiveOrigin: "50% 50%",
            }}
          >
            {months.map((monthData) => {
              const key = `${monthData.year}-${monthData.month}`;
              const isHovered = hoveredMonth === key;
              const delay = globalIndex * 0.08;
              globalIndex++;

              return (
                <div
                  key={key}
                  className="animate-fade-up"
                  style={{
                    animationDelay: `${delay + 0.2}s`,
                    transformStyle: "preserve-3d",
                  }}
                >
                  <button
                    onClick={() => onMonthClick(monthData)}
                    onMouseEnter={() => onHover(key)}
                    onMouseLeave={() => onHover(null)}
                    className="w-full text-left group relative rounded-2xl overflow-hidden border transition-all duration-500"
                    style={{
                      transform: isHovered
                        ? `translateZ(30px) rotateY(${mousePos.x * -3}deg) rotateX(${mousePos.y * 3}deg) scale(1.03)`
                        : `translateZ(0) rotateY(${mousePos.x * -1}deg) rotateX(${mousePos.y * 1}deg)`,
                      borderColor: isHovered ? "rgba(201,168,124,0.3)" : "rgba(255,255,255,0.06)",
                      boxShadow: isHovered
                        ? "0 25px 60px rgba(0,0,0,0.4), 0 0 40px rgba(201,168,124,0.1)"
                        : "0 4px 20px rgba(0,0,0,0.2)",
                      transition: "all 0.5s cubic-bezier(0.23, 1, 0.32, 1)",
                      transformStyle: "preserve-3d",
                    }}
                    id={`month-${key}`}
                  >
                    {/* Collage of booking images */}
                    <div className="aspect-[4/3] relative overflow-hidden">
                      <BookingCollage monthBookings={monthData.bookings} />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/30 to-[#0a0a0a]/5" />

                      {/* Booking count badge */}
                      <div className="absolute top-3 right-3 px-2.5 py-1 bg-[#0a0a0a]/50 backdrop-blur-sm rounded-full border border-white/10">
                        <span className="text-[11px] text-[#c9a87c] font-semibold">
                          {monthData.count} {monthData.count === 1 ? "booking" : "bookings"}
                        </span>
                      </div>

                      {/* Hover glow */}
                      <div
                        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                        style={{
                          background: "radial-gradient(circle at 50% 80%, rgba(201,168,124,0.15) 0%, transparent 60%)",
                        }}
                      />
                    </div>

                    {/* Month info */}
                    <div className="p-4 bg-[#111111]">
                      <div className="flex items-end justify-between">
                        <div>
                          <h3 className="text-xl font-[family-name:var(--font-playfair)] font-semibold text-[#f5f0eb] group-hover:text-[#c9a87c] transition-colors duration-300">
                            {monthData.monthName}
                          </h3>
                          {!showYearHeaders && (
                            <span className="text-xs text-[#6b6560] tracking-wider">{monthData.year}</span>
                          )}
                        </div>
                        <div className="w-8 h-8 rounded-full border border-[#c9a87c]/20 flex items-center justify-center group-hover:border-[#c9a87c]/60 group-hover:bg-[#c9a87c]/10 transition-all duration-300">
                          <svg className="w-4 h-4 text-[#c9a87c] transition-transform duration-300 group-hover:translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </div>
                      </div>

                      {/* Category pills */}
                      <div className="flex flex-wrap gap-1.5 mt-3">
                        {Array.from(new Set(monthData.bookings.map((b) => b.category))).map((cat) => (
                          <span key={cat} className="px-2 py-0.5 text-[9px] uppercase tracking-wider text-[#6b6560] border border-[rgba(255,255,255,0.06)] rounded-full">
                            {cat}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Bottom accent */}
                    <div className="h-[2px] bg-gradient-to-r from-transparent via-[#c9a87c]/30 to-transparent transform scale-x-0 group-hover:scale-x-100 transition-transform duration-700" />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}

// ── Bookings View ─────────────────────────────────────────────────────────
function BookingsView({
  monthData,
  onBookingClick,
  onBack,
}: {
  monthData: MonthData;
  onBookingClick: (b: Booking) => void;
  onBack: () => void;
}) {
  return (
    <div className="max-w-6xl mx-auto px-6 pt-8 pb-24">
      {/* Back + title */}
      <div className="mb-12 animate-fade-up">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-sm text-[#6b6560] hover:text-[#c9a87c] transition-colors duration-300 mb-6"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Timeline
        </button>

        <div className="flex items-end gap-4">
          <div>
            <span className="text-xs tracking-[0.3em] text-[#c9a87c] uppercase font-medium">{monthData.year}</span>
            <h2 className="text-4xl md:text-5xl font-[family-name:var(--font-playfair)] font-semibold text-[#f5f0eb]">
              {monthData.monthName}
            </h2>
          </div>
          <span className="text-sm text-[#6b6560] pb-1">
            {monthData.count} {monthData.count === 1 ? "booking" : "bookings"}
          </span>
        </div>
      </div>

      {/* Bookings grid */}
      <div
        className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6"
        style={{ perspective: "1000px" }}
      >
        {monthData.bookings.map((booking, index) => (
          <div
            key={booking.id}
            className="animate-fade-up"
            style={{ animationDelay: `${index * 0.1 + 0.15}s` }}
          >
            <button
              onClick={() => onBookingClick(booking)}
              className="w-full text-left group rounded-2xl overflow-hidden border border-[rgba(255,255,255,0.06)] bg-[#111111] hover:border-[rgba(201,168,124,0.25)] transition-all duration-500 hover:shadow-[0_20px_50px_rgba(0,0,0,0.4),0_0_30px_rgba(201,168,124,0.06)]"
              style={{
                transformStyle: "preserve-3d",
                transition: "all 0.5s cubic-bezier(0.23, 1, 0.32, 1)",
              }}
              id={`booking-${booking.id}`}
            >
              {/* Cover image */}
              <div className="aspect-[4/3] relative overflow-hidden">
                <Image
                  src={booking.images[0]?.imageUrl ?? ""}
                  alt={booking.title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a]/80 via-transparent to-transparent" />

                {/* Category */}
                <div className="absolute top-3 left-3">
                  <span className="px-2.5 py-1 text-[10px] uppercase tracking-wider font-semibold bg-[#c9a87c]/90 text-[#0a0a0a] rounded-full">
                    {booking.category}
                  </span>
                </div>

                {/* Image count */}
                <div className="absolute bottom-3 right-3 flex items-center gap-1.5 px-2.5 py-1 bg-[#0a0a0a]/60 backdrop-blur-sm rounded-full border border-white/10">
                  <svg className="w-3.5 h-3.5 text-[#c9a87c]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span className="text-xs text-[#f5f0eb] font-medium">{booking.images.length}</span>
                </div>

                {/* Hover icon */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-400">
                  <div className="w-12 h-12 rounded-full border-2 border-[#c9a87c] flex items-center justify-center bg-[#0a0a0a]/40 backdrop-blur-sm">
                    <svg className="w-5 h-5 text-[#c9a87c]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Info */}
              <div className="p-5">
                <h3 className="text-lg font-semibold text-[#f5f0eb] mb-2 group-hover:text-[#c9a87c] transition-colors duration-300">
                  {booking.title}
                </h3>
                <div className="flex items-center gap-2 text-xs text-[#6b6560]">
                  <svg className="w-3 h-3 text-[#c9a87c]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  </svg>
                  <span>{booking.location}</span>
                  {booking.clientName && (
                    <>
                      <span className="text-[#3a3530]">·</span>
                      <span>{booking.clientName}</span>
                    </>
                  )}
                </div>
                <div className="flex items-center gap-2 text-xs text-[#6b6560] mt-1">
                  <svg className="w-3 h-3 text-[#c9a87c]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span>
                    {new Date(booking.date).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </span>
                </div>
                {booking.description && (
                  <p className="mt-3 text-xs text-[#6b6560] leading-relaxed line-clamp-2">
                    {booking.description}
                  </p>
                )}
              </div>

              {/* Bottom accent */}
              <div className="h-[2px] bg-gradient-to-r from-transparent via-[#c9a87c]/30 to-transparent transform scale-x-0 group-hover:scale-x-100 transition-transform duration-700" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Images View ───────────────────────────────────────────────────────────
function ImagesView({ booking, onBack }: { booking: Booking; onBack: () => void }) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const selectedImage = booking.images[selectedIndex];

  // Keyboard navigation
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        setSelectedIndex((prev) => (prev - 1 + booking.images.length) % booking.images.length);
      } else if (e.key === "ArrowRight") {
        setSelectedIndex((prev) => (prev + 1) % booking.images.length);
      } else if (e.key === "Escape") {
        onBack();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [booking.images.length, onBack]);

  return (
    <div className="max-w-6xl mx-auto px-6 pt-8 pb-24">
      {/* Back + title */}
      <div className="mb-8 animate-fade-up">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-sm text-[#6b6560] hover:text-[#c9a87c] transition-colors duration-300 mb-6"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Bookings
        </button>

        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <span className="px-2.5 py-0.5 text-[10px] uppercase tracking-wider font-semibold bg-[#c9a87c]/15 text-[#c9a87c] rounded-full">
                {booking.category}
              </span>
              <span className="text-xs text-[#6b6560]">
                {new Date(booking.date).toLocaleDateString("en-IN", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </span>
            </div>
            <h2 className="text-3xl md:text-4xl font-[family-name:var(--font-playfair)] font-semibold text-[#f5f0eb]">
              {booking.title}
            </h2>
            <div className="flex items-center gap-2 mt-2 text-sm text-[#6b6560]">
              <svg className="w-3.5 h-3.5 text-[#c9a87c]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              </svg>
              <span>{booking.location}</span>
              {booking.clientName && (
                <>
                  <span className="text-[#3a3530]">·</span>
                  <span>Client: {booking.clientName}</span>
                </>
              )}
            </div>
          </div>
          <div className="text-right">
            <div className="text-[10px] text-[#6b6560] uppercase tracking-wider mb-1">Makeup by</div>
            <div className="text-sm font-semibold text-[#c9a87c]">Meena Bisht</div>
          </div>
        </div>
      </div>

      {/* Main image viewer */}
      <div
        className="relative rounded-2xl overflow-hidden border border-[rgba(255,255,255,0.06)] bg-[#0a0a0a] mb-6 animate-fade-up glow"
        style={{ animationDelay: "0.15s", perspective: "1000px" }}
      >
        <div className="aspect-[16/10] relative">
          <Image
            key={selectedImage?.id}
            src={selectedImage?.imageUrl ?? ""}
            alt={selectedImage?.caption ?? booking.title}
            fill
            className="object-cover"
            sizes="90vw"
            priority
          />

          {/* Caption */}
          {selectedImage?.caption && (
            <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-[#0a0a0a]/80 to-transparent">
              <p className="text-sm text-[#f5f0eb] font-medium">{selectedImage.caption}</p>
            </div>
          )}

          {/* Counter */}
          <div className="absolute top-4 right-4 px-3 py-1.5 bg-[#0a0a0a]/60 backdrop-blur-sm rounded-full text-xs text-[#f5f0eb] font-medium border border-white/10">
            {selectedIndex + 1} / {booking.images.length}
          </div>

          {/* Navigation arrows */}
          {booking.images.length > 1 && (
            <>
              <button
                onClick={() =>
                  setSelectedIndex((prev) => (prev - 1 + booking.images.length) % booking.images.length)
                }
                className="absolute left-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-[#0a0a0a]/50 backdrop-blur-sm border border-white/10 flex items-center justify-center text-[#f5f0eb] hover:bg-[#0a0a0a]/80 hover:border-[#c9a87c]/40 transition-all duration-300"
                id="img-prev"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button
                onClick={() =>
                  setSelectedIndex((prev) => (prev + 1) % booking.images.length)
                }
                className="absolute right-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-[#0a0a0a]/50 backdrop-blur-sm border border-white/10 flex items-center justify-center text-[#f5f0eb] hover:bg-[#0a0a0a]/80 hover:border-[#c9a87c]/40 transition-all duration-300"
                id="img-next"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </>
          )}
        </div>
      </div>

      {/* Thumbnails */}
      {booking.images.length > 1 && (
        <div className="flex gap-3 overflow-x-auto pb-4 no-scrollbar animate-fade-up" style={{ animationDelay: "0.2s" }}>
          {booking.images.map((img, i) => (
            <button
              key={img.id}
              onClick={() => setSelectedIndex(i)}
              className={`relative flex-shrink-0 w-24 aspect-[4/3] rounded-lg overflow-hidden border-2 transition-all duration-300 ${
                selectedIndex === i ? "border-[#c9a87c] scale-105" : "border-[rgba(255,255,255,0.06)] opacity-50 grayscale hover:opacity-100 hover:grayscale-0"
              }`}
            >
              <Image src={img.imageUrl} alt="" fill className="object-cover" sizes="100px" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
