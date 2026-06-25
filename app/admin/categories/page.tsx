// app/admin/categories/page.tsx

import { getCategories } from '@/lib/db';
import CategoryManagerClient from '@/components/admin/CategoryManagerClient';

export const dynamic = 'force-dynamic';

export default async function AdminCategoriesPage() {
  const categories = await getCategories();
  return <CategoryManagerClient initialCategories={categories} />;
}