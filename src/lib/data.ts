import { db } from "@/db";
import {
	bookingsTable,
	bookingImages,
	servicesTable,
	heroContentTable,
} from "@/db/schema";
import { desc, eq } from "drizzle-orm";

export async function getHeroContent() {
	try {
		const [hero] = await db.select().from(heroContentTable).limit(1);
		return hero || null;
	} catch (err) {
		console.error("Error fetching hero content:", err);
		return null;
	}
}

export async function getServices() {
	try {
		return await db
			.select()
			.from(servicesTable)
			.orderBy(servicesTable.sortOrder);
	} catch (err) {
		console.error("Error fetching services:", err);
		return [];
	}
}

export async function getBookings() {
	try {
		const allBookings = await db
			.select()
			.from(bookingsTable)
			.orderBy(desc(bookingsTable.date));

		const allImages = await db
			.select()
			.from(bookingImages)
			.orderBy(bookingImages.sortOrder);

		return allBookings.map((b) => ({
			...b,
			images: allImages.filter((img) => img.bookingId === b.id),
		}));
	} catch (err) {
		console.error("Error fetching bookings:", err);
		return [];
	}
}
