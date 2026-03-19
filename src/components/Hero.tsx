"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

interface HeroContent {
	badgeText: string;
	titlePart1: string;
	titlePart2: string;
	subtitle: string;
	primaryCtaText: string;
	primaryCtaLink: string;
	secondaryCtaText: string;
	secondaryCtaLink: string;
	backgroundImage: string;
	stat1Number: string;
	stat1Label: string;
	stat2Number: string;
	stat2Label: string;
	stat3Number: string;
	stat3Label: string;
}

export default function Hero({ data }: { data: HeroContent | null }) {
	const [loaded, setLoaded] = useState(false);

	useEffect(() => {
		setLoaded(true);
	}, []);

	// Use provided data or fall back to defaults
	const content = {
		badgeText: data?.badgeText || "Professional Makeup Artist",
		titlePart1: data?.titlePart1 || "Meena",
		titlePart2: data?.titlePart2 || "Bisht",
		subtitle:
			data?.subtitle ||
			"Crafting timeless beauty for brides, celebrations, and every moment that matters. Where artistry meets elegance.",
		primaryCtaText: data?.primaryCtaText || "Explore Portfolio",
		primaryCtaLink: data?.primaryCtaLink || "/portfolio",
		secondaryCtaText: data?.secondaryCtaText || "Book a Session",
		secondaryCtaLink: data?.secondaryCtaLink || "#contact",
		backgroundImage:
			data?.backgroundImage ||
			"https://images.unsplash.com/photo-1742891602044-7fdc0a9839ad?w=1920&q=80",
		stat1Number: data?.stat1Number || "500+",
		stat1Label: data?.stat1Label || "Happy Brides",
		stat2Number: data?.stat2Number || "8+",
		stat2Label: data?.stat2Label || "Years Experience",
		stat3Number: data?.stat3Number || "50+",
		stat3Label: data?.stat3Label || "Cities Covered",
	};

	return (
		<section
			className="relative min-h-screen flex items-center overflow-hidden"
			id="hero"
		>
			{/* Background Image */}
			<div className="absolute inset-0">
				<Image
					src={content.backgroundImage}
					alt={`MBM Makeup Artistry by ${content.titlePart1} ${content.titlePart2}`}
					fill
					className="object-cover"
					priority
					sizes="100vw"
				/>
				{/* Dark overlay with gradient */}
				<div className="absolute inset-0 bg-gradient-to-r from-[#0a0a0a] via-[#0a0a0a]/85 to-[#0a0a0a]/40" />
				<div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-[#0a0a0a]/50" />
			</div>

			{/* Decorative orbs */}
			<div className="orb w-96 h-96 bg-[#c9a87c]/20 -top-48 -left-48" />
			<div className="orb w-72 h-72 bg-[#d4a0a0]/15 bottom-20 right-20" />

			{/* Content */}
			<div className="relative max-w-7xl mx-auto px-6 py-32 w-full">
				<div className="max-w-2xl">
					{/* Small badge */}
					<div
						className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#c9a87c]/20 bg-[#c9a87c]/5 mb-8 transition-all duration-1000 ${
							loaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
						}`}
					>
						<span className="w-1.5 h-1.5 rounded-full bg-[#c9a87c] pulse-glow" />
						<span className="text-xs tracking-[0.3em] text-[#c9a87c] uppercase font-medium">
							{content.badgeText}
						</span>
					</div>

					{/* Main heading */}
					<h1
						className={`text-5xl md:text-7xl lg:text-8xl font-[family-name:var(--font-playfair)] font-semibold leading-[1.1] mb-6 transition-all duration-1000 delay-200 ${
							loaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
						}`}
					>
						<span className="text-[#f5f0eb]">{content.titlePart1}</span>
						<br />
						<span className="gradient-text">{content.titlePart2}</span>
					</h1>

					{/* Subtitle */}
					<p
						className={`text-[#a8a29e] text-lg md:text-xl mb-10 max-w-lg leading-relaxed transition-all duration-1000 delay-400 ${
							loaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
						}`}
					>
						{content.subtitle}
					</p>

					{/* CTA buttons */}
					<div
						className={`flex flex-wrap gap-4 transition-all duration-1000 delay-500 ${
							loaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
						}`}
					>
						<a
							href={content.primaryCtaLink}
							className="group relative px-8 py-4 bg-[#c9a87c] text-[#0a0a0a] font-semibold rounded-full overflow-hidden transition-all duration-500 hover:shadow-[0_0_40px_rgba(201,168,124,0.3)]"
						>
							<span className="relative z-10">{content.primaryCtaText}</span>
							<div className="absolute inset-0 bg-[#e8d5b7] transform scale-x-0 origin-left group-hover:scale-x-100 transition-transform duration-500" />
						</a>
						<a
							href={content.secondaryCtaLink}
							className="px-8 py-4 border border-[#f5f0eb]/20 text-[#f5f0eb] font-medium rounded-full hover:border-[#c9a87c]/50 hover:text-[#c9a87c] transition-all duration-300"
						>
							{content.secondaryCtaText}
						</a>
					</div>

					<div
						className={`flex gap-12 mt-16 pt-10 border-t border-white/5 transition-all duration-1000 delay-700 ${
							loaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
						}`}
					>
						{[
							{ number: content.stat1Number, label: content.stat1Label },
							{ number: content.stat2Number, label: content.stat2Label },
							{ number: content.stat3Number, label: content.stat3Label },
						].map((stat) => (
							<div key={stat.label}>
								<div className="text-2xl md:text-3xl font-semibold text-[#c9a87c]">
									{stat.number}
								</div>
								<div className="text-xs tracking-wider text-[#6b6560] uppercase mt-1">
									{stat.label}
								</div>
							</div>
						))}
					</div>
				</div>
			</div>

			{/* Scroll indicator */}
			<div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
				<span className="text-[10px] tracking-[0.3em] text-[#6b6560] uppercase">
					Scroll
				</span>
				<div className="w-[1px] h-10 bg-gradient-to-b from-[#c9a87c]/50 to-transparent float" />
			</div>
		</section>
	);
}
