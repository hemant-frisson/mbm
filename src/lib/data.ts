import { HeroContent, Service, Booking, BookingImage } from "@/db/models";

export async function getHeroContent() {
  try {
    const hero = await HeroContent.findOne();
    if (!hero) return null;
    // Serialize to plain JS object for Next.js Server Components
    return JSON.parse(JSON.stringify(hero.get({ plain: true })));
  } catch (err) {
    console.error("Error fetching hero content:", err);
    return null;
  }
}

export async function getServices() {
  try {
    const services = await Service.findAll({
      order: [["sort_order", "ASC"]],
    });
    return JSON.parse(JSON.stringify(services.map(s => s.get({ plain: true }))));
  } catch (err) {
    console.error("Error fetching services:", err);
    return [];
  }
}

export async function getBookings() {
  try {
    const bookings = await Booking.findAll({
      include: [{ model: BookingImage, as: "images" }],
      order: [["date", "DESC"], [{ model: BookingImage, as: "images" }, "sort_order", "ASC"]],
    });
    return JSON.parse(JSON.stringify(bookings.map(b => b.get({ plain: true }))));
  } catch (err) {
    console.error("Error fetching bookings:", err);
    return [];
  }
}
