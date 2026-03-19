"use client";

import { useState } from "react";

export default function Contact() {
	const [hoveredButton, setHoveredButton] = useState<string | null>(null);

	return (
		<section id="contact" className="py-32 relative overflow-hidden">
			{/* Background */}
			<div className="absolute inset-0 bg-[#0a0a0a]" />
			<div className="orb w-80 h-80 bg-[#c9a87c]/8 top-0 right-1/4" />
			<div className="orb w-60 h-60 bg-[#d4a0a0]/6 bottom-0 left-1/3" />

			<div className="relative max-w-4xl mx-auto px-6 text-center">
				{/* Decorative element */}
				<div className="flex justify-center mb-8">
					<div className="w-20 h-[1px] bg-gradient-to-r from-transparent via-[#c9a87c]/40 to-transparent" />
				</div>

				<span className="inline-block text-xs tracking-[0.4em] text-[#c9a87c] uppercase font-medium mb-4">
					Get in Touch
				</span>

				<h2 className="text-4xl md:text-6xl font-[family-name:var(--font-playfair)] font-semibold text-[#f5f0eb] mb-6">
					Book Your <span className="gradient-text">Session</span>
				</h2>

				<p className="text-[#a8a29e] max-w-lg mx-auto leading-relaxed mb-14">
					Ready to look your best? Reach out for bridal consultations, party
					bookings, or any makeup service. We travel to your location across
					India.
				</p>

				{/* Contact buttons */}
				<div className="flex flex-col sm:flex-row gap-5 justify-center">
					<a
						href="mailto:meena@mbmmakeup.com"
						className="group relative px-10 py-5 bg-[#c9a87c] text-[#0a0a0a] font-semibold rounded-full overflow-hidden transition-all duration-500 hover:shadow-[0_0_40px_rgba(201,168,124,0.3)] flex items-center justify-center gap-3"
						onMouseEnter={() => setHoveredButton("email")}
						onMouseLeave={() => setHoveredButton(null)}
						id="contact-email"
					>
						<svg
							className="w-5 h-5 transition-transform duration-300 group-hover:scale-110"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
							/>
						</svg>
						<span className="relative z-10">Email Us</span>
						<div className="absolute inset-0 bg-[#e8d5b7] transform scale-x-0 origin-left group-hover:scale-x-100 transition-transform duration-500" />
					</a>

					<a
						href="tel:+918299525252"
						className="group px-10 py-5 border border-[#c9a87c]/40 text-[#c9a87c] font-semibold rounded-full transition-all duration-300 hover:border-[#c9a87c] hover:bg-[#c9a87c]/5 hover:shadow-[0_0_30px_rgba(201,168,124,0.1)] flex items-center justify-center gap-3"
						onMouseEnter={() => setHoveredButton("phone")}
						onMouseLeave={() => setHoveredButton(null)}
						id="contact-phone"
					>
						<svg
							className="w-5 h-5 transition-transform duration-300 group-hover:scale-110"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
							/>
						</svg>
						Call Us
					</a>

					<a
						href="https://wa.me/+918299525252"
						target="_blank"
						rel="noopener noreferrer"
						className="group px-10 py-5 border border-[#c9a87c]/40 text-[#c9a87c] font-semibold rounded-full transition-all duration-300 hover:border-[#c9a87c] hover:bg-[#c9a87c]/5 hover:shadow-[0_0_30px_rgba(201,168,124,0.1)] flex items-center justify-center gap-3"
						onMouseEnter={() => setHoveredButton("whatsapp")}
						onMouseLeave={() => setHoveredButton(null)}
						id="contact-whatsapp"
					>
						<svg
							className="w-5 h-5 transition-transform duration-300 group-hover:scale-110"
							viewBox="0 0 24 24"
							fill="currentColor"
						>
							<path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
						</svg>
						WhatsApp
					</a>

					<a
						href="https://instagram.com/meenabisht_makeovers"
						target="_blank"
						rel="noopener noreferrer"
						className="group px-10 py-5 border border-[#c9a87c]/40 text-[#c9a87c] font-semibold rounded-full transition-all duration-300 hover:border-[#c9a87c] hover:bg-[#c9a87c]/5 hover:shadow-[0_0_30px_rgba(201,168,124,0.1)] flex items-center justify-center gap-3"
						onMouseEnter={() => setHoveredButton("instagram")}
						onMouseLeave={() => setHoveredButton(null)}
						id="contact-instagram"
					>
						<svg
							className="w-5 h-5 transition-transform duration-300 group-hover:scale-110"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							strokeWidth="2"
							strokeLinecap="round"
							strokeLinejoin="round"
						>
							<rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
							<path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
							<line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
						</svg>
						Instagram
					</a>
				</div>

				{/* Additional info */}
				<div className="mt-20 flex flex-col md:flex-row items-center justify-center gap-8 md:gap-16">
					{[
						{ icon: "🎨", label: "Trial Session Available" },
						{ icon: "✈️", label: "All India Coverage" },
						{ icon: "💎", label: "Premium Products Only" },
					].map((info) => (
						<div key={info.label} className="flex items-center gap-3">
							<span className="text-lg">{info.icon}</span>
							<span className="text-sm text-[#6b6560]">{info.label}</span>
						</div>
					))}
				</div>
			</div>
		</section>
	);
}
