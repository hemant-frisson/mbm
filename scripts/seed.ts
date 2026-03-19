import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import bcrypt from "bcryptjs";
import * as schema from "../src/db/schema";
import { config } from "dotenv";

config({ path: ".env.local" });

const sql = neon(process.env.DATABASE_URL!);
const db = drizzle(sql, { schema });

async function seed() {
  console.log("🌱 Seeding database using Drizzle...\n");

  try {
    // ── Create tables (raw SQL) ────────────────────────────────────────────
    console.log("Creating tables...");
    await sql`
      CREATE TABLE IF NOT EXISTS admin_users (
        id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
        email VARCHAR(255) NOT NULL UNIQUE,
        password_hash TEXT NOT NULL,
        name VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT NOW() NOT NULL
      )
    `;
    await sql`
      CREATE TABLE IF NOT EXISTS bookings (
        id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        location VARCHAR(255) NOT NULL,
        category VARCHAR(50) NOT NULL,
        description TEXT,
        date DATE NOT NULL,
        client_name VARCHAR(255),
        created_at TIMESTAMP DEFAULT NOW() NOT NULL,
        updated_at TIMESTAMP DEFAULT NOW() NOT NULL
      )
    `;
    await sql`
      CREATE TABLE IF NOT EXISTS booking_images (
        id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
        booking_id UUID NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
        image_url TEXT NOT NULL,
        caption VARCHAR(500),
        sort_order INTEGER NOT NULL DEFAULT 0
      )
    `;
    await sql`
      CREATE TABLE IF NOT EXISTS services (
        id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT NOT NULL,
        image_url TEXT NOT NULL,
        icon VARCHAR(10) NOT NULL DEFAULT '✨',
        sort_order INTEGER NOT NULL DEFAULT 0,
        created_at TIMESTAMP DEFAULT NOW() NOT NULL
      )
    `;
    await sql`
      CREATE TABLE IF NOT EXISTS hero_content (
        id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
        badge_text VARCHAR(255) NOT NULL DEFAULT 'Professional Makeup Artist',
        title_part1 VARCHAR(255) NOT NULL DEFAULT 'Meena',
        title_part2 VARCHAR(255) NOT NULL DEFAULT 'Bisht',
        subtitle TEXT NOT NULL DEFAULT 'Crafting timeless beauty for brides, celebrations, and every moment that matters. Where artistry meets elegance.',
        primary_cta_text VARCHAR(255) NOT NULL DEFAULT 'Explore Portfolio',
        primary_cta_link VARCHAR(255) NOT NULL DEFAULT '/portfolio',
        secondary_cta_text VARCHAR(255) NOT NULL DEFAULT 'Book a Session',
        secondary_cta_link VARCHAR(255) NOT NULL DEFAULT '#contact',
        background_image TEXT NOT NULL DEFAULT 'https://images.unsplash.com/photo-1742891602044-7fdc0a9839ad?w=1920&q=80',
        stat1_number VARCHAR(50) NOT NULL DEFAULT '500+',
        stat1_label VARCHAR(100) NOT NULL DEFAULT 'Happy Brides',
        stat2_number VARCHAR(50) NOT NULL DEFAULT '8+',
        stat2_label VARCHAR(100) NOT NULL DEFAULT 'Years Experience',
        stat3_number VARCHAR(50) NOT NULL DEFAULT '50+',
        stat3_label VARCHAR(100) NOT NULL DEFAULT 'Cities Covered',
        updated_at TIMESTAMP DEFAULT NOW() NOT NULL
      )
    `;
    // We add explicitly missing columns if they didn't exist before, using safe add
    try { await sql`ALTER TABLE hero_content ADD COLUMN stat1_number VARCHAR(50) NOT NULL DEFAULT '500+'`; } catch (e) {}
    try { await sql`ALTER TABLE hero_content ADD COLUMN stat1_label VARCHAR(100) NOT NULL DEFAULT 'Happy Brides'`; } catch (e) {}
    try { await sql`ALTER TABLE hero_content ADD COLUMN stat2_number VARCHAR(50) NOT NULL DEFAULT '8+'`; } catch (e) {}
    try { await sql`ALTER TABLE hero_content ADD COLUMN stat2_label VARCHAR(100) NOT NULL DEFAULT 'Years Experience'`; } catch (e) {}
    try { await sql`ALTER TABLE hero_content ADD COLUMN stat3_number VARCHAR(50) NOT NULL DEFAULT '50+'`; } catch (e) {}
    try { await sql`ALTER TABLE hero_content ADD COLUMN stat3_label VARCHAR(100) NOT NULL DEFAULT 'Cities Covered'`; } catch (e) {}
    
    console.log("✅ Tables created or verified\n");

    // ── Seed admin user ────────────────────────────────────────────────────
    console.log("Checking admin user...");
    const existingAdmin = await db.select().from(schema.adminUsers).limit(1);

    if (existingAdmin.length === 0) {
      const passwordHash = await bcrypt.hash("admin123", 12);
      await db.insert(schema.adminUsers).values({
        email: "admin@mbm.com",
        passwordHash,
        name: "Meena Bisht",
      });
      console.log("✅ Admin user created (admin@mbm.com / admin123)");
    } else {
      console.log("✅ Admin user already exists");
    }

    // ── Seed hero content ──────────────────────────────────────────────────
    console.log("\nChecking hero content...");
    const existingHero = await db.select().from(schema.heroContentTable).limit(1);
    if (existingHero.length === 0) {
      await db.insert(schema.heroContentTable).values({
        badgeText: "Professional Makeup Artist",
        titlePart1: "Meena",
        titlePart2: "Bisht",
        subtitle: "Crafting timeless beauty for brides, celebrations, and every moment that matters. Where artistry meets elegance.",
        primaryCtaText: "Explore Portfolio",
        primaryCtaLink: "/portfolio",
        secondaryCtaText: "Book a Session",
        secondaryCtaLink: "#contact",
        backgroundImage: "https://images.unsplash.com/photo-1742891602044-7fdc0a9839ad?w=1920&q=80",
        stat1Number: "500+",
        stat1Label: "Happy Brides",
        stat2Number: "8+",
        stat2Label: "Years Experience",
        stat3Number: "50+",
        stat3Label: "Cities Covered",
      });
      console.log("✅ Hero content seeded");
    } else {
      console.log("✅ Hero content already exists");
    }

    // ── Seed services ──────────────────────────────────────────────────────
    console.log("\nChecking services...");
    const existingServicesCount = await db.select().from(schema.servicesTable).limit(1);
    if (existingServicesCount.length === 0) {
      const serviceData = [
        {
          title: "Bridal Makeup",
          description: "Complete bridal makeup packages for your special day. From engagement to wedding and reception, we create timeless looks that enhance your natural beauty.",
          imageUrl: "https://images.unsplash.com/photo-1742891602044-7fdc0a9839ad?w=600&q=80",
          icon: "💍",
          sortOrder: 0,
        },
        {
          title: "Party & Occasion",
          description: "Stunning looks for sangeet, cocktail parties, anniversaries, and any celebration. Glamorous styles that make you shine.",
          imageUrl: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=600&q=80",
          icon: "✨",
          sortOrder: 1,
        },
        {
          title: "Editorial & Fashion",
          description: "High-fashion editorial, photoshoots, and custom artistic looks. We bring creative visions to life.",
          imageUrl: "https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=600&q=80",
          icon: "📸",
          sortOrder: 2,
        },
      ];
      await db.insert(schema.servicesTable).values(serviceData);
      console.log("✅ Services seeded");
    } else {
      console.log("✅ Services already exist");
    }

    // ── Seed bookings ──────────────────────────────────────────────────────
    console.log("\nChecking bookings...");
    const existingBookingsCount = await db.select().from(schema.bookingsTable).limit(1);
    if (existingBookingsCount.length === 0) {
      const bookingsData = [
        {
          title: "Traditional Bridal Look",
          location: "Kolkata",
          category: "bridal",
          description: "Elegant bridal makeup with traditional jewelry and intricate detailing for the perfect wedding day.",
          date: "2025-01-15",
          clientName: "Priya S.",
          images: [
            { imageUrl: "https://images.unsplash.com/photo-1742891602044-7fdc0a9839ad?w=800&q=80", caption: "Bridal look - front view", sortOrder: 0 },
            { imageUrl: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=800&q=80", caption: "Detail - eye makeup", sortOrder: 1 },
            { imageUrl: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=800&q=80", caption: "Final reveal", sortOrder: 2 },
          ],
        },
        {
          title: "Classic Bride",
          location: "Mumbai",
          category: "bridal",
          description: "Timeless bridal elegance with soft smoky eyes and luminous skin.",
          date: "2025-02-22",
          clientName: "Anjali M.",
          images: [
            { imageUrl: "https://images.unsplash.com/photo-1519699047748-de8e457a634e?w=800&q=80", caption: "Before the ceremony", sortOrder: 0 },
            { imageUrl: "https://images.unsplash.com/photo-1502823403499-6ccfcf4fb453?w=800&q=80", caption: "Getting ready", sortOrder: 1 },
          ],
        },
      ];

      for (const b of bookingsData) {
        const { images, ...bookingFields } = b;
        const [booking] = await db.insert(schema.bookingsTable).values(bookingFields).returning();
        
        if (images && images.length > 0) {
          await db.insert(schema.bookingImages).values(
            images.map(img => ({ ...img, bookingId: booking.id }))
          );
        }
      }
      console.log("✅ Bookings seeded");
    } else {
      console.log("✅ Bookings already exist");
    }

    console.log("\n🎉 Seeding complete via Drizzle!");
    console.log("Admin credentials: admin@mbm.com / admin123");
    process.exit(0);
  } catch (err) {
    console.error("\n❌ Seeding failed:", err);
    process.exit(1);
  }
}

seed();
