export type MakeupCategory =
	| "bridal"
	| "party"
	| "engagement"
	| "festival"
	| "editorial"
	| "glamour";

export interface BookingImage {
	id: string;
	imageUrl: string;
	caption?: string;
}

export interface Booking {
	id: string;
	title: string;
	location: string;
	category: MakeupCategory;
	description?: string;
	date: string; // ISO date string, e.g. "2025-01-15"
	clientName?: string;
	images: BookingImage[];
}

export interface GalleryItem {
	id: string;
	imageUrl: string;
	title: string;
	location: string;
	category: MakeupCategory;
	description?: string;
	date: string;
}

// ── Bookings (will be fetched from DB later) ──────────────────────────────
export const bookings: Booking[] = [
	{
		id: "b1",
		title: "Traditional Bridal Look",
		location: "Kolkata",
		category: "bridal",
		description:
			"Elegant bridal makeup with traditional jewelry and intricate detailing for the perfect wedding day.",
		date: "2025-01-15",
		clientName: "Priya S.",
		images: [
			{
				id: "b1-1",
				imageUrl:
					"https://images.unsplash.com/photo-1742891602044-7fdc0a9839ad?w=800&q=80",
				caption: "Bridal look - front view",
			},
			{
				id: "b1-2",
				imageUrl:
					"https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=800&q=80",
				caption: "Detail - eye makeup",
			},
			{
				id: "b1-3",
				imageUrl:
					"https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=800&q=80",
				caption: "Final reveal",
			},
		],
	},
	{
		id: "b2",
		title: "Classic Bride",
		location: "Mumbai",
		category: "bridal",
		description:
			"Timeless bridal elegance with soft smoky eyes and luminous skin.",
		date: "2025-02-22",
		clientName: "Anjali M.",
		images: [
			{
				id: "b2-1",
				imageUrl:
					"https://images.unsplash.com/photo-1519699047748-de8e457a634e?w=800&q=80",
				caption: "Before the ceremony",
			},
			{
				id: "b2-2",
				imageUrl:
					"https://images.unsplash.com/photo-1502823403499-6ccfcf4fb453?w=800&q=80",
				caption: "Getting ready",
			},
		],
	},
	{
		id: "b3",
		title: "Glamorous Party Makeup",
		location: "Delhi",
		category: "party",
		description:
			"Stunning evening party look with bold lips and dramatic lashes.",
		date: "2025-03-10",
		clientName: "Kavya R.",
		images: [
			{
				id: "b3-1",
				imageUrl:
					"https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=800&q=80",
				caption: "Party glam",
			},
			{
				id: "b3-2",
				imageUrl:
					"https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&q=80",
				caption: "Night look",
			},
		],
	},
	{
		id: "b4",
		title: "Editorial Beauty Shoot",
		location: "Bangalore",
		category: "editorial",
		description: "High fashion editorial makeup for Vogue India collaboration.",
		date: "2025-04-05",
		clientName: "Studio Collab",
		images: [
			{
				id: "b4-1",
				imageUrl:
					"https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=800&q=80",
				caption: "Editorial look 1",
			},
			{
				id: "b4-2",
				imageUrl:
					"https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&q=80",
				caption: "Editorial look 2",
			},
			{
				id: "b4-3",
				imageUrl:
					"https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=800&q=80",
				caption: "Editorial look 3",
			},
		],
	},
	{
		id: "b5",
		title: "Wedding Day Glow",
		location: "Jaipur",
		category: "bridal",
		description:
			"Radiant bridal glow with dewey skin and soft pink tones for a royal Jaipur wedding.",
		date: "2025-05-18",
		clientName: "Sneha K.",
		images: [
			{
				id: "b5-1",
				imageUrl:
					"https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=800&q=80",
				caption: "Bridal glow",
			},
		],
	},
	{
		id: "b6",
		title: "Diwali Festival Glam",
		location: "Hyderabad",
		category: "festival",
		description:
			"Vibrant festival makeup with gold accents and bold colors for Diwali celebrations.",
		date: "2025-06-25",
		clientName: "Deepa V.",
		images: [
			{
				id: "b6-1",
				imageUrl:
					"https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=800&q=80",
				caption: "Festival ready",
			},
			{
				id: "b6-2",
				imageUrl:
					"https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=800&q=80",
				caption: "Gold accent details",
			},
		],
	},
	{
		id: "b7",
		title: "Sangeet Night Transformation",
		location: "Pune",
		category: "party",
		description: "Bold and vibrant party makeup for a memorable sangeet night.",
		date: "2025-07-12",
		clientName: "Riya P.",
		images: [
			{
				id: "b7-1",
				imageUrl:
					"https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&q=80",
				caption: "Sangeet look",
			},
		],
	},
	{
		id: "b8",
		title: "Engagement Ceremony",
		location: "Chennai",
		category: "engagement",
		description:
			"Soft romantic engagement look with rose gold tones and dewy finish.",
		date: "2025-08-30",
		clientName: "Nandini S.",
		images: [
			{
				id: "b8-1",
				imageUrl:
					"https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?w=800&q=80",
				caption: "Engagement look",
			},
			{
				id: "b8-2",
				imageUrl:
					"https://images.unsplash.com/photo-1519699047748-de8e457a634e?w=800&q=80",
				caption: "Close-up",
			},
		],
	},
	{
		id: "b9",
		title: "Natural Bridal Beauty",
		location: "Ahmedabad",
		category: "bridal",
		description: "Fresh natural bridal beauty with minimal, enhancing makeup.",
		date: "2025-09-14",
		clientName: "Pooja D.",
		images: [
			{
				id: "b9-1",
				imageUrl:
					"https://images.unsplash.com/photo-1502823403499-6ccfcf4fb453?w=800&q=80",
				caption: "Natural bridal",
			},
		],
	},
	{
		id: "b10",
		title: "Cocktail Evening",
		location: "Mumbai",
		category: "party",
		description: "Chic cocktail evening look with smoky eyes and matte lips.",
		date: "2025-10-20",
		clientName: "Aisha N.",
		images: [
			{
				id: "b10-1",
				imageUrl:
					"https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=800&q=80",
				caption: "Cocktail glam",
			},
			{
				id: "b10-2",
				imageUrl:
					"https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=800&q=80",
				caption: "Evening elegance",
			},
		],
	},
	{
		id: "b11",
		title: "Mehndi Ceremony Special",
		location: "Lucknow",
		category: "festival",
		description:
			"Complementing mehndi ceremony with fresh floral-inspired makeup.",
		date: "2025-11-08",
		clientName: "Sara A.",
		images: [
			{
				id: "b11-1",
				imageUrl:
					"https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&q=80",
				caption: "Mehndi special",
			},
		],
	},
	{
		id: "b12",
		title: "Reception Royalty",
		location: "Chandigarh",
		category: "bridal",
		description:
			"Regal reception makeup with dramatic eyes and radiant highlighter.",
		date: "2025-12-25",
		clientName: "Mansi G.",
		images: [
			{
				id: "b12-1",
				imageUrl:
					"https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=800&q=80",
				caption: "Reception look",
			},
			{
				id: "b12-2",
				imageUrl:
					"https://images.unsplash.com/photo-1742891602044-7fdc0a9839ad?w=800&q=80",
				caption: "Royal finish",
			},
			{
				id: "b12-3",
				imageUrl:
					"https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=800&q=80",
				caption: "Detail shot",
			},
		],
	},
	{
		id: "b20",
		title: "Natural Bridal Beauty",
		location: "Ahmedabad",
		category: "festival",
		description: "Fresh natural bridal beauty with minimal, enhancing makeup.",
		date: "2025-12-14",
		clientName: "Pooja D.",
		images: [
			{
				id: "b9-1",
				imageUrl:
					"https://images.unsplash.com/photo-1502823403499-6ccfcf4fb453?w=800&q=80",
				caption: "Natural bridal",
			},
		],
	},
];

// ── Flat gallery items for backwards compat ────────────────────────────────
export const galleryItems: GalleryItem[] = bookings.map((b) => ({
	id: b.id,
	imageUrl: b.images[0]?.imageUrl ?? "",
	title: b.title,
	location: b.location,
	category: b.category,
	description: b.description,
	date: b.date,
}));

// ── Services ────────────────────────────────────────────────────────────────
export const services = [
	{
		id: "bridal",
		title: "Bridal Makeup",
		description:
			"Complete bridal makeup packages for your special day. From engagement to wedding and reception, we create timeless looks that enhance your natural beauty.",
		imageUrl:
			"https://images.unsplash.com/photo-1742891602044-7fdc0a9839ad?w=600&q=80",
		icon: "💍",
	},
	{
		id: "party",
		title: "Party & Occasion",
		description:
			"Stunning looks for sangeet, cocktail parties, anniversaries, and any celebration. Glamorous styles that make you shine.",
		imageUrl:
			"https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=600&q=80",
		icon: "✨",
	},
	{
		id: "editorial",
		title: "Editorial & Fashion",
		description:
			"High-fashion editorial, photoshoots, and custom artistic looks. We bring creative visions to life.",
		imageUrl:
			"https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=600&q=80",
		icon: "📸",
	},
];
