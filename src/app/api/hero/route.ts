import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { heroContentTable } from "@/db/schema";
import { requireAdmin } from "@/lib/auth";
import { eq } from "drizzle-orm";

// GET — fetch hero content
export async function GET() {
  try {
    const [hero] = await db.select().from(heroContentTable).limit(1);
    return NextResponse.json(hero || {});
  } catch (err) {
    console.error("Error fetching hero:", err);
    return NextResponse.json(
      { error: "Failed to fetch hero content" },
      { status: 500 },
    );
  }
}

// PUT — update hero content (admin only)
export async function PUT(req: NextRequest) {
  try {
    await requireAdmin();
    const body = await req.json();

    const {
      badgeText,
      titlePart1,
      titlePart2,
      subtitle,
      primaryCtaText,
      primaryCtaLink,
      secondaryCtaText,
      secondaryCtaLink,
      backgroundImage,
      stat1Number,
      stat1Label,
      stat2Number,
      stat2Label,
      stat3Number,
      stat3Label,
    } = body;

    // Check if hero exists
    const [existing] = await db.select().from(heroContentTable).limit(1);

    if (existing) {
      const [updated] = await db
        .update(heroContentTable)
        .set({
          badgeText,
          titlePart1,
          titlePart2,
          subtitle,
          primaryCtaText,
          primaryCtaLink,
          secondaryCtaText,
          secondaryCtaLink,
          backgroundImage,
          stat1Number,
          stat1Label,
          stat2Number,
          stat2Label,
          stat3Number,
          stat3Label,
          updatedAt: new Date(),
        })
        .where(eq(heroContentTable.id, existing.id))
        .returning();
      return NextResponse.json(updated);
    } else {
      const [inserted] = await db
        .insert(heroContentTable)
        .values({
          badgeText,
          titlePart1,
          titlePart2,
          subtitle,
          primaryCtaText,
          primaryCtaLink,
          secondaryCtaText,
          secondaryCtaLink,
          backgroundImage,
          stat1Number,
          stat1Label,
          stat2Number,
          stat2Label,
          stat3Number,
          stat3Label,
        })
        .returning();
      return NextResponse.json(inserted);
    }
  } catch (err: any) {
    if (err.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("Error updating hero:", err);
    return NextResponse.json(
      { error: "Failed to update hero content" },
      { status: 500 },
    );
  }
}
