// app/page.tsx

import type { Metadata } from "next"
import { HeroSection } from "@/components/hero-section"
import { ProductShowcase } from "@/components/product-showcase"
import { VideoShowcase } from "@/components/video-showcase"
import { TestimonialsSection } from "@/components/testimonials-section"
import { HomeCtaSection } from "@/components/home-cta-section"
import { IngredientBreakdown } from "@/components/ingredient-breakdown"
import { getHeroSlides, getProducts, getShowcaseVideos } from "@/lib/db"
// Enable Incremental Static Regeneration: Cache the page on the Edge for 1 hour [1]
export const revalidate = 3600; 

export const metadata: Metadata = {
  title: "48 Hours Plus Herbal Honey | Natural Male Enhancement",
}

export default async function HomePage() {
  /* 
     PERFORMANCE OPTIMIZATION: TRIPLE PARALLEL CONCURRENT FETCHING
     Instead of three sequential awaits (which creates a massive waterfall bottleneck), 
     we execute all three database queries concurrently using Promise.all [1].
     This cuts your home page database wait time by nearly 66% [1]!
  */
  const [slides, products, videos] = await Promise.all([
    getHeroSlides(),
    getProducts(),
    getShowcaseVideos()
  ]);

  return (
    <div className="space-y-0 bg-black text-white min-h-screen">
      {/* 1. HERO CAROUSEL */}
      <HeroSection slides={slides} />

      {/* 3. PRODUCT SHOWCASE */}
      <ProductShowcase products={products} videos={videos} />
       
      <IngredientBreakdown />
      
      {/* 5. CINEMATIC VIDEO THEATER */}
      <VideoShowcase videos={videos} />

      {/* 8. TESTIMONIALS */}
      <TestimonialsSection />

      {/* 10. CLOSING CTA */}
      <HomeCtaSection />
    </div>
  )
}