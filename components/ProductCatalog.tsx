// components/ProductCatalog.tsx
'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Product } from '@/lib/types'; // <-- Swapped import from @/lib/products to @/lib/types!

interface ProductCatalogProps {
  products: Product[];
  categories: string[];
}

export default function ProductCatalog({ products, categories }: ProductCatalogProps) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // Filter products based on active category slug matching our database field
  const filteredProducts = selectedCategory
    ? products.filter((p) => p.categorySlug === selectedCategory)
    : products;

  return (
    <div className="space-y-8">
      {/* Categories Filter Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-gray-100 pb-4">
        <button
          onClick={() => setSelectedCategory(null)}
          className={`px-4 py-2 text-sm font-medium rounded-full transition-colors ${
            selectedCategory === null
              ? 'bg-indigo-600 text-white'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          All Products
        </button>
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category.toLowerCase())}
            className={`px-4 py-2 text-sm font-medium rounded-full transition-colors ${
              selectedCategory === category.toLowerCase()
                ? 'bg-indigo-600 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Grid of Product Cards */}
      {filteredProducts.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          No products found in this category.
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:gap-x-8">
          {filteredProducts.map((product) => (
            <div key={product.id} className="group relative flex flex-col justify-between border border-gray-100 rounded-lg p-4 hover:shadow-md transition-shadow">
              <div>
                <div className="relative aspect-square w-full overflow-hidden rounded-md bg-gray-50 group-hover:opacity-90 transition-opacity">
                  <Image
                    src={product.images[0] || 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=600&auto=format&fit=crop&q=80'}
                    alt={product.name}
                    fill
                    className="h-full w-full object-cover object-center"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                </div>
                <div className="mt-4 flex justify-between">
                  <div>
                    {/* Access categorySlug from database model */}
                    <p className="text-xs text-indigo-600 uppercase tracking-wider font-semibold">
                      {product.categorySlug}
                    </p>
                    <h3 className="text-sm font-semibold text-gray-800 mt-1">
                      <Link href={`/products/${product.slug}`}>
                        <span aria-hidden="true" className="absolute inset-0" />
                        {product.name}
                      </Link>
                    </h3>
                  </div>
                  <p className="text-sm font-bold text-gray-900">{product.price}</p>
                </div>
              </div>
              <div className="mt-4 pt-3 border-t border-gray-50 flex items-center justify-between">
                <span className="text-xs text-gray-500">
                  {product.reviews.length} {product.reviews.length === 1 ? 'Review' : 'Reviews'}
                </span>
                <span className="text-xs font-semibold text-indigo-600 group-hover:underline">
                  View Details &rarr;
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}