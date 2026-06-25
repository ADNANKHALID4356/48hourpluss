// components/product-showcase.tsx
"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MessageCircle, Package, Clock, Droplets, Zap, ArrowUpRight } from "lucide-react"
import { useEffect, useRef } from "react"
import Image from "next/image"
import Link from "next/link"
import { Product } from "@/lib/types"

interface ProductShowcaseProps {
  products: Product[]
}

export function ProductShowcase({ products }: ProductShowcaseProps) {
  const videoRef = useRef<HTMLVideoElement>(null)

  const features = [
    {
      icon: Package,
      title: "16g Premium Sachets",
      description: "12 individual servings formulated for structured dosing.",
    },
    {
      icon: Droplets,
      title: "Honey-Based Delivery",
      description: "Optimized absorption mechanism utilizing pure raw honey.",
    },
    {
      icon: Zap,
      title: "9 Active Botanicals",
      description: "Carefully calibrated compounds designed for synergistic impact.",
    },
    {
      icon: Clock,
      title: "48-Hour Sustained Duration",
      description: "Sustained bioavailability for physical recovery and stamina.",
    },
  ]

  useEffect(() => {
    const video = videoRef.current
    if (video) {
      video.muted = true
      video.autoplay = true
      video.loop = true
      video.play().catch(console.error)
    }
  }, [])

  return (
    <section id="product-showcase" className="py-28 bg-black border-b border-gray-900/40">
      <div className="container mx-auto px-6">
        
        {/* Dynamic Featured Products Catalog */}
        {products && products.length > 0 && (
          <div className="mb-28">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <Badge className="bg-yellow-500/10 text-yellow-500 border border-yellow-500/20 text-xs px-3 py-1 mb-4 uppercase tracking-wider">
                Dynamic Storefront Catalog
              </Badge>
              <h3 className="text-3xl sm:text-5xl font-light tracking-tight text-white mb-4 font-serif">
                Featured <span className="text-yellow-400">Formulations</span>
              </h3>
              <p className="text-gray-400 font-light text-base leading-relaxed">
                Explore our certified natural formulations queried directly from our database.
              </p>
            </div>

            {/* Obsidian Card Product Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 justify-center">
              {products.slice(0, 3).map((product) => (
                <div
                  key={product.id}
                  className="group relative flex flex-col justify-between border border-gray-900 rounded-3xl bg-gray-950/40 p-5 hover:border-yellow-500/20 hover:shadow-xl hover:shadow-yellow-500/[0.02] transition-all duration-500 hover:-translate-y-1.5"
                >
                  <div>
                    {/* Media Container with zoom on hover */}
                    <div className="relative aspect-square w-full overflow-hidden rounded-2xl bg-black border border-gray-900/60">
                      <Image
                        src={product.images[0] || 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=600&auto=format&fit=crop&q=80'}
                        alt={product.name}
                        fill
                        className="h-full w-full object-cover object-center transition duration-500 group-hover:scale-105"
                        sizes="(max-width: 768px) 100vw, 33vw"
                      />
                    </div>
                    
                    <div className="mt-5 flex justify-between items-start gap-4">
                      <div>
                        <span className="text-xs text-yellow-500 font-semibold uppercase tracking-wider">
                          {product.categorySlug}
                        </span>
                        <h4 className="text-lg font-bold text-white mt-1 group-hover:text-yellow-400 transition-colors">
                          <Link href={`/products/${product.slug}`}>
                            <span aria-hidden="true" className="absolute inset-0" />
                            {product.name}
                          </Link>
                        </h4>
                      </div>
                      <p className="text-lg font-extrabold text-yellow-400 shrink-0 font-serif">{product.price}</p>
                    </div>
                  </div>

                  <div className="mt-6 pt-4 border-t border-gray-900/60 flex items-center justify-between text-xs text-gray-500">
                    <span>
                      {product.reviews.length} {product.reviews.length === 1 ? 'Review' : 'Reviews'}
                    </span>
                    <span className="text-yellow-500 font-semibold flex items-center gap-1 group-hover:underline">
                      View Specs 
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Video Features Grid */}
        <div className="border-t border-gray-900/50 pt-20">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h3 className="text-3xl sm:text-5xl font-light tracking-tight text-white mb-4 font-serif">
              Traditional <span className="text-yellow-400">Wisdom</span>
            </h3>
            <p className="text-gray-400 font-light text-base leading-relaxed">
              Synthesized with clinical standards to create a highly bioavailable energy formulation.
            </p>
          </div>

          <div className="grid lg:grid-cols-12 gap-16 items-center">
            {/* Left: Video Showcase */}
            <div className="lg:col-span-7 relative">
              <div className="bg-gradient-to-br from-yellow-500/[0.05] to-transparent rounded-3xl p-4 border border-gray-900/50">
                <div className="relative overflow-hidden rounded-2xl shadow-2xl border border-gray-900 bg-black">
                  <video
                    ref={videoRef}
                    className="w-full h-auto rounded-2xl"
                    autoPlay
                    loop
                    muted
                    playsInline
                    poster="/images/product-main.png"
                  >
                    <source src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Untitled%20design%20%282%29-BcjxTQqEgmIXohURl79ynqgmdrUsTh.mp4" type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                </div>
              </div>

              {/* Dynamic Overlay Badges */}
              <div className="absolute top-8 right-8 bg-green-500/10 text-green-400 border border-green-500/20 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider">
                Turkish Import
              </div>
              <div className="absolute bottom-8 left-8 bg-blue-500/10 text-blue-400 border border-blue-500/20 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider">
                ISO & Halal
              </div>
            </div>

            {/* Right: Technical Features List */}
            <div className="lg:col-span-5 space-y-6">
              {features.map((feature, index) => (
                <Card key={index} className="bg-gray-950/40 border-gray-900 hover:border-yellow-500/30 transition-all duration-300">
                  <CardContent className="p-5 flex items-start space-x-4">
                    <div className="bg-yellow-500/10 p-3 rounded-xl border border-yellow-500/20 shrink-0">
                      <feature.icon className="w-5 h-5 text-yellow-500" />
                    </div>
                    <div>
                      <h3 className="text-md font-semibold text-white mb-1">{feature.title}</h3>
                      <p className="text-sm text-gray-400 font-light leading-relaxed">{feature.description}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>

        {/* Global Action CTA */}
        <div className="text-center mt-20">
          <Button
            size="lg"
            className="bg-green-600 hover:bg-green-700 text-white text-md px-10 py-6 h-auto font-semibold transition-all duration-300 hover:scale-105 shadow-lg shadow-green-600/10 flex items-center justify-center gap-2 mx-auto"
            onClick={() => {
              window.open(
                "https://wa.me/923194405935?text=I want to know more about 48hoursplus Herbal Honey features and place an order",
                "_blank"
              )
            }}
          >
            <MessageCircle className="w-5 h-5" />
            Inquire via WhatsApp
          </Button>
        </div>
      </div>
    </section>
  )
}