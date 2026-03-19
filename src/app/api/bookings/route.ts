import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { bookingsTable, bookingImages } from "@/db/schema";
import { requireAdmin } from "@/lib/auth";
import { desc, eq } from "drizzle-orm";

// GET — list all bookings with images
export async function GET() {
	try {
		const allBookings = await db
			.select()
			.from(bookingsTable)
			.orderBy(desc(bookingsTable.date));

		const allImages = await db
			.select()
			.from(bookingImages)
			.orderBy(bookingImages.sortOrder);

		const result = allBookings.map((b) => ({
			...b,
			images: allImages.filter((img) => img.bookingId === b.id),
		}));

		return NextResponse.json(result);
	} catch (err) {
		console.error("Error fetching bookings:", err);
		return NextResponse.json(
			{ error: "Failed to fetch bookings" },
			{ status: 500 },
		);
	}
}

// POST — create a new booking (admin only)
export async function POST(req: NextRequest) {
	try {
		await requireAdmin();
		const body = await req.json();

		const { title, location, category, description, date, clientName, images } =
			body;

		if (!title || !location || !category || !date) {
			return NextResponse.json(
				{ error: "Title, location, category, and date are required" },
				{ status: 400 },
			);
		}

		const [booking] = await db
			.insert(bookingsTable)
			.values({
				title,
				location,
				category,
				description: description || null,
				date,
				clientName: clientName || null,
			})
			.returning();

		// Insert images if provided
		if (images && Array.isArray(images) && images.length > 0) {
			await db.insert(bookingImages).values(
				images.map(
					(img: { imageUrl: string; caption?: string }, i: number) => ({
						bookingId: booking.id,
						imageUrl: img.imageUrl,
						caption: img.caption || null,
						sortOrder: i,
					}),
				),
			);
		}

		// Return the full booking with images
		const insertedImages = await db
			.select()
			.from(bookingImages)
			.where(eq(bookingImages.bookingId, booking.id))
			.orderBy(bookingImages.sortOrder);

		return NextResponse.json(
			{ ...booking, images: insertedImages },
			{ status: 201 },
		);
	} catch (err: unknown) {
		if (err instanceof Error && err.message === "Unauthorized") {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}
		console.error("Error creating booking:", err);
		return NextResponse.json(
			{ error: "Failed to create booking" },
			{ status: 500 },
		);
	}
}
