import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Services from "@/components/Services";
import PortfolioPreview from "@/components/PortfolioPreview";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import { getHeroContent, getServices, getBookings } from "@/lib/data";

// Revalidate every 60 seconds (ISR) or use 0 for full SSR
export const revalidate = 60;

export default async function Home() {
  // Parallel fetching for performance
  const [heroData, servicesData, allBookings] = await Promise.all([
    getHeroContent(),
    getServices(),
    getBookings(),
  ]);

  // Take first 8 for the preview
  const previewBookings = allBookings.slice(0, 8);

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <Header />
      <main>
        <Hero data={heroData} />
        <Services data={servicesData} />
        <PortfolioPreview data={previewBookings} />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}
