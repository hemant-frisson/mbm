import PortfolioTimeline from "@/components/PortfolioTimeline";
import { getBookings } from "@/lib/data";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Portfolio | MBM — Meena Bisht Makeup Timeline",
  description:
    "Explore Meena Bisht's makeup artistry portfolio through an interactive 3D timeline. Browse by month, view bookings, and see stunning transformations.",
};

// SSR - revalidate every 60s
export const revalidate = 60;

export default async function PortfolioPage() {
  const bookings = await getBookings();

  return <PortfolioTimeline bookings={bookings} />;
}
