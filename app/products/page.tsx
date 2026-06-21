// app/products/page.tsx

import { getProducts, getCategories } from '@/lib/db'; // <-- Imports from your active Prisma database!
import ProductCatalog from '@/components/ProductCatalog';

export const metadata = {
  title: 'Product Catalog',
  description: 'Explore our catalog of premium ingredients and formulas.',
};

// Mark the function as async so we can await database queries
export default async function CatalogPage() {
  // Fetch live products and categories from SQLite
  const products = await getProducts();
  const categories = await getCategories();
  
  // Extract category names for the filtering UI tabs
  const categoryNames = categories.map((c) => c.name);

  return (
    <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="space-y-4 mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Our Catalog</h1>
        <p className="text-lg text-gray-500">
          Discover high-quality, targeted formulations matching your physical routine.
        </p>
      </div>

      {/* Pass the dynamic database products and categories to the catalog grid */}
      <ProductCatalog products={products} categories={categoryNames} />
    </main>
  );
}