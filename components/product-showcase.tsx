// components/product-showcase.tsx
"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MessageCircle, Package, Clock, Droplets, Zap } from "lucide-react"
import { useEffect, useRef } from "react"
import Image from "next/image"
import Link from "next/link"
import { Product } from "@/lib/types" // <-- Import the database Product model!

interface ProductShowcaseProps {
  products: Product[]
}

export function ProductShowcase({ products }: ProductShowcaseProps) {
  const videoRef = useRef<HTMLVideoElement>(null)

  const features = [
    {
      icon: Package,
      title: "16g Premium Sachets",
      description: "12 pieces per box for optimal dosing",
    },
    {
      icon: Droplets,
      title: "Honey-Based Delivery",
      description: "Natural absorption enhancement system",
    },
    {
      icon: Zap,
      title: "9 Powerful Ingredients",
      description: "Carefully selected herbal compounds",
    },
    {
      icon: Clock,
      title: "48-Hour Effect",
      description: "Extended duration for maximum benefit",
    },
  ]

  useEffect(() => {
    const video = videoRef.current
    if (video) {
      // Ensure video plays automatically and loops
      video.muted = true
      video.autoplay = true
      video.loop = true
      video.play().catch(console.error)
    }
  }, [])

  return (
    <section id="product-showcase" className="py-16 bg-gradient-to-b from-black to-gray-900">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <Badge className="bg-yellow-500 text-black text-lg px-4 py-2 mb-4">Premium Product</Badge>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Experience the <span className="text-yellow-400">Power</span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Our premium herbal honey combines traditional Turkish wisdom with modern quality standards
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center mb-12">
          {/* Video Display */}
          <div className="relative">
            <div className="bg-gradient-to-br from-yellow-500/20 to-yellow-600/20 rounded-3xl p-8">
              <div className="relative overflow-hidden rounded-2xl shadow-2xl">
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

            {/* Floating badges */}
            <div className="absolute top-4 right-4 bg-green-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
              Turkish Made
            </div>
            <div className="absolute bottom-4 left-4 bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
              ISO Certified
            </div>
          </div>

          {/* Features Grid */}
          <div className="space-y-6">
            {features.map((feature, index) => (
              <Card key={index} className="bg-gray-800 border-gray-700 hover:border-yellow-500 transition-colors">
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <div className="bg-yellow-500 p-3 rounded-lg">
                      <feature.icon className="w-6 h-6 text-black" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-white mb-2">{feature.title}</h3>
                      <p className="text-gray-400">{feature.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* ==========================================================================
           DYNAMIC FEATURED PRODUCTS SECTION (PRISMA DATABASE DRIVEN)
           ========================================================================== */}
        {products && products.length > 0 && (
          <div className="mt-20 mb-16 border-t border-gray-800/80 pt-16">
            <h3 className="text-3xl font-bold text-center text-white mb-2">
              Featured <span className="text-yellow-400">Products</span>
            </h3>
            <p className="text-gray-400 text-center mb-12 max-w-lg mx-auto">
              Explore our laboratory-certified botanical formulas direct from the database
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 justify-center">
              {products.slice(0, 3).map((product) => (
                <div
                  key={product.id}
                  className="group relative flex flex-col justify-between border border-gray-800 rounded-2xl bg-gray-900/50 p-5 hover:border-yellow-500/50 transition-all hover:scale-[1.02] duration-300"
                >
                  <div>
                    <div className="relative aspect-square w-full overflow-hidden rounded-xl bg-gray-950">
                      <Image
                        src={product.images[0] || 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=600&auto=format&fit=crop&q=80'}
                        alt={product.name}
                        fill
                        className="h-full w-full object-cover object-center transition duration-300 group-hover:scale-105"
                        sizes="(max-width: 768px) 100vw, 33vw"
                      />
                    </div>
                    <div className="mt-4 flex justify-between items-start gap-4">
                      <div>
                        <span className="text-xs text-yellow-500 font-semibold uppercase tracking-wider">
                          {product.categorySlug}
                        </span>
                        <h4 className="text-lg font-bold text-white mt-1">
                          <Link href={`/products/${product.slug}`}>
                            <span aria-hidden="true" className="absolute inset-0" />
                            {product.name}
                          </Link>
                        </h4>
                      </div>
                      <p className="text-lg font-extrabold text-yellow-400 shrink-0">{product.price}</p>
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t border-gray-800/60 flex items-center justify-between text-xs text-gray-400">
                    <span>{product.reviews.length} {product.reviews.length === 1 ? 'Review' : 'Reviews'}</span>
                    <span className="text-yellow-500 font-semibold group-hover:underline">
                      View Specs &rarr;
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* CTA Section */}
        <div className="text-center">
          <Button
            size="lg"
            className="bg-green-600 hover:bg-green-700 text-white text-lg px-8 py-4 h-auto transition-all duration-300 hover:scale-105"
            onClick={() => {
              window.open(
                "https://wa.me/923194405935?text=I want to know more about 48hoursplus Herbal Honey features and place an order",
                "_blank",
              )
            }}
          >
            <MessageCircle className="w-5 h-5 mr-3" />
            Order Now via WhatsApp
          </Button>
        </div>
      </div>
    </section>
  )
}