// app/products/[slug]/page.tsx

import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getProductBySlug, getProducts } from '@/lib/db';
import ImageGallery from '@/components/ImageGallery';
import AddToCartButton from '@/components/AddToCartButton'; // <-- Import the client button
import { MessageCircle } from 'lucide-react';
const WHATSAPP_NUMBER = "923194405935"; // Your WhatsApp number

interface PageProps {
  params: Promise<{ slug: string }> | { slug: string };
}

export async function generateStaticParams() {
  const products = await getProducts();
  return products.map((product) => ({
    slug: product.slug,
  }));
}

export async function generateMetadata({ params }: PageProps) {
  const resolvedParams = await params;
  const product = await getProductBySlug(resolvedParams.slug);

  return {
    title: product ? `${product.name} | Details` : 'Product Not Found',
    description: product?.description || 'View detailed product specifications.',
  };
}

export default async function ProductDetailPage({ params }: PageProps) {
  const resolvedParams = await params;
  const product = await getProductBySlug(resolvedParams.slug);

  if (!product) {
    notFound();
  }

  // Pre-filled single-item fallback WhatsApp link
  const textMessage = `Hello! I would like to order: *${product.name}* \nPrice: *${product.price}*.\n\nPlease confirm availability and payment options.`;
  const encodedText = encodeURIComponent(textMessage);
  const whatsAppUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodedText}`;

  return (
    <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 mt-24">
      {/* Breadcrumbs */}
      <nav className="mb-8">
        <Link href="/products" className="text-sm font-medium text-yellow-400 hover:text-yellow-300">
          &larr; Back to Catalog
        </Link>
      </nav>

      <div className="lg:grid lg:grid-cols-2 lg:items-start lg:gap-x-8">
        {/* Gallery */}
        <ImageGallery images={product.images} altText={product.name} />

        {/* Info */}
        <div className="mt-10 px-4 sm:mt-16 sm:px-0 lg:mt-0">
          <p className="text-sm font-semibold text-yellow-400 uppercase tracking-wider">
            {product.categorySlug}
          </p>
          <h1 className="text-3xl font-bold tracking-tight text-white mt-1">{product.name}</h1>
          
          <div className="mt-3">
            <p className="text-3xl tracking-tight text-yellow-400 font-bold">{product.price}</p>
          </div>

          <div className="mt-6">
            <h3 className="sr-only">Description</h3>
            <p className="text-base text-gray-300 leading-relaxed">{product.description}</p>
          </div>

          {/* Dynamic Ingredients list */}
          <div className="mt-8 border-t border-gray-800 pt-6">
            <h3 className="text-sm font-semibold text-white">Key Ingredients</h3>
            <div className="mt-4">
              <ul className="list-disc pl-5 space-y-2 text-sm text-gray-400">
                {product.ingredients.map((ingredient, idx) => (
                  <li key={idx} className="pl-1">
                    {ingredient}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Checkout Controls */}
          <div className="mt-10 space-y-4 border-t border-gray-800 pt-6">
            {/* Interactive Add to Cart selector */}
            <AddToCartButton product={product} />

            <div className="relative flex py-2 items-center">
              <div className="flex-grow border-t border-gray-800"></div>
              <span className="flex-shrink mx-4 text-gray-500 text-xs uppercase tracking-wider font-semibold">or buy instantly</span>
              <div className="flex-grow border-t border-gray-800"></div>
            </div>

            <a
              href={whatsAppUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex w-full items-center justify-center rounded-md border border-emerald-600/30 bg-emerald-600/10 px-8 py-4 text-base font-semibold text-emerald-400 hover:bg-emerald-600 hover:text-white transition-all duration-300 hover:scale-105 shadow-sm"
            >
              <MessageCircle className="w-5 h-5 mr-3" />
              Instant Order via WhatsApp
            </a>
          </div>
        </div>
      </div>

      {/* Customer Reviews Section */}
      <section className="mt-16 border-t border-gray-800 pt-10">
        <h2 className="text-lg font-bold text-white">Customer Feedback</h2>
        <div className="mt-6 space-y-10 division-y division-gray-800">
          {product.reviews.length === 0 ? (
            <p className="text-sm text-gray-500">No reviews yet. Be the first to leave feedback on your purchase!</p>
          ) : (
            product.reviews.map((review) => (
              <div key={review.id} className="pt-6 first:pt-0">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-white">{review.author}</p>
                    <p className="text-xs text-gray-500">{review.date}</p>
                  </div>
                  <div className="flex items-center">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <span
                        key={i}
                        className={`text-lg ${i < review.rating ? 'text-amber-400' : 'text-gray-800'}`}
                      >
                        ★
                      </span>
                    ))}
                  </div>
                </div>
                <div className="mt-3 text-sm italic text-gray-400 leading-relaxed font-light">
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