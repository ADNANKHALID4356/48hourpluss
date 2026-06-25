// components/StorefrontWrapper.tsx
'use client';

import { usePathname } from 'next/navigation';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { WhatsAppFloat } from '@/components/whatsapp-float';
import CartDrawer from '@/components/CartDrawer';

interface StorefrontWrapperProps {
  children: React.ReactNode;
}

export default function StorefrontWrapper({ children }: StorefrontWrapperProps) {
  const pathname = usePathname();
  
  // Detect if the active browser path is an administrative page
  const isAdminPath = pathname.startsWith('/admin');

  if (isAdminPath) {
    // Admin routes render only their children (their own layout.tsx handles their custom sidebar)
    return <main>{children}</main>;
  }

  // Customer-facing storefront routes render the full Header, Footer, and Cart Drawer utilities
  return (
    <>
      <Header />
      <main>{children}</main>
      <Footer />
      <WhatsAppFloat />
      
      {/* Mount the interactive Cart Drawer specifically on storefront pages */}
      <CartDrawer />
    </>
  );
}