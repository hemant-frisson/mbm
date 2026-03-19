import { NextRequest, NextResponse } from "next/server";
import { HeroContent } from "@/db/models";
import { requireAdmin } from "@/lib/auth";

// GET — fetch hero content
export async function GET() {
  try {
    const hero = await HeroContent.findOne();
    return NextResponse.json(hero || {});
  } catch (err) {
    console.error("Error fetching hero:", err);
    return NextResponse.json({ error: "Failed to fetch hero content" }, { status: 500 });
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

    const hero = await HeroContent.findOne();

    const data = {
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
    };

    if (hero) {
      await hero.update(data);
      return NextResponse.json(hero);
    } else {
      const inserted = await HeroContent.create(data);
      return NextResponse.json(inserted);
    }
  } catch (err: any) {
    if (err.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("Error updating hero:", err);
    return NextResponse.json({ error: "Failed to update hero content" }, { status: 500 });
  }
}
