import * as dotenv from "dotenv";
dotenv.config({ path: ".env.local" });
import { db } from "../src/db";
import { heroContentTable } from "../src/db/schema";

async function seedHero() {
  console.log("Seeding hero content...");
  try {
    // Check if hero content already exists
    const existing = await db.select().from(heroContentTable).limit(1);
    if (existing.length > 0) {
      console.log("Hero content already exists. Skipping.");
      return;
    }

    await db.insert(heroContentTable).values({
      badgeText: "Professional Makeup Artist",
      titlePart1: "Meena",
      titlePart2: "Bisht",
      subtitle: "Crafting timeless beauty for brides, celebrations, and every moment that matters. Where artistry meets elegance.",
      primaryCtaText: "Explore Portfolio",
      primaryCtaLink: "/portfolio",
      secondaryCtaText: "Book a Session",
      secondaryCtaLink: "#contact",
      backgroundImage: "https://images.unsplash.com/photo-1742891602044-7fdc0a9839ad?w=1920&q=80",
    });
    console.log("Hero content seeded successfully!");
  } catch (err) {
    console.error("Error seeding hero:", err);
  }
}

seedHero().then(() => process.exit());
