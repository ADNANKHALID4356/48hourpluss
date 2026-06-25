// app/admin/products/page.tsx

import { getProducts, getCategories } from '@/lib/db';
import ProductManagerClient from '@/components/admin/ProductManagerClient';

export const dynamic = 'force-dynamic';

export default async function AdminProductsPage() {
  // Fetch raw database records directly on the server
  const products = await getProducts({ includeInactive: true });
  const categories = await getCategories();

  return <ProductManagerClient initialProducts={products} categories={categories} />;
}