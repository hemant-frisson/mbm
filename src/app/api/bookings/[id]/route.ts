import { NextRequest, NextResponse } from "next/server";
import { Booking, BookingImage, sequelize } from "@/db/models";
import { requireAdmin } from "@/lib/auth";

// GET — single booking with images
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    
    const booking = await Booking.findByPk(id, {
      include: [{ model: BookingImage, as: "images" }],
      order: [[{ model: BookingImage, as: "images" }, "sort_order", "ASC"]],
    });

    if (!booking) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }

    return NextResponse.json(booking);
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
  const transaction = await sequelize.transaction();
  try {
    await requireAdmin();
    const { id } = await params;
    const body = await req.json();

    const { title, location, category, description, date, clientName, images } = body;

    const booking = await Booking.findByPk(id);

    if (!booking) {
      await transaction.rollback();
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }

    await booking.update(
      {
        ...(title && { title }),
        ...(location && { location }),
        ...(category && { category }),
        description: description ?? null,
        ...(date && { date }),
        clientName: clientName ?? null,
      },
      { transaction }
    );

    // If images provided, replace all images
    if (images && Array.isArray(images)) {
      await BookingImage.destroy({
        where: { bookingId: id },
        transaction,
      });

      if (images.length > 0) {
        await BookingImage.bulkCreate(
          images.map((img: { imageUrl: string; caption?: string }, i: number) => ({
            bookingId: id,
            imageUrl: img.imageUrl,
            caption: img.caption || null,
            sortOrder: i,
          })),
          { transaction }
        );
      }
    }

    await transaction.commit();

    const updatedBooking = await Booking.findByPk(id, {
      include: [{ model: BookingImage, as: "images" }],
      order: [[{ model: BookingImage, as: "images" }, "sort_order", "ASC"]],
    });

    return NextResponse.json(updatedBooking);
  } catch (err: unknown) {
    if (transaction) await transaction.rollback();
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

// DELETE — delete a booking (admin only)
export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    await requireAdmin();
    const { id } = await params;

    const booking = await Booking.findByPk(id);

    if (!booking) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }

    // This will cascade delete images if the DB constraint is ON DELETE CASCADE
    // Alternatively Sequelize destroys all related if configured, or we can just destroy booking.
    await booking.destroy();

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
