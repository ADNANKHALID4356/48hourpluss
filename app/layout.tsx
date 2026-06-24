// app/layout.tsx

import type { Metadata } from 'next'
import { GeistSans } from 'geist/font/sans'
import { GeistMono } from 'geist/font/mono'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { WhatsAppFloat } from '@/components/whatsapp-float'
import './globals.css'
import { CartProvider } from '../components/CartProvider'
import CartDrawer from '../components/CartDrawer'

export const metadata: Metadata = {
  title: {
    default: '48 Hours Plus Herbal Honey | Natural Male Enhancement',
    template: '%s | 48 Hours Plus',
  },
  description:
    'Premium Turkish herbal honey with 9 natural ingredients. Lab-tested, ISO & Halal certified. Order worldwide via WhatsApp.',
  generator: 'v0.dev',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head>
        <style>{`
html {
  font-family: ${GeistSans.style.fontFamily};
  --font-sans: ${GeistSans.variable};
  --font-mono: ${GeistMono.variable};
}
        `}</style>
      </head>
      <body className="bg-black text-white min-h-screen">
        {/* Wrap your entire application inside the dynamic Cart Provider */}
        <CartProvider>
          <Header />
          <main>{children}</main>
          <Footer />
          <WhatsAppFloat />
          
          {/* Mount the interactive Cart sliding drawer globally */}
          <CartDrawer />
        </CartProvider>
      </body>
    </html>
  )
}