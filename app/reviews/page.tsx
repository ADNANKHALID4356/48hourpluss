// app/reviews/page.tsx

import { getVideoReviews, getTextReviews } from '@/lib/db';
import { Star, MessageCircle, Quote } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { VideoReview, TextReview } from '@/lib/types';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Customer Reviews & Testimonials',
  description: 'See why thousands of men worldwide trust our certified natural Turkish herbal formula.',
};

export default async function ReviewsPage() {
  // Fetch active testimonials dynamically from Supabase
  const videoReviews = await getVideoReviews();
  const textReviews = await getTextReviews();

  return (
    /* 
       FORCED OBSIDIAN-HONEY CANVAS:
       Applied your signature 3-stop luxury dark gradient directly to the main container.
       This guarantees the testimonials page matches the home page aesthetic on any browser.
    */
    <main className="min-h-screen bg-gradient-to-b from-[#000000] via-[#080602] to-[#170f03] text-zinc-100 py-12 mt-24 px-6 sm:px-8 lg:px-12 transition-colors duration-300 ease-in-out">
      
      {/* Dynamic breadcrumb navigation */}
      <nav className="mb-8 max-w-7xl mx-auto">
        <Link href="/products" className="text-sm font-semibold text-yellow-400 hover:text-yellow-300">
          &larr; Back to Catalog
        </Link>
      </nav>

      <div className="max-w-7xl mx-auto space-y-16">
        {/* Page Header */}
        <div className="text-center max-w-2xl mx-auto">
          <span className="text-xs text-yellow-500 font-semibold uppercase tracking-widest bg-yellow-500/10 border border-yellow-500/20 px-3.5 py-1.5 rounded-full select-none">
            Verified Testimonials
          </span>
          <h1 className="text-4xl sm:text-5xl font-light tracking-tight text-white mt-4 mb-4 font-serif">
            What Our <span className="bg-gradient-to-r from-amber-200 via-yellow-400 to-amber-500 bg-clip-text text-transparent font-medium">Customers</span> Say
          </h1>
          <p className="text-zinc-400 font-light text-base leading-relaxed">
            See honest video reviews and verified feedback from customers who have experienced our formula.
          </p>
        </div>
      </div>
        {/* ====================================================
           SECTION 1: CUSTOMER VIDEO REVIEWS GALLERY
           ==================================================== */}
        {videoReviews.length > 0 && (
          <section className="space-y-8">
            <h2 className="text-xl sm:text-2xl font-bold text-yellow-400 font-serif border-b border-zinc-900 pb-3 flex items-center gap-2">
              <span>🎥</span> Customer Video Testimonials
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {videoReviews.map((video: VideoReview) => (
                <div 
                  key={video.id} 
                  className="rounded-3xl border border-zinc-900 bg-zinc-950/40 p-4 flex flex-col justify-between hover:border-yellow-500/20 transition-all duration-300"
                >
                  <div className="relative aspect-video w-full rounded-2xl overflow-hidden bg-black border border-zinc-900/60 mb-4">
                    <video
                      src={video.videoUrl}
                      className="w-full h-full object-cover"
                      controls
                      playsInline
                    />
                  </div>
                  <div className="text-left px-1">
                    <h4 className="text-sm font-bold text-white font-serif flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                      {video.author}
                    </h4>
                    <p className="text-xs text-zinc-500 mt-0.5">Verified Customer • Active Video</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ====================================================
           SECTION 2: CUSTOMER TEXT REVIEWS GRID
           ==================================================== */}
        {textReviews.length > 0 && (
          <section className="space-y-8">
            <h2 className="text-xl sm:text-2xl font-bold text-yellow-400 font-serif border-b border-zinc-900 pb-3 flex items-center gap-2">
              <span>💬</span> Verified Purchase Reviews
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {textReviews.map((t: TextReview) => (
              <div 
                key={t.id} 
                className="rounded-3xl border border-zinc-900 bg-zinc-950/40 p-6 flex flex-col justify-between hover:border-yellow-500/20 transition-all duration-300 relative"
              >
                <Quote className="absolute top-4 right-4 w-12 h-12 text-zinc-900/40 pointer-events-none" />

                <div className="space-y-3">
                  <div className="flex items-center text-amber-400">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${
                          i < t.rating ? 'fill-amber-400 text-amber-400' : 'text-zinc-800'
                        }`}
                      />
                    ))}
                  </div>

                  <p className="text-sm italic text-zinc-300 font-light leading-relaxed">
                    &ldquo;{t.comment}&rdquo;
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-zinc-900/60 flex items-center justify-between text-xs text-zinc-500">
                  <span className="font-bold text-white">{t.author}</span>
                  <span>{t.date}</span>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Global Conversions CTA */}
      <div className="text-center border-t border-zinc-900 pt-16">
        <h3 className="text-xl font-bold text-white mb-2 font-serif">Have questions before buying?</h3>
        <p className="text-sm text-zinc-400 mb-8 font-light">Join thousands of satisfied customers. Inquire directly on chat.</p>
        <Link href="https://wa.me/923194405935?text=Hi, I am looking at customer reviews and have some questions." passHref>
          <Button
            size="lg"
            className="bg-green-600 hover:bg-green-700 text-white text-md px-10 py-6 h-auto font-semibold transition-all duration-300 hover:scale-105 shadow-lg shadow-green-600/10 flex items-center justify-center gap-2 mx-auto"
          >
            <MessageCircle className="w-5 h-5" />
            Inquire via WhatsApp
          </Button>
        </Link>
      </div>
    </main>
  );
}