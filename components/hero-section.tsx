// components/hero-section.tsx
"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  MessageCircle, 
  Shield, 
  Clock, 
  Leaf, 
  ArrowRight, 
  ChevronLeft, 
  ChevronRight 
} from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { HeroSlide } from "@/lib/types" // <-- Import the database HeroSlide model!

interface HeroSectionProps {
  slides: HeroSlide[]
}

export function HeroSection({ slides }: HeroSectionProps) {
  // Compile slides array. If empty, fall back to your beautiful default static slide
  const activeSlides = slides && slides.length > 0 ? slides : [
    {
      id: "static",
      title: "48 Hours Plus Herbal Honey",
      subtitle: "Premium Turkish Herbal Formula with 9 Powerful Natural Ingredients. Honey-based delivery system for maximum absorption and 48-hour effectiveness.",
      imageUrl: "/images/product-main.png",
      linkUrl: null,
      order: 1,
      isActive: true
    }
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [fadeState, setFadeState] = useState<'fade-in' | 'fade-out'>('fade-in');
  const [isTransitioning, setIsTransitioning] = useState(false);

  const activeSlide = activeSlides[currentIndex];

  // Auto-play timer loop
  useEffect(() => {
    if (activeSlides.length <= 1) return;

    const interval = setInterval(() => {
      handleNext();
    }, 2000); // Rotates slides automatically every 2 seconds

    return () => clearInterval(interval);
  }, [currentIndex, activeSlides.length]);

  const handleNext = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setFadeState('fade-out');

    // Wait 500ms for the dissolve animation to complete before swapping slides
    setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % activeSlides.length);
      setFadeState('fade-in');
      setIsTransitioning(false);
    }, 500);
  };

  const handlePrev = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setFadeState('fade-out');

    setTimeout(() => {
      setCurrentIndex((prev) => (prev - 1 + activeSlides.length) % activeSlides.length);
      setFadeState('fade-in');
      setIsTransitioning(false);
    }, 500);
  };

  const handleDotClick = (index: number) => {
    if (isTransitioning || index === currentIndex) return;
    setIsTransitioning(true);
    setFadeState('fade-out');

    setTimeout(() => {
      setCurrentIndex(index);
      setFadeState('fade-in');
      setIsTransitioning(false);
    }, 500);
  };

  const openWhatsApp = () => {
    window.open(
      "https://wa.me/923194405935?text=Hi, I want to order 48 Hours Plus Herbal Honey from 48hoursplus",
      "_blank"
    )
  }

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-24 bg-black">
      {/* Fixed Honeycomb Background Layer (Does not fade, maintaining UI stability) */}
      <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-yellow-900/20">
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fillRule='evenodd'%3E%3Cg fill='%23FFD700' fillOpacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
      </div>

      {/* Manual Navigation Arrow Buttons (Only rendered if more than 1 slide exists) */}
      {activeSlides.length > 1 && (
        <>
          <button
            onClick={handlePrev}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-30 bg-black/40 hover:bg-yellow-400 hover:text-black text-white p-3 rounded-full border border-gray-800 transition-all hover:scale-110 active:scale-95"
            aria-label="Previous slide"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={handleNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-30 bg-black/40 hover:bg-yellow-400 hover:text-black text-white p-3 rounded-full border border-gray-800 transition-all hover:scale-110 active:scale-95"
            aria-label="Next slide"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </>
      )}

      {/* 
         DISSOLVE/DIFFUSION SLIDE CONTAINER:
         Handles opacity, translate-x offset, blur, and scale transitions symmetrically.
      */}
      <div className={`container mx-auto px-12 py-8 relative z-10 transition-all duration-500 ease-in-out ${
        fadeState === 'fade-in' 
          ? 'opacity-100 translate-x-0 blur-0 scale-100' 
          : 'opacity-0 -translate-x-4 blur-md scale-95'
      }`}>
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-8">
            <div className="space-y-4">
              <div className="flex flex-wrap gap-2">
                <Badge className="bg-yellow-500 text-black hover:bg-yellow-400">
                  <Leaf className="w-3 h-3 mr-1" />
                  100% Natural
                </Badge>
                <Badge className="bg-blue-600 text-white hover:bg-blue-700">
                  <Shield className="w-3 h-3 mr-1" />
                  Turkish Made
                </Badge>
                <Badge className="bg-green-600 text-white hover:bg-green-700">
                  <Clock className="w-3 h-3 mr-1" />
                  2-Year Shelf Life
                </Badge>
              </div>

              <h1 className="text-4xl md:text-6xl font-bold leading-tight tracking-tight text-white">
                <span className="text-yellow-400">{activeSlide.title}</span>
              </h1>

              {activeSlide.subtitle && (
                <p className="text-lg text-gray-300 leading-relaxed font-light">
                  {activeSlide.subtitle}
                </p>
              )}
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                size="lg"
                className="bg-green-600 hover:bg-green-700 text-white text-lg px-8 py-4 h-auto transition-all duration-300 hover:scale-105"
                onClick={openWhatsApp}
              >
                <MessageCircle className="w-5 h-5 mr-3" />
                Order Now via WhatsApp
              </Button>

              {activeSlide.linkUrl && (
                <Link href={activeSlide.linkUrl} passHref>
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-yellow-400 text-yellow-400 hover:bg-yellow-400/10 text-lg px-8 py-4 h-auto transition-all duration-300 hover:scale-105"
                  >
                    View Specs
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </Link>
              )}
            </div>

            <div className="flex items-center space-x-6 text-sm text-gray-400">
              <span>✓ 16g Premium Sachets</span>
              <span>✓ 12 Sachets per Box</span>
              <span>✓ Starting from 999 PKR</span>
            </div>
          </div>

          {/* Right Content - Product Image */}
          <div className="relative flex justify-center">
            <div className="relative z-10 w-full max-w-[500px] aspect-square rounded-2xl overflow-hidden shadow-2xl border border-yellow-500/10">
              <Image
                src={activeSlide.imageUrl}
                alt={activeSlide.title}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
                priority
              />
            </div>

            {/* Floating Badge */}
            <div className="absolute -top-4 -right-4 bg-yellow-500 text-black p-4 rounded-full shadow-lg animate-pulse z-20">
              <span className="font-bold text-sm">48H</span>
            </div>
          </div>
        </div>
      </div>

      {/* Progress indicators/dots at the bottom of the section */}
      {activeSlides.length > 1 && (
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30 flex gap-2">
          {activeSlides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => handleDotClick(idx)}
              className={`h-2 rounded-full transition-all duration-300 ${
                idx === currentIndex ? 'bg-yellow-400 w-6' : 'bg-white/30 w-2 hover:bg-white/60'
              }`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
      )}
    </section>
  )
}