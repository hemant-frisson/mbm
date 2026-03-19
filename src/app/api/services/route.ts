import { NextRequest, NextResponse } from "next/server";
import { Service } from "@/db/models";
import { requireAdmin } from "@/lib/auth";

// GET — list all services (public)
export async function GET() {
  try {
    const allServices = await Service.findAll({
      order: [["sort_order", "ASC"]],
    });
    return NextResponse.json(allServices);
  } catch (err) {
    console.error("Error fetching services:", err);
    return NextResponse.json(
      { error: "Failed to fetch services" },
      { status: 500 }
    );
  }
}

// POST — create a service (admin only)
export async function POST(req: NextRequest) {
  try {
    await requireAdmin();
    const body = await req.json();
    const { title, description, imageUrl, icon, sortOrder } = body;

    if (!title || !description || !imageUrl) {
      return NextResponse.json(
        { error: "Title, description, and imageUrl are required" },
        { status: 400 }
      );
    }

    const service = await Service.create({
      title,
      description,
      imageUrl,
      icon: icon || "✨",
      sortOrder: sortOrder ?? 0,
    });

    return NextResponse.json(service, { status: 201 });
  } catch (err: unknown) {
    if (err instanceof Error && err.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("Error creating service:", err);
    return NextResponse.json(
      { error: "Failed to create service" },
      { status: 500 }
    );
  }
}

// PUT — update service (admin only)
export async function PUT(req: NextRequest) {
  try {
    await requireAdmin();
    const body = await req.json();
    const { id, ...updates } = body;

    if (!id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 });
    }

    const service = await Service.findByPk(id);

    if (!service) {
      return NextResponse.json({ error: "Service not found" }, { status: 404 });
    }

    const updated = await service.update(updates);

    return NextResponse.json(updated);
  } catch (err: unknown) {
    if (err instanceof Error && err.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("Error updating service:", err);
    return NextResponse.json(
      { error: "Failed to update service" },
      { status: 500 }
    );
  }
}

// DELETE — delete service (admin only)
export async function DELETE(req: NextRequest) {
  try {
    await requireAdmin();
    const { id } = await req.json();

    if (!id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 });
    }

    const service = await Service.findByPk(id);

    if (!service) {
      return NextResponse.json({ error: "Service not found" }, { status: 404 });
    }

    await service.destroy();

    return NextResponse.json({ success: true });
  } catch (err: unknown) {
    if (err instanceof Error && err.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("Error deleting service:", err);
    return NextResponse.json(
      { error: "Failed to delete service" },
      { status: 500 }
    );
  }
}
