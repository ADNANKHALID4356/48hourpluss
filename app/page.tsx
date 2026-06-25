// app/page.tsx

import type { Metadata } from "next"
import { HeroSection } from "@/components/hero-section"
import { ProductShowcase } from "@/components/product-showcase"
import { VideoShowcase } from "@/components/video-showcase"
import { TestimonialsSection } from "@/components/testimonials-section"
import { HomeCtaSection } from "@/components/home-cta-section"
import { getHeroSlides, getProducts } from "@/lib/db" // <-- Import database utilities!

// Force Next.js to run this server component on every request (disables build cache)
export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: "48 Hours Plus Herbal Honey | Natural Male Enhancement",
}

// Mark the function as async to support database queries
export default async function HomePage() {
  // Fetch dynamic content from the SQLite database at runtime
  const slides = await getHeroSlides();
  const products = await getProducts();

  // DIAGNOSTIC LOG: This will now print on every browser page refresh
  console.log("\n=== HOMEPAGE DATABASE DIAGNOSTIC ===");
  console.log("Seeded Slides returned:", JSON.stringify(slides, null, 2));
  console.log("Seeded Products returned:", JSON.stringify(products, null, 2));
  console.log("====================================\n");

  return (
    <div>
      {/* Pass the dynamic database arrays as props to the components */}
      <HeroSection slides={slides} />
      <ProductShowcase products={products} />
      <VideoShowcase />
      <TestimonialsSection />
      <HomeCtaSection />
    </div>
  )
}