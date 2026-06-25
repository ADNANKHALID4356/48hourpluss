// app/admin/layout.tsx
'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Package, 
  FolderTree, 
  Sliders, 
  LogOut, 
  Menu, 
  X, 
  ExternalLink 
} from 'lucide-react';
import { Button } from '@/components/ui/button';

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  const handleLogout = async () => {
    try {
      const response = await fetch('/api/auth', { method: 'DELETE' });
      if (response.ok) {
        router.push('/');
        router.refresh();
      }
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const navItems = [
    { name: 'Overview', href: '/admin', icon: LayoutDashboard },
    { name: 'Products', href: '/admin/products', icon: Package },
    { name: 'Categories', href: '/admin/categories', icon: FolderTree },
    { name: 'Hero Slides', href: '/admin/hero-slides', icon: Sliders },
  ];

  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col md:flex-row">
      {/* Mobile Header Bar */}
      <header className="md:hidden bg-black border-b border-gray-800 p-4 flex items-center justify-between z-40">
        <div className="flex items-center space-x-2">
          <span className="text-yellow-400 font-bold text-lg">48H Admin</span>
        </div>
        <button 
          onClick={() => setIsMobileOpen(!isMobileOpen)}
          className="text-gray-400 hover:text-white"
        >
          {isMobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </header>

      {/* Persistent Left Sidebar (Desktop) / Sliding Sidebar (Mobile) */}
      <aside className={`
        fixed inset-y-0 left-0 bg-black border-r border-gray-900 w-64 p-6 flex flex-col justify-between z-50 transform transition-transform duration-300 md:relative md:transform-none md:flex
        ${isMobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        <div className="space-y-8">
          <div className="flex items-center justify-between border-b border-gray-900 pb-5">
            <span className="text-yellow-400 font-extrabold text-xl tracking-tight">
              48hoursplus
            </span>
            <span className="text-[10px] bg-yellow-500/10 text-yellow-400 font-semibold px-2 py-1 rounded-md border border-yellow-500/20">
              Admin
            </span>
          </div>

          <nav className="space-y-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsMobileOpen(false)}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-md text-sm font-medium transition-colors ${
                    isActive 
                      ? 'bg-yellow-500 text-black font-semibold' 
                      : 'text-gray-400 hover:bg-gray-900 hover:text-white'
                  }`}
                >
                  <item.icon className="w-4 h-4" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="space-y-4 pt-6 border-t border-gray-900">
          <Link
            href="/"
            className="flex items-center space-x-3 px-4 py-2 text-xs font-semibold text-gray-400 hover:text-white transition-colors"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>Go to Storefront</span>
          </Link>

          <Button
            variant="ghost"
            onClick={handleLogout}
            className="w-full justify-start text-xs font-semibold text-gray-400 hover:text-red-400 hover:bg-red-500/5 transition-colors px-4"
          >
            <LogOut className="w-3.5 h-3.5 mr-3" />
            Sign Out
          </Button>
        </div>
      </aside>

      {/* Main Panel Content Container */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <main className="flex-grow p-4 md:p-8 overflow-y-auto mt-0">
          {children}
        </main>
      </div>
    </div>
  );
}