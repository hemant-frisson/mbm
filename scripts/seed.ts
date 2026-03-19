import { AdminUser, Booking, BookingImage, Service, HeroContent, sequelize } from "../src/db/models";
import bcrypt from "bcryptjs";
import { config } from "dotenv";

config({ path: ".env.local" });

async function seed() {
  console.log("🌱 Seeding database with Sequelize...\n");

  try {
    console.log("Connecting to database and syncing tables...");
    await sequelize.authenticate();
    console.log("✅ Authenticated");

    // Sync all models (create tables if they don't exist)
    // force: false ensures we don't drop tables if they exist
    await sequelize.sync({ force: false });
    console.log("✅ Tables synchronized\n");

    // ── Seed admin user ────────────────────────────────────────────────────
    console.log("Checking admin user...");
    const adminEmail = "admin@mbm.com";
    const existingAdmin = await AdminUser.findOne({ where: { email: adminEmail } });

    if (!existingAdmin) {
      const passwordHash = await bcrypt.hash("admin123", 12);
      await AdminUser.create({
        email: adminEmail,
        passwordHash,
        name: "Meena Bisht",
      });
      console.log("✅ Admin user created (admin@mbm.com / admin123)");
    } else {
      console.log("✅ Admin user already exists");
    }

    // ── Seed hero content ──────────────────────────────────────────────────
    console.log("\nChecking hero content...");
    const hero = await HeroContent.findOne();
    if (!hero) {
      await HeroContent.create({
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
    const existingServicesCount = await Service.count();
    if (existingServicesCount === 0) {
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
      await Service.bulkCreate(serviceData);
      console.log("✅ Services seeded");
    } else {
      console.log("✅ Services already exist");
    }

    // ── Seed bookings ──────────────────────────────────────────────────────
    console.log("\nChecking bookings...");
    const existingBookingsCount = await Booking.count();
    if (existingBookingsCount === 0) {
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
        const booking = await Booking.create(bookingFields);
        if (images && images.length > 0) {
          await BookingImage.bulkCreate(
            images.map(img => ({ ...img, bookingId: booking.id }))
          );
        }
      }
      console.log("✅ Bookings seeded");
    } else {
      console.log("✅ Bookings already exist");
    }

    console.log("\n🎉 Seeding complete via Sequelize!");
    console.log("Admin credentials: admin@mbm.com / admin123");
    process.exit(0);
  } catch (err) {
    console.error("\n❌ Seeding failed:", err);
    process.exit(1);
  }
}

seed();
