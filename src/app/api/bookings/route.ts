import { NextRequest, NextResponse } from "next/server";
import { Booking, BookingImage, sequelize } from "@/db/models";
import { requireAdmin } from "@/lib/auth";

// GET — list all bookings with images
export async function GET() {
  try {
    const allBookings = await Booking.findAll({
      include: [{ model: BookingImage, as: "images" }],
      order: [
        ["date", "DESC"],
        [{ model: BookingImage, as: "images" }, "sort_order", "ASC"],
      ],
    });

    return NextResponse.json(allBookings);
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
  const transaction = await sequelize.transaction();
  try {
    await requireAdmin();
    const body = await req.json();

    const { title, location, category, description, date, clientName, images } = body;

    if (!title || !location || !category || !date) {
      await transaction.rollback();
      return NextResponse.json(
        { error: "Title, location, category, and date are required" },
        { status: 400 },
      );
    }

    const booking = await Booking.create(
      {
        title,
        location,
        category,
        description: description || null,
        date,
        clientName: clientName || null,
      },
      { transaction }
    );

    // Insert images if provided
    if (images && Array.isArray(images) && images.length > 0) {
      await BookingImage.bulkCreate(
        images.map((img: { imageUrl: string; caption?: string }, i: number) => ({
          bookingId: booking.id,
          imageUrl: img.imageUrl,
          caption: img.caption || null,
          sortOrder: i,
        })),
        { transaction }
      );
    }

    await transaction.commit();

    // Fetch the newly created booking with its images
    const createdBooking = await Booking.findByPk(booking.id, {
      include: [{ model: BookingImage, as: "images" }],
      order: [[{ model: BookingImage, as: "images" }, "sort_order", "ASC"]],
    });

    return NextResponse.json(createdBooking, { status: 201 });
  } catch (err: unknown) {
    if (transaction) await transaction.rollback();
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
