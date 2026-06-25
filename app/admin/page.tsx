// app/admin/page.tsx

import { prisma } from '@/lib/db';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Package, FolderTree, Sliders, AlertTriangle } from 'lucide-react';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function AdminDashboardPage() {
  // Query Supabase directly for dynamic statistics
  const productCount = await prisma.product.count();
  const categoryCount = await prisma.category.count();
  const slideCount = await prisma.heroSlide.count({ where: { isActive: true } });

  // Query database for inventory stock warnings (under 10 items)
  const lowStockProducts = await prisma.product.findMany({
    where: { stock: { lt: 10 } },
    include: { category: true }
  });

  const stats = [
    { name: 'Total Products', value: productCount, icon: Package, href: '/admin/products' },
    { name: 'Active Categories', value: categoryCount, icon: FolderTree, href: '/admin/categories' },
    { name: 'Hero Slides Active', value: slideCount, icon: Sliders, href: '/admin/hero-slides' },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-white">Dashboard Overview</h2>
        <p className="text-gray-400 mt-1">Real-time storefront metrics from Supabase</p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {stats.map((stat, idx) => (
          <Link key={idx} href={stat.href} className="block transition-transform hover:scale-[1.02] duration-200">
            <Card className="bg-gray-900 border-gray-800 text-white relative overflow-hidden group">
              <div className="absolute top-0 left-0 w-[3px] h-full bg-yellow-500 transition-colors group-hover:bg-yellow-400"></div>
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-sm font-medium text-gray-400">{stat.name}</CardTitle>
                <stat.icon className="w-5 h-5 text-yellow-500" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{stat.value}</div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {/* Stock Alerts Grid */}
      <div className="mt-8">
        <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-yellow-500" />
          Inventory Warnings ({lowStockProducts.length})
        </h3>

        {lowStockProducts.length === 0 ? (
          <div className="p-6 text-center text-sm text-gray-500 bg-gray-900/50 border border-gray-800 rounded-lg">
            All products possess healthy stock volumes.
          </div>
        ) : (
          <div className="overflow-x-auto border border-gray-800 rounded-lg bg-gray-900/50">
            <table className="w-full text-left text-sm text-gray-300">
              <thead className="bg-black text-xs font-semibold text-gray-400 uppercase tracking-wider border-b border-gray-800">
                <tr>
                  <th className="p-4">Product Name</th>
                  <th className="p-4">Category</th>
                  <th className="p-4">Stock Count</th>
                  <th className="p-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {lowStockProducts.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-900/30">
                    <td className="p-4 font-semibold text-white">{product.name}</td>
                    <td className="p-4">{product.category.name}</td>
                    <td className="p-4 flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse"></span>
                      <span className="text-red-400 font-bold">{product.stock} units left</span>
                    </td>
                    <td className="p-4 text-right">
                      <Link href={`/admin/products?edit=${product.id}`} className="text-yellow-400 hover:text-yellow-300 text-xs font-semibold">
                        Restock Product &rarr;
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}