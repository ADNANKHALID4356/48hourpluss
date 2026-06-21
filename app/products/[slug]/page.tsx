// import type { Metadata } from "next"
// import { notFound } from "next/navigation"
// import Image from "next/image"
// import { getProductBySlug, getAllProductSlugs } from "@/lib/products"
// import { IngredientBreakdown } from "@/components/ingredient-breakdown"
// import { PricingSection } from "@/components/pricing-section"
// import { UsageInstructions } from "@/components/usage-instructions"

// export function generateStaticParams() {
//   return getAllProductSlugs().map((slug) => ({ slug }))
// }

// export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
//   const product = getProductBySlug(params.slug)
//   if (!product) return {}
//   return {
//     title: product.name,
//     description: product.shortDescription,
//   }
// }

// export default function ProductDetailPage({ params }: { params: { slug: string } }) {
//   const product = getProductBySlug(params.slug)

//   if (!product) {
//     notFound()
//   }

//   return (
//     <div className="pt-24">
//       <section className="py-12 bg-gradient-to-b from-black via-gray-900 to-black">
//         <div className="container mx-auto px-4">
//           <div className="grid md:grid-cols-2 gap-12 items-center">
//             <Image
//               src={product.heroImage || "/placeholder.svg"}
//               alt={product.name}
//               width={500}
//               height={500}
//               className="rounded-2xl shadow-2xl mx-auto"
//             />
//             <div>
//               <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">{product.name}</h1>
//               <p className="text-xl text-yellow-400 font-medium mb-4">{product.tagline}</p>
//               <p className="text-gray-300 text-lg leading-relaxed">{product.shortDescription}</p>
//             </div>
//           </div>
//         </div>
//       </section>

//       <IngredientBreakdown />
//       <PricingSection />
//       <UsageInstructions />
//     </div>
//   )
// }





// app/products/[slug]/page.tsx

import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getProductBySlug, PRODUCTS, WHATSAPP_NUMBER } from '@/lib/products';
import ImageGallery from '@/components/ImageGallery';

interface PageProps {
  params: Promise<{ slug: string }> | { slug: string };
}

// Generate static fallback parameters for static build pre-rendering
export async function generateStaticParams() {
  return PRODUCTS.map((product) => ({
    slug: product.slug,
  }));
}

export async function generateMetadata({ params }: PageProps) {
  const resolvedParams = await params;
  const product = getProductBySlug(resolvedParams.slug);

  return {
    title: product ? `${product.name} | Details` : 'Product Not Found',
    description: product?.description || 'View detailed product specifications.',
  };
}

export default async function ProductDetailPage({ params }: PageProps) {
  const resolvedParams = await params;
  const product = getProductBySlug(resolvedParams.slug);

  if (!product) {
    notFound();
  }

  // Pre-fill message formatting for WhatsApp CTA
  const textMessage = `Hello! I would like to order: *${product.name}* \nPrice: *${product.price}*.\n\nPlease confirm availability and payment options.`;
  const encodedText = encodeURIComponent(textMessage);
  const whatsAppUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodedText}`;

  return (
    <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      {/* Navigation Breadcrumb */}
      <nav className="mb-8">
        <Link href="/products" className="text-sm font-medium text-indigo-600 hover:text-indigo-500">
          &larr; Back to Catalog
        </Link>
      </nav>

      <div className="lg:grid lg:grid-cols-2 lg:items-start lg:gap-x-8">
        {/* Dynamic Image Gallery */}
        <ImageGallery images={product.images} altText={product.name} />

        {/* Product Information Details */}
        <div className="mt-10 px-4 sm:mt-16 sm:px-0 lg:mt-0">
          <p className="text-sm font-semibold text-indigo-600 uppercase tracking-wider">
            {product.category}
          </p>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 mt-1">{product.name}</h1>
          
          <div className="mt-3">
            <p className="text-3xl tracking-tight text-gray-950 font-bold">{product.price}</p>
          </div>

          <div className="mt-6">
            <h3 className="sr-only">Description</h3>
            <p className="space-y-6 text-base text-gray-700 leading-relaxed">{product.description}</p>
          </div>

          {/* Ingredient Breakdown List */}
          <div className="mt-8 border-t border-gray-100 pt-6">
            <h3 className="text-sm font-semibold text-gray-900">Key Ingredients</h3>
            <div className="mt-4">
              <ul role="list" className="list-disc pl-5 space-y-2 text-sm text-gray-600">
                {product.ingredients.map((ingredient, idx) => (
                  <li key={idx} className="pl-1">
                    {ingredient}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* WhatsApp Direct Action CTA */}
          <div className="mt-10">
            <a
              href={whatsAppUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex w-full items-center justify-center rounded-md border border-transparent bg-emerald-600 px-8 py-3 text-base font-semibold text-white hover:bg-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 transition-colors shadow-sm"
            >
              Order via WhatsApp
            </a>
            <p className="text-xs text-center text-gray-400 mt-2">
              Secure checkouts processed directly via our chat assistant.
            </p>
          </div>
        </div>
      </div>

      {/* Reviews Display System */}
      <section className="mt-16 border-t border-gray-100 pt-10">
        <h2 className="text-lg font-bold text-gray-900">Customer Feedback</h2>
        <div className="mt-6 space-y-10 division-y division-gray-100">
          {product.reviews.length === 0 ? (
            <p className="text-sm text-gray-500">No reviews yet. Be the first to leave feedback on your purchase!</p>
          ) : (
            product.reviews.map((review) => (
              <div key={review.id} className="pt-6 first:pt-0">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="mr-3">
                      <p className="text-sm font-semibold text-gray-900">{review.author}</p>
                      <p className="text-xs text-gray-400">{review.date}</p>
                    </div>
                  </div>
                  {/* Visual Star Rating representation */}
                  <div className="flex items-center">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <span
                        key={i}
                        className={`text-lg ${i < review.rating ? 'text-amber-400' : 'text-gray-200'}`}
                      >
                        ★
                      </span>
                    ))}
                  </div>
                </div>
                <div className="mt-3 text-sm italic text-gray-600 leading-relaxed">
                  &ldquo;{review.comment}&rdquo;
                </div>
              </div>
            ))
          )}
        </div>
      </section>
    </main>
  );
}