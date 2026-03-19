import {
  pgTable,
  uuid,
  varchar,
  text,
  timestamp,
  integer,
  date,
} from "drizzle-orm/pg-core";

// ── Admin Users ──────────────────────────────────────────────────────────
export const adminUsers = pgTable("admin_users", {
  id: uuid("id").defaultRandom().primaryKey(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// ── Bookings ─────────────────────────────────────────────────────────────
export const bookingsTable = pgTable("bookings", {
  id: uuid("id").defaultRandom().primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  location: varchar("location", { length: 255 }).notNull(),
  category: varchar("category", { length: 50 }).notNull(), // bridal, party, engagement, etc.
  description: text("description"),
  date: date("date").notNull(),
  clientName: varchar("client_name", { length: 255 }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// ── Booking Images ───────────────────────────────────────────────────────
export const bookingImages = pgTable("booking_images", {
  id: uuid("id").defaultRandom().primaryKey(),
  bookingId: uuid("booking_id")
    .notNull()
    .references(() => bookingsTable.id, { onDelete: "cascade" }),
  imageUrl: text("image_url").notNull(),
  caption: varchar("caption", { length: 500 }),
  sortOrder: integer("sort_order").notNull().default(0),
});

// ── Services ─────────────────────────────────────────────────────────────
export const servicesTable = pgTable("services", {
  id: uuid("id").defaultRandom().primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description").notNull(),
  imageUrl: text("image_url").notNull(),
  icon: varchar("icon", { length: 10 }).notNull().default("✨"),
  sortOrder: integer("sort_order").notNull().default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// ── Hero Content ────────────────────────────────────────────────────────
export const heroContentTable = pgTable("hero_content", {
  id: uuid("id").defaultRandom().primaryKey(),
  badgeText: varchar("badge_text", { length: 255 }).notNull().default("Professional Makeup Artist"),
  titlePart1: varchar("title_part1", { length: 255 }).notNull().default("Meena"),
  titlePart2: varchar("title_part2", { length: 255 }).notNull().default("Bisht"),
  subtitle: text("subtitle").notNull().default("Crafting timeless beauty for brides, celebrations, and every moment that matters. Where artistry meets elegance."),
  primaryCtaText: varchar("primary_cta_text", { length: 255 }).notNull().default("Explore Portfolio"),
  primaryCtaLink: varchar("primary_cta_link", { length: 255 }).notNull().default("/portfolio"),
  secondaryCtaText: varchar("secondary_cta_text", { length: 255 }).notNull().default("Book a Session"),
  secondaryCtaLink: varchar("secondary_cta_link", { length: 255 }).notNull().default("#contact"),
  backgroundImage: text("background_image").notNull().default("https://images.unsplash.com/photo-1742891602044-7fdc0a9839ad?w=1920&q=80"),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});
