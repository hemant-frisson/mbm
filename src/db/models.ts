import { Sequelize, DataTypes, Model } from "sequelize";
import pg from "pg";

import { config } from "dotenv";
config({ path: ".env.local" });

const DATABASE_URL = process.env.DATABASE_URL!;

if (!DATABASE_URL) {
  throw new Error("DATABASE_URL must be set in .env.local");
}

const sequelize = new Sequelize(DATABASE_URL, {
  dialect: "postgres",
  dialectModule: pg,
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false, // For Neon DB
    },
  },
  logging: false,
});

// ── Admin User ────────────────────────────────────────────────────────────
class AdminUser extends Model {
  public id!: string;
  public email!: string;
  public passwordHash!: string;
  public name!: string;
}

AdminUser.init(
  {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    email: { type: DataTypes.STRING, allowNull: false, unique: true },
    passwordHash: { type: DataTypes.TEXT, allowNull: false },
    name: { type: DataTypes.STRING, allowNull: false },
  },
  { sequelize, modelName: "AdminUser", tableName: "admin_users", underscored: true }
);

// ── Booking ───────────────────────────────────────────────────────────────
class Booking extends Model {
  public id!: string;
  public title!: string;
  public location!: string;
  public category!: string;
  public description!: string | null;
  public date!: Date;
  public clientName!: string | null;
}

Booking.init(
  {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    title: { type: DataTypes.STRING, allowNull: false },
    location: { type: DataTypes.STRING, allowNull: false },
    category: { type: DataTypes.STRING(50), allowNull: false },
    description: { type: DataTypes.TEXT },
    date: { type: DataTypes.DATEONLY, allowNull: false },
    clientName: { type: DataTypes.STRING },
  },
  { sequelize, modelName: "Booking", tableName: "bookings", underscored: true }
);

// ── Booking Image ─────────────────────────────────────────────────────────
class BookingImage extends Model {
  public id!: string;
  public bookingId!: string;
  public imageUrl!: string;
  public caption!: string | null;
  public sortOrder!: number;
}

BookingImage.init(
  {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    bookingId: { type: DataTypes.UUID, allowNull: false },
    imageUrl: { type: DataTypes.TEXT, allowNull: false },
    caption: { type: DataTypes.STRING(500) },
    sortOrder: { type: DataTypes.INTEGER, defaultValue: 0 },
  },
  { sequelize, modelName: "BookingImage", tableName: "booking_images", underscored: true }
);

// Associations
Booking.hasMany(BookingImage, { as: "images", foreignKey: "booking_id" });
BookingImage.belongsTo(Booking, { foreignKey: "booking_id" });

// ── Service ───────────────────────────────────────────────────────────────
class Service extends Model {
  public id!: string;
  public title!: string;
  public description!: string;
  public imageUrl!: string;
  public icon!: string;
  public sortOrder!: number;
}

Service.init(
  {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    title: { type: DataTypes.STRING, allowNull: false },
    description: { type: DataTypes.TEXT, allowNull: false },
    imageUrl: { type: DataTypes.TEXT, allowNull: false },
    icon: { type: DataTypes.STRING(10), defaultValue: "✨" },
    sortOrder: { type: DataTypes.INTEGER, defaultValue: 0 },
  },
  { sequelize, modelName: "Service", tableName: "services", underscored: true }
);

// ── Hero Content ──────────────────────────────────────────────────────────
class HeroContent extends Model {
  public id!: string;
  public badgeText!: string;
  public titlePart1!: string;
  public titlePart2!: string;
  public subtitle!: string;
  public primaryCtaText!: string;
  public primaryCtaLink!: string;
  public secondaryCtaText!: string;
  public secondaryCtaLink!: string;
  public backgroundImage!: string;
  public stat1Number!: string;
  public stat1Label!: string;
  public stat2Number!: string;
  public stat2Label!: string;
  public stat3Number!: string;
  public stat3Label!: string;
}

HeroContent.init(
  {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    badgeText: { type: DataTypes.STRING, defaultValue: "Professional Makeup Artist" },
    titlePart1: { type: DataTypes.STRING, defaultValue: "Meena" },
    titlePart2: { type: DataTypes.STRING, defaultValue: "Bisht" },
    subtitle: { type: DataTypes.TEXT, allowNull: false },
    primaryCtaText: { type: DataTypes.STRING, defaultValue: "Explore Portfolio" },
    primaryCtaLink: { type: DataTypes.STRING, defaultValue: "/portfolio" },
    secondaryCtaText: { type: DataTypes.STRING, defaultValue: "Book a Session" },
    secondaryCtaLink: { type: DataTypes.STRING, defaultValue: "#contact" },
    backgroundImage: { type: DataTypes.TEXT, allowNull: false },
    stat1Number: { type: DataTypes.STRING, defaultValue: "500+" },
    stat1Label: { type: DataTypes.STRING, defaultValue: "Happy Brides" },
    stat2Number: { type: DataTypes.STRING, defaultValue: "8+" },
    stat2Label: { type: DataTypes.STRING, defaultValue: "Years Experience" },
    stat3Number: { type: DataTypes.STRING, defaultValue: "50+" },
    stat3Label: { type: DataTypes.STRING, defaultValue: "Cities Covered" },
  },
  { sequelize, modelName: "HeroContent", tableName: "hero_content", underscored: true }
);

export { sequelize, AdminUser, Booking, BookingImage, Service, HeroContent };
