"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

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

interface Service {
	id: string;
	title: string;
	description: string;
	imageUrl: string;
	icon: string;
	sortOrder: number;
}

interface HeroContent {
	id?: string;
	badgeText: string;
	titlePart1: string;
	titlePart2: string;
	subtitle: string;
	primaryCtaText: string;
	primaryCtaLink: string;
	secondaryCtaText: string;
	secondaryCtaLink: string;
	backgroundImage: string;
}

type Tab = "bookings" | "services" | "hero";

interface AdminUser {
	id: string;
	email: string;
	name: string;
}

export default function AdminDashboard() {
	const [admin, setAdmin] = useState<AdminUser | null>(null);
	const [loading, setLoading] = useState(true);
	const [tab, setTab] = useState<Tab>("bookings");
	const [bookings, setBookings] = useState<Booking[]>([]);
	const [services, setServices] = useState<Service[]>([]);
	const [heroContent, setHeroContent] = useState<HeroContent | null>(null);

	const [editingBooking, setEditingBooking] = useState<Booking | null>(null);
	const [editingService, setEditingService] = useState<Service | null>(null);
	const [showBookingForm, setShowBookingForm] = useState(false);
	const [showServiceForm, setShowServiceForm] = useState(false);
	const [showHeroForm, setShowHeroForm] = useState(false);

	const router = useRouter();

	// Auth check
	useEffect(() => {
		fetch("/api/auth/me")
			.then((r) => r.json())
			.then((data) => {
				if (!data.authenticated) {
					router.replace("/admin");
					return;
				}
				setAdmin(data.user);
				setLoading(false);
			})
			.catch(() => router.replace("/admin"));
	}, [router]);

	// Fetch data
	const fetchBookings = useCallback(async () => {
		const r = await fetch("/api/bookings");
		const data = await r.json();
		setBookings(data);
	}, []);

	const fetchServices = useCallback(async () => {
		const r = await fetch("/api/services");
		const data = await r.json();
		setServices(data);
	}, []);

	const fetchHero = useCallback(async () => {
		const r = await fetch("/api/hero");
		const data = await r.json();
		if (data.id) setHeroContent(data);
	}, []);

	useEffect(() => {
		if (!loading) {
			fetchBookings();
			fetchServices();
			fetchHero();
		}
	}, [loading, fetchBookings, fetchServices, fetchHero]);

	const handleLogout = async () => {
		await fetch("/api/auth/logout", { method: "POST" });
		router.replace("/admin");
	};

	const deleteBooking = async (id: string) => {
		if (!confirm("Are you sure you want to delete this booking?")) return;
		await fetch(`/api/bookings/${id}`, { method: "DELETE" });
		fetchBookings();
	};

	const deleteService = async (id: string) => {
		if (!confirm("Are you sure you want to delete this service?")) return;
		await fetch("/api/services", {
			method: "DELETE",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ id }),
		});
		fetchServices();
	};

	if (loading) {
		return (
			<div className="min-h-screen flex items-center justify-center">
				<div className="w-6 h-6 border-2 border-[#c9a87c] border-t-transparent rounded-full animate-spin" />
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-[#0a0a0a]">
			{/* Header */}
			<header className="border-b border-[rgba(255,255,255,0.06)] bg-[#111111]">
				<div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
					<div className="flex items-center gap-4">
						<div className="w-9 h-9 rounded-full border-2 border-[#c9a87c]/60 flex items-center justify-center">
							<span className="text-xs font-bold tracking-wider text-[#c9a87c]">
								M
							</span>
						</div>
						<div>
							<h1 className="text-lg font-semibold text-[#f5f0eb]">
								Admin Dashboard
							</h1>
							<p className="text-xs text-[#6b6560]">Welcome, {admin?.name}</p>
						</div>
					</div>
					<div className="flex items-center gap-4">
						<a
							href="/"
							target="_blank"
							className="text-xs text-[#6b6560] hover:text-[#a8a29e] transition-colors"
						>
							View Site →
						</a>
						<button
							onClick={handleLogout}
							className="px-4 py-2 text-xs border border-[rgba(255,255,255,0.08)] text-[#a8a29e] rounded-lg hover:border-red-500/30 hover:text-red-400 transition-all duration-300"
						>
							Logout
						</button>
					</div>
				</div>
			</header>

			{/* Stats bar */}
			<div className="border-b border-[rgba(255,255,255,0.06)] bg-[#0d0d0d]">
				<div className="max-w-7xl mx-auto px-6 py-4 flex gap-8">
					<div className="flex items-center gap-3">
						<div className="w-10 h-10 rounded-lg bg-[#c9a87c]/10 flex items-center justify-center text-[#c9a87c] text-sm">
							📋
						</div>
						<div>
							<div className="text-xl font-semibold text-[#f5f0eb]">
								{bookings.length}
							</div>
							<div className="text-[10px] text-[#6b6560] uppercase tracking-wider">
								Bookings
							</div>
						</div>
					</div>
					<div className="flex items-center gap-3">
						<div className="w-10 h-10 rounded-lg bg-[#c9a87c]/10 flex items-center justify-center text-[#c9a87c] text-sm">
							✨
						</div>
						<div>
							<div className="text-xl font-semibold text-[#f5f0eb]">
								{services.length}
							</div>
							<div className="text-[10px] text-[#6b6560] uppercase tracking-wider">
								Services
							</div>
						</div>
					</div>
					<div className="flex items-center gap-3">
						<div className="w-10 h-10 rounded-lg bg-[#c9a87c]/10 flex items-center justify-center text-[#c9a87c] text-sm">
							🏠
						</div>
						<div>
							<div className="text-xl font-semibold text-[#f5f0eb]">
								{heroContent ? "Set" : "Not Set"}
							</div>
							<div className="text-[10px] text-[#6b6560] uppercase tracking-wider">
								Hero Section
							</div>
						</div>
					</div>
				</div>
			</div>

			{/* Tabs */}
			<div className="max-w-7xl mx-auto px-6 pt-6">
				<div className="flex gap-1 mb-6 overflow-x-auto no-scrollbar">
					{(["bookings", "services", "hero"] as Tab[]).map((t) => (
						<button
							key={t}
							onClick={() => setTab(t)}
							className={`px-5 py-2.5 rounded-lg text-sm font-medium transition-all duration-300 whitespace-nowrap ${
								tab === t
									? "bg-[#c9a87c]/15 text-[#c9a87c] border border-[#c9a87c]/20"
									: "text-[#6b6560] hover:text-[#a8a29e] border border-transparent"
							}`}
						>
							{t === "bookings"
								? "📋 Bookings"
								: t === "services"
									? "✨ Services"
									: "🏠 Hero Section"}
						</button>
					))}
				</div>

				{/* Bookings tab */}
				{tab === "bookings" && (
					<div>
						<div className="flex items-center justify-between mb-6">
							<h2 className="text-xl font-semibold text-[#f5f0eb]">Bookings</h2>
							<button
								onClick={() => {
									setEditingBooking(null);
									setShowBookingForm(true);
								}}
								className="px-4 py-2 bg-[#c9a87c] text-[#0a0a0a] text-sm font-semibold rounded-lg hover:bg-[#e8d5b7] transition-colors"
							>
								+ Add Booking
							</button>
						</div>

						<div className="grid gap-4">
							{bookings.map((booking) => (
								<div
									key={booking.id}
									className="rounded-xl border border-[rgba(255,255,255,0.06)] bg-[#111111] p-5"
								>
									<div className="flex items-start gap-5">
										{/* Thumbnail */}
										{booking.images[0] && (
											<div className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 relative">
												<Image
													src={booking.images[0].imageUrl}
													alt={booking.title}
													fill
													className="object-cover"
													sizes="80px"
												/>
											</div>
										)}
										{/* Info */}
										<div className="flex-1 min-w-0">
											<div className="flex items-center gap-2 mb-1">
												<h3 className="text-base font-semibold text-[#f5f0eb] truncate">
													{booking.title}
												</h3>
												<span className="px-2 py-0.5 text-[9px] uppercase tracking-wider font-semibold bg-[#c9a87c]/15 text-[#c9a87c] rounded-full flex-shrink-0">
													{booking.category}
												</span>
											</div>
											<div className="flex items-center gap-3 text-xs text-[#6b6560]">
												<span>📍 {booking.location}</span>
												<span>
													📅{" "}
													{new Date(booking.date).toLocaleDateString("en-IN", {
														day: "numeric",
														month: "short",
														year: "numeric",
													})}
												</span>
												{booking.clientName && (
													<span>👤 {booking.clientName}</span>
												)}
												<span>🖼️ {booking.images.length} images</span>
											</div>
											{booking.description && (
												<p className="text-xs text-[#6b6560] mt-2 line-clamp-1">
													{booking.description}
												</p>
											)}
										</div>
										{/* Actions */}
										<div className="flex gap-2 flex-shrink-0">
											<button
												onClick={() => {
													setEditingBooking(booking);
													setShowBookingForm(true);
												}}
												className="px-3 py-1.5 text-xs border border-[rgba(255,255,255,0.08)] text-[#a8a29e] rounded-lg hover:border-[#c9a87c]/30 hover:text-[#c9a87c] transition-all"
											>
												Edit
											</button>
											<button
												onClick={() => deleteBooking(booking.id)}
												className="px-3 py-1.5 text-xs border border-[rgba(255,255,255,0.08)] text-[#a8a29e] rounded-lg hover:border-red-500/30 hover:text-red-400 transition-all"
											>
												Delete
											</button>
										</div>
									</div>
								</div>
							))}

							{bookings.length === 0 && (
								<div className="text-center py-12 text-[#6b6560] text-sm">
									No bookings yet. Click &ldquo;+ Add Booking&rdquo; to create
									one.
								</div>
							)}
						</div>
					</div>
				)}

				{/* Services tab */}
				{tab === "services" && (
					<div>
						<div className="flex items-center justify-between mb-6">
							<h2 className="text-xl font-semibold text-[#f5f0eb]">Services</h2>
							<button
								onClick={() => {
									setEditingService(null);
									setShowServiceForm(true);
								}}
								className="px-4 py-2 bg-[#c9a87c] text-[#0a0a0a] text-sm font-semibold rounded-lg hover:bg-[#e8d5b7] transition-colors"
							>
								+ Add Service
							</button>
						</div>

						<div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
							{services.map((service) => (
								<div
									key={service.id}
									className="rounded-xl border border-[rgba(255,255,255,0.06)] bg-[#111111] overflow-hidden"
								>
									<div className="aspect-[16/9] relative">
										<Image
											src={service.imageUrl}
											alt={service.title}
											fill
											className="object-cover"
											sizes="400px"
										/>
									</div>
									<div className="p-4">
										<div className="flex items-center gap-2 mb-1">
											<span className="text-base">{service.icon}</span>
											<h3 className="text-sm font-semibold text-[#f5f0eb]">
												{service.title}
											</h3>
										</div>
										<p className="text-xs text-[#6b6560] line-clamp-2 mb-3">
											{service.description}
										</p>
										<div className="flex gap-2">
											<button
												onClick={() => {
													setEditingService(service);
													setShowServiceForm(true);
												}}
												className="px-3 py-1.5 text-xs border border-[rgba(255,255,255,0.08)] text-[#a8a29e] rounded-lg hover:border-[#c9a87c]/30 hover:text-[#c9a87c] transition-all"
											>
												Edit
											</button>
											<button
												onClick={() => deleteService(service.id)}
												className="px-3 py-1.5 text-xs border border-[rgba(255,255,255,0.08)] text-[#a8a29e] rounded-lg hover:border-red-500/30 hover:text-red-400 transition-all"
											>
												Delete
											</button>
										</div>
									</div>
								</div>
							))}

							{services.length === 0 && (
								<div className="text-center py-12 text-[#6b6560] text-sm col-span-full">
									No services yet. Click &ldquo;+ Add Service&rdquo; to create
									one.
								</div>
							)}
						</div>
					</div>
				)}

				{/* Hero tab */}
				{tab === "hero" && (
					<div>
						<div className="flex items-center justify-between mb-6">
							<h2 className="text-xl font-semibold text-[#f5f0eb]">
								Hero Section
							</h2>
							<button
								onClick={() => setShowHeroForm(true)}
								className="px-4 py-2 bg-[#c9a87c] text-[#0a0a0a] text-sm font-semibold rounded-lg hover:bg-[#e8d5b7] transition-colors"
							>
								{heroContent ? "Edit Hero Content" : "Setup Hero Content"}
							</button>
						</div>

						{heroContent ? (
							<div className="rounded-2xl border border-[rgba(255,255,255,0.06)] bg-[#111111] overflow-hidden">
								<div className="aspect-[21/9] relative">
									<Image
										src={heroContent.backgroundImage}
										alt="Hero Preview"
										fill
										className="object-cover opacity-60"
									/>
									<div className="absolute inset-0 p-8 flex flex-col justify-center max-w-2xl">
										<span className="text-[#c9a87c] text-xs font-semibold tracking-widest uppercase mb-2">
											{heroContent.badgeText}
										</span>
										<h3 className="text-3xl md:text-4xl font-bold text-white mb-3">
											{heroContent.titlePart1}{" "}
											<span className="text-[#c9a87c]">
												{heroContent.titlePart2}
											</span>
										</h3>
										<p className="text-[#a8a29e] text-sm line-clamp-2 mb-6">
											{heroContent.subtitle}
										</p>
										<div className="flex gap-4">
											<div className="px-5 py-2.5 bg-[#c9a87c] text-black text-xs font-bold rounded-lg opacity-80 cursor-default">
												{heroContent.primaryCtaText}
											</div>
											<div className="px-5 py-2.5 border border-[#c9a87c]/40 text-[#c9a87c] text-xs font-bold rounded-lg opacity-80 cursor-default">
												{heroContent.secondaryCtaText}
											</div>
										</div>
									</div>
								</div>
								<div className="p-4 border-t border-white/5 bg-[#0d0d0d] flex justify-between items-center text-xs text-[#6b6560]">
									<span>
										Redirects to: {heroContent.primaryCtaLink} |{" "}
										{heroContent.secondaryCtaLink}
									</span>
									<span className="italic">
										This is how your homepage looks.
									</span>
								</div>
							</div>
						) : (
							<div className="text-center py-20 border-2 border-dashed border-[rgba(255,255,255,0.06)] rounded-2xl">
								<p className="text-[#6b6560] mb-4">
									You haven&apos;t set up the hero section yet.
								</p>
								<button
									onClick={() => setShowHeroForm(true)}
									className="px-6 py-2.5 text-sm font-semibold bg-[#c9a87c]/10 text-[#c9a87c] rounded-xl hover:bg-[#c9a87c]/20 transition-all"
								>
									Configure Now
								</button>
							</div>
						)}
					</div>
				)}
			</div>

			{/* Forms */}
			{showBookingForm && (
				<BookingFormModal
					booking={editingBooking}
					onClose={() => {
						setShowBookingForm(false);
						setEditingBooking(null);
					}}
					onSaved={() => {
						setShowBookingForm(false);
						setEditingBooking(null);
						fetchBookings();
					}}
				/>
			)}

			{showServiceForm && (
				<ServiceFormModal
					service={editingService}
					onClose={() => {
						setShowServiceForm(false);
						setEditingService(null);
					}}
					onSaved={() => {
						setShowServiceForm(false);
						setEditingService(null);
						fetchServices();
					}}
				/>
			)}

			{showHeroForm && (
				<HeroFormModal
					hero={heroContent}
					onClose={() => setShowHeroForm(false)}
					onSaved={() => {
						setShowHeroForm(false);
						fetchHero();
					}}
				/>
			)}
		</div>
	);
}

// ── Booking Form Modal ─────────────────────────────────────────────────────
function BookingFormModal({
	booking,
	onClose,
	onSaved,
}: {
	booking: Booking | null;
	onClose: () => void;
	onSaved: () => void;
}) {
	const isEditing = !!booking;
	const [title, setTitle] = useState(booking?.title || "");
	const [location, setLocation] = useState(booking?.location || "");
	const [category, setCategory] = useState(booking?.category || "bridal");
	const [description, setDescription] = useState(booking?.description || "");
	const [date, setDate] = useState(booking?.date?.split("T")[0] || "");
	const [clientName, setClientName] = useState(booking?.clientName || "");
	const [images, setImages] = useState<{ imageUrl: string; caption: string }[]>(
		booking?.images.map((img) => ({
			imageUrl: img.imageUrl,
			caption: img.caption || "",
		})) || [{ imageUrl: "", caption: "" }],
	);
	const [saving, setSaving] = useState(false);
	const [error, setError] = useState("");

	const addImage = () => setImages([...images, { imageUrl: "", caption: "" }]);
	const removeImage = (i: number) =>
		setImages(images.filter((_, idx) => idx !== i));
	const updateImage = (
		i: number,
		field: "imageUrl" | "caption",
		value: string,
	) => {
		const updated = [...images];
		updated[i][field] = value;
		setImages(updated);
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setError("");
		setSaving(true);

		const validImages = images.filter((img) => img.imageUrl.trim());
		const body = {
			title,
			location,
			category,
			description,
			date,
			clientName,
			images: validImages,
		};

		try {
			const url = isEditing ? `/api/bookings/${booking.id}` : "/api/bookings";
			const method = isEditing ? "PUT" : "POST";
			const res = await fetch(url, {
				method,
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(body),
			});

			if (!res.ok) {
				const data = await res.json();
				setError(data.error || "Failed to save");
				setSaving(false);
				return;
			}

			onSaved();
		} catch {
			setError("Network error");
			setSaving(false);
		}
	};

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center p-4">
			<div
				className="absolute inset-0 bg-black/60 backdrop-blur-sm"
				onClick={onClose}
			/>
			<div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-[#111111] rounded-2xl border border-[rgba(255,255,255,0.06)] shadow-2xl">
				<div className="sticky top-0 bg-[#111111] border-b border-[rgba(255,255,255,0.06)] p-6 flex items-center justify-between z-10">
					<h2 className="text-lg font-semibold text-[#f5f0eb]">
						{isEditing ? "Edit Booking" : "New Booking"}
					</h2>
					<button
						onClick={onClose}
						className="text-[#6b6560] hover:text-[#f5f0eb] transition-colors"
					>
						✕
					</button>
				</div>

				<form onSubmit={handleSubmit} className="p-6 space-y-5">
					{error && (
						<div className="px-4 py-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
							{error}
						</div>
					)}

					<div className="grid sm:grid-cols-2 gap-4">
						<InputField
							label="Title"
							value={title}
							onChange={setTitle}
							required
						/>
						<InputField
							label="Location"
							value={location}
							onChange={setLocation}
							required
						/>
					</div>

					<div className="grid sm:grid-cols-3 gap-4">
						<div>
							<label className="block text-xs uppercase tracking-wider text-[#6b6560] mb-2 font-medium">
								Category
							</label>
							<select
								value={category}
								onChange={(e) => setCategory(e.target.value)}
								className="w-full px-4 py-3 rounded-xl bg-[#0a0a0a] border border-[rgba(255,255,255,0.08)] text-[#f5f0eb] text-sm focus:outline-none focus:border-[#c9a87c]/40"
							>
								{[
									"bridal",
									"party",
									"engagement",
									"festival",
									"editorial",
									"glamour",
								].map((c) => (
									<option key={c} value={c}>
										{c.charAt(0).toUpperCase() + c.slice(1)}
									</option>
								))}
							</select>
						</div>
						<InputField
							label="Date"
							value={date}
							onChange={setDate}
							type="date"
							required
						/>
						<InputField
							label="Client Name"
							value={clientName}
							onChange={setClientName}
						/>
					</div>

					<div>
						<label className="block text-xs uppercase tracking-wider text-[#6b6560] mb-2 font-medium">
							Description
						</label>
						<textarea
							value={description}
							onChange={(e) => setDescription(e.target.value)}
							className="w-full px-4 py-3 rounded-xl bg-[#0a0a0a] border border-[rgba(255,255,255,0.08)] text-[#f5f0eb] text-sm focus:outline-none focus:border-[#c9a87c]/40 min-h-[80px] resize-y"
							rows={3}
						/>
					</div>

					{/* Images */}
					<div>
						<div className="flex items-center justify-between mb-3">
							<label className="text-xs uppercase tracking-wider text-[#6b6560] font-medium">
								Images
							</label>
							<button
								type="button"
								onClick={addImage}
								className="text-xs text-[#c9a87c] hover:text-[#e8d5b7] transition-colors"
							>
								+ Add Image
							</button>
						</div>
						<div className="space-y-3">
							{images.map((img, i) => (
								<div
									key={i}
									className="rounded-lg border border-[rgba(255,255,255,0.06)] bg-[#0a0a0a]/50 p-3"
								>
									<div className="flex gap-3 items-start">
										{img.imageUrl && (
											<div className="w-14 h-14 rounded-lg overflow-hidden flex-shrink-0 relative border border-[rgba(255,255,255,0.06)]">
												<Image
													src={img.imageUrl}
													alt=""
													fill
													className="object-cover"
													sizes="56px"
												/>
											</div>
										)}
										<div className="flex-1 space-y-2">
											<div className="flex gap-2">
												<input
													value={img.imageUrl}
													onChange={(e) =>
														updateImage(i, "imageUrl", e.target.value)
													}
													className="flex-1 px-3 py-2 rounded-lg bg-[#0a0a0a] border border-[rgba(255,255,255,0.08)] text-[#f5f0eb] text-xs focus:outline-none focus:border-[#c9a87c]/40"
													placeholder="Image URL or upload →"
												/>
												<ImageUploader
													onUploaded={(url) => updateImage(i, "imageUrl", url)}
												/>
											</div>
											<input
												value={img.caption}
												onChange={(e) =>
													updateImage(i, "caption", e.target.value)
												}
												className="w-full px-3 py-2 rounded-lg bg-[#0a0a0a] border border-[rgba(255,255,255,0.08)] text-[#f5f0eb] text-xs focus:outline-none focus:border-[#c9a87c]/40"
												placeholder="Caption (optional)"
											/>
										</div>
										{images.length > 1 && (
											<button
												type="button"
												onClick={() => removeImage(i)}
												className="text-[#6b6560] hover:text-red-400 text-sm mt-1 transition-colors"
											>
												✕
											</button>
										)}
									</div>
								</div>
							))}
						</div>
					</div>

					<div className="flex gap-3 pt-4 border-t border-[rgba(255,255,255,0.06)]">
						<button
							type="button"
							onClick={onClose}
							className="flex-1 py-3 border border-[rgba(255,255,255,0.08)] text-[#a8a29e] rounded-xl hover:border-[rgba(255,255,255,0.15)] transition-colors text-sm"
						>
							Cancel
						</button>
						<button
							type="submit"
							disabled={saving}
							className="flex-1 py-3 bg-[#c9a87c] text-[#0a0a0a] font-semibold rounded-xl hover:bg-[#e8d5b7] transition-colors text-sm disabled:opacity-50"
						>
							{saving
								? "Saving..."
								: isEditing
									? "Update Booking"
									: "Create Booking"}
						</button>
					</div>
				</form>
			</div>
		</div>
	);
}

// ── Service Form Modal ──────────────────────────────────────────────────────
function ServiceFormModal({
	service,
	onClose,
	onSaved,
}: {
	service: Service | null;
	onClose: () => void;
	onSaved: () => void;
}) {
	const isEditing = !!service;
	const [title, setTitle] = useState(service?.title || "");
	const [description, setDescription] = useState(service?.description || "");
	const [imageUrl, setImageUrl] = useState(service?.imageUrl || "");
	const [icon, setIcon] = useState(service?.icon || "✨");
	const [sortOrder, setSortOrder] = useState(service?.sortOrder ?? 0);
	const [saving, setSaving] = useState(false);
	const [error, setError] = useState("");

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setError("");
		setSaving(true);

		const body = isEditing
			? { id: service.id, title, description, imageUrl, icon, sortOrder }
			: { title, description, imageUrl, icon, sortOrder };

		try {
			const res = await fetch("/api/services", {
				method: isEditing ? "PUT" : "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(body),
			});

			if (!res.ok) {
				const data = await res.json();
				setError(data.error || "Failed to save");
				setSaving(false);
				return;
			}

			onSaved();
		} catch {
			setError("Network error");
			setSaving(false);
		}
	};

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center p-4">
			<div
				className="absolute inset-0 bg-black/60 backdrop-blur-sm"
				onClick={onClose}
			/>
			<div className="relative w-full max-lg bg-[#111111] rounded-2xl border border-[rgba(255,255,255,0.06)] shadow-2xl overflow-hidden max-w-lg">
				<div className="border-b border-[rgba(255,255,255,0.06)] p-6 flex items-center justify-between">
					<h2 className="text-lg font-semibold text-[#f5f0eb]">
						{isEditing ? "Edit Service" : "New Service"}
					</h2>
					<button
						onClick={onClose}
						className="text-[#6b6560] hover:text-[#f5f0eb] transition-colors"
					>
						✕
					</button>
				</div>

				<form onSubmit={handleSubmit} className="p-6 space-y-5">
					{error && (
						<div className="px-4 py-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
							{error}
						</div>
					)}

					<div className="grid sm:grid-cols-2 gap-4">
						<InputField
							label="Title"
							value={title}
							onChange={setTitle}
							required
						/>
						<div className="grid grid-cols-2 gap-2">
							<InputField
								label="Icon (emoji)"
								value={icon}
								onChange={setIcon}
							/>
							<InputField
								label="Sort Order"
								value={String(sortOrder)}
								onChange={(v) => setSortOrder(Number(v))}
								type="number"
							/>
						</div>
					</div>

					<div>
						<label className="block text-xs uppercase tracking-wider text-[#6b6560] mb-2 font-medium">
							Image
						</label>
						<div className="flex gap-2">
							<input
								value={imageUrl}
								onChange={(e) => setImageUrl(e.target.value)}
								className="flex-1 px-4 py-3 rounded-xl bg-[#0a0a0a] border border-[rgba(255,255,255,0.08)] text-[#f5f0eb] text-sm focus:outline-none focus:border-[#c9a87c]/40"
								placeholder="Image URL or upload →"
								required
							/>
							<ImageUploader onUploaded={(url) => setImageUrl(url)} />
						</div>
					</div>

					<div>
						<label className="block text-xs uppercase tracking-wider text-[#6b6560] mb-2 font-medium">
							Description
						</label>
						<textarea
							value={description}
							onChange={(e) => setDescription(e.target.value)}
							className="w-full px-4 py-3 rounded-xl bg-[#0a0a0a] border border-[rgba(255,255,255,0.08)] text-[#f5f0eb] text-sm focus:outline-none focus:border-[#c9a87c]/40 min-h-[80px] resize-y"
							rows={3}
							required
						/>
					</div>

					<div className="flex gap-3 pt-4 border-t border-[rgba(255,255,255,0.06)]">
						<button
							type="button"
							onClick={onClose}
							className="flex-1 py-3 border border-[rgba(255,255,255,0.08)] text-[#a8a29e] rounded-xl hover:border-[rgba(255,255,255,0.15)] transition-colors text-sm"
						>
							Cancel
						</button>
						<button
							type="submit"
							disabled={saving}
							className="flex-1 py-3 bg-[#c9a87c] text-[#0a0a0a] font-semibold rounded-xl hover:bg-[#e8d5b7] transition-colors text-sm disabled:opacity-50"
						>
							{saving
								? "Saving..."
								: isEditing
									? "Update Service"
									: "Create Service"}
						</button>
					</div>
				</form>
			</div>
		</div>
	);
}

// ── Hero Form Modal ──────────────────────────────────────────────────────────
function HeroFormModal({
	hero,
	onClose,
	onSaved,
}: {
	hero: HeroContent | null;
	onClose: () => void;
	onSaved: () => void;
}) {
	const [badgeText, setBadgeText] = useState(
		hero?.badgeText || "Professional Makeup Artist",
	);
	const [titlePart1, setTitlePart1] = useState(hero?.titlePart1 || "Meena");
	const [titlePart2, setTitlePart2] = useState(hero?.titlePart2 || "Bisht");
	const [subtitle, setSubtitle] = useState(hero?.subtitle || "");
	const [primaryCtaText, setPrimaryCtaText] = useState(
		hero?.primaryCtaText || "Explore Portfolio",
	);
	const [primaryCtaLink, setPrimaryCtaLink] = useState(
		hero?.primaryCtaLink || "/portfolio",
	);
	const [secondaryCtaText, setSecondaryCtaText] = useState(
		hero?.secondaryCtaText || "Book a Session",
	);
	const [secondaryCtaLink, setSecondaryCtaLink] = useState(
		hero?.secondaryCtaLink || "#contact",
	);
	const [backgroundImage, setBackgroundImage] = useState(
		hero?.backgroundImage || "",
	);
	const [saving, setSaving] = useState(false);
	const [error, setError] = useState("");

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setError("");
		setSaving(true);

		try {
			const res = await fetch("/api/hero", {
				method: "PUT",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					badgeText,
					titlePart1,
					titlePart2,
					subtitle,
					primaryCtaText,
					primaryCtaLink,
					secondaryCtaText,
					secondaryCtaLink,
					backgroundImage,
				}),
			});

			if (!res.ok) {
				const data = await res.json();
				setError(data.error || "Failed to save");
				setSaving(false);
				return;
			}
			onSaved();
		} catch {
			setError("Network error");
			setSaving(false);
		}
	};

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center p-4">
			<div
				className="absolute inset-0 bg-black/60 backdrop-blur-sm"
				onClick={onClose}
			/>
			<div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-[#111111] rounded-2xl border border-[rgba(255,255,255,0.06)] shadow-2xl">
				<div className="sticky top-0 bg-[#111111] border-b border-[rgba(255,255,255,0.06)] p-6 flex items-center justify-between z-10">
					<h2 className="text-lg font-semibold text-[#f5f0eb]">
						Homepage Hero Content
					</h2>
					<button
						onClick={onClose}
						className="text-[#6b6560] hover:text-[#f5f0eb] transition-colors"
					>
						✕
					</button>
				</div>

				<form onSubmit={handleSubmit} className="p-6 space-y-5">
					{error && (
						<div className="px-4 py-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
							{error}
						</div>
					)}

					<InputField
						label="Badge Text"
						value={badgeText}
						onChange={setBadgeText}
						required
					/>

					<div className="grid sm:grid-cols-2 gap-4">
						<InputField
							label="Name/Title 1"
							value={titlePart1}
							onChange={setTitlePart1}
							required
						/>
						<InputField
							label="Name/Title 2 (colored)"
							value={titlePart2}
							onChange={setTitlePart2}
							required
						/>
					</div>

					<div>
						<label className="block text-xs uppercase tracking-wider text-[#6b6560] mb-2 font-medium">
							Subtitle
						</label>
						<textarea
							value={subtitle}
							onChange={(e) => setSubtitle(e.target.value)}
							className="w-full px-4 py-3 rounded-xl bg-[#0a0a0a] border border-[rgba(255,255,255,0.08)] text-[#f5f0eb] text-sm focus:outline-none focus:border-[#c9a87c]/40 min-h-[80px]"
							rows={3}
							required
						/>
					</div>

					<div className="grid sm:grid-cols-2 gap-4">
						<div className="space-y-4">
							<InputField
								label="Primary Button Text"
								value={primaryCtaText}
								onChange={setPrimaryCtaText}
								required
							/>
							<InputField
								label="Primary Button Link"
								value={primaryCtaLink}
								onChange={setPrimaryCtaLink}
								required
							/>
						</div>
						<div className="space-y-4">
							<InputField
								label="Secondary Button Text"
								value={secondaryCtaText}
								onChange={setSecondaryCtaText}
								required
							/>
							<InputField
								label="Secondary Button Link"
								value={secondaryCtaLink}
								onChange={setSecondaryCtaLink}
								required
							/>
						</div>
					</div>

					<div>
						<label className="block text-xs uppercase tracking-wider text-[#6b6560] mb-2 font-medium">
							Background Image
						</label>
						<div className="flex gap-2">
							<input
								value={backgroundImage}
								onChange={(e) => setBackgroundImage(e.target.value)}
								className="flex-1 px-4 py-3 rounded-xl bg-[#0a0a0a] border border-[rgba(255,255,255,0.08)] text-[#f5f0eb] text-sm focus:outline-none focus:border-[#c9a87c]/40"
								placeholder="Background image URL..."
								required
							/>
							<ImageUploader onUploaded={setBackgroundImage} />
						</div>
					</div>

					<div className="flex gap-3 pt-4 border-t border-[rgba(255,255,255,0.06)]">
						<button
							type="button"
							onClick={onClose}
							className="flex-1 py-3 border border-[rgba(255,255,255,0.08)] text-[#a8a29e] rounded-xl hover:border-[rgba(255,255,255,0.15)] text-sm"
						>
							Cancel
						</button>
						<button
							type="submit"
							disabled={saving}
							className="flex-1 py-3 bg-[#c9a87c] text-[#0a0a0a] font-semibold rounded-xl hover:bg-[#e8d5b7] text-sm disabled:opacity-50"
						>
							{saving ? "Saving..." : "Save Hero Content"}
						</button>
					</div>
				</form>
			</div>
		</div>
	);
}

// ── Image Uploader (Cloudinary) ─────────────────────────────────────────────
function ImageUploader({ onUploaded }: { onUploaded: (url: string) => void }) {
	const fileRef = useRef<HTMLInputElement>(null);
	const [uploading, setUploading] = useState(false);

	const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (!file) return;

		setUploading(true);
		const formData = new FormData();
		formData.append("file", file);

		try {
			const res = await fetch("/api/upload", {
				method: "POST",
				body: formData,
			});

			if (!res.ok) {
				const data = await res.json();
				alert(data.error || "Upload failed");
				setUploading(false);
				return;
			}

			const data = await res.json();
			onUploaded(data.url);
		} catch {
			alert("Upload failed. Check your Cloudinary credentials.");
		} finally {
			setUploading(false);
			if (fileRef.current) fileRef.current.value = "";
		}
	};

	return (
		<>
			<input
				ref={fileRef}
				type="file"
				accept="image/*"
				onChange={handleUpload}
				className="hidden"
			/>
			<button
				type="button"
				onClick={() => fileRef.current?.click()}
				disabled={uploading}
				className="px-3 py-2 rounded-lg bg-[#c9a87c]/15 border border-[#c9a87c]/20 text-[#c9a87c] text-xs font-medium hover:bg-[#c9a87c]/25 transition-all disabled:opacity-50 flex items-center gap-1.5 whitespace-nowrap"
			>
				{uploading ? (
					<>
						<div className="w-3 h-3 border-2 border-[#c9a87c]/30 border-t-[#c9a87c] rounded-full animate-spin" />
						Uploading
					</>
				) : (
					<>
						<svg
							className="w-3.5 h-3.5"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
							/>
						</svg>
						Upload
					</>
				)}
			</button>
		</>
	);
}

// ── Reusable input ──────────────────────────────────────────────────────────
function InputField({
	label,
	value,
	onChange,
	type = "text",
	required = false,
}: {
	label: string;
	value: string;
	onChange: (v: string) => void;
	type?: string;
	required?: boolean;
}) {
	return (
		<div>
			<label className="block text-xs uppercase tracking-wider text-[#6b6560] mb-2 font-medium">
				{label}
			</label>
			<input
				type={type}
				value={value}
				onChange={(e) => onChange(e.target.value)}
				required={required}
				className="w-full px-4 py-3 rounded-xl bg-[#0a0a0a] border border-[rgba(255,255,255,0.08)] text-[#f5f0eb] text-sm focus:outline-none focus:border-[#c9a87c]/40"
			/>
		</div>
	);
}
