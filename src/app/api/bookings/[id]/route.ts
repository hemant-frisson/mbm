import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { bookingsTable, bookingImages } from "@/db/schema";
import { requireAdmin } from "@/lib/auth";
import { eq } from "drizzle-orm";

// GET — single booking with images
export async function GET(
	_req: NextRequest,
	{ params }: { params: Promise<{ id: string }> },
) {
	try {
		const { id } = await params;
		const [booking] = await db
			.select()
			.from(bookingsTable)
			.where(eq(bookingsTable.id, id))
			.limit(1);

		if (!booking) {
			return NextResponse.json({ error: "Booking not found" }, { status: 404 });
		}

		const images = await db
			.select()
			.from(bookingImages)
			.where(eq(bookingImages.bookingId, id))
			.orderBy(bookingImages.sortOrder);

		return NextResponse.json({ ...booking, images });
	} catch (err) {
		console.error("Error fetching booking:", err);
		return NextResponse.json(
			{ error: "Failed to fetch booking" },
			{ status: 500 },
		);
	}
}

// PUT — update a booking (admin only)
export async function PUT(
	req: NextRequest,
	{ params }: { params: Promise<{ id: string }> },
) {
	try {
		await requireAdmin();
		const { id } = await params;
		const body = await req.json();

		const { title, location, category, description, date, clientName, images } =
			body;

		const [updated] = await db
			.update(bookingsTable)
			.set({
				...(title && { title }),
				...(location && { location }),
				...(category && { category }),
				description: description ?? undefined,
				...(date && { date }),
				clientName: clientName ?? undefined,
				updatedAt: new Date(),
			})
			.where(eq(bookingsTable.id, id))
			.returning();

		if (!updated) {
			return NextResponse.json({ error: "Booking not found" }, { status: 404 });
		}

		// If images provided, replace all images
		if (images && Array.isArray(images)) {
			await db.delete(bookingImages).where(eq(bookingImages.bookingId, id));

			if (images.length > 0) {
				await db.insert(bookingImages).values(
					images.map(
						(img: { imageUrl: string; caption?: string }, i: number) => ({
							bookingId: id,
							imageUrl: img.imageUrl,
							caption: img.caption || null,
							sortOrder: i,
						}),
					),
				);
			}
		}

		const updatedImages = await db
			.select()
			.from(bookingImages)
			.where(eq(bookingImages.bookingId, id))
			.orderBy(bookingImages.sortOrder);

		return NextResponse.json({ ...updated, images: updatedImages });
	} catch (err: unknown) {
		if (err instanceof Error && err.message === "Unauthorized") {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}
		console.error("Error updating booking:", err);
		return NextResponse.json(
			{ error: "Failed to update booking" },
			{ status: 500 },
		);
	}
}

// DELETE — delete a booking (admin only) — cascades to images
export async function DELETE(
	_req: NextRequest,
	{ params }: { params: Promise<{ id: string }> },
) {
	try {
		await requireAdmin();
		const { id } = await params;

		const [deleted] = await db
			.delete(bookingsTable)
			.where(eq(bookingsTable.id, id))
			.returning();

		if (!deleted) {
			return NextResponse.json({ error: "Booking not found" }, { status: 404 });
		}

		return NextResponse.json({ success: true });
	} catch (err: unknown) {
		if (err instanceof Error && err.message === "Unauthorized") {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}
		console.error("Error deleting booking:", err);
		return NextResponse.json(
			{ error: "Failed to delete booking" },
			{ status: 500 },
		);
	}
}
