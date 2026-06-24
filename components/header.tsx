// components/header.tsx
"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet"
import { MessageCircle, Menu, ShoppingBag } from "lucide-react"
import { useCart } from "./CartProvider" // <-- Import the cart hook!

const navLinks = [
  { name: "Home", href: "/" },
  { name: "Products", href: "/products" },
  { name: "Certificates", href: "/certificates" },
  { name: "Reviews", href: "/reviews" },
  { name: "Contact", href: "/contact" },
]

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  
  // Destructure cart helper actions
  const { getCartItemCount, setIsCartOpen } = useCart()

  const openWhatsApp = () => {
    window.open("https://wa.me/923194405935?text=Hi, I'm interested in 48 Hours Plus Herbal Honey", "_blank")
  }

  return (
    <header className="fixed top-0 w-full bg-black/95 backdrop-blur-sm z-50 border-b border-yellow-500/20">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center space-x-3">
          <Image src="/images/logo-new.png" alt="48 Hours Plus Logo" width={48} height={48} className="rounded-lg" />
          <div>
            <h1 className="text-xl font-bold text-yellow-400">48hoursplus</h1>
            <p className="text-xs text-gray-400">Herbal Honey</p>
          </div>
        </Link>

        <nav className="hidden md:flex items-center space-x-6">
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href} className="text-white hover:text-yellow-400 transition-colors">
              {link.name}
            </Link>
          ))}
        </nav>

        <div className="flex items-center space-x-3">
          {/* Global Cart Open Trigger */}
          <Button
            variant="ghost"
            className="relative text-white hover:text-yellow-400 hover:bg-gray-900/50 p-2 px-3 flex items-center gap-2"
            onClick={() => setIsCartOpen(true)}
          >
            <ShoppingBag className="w-5 h-5" />
            {getCartItemCount() > 0 && (
              <span className="absolute -top-1 -right-1 bg-yellow-500 text-black text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center animate-scale-in">
                {getCartItemCount()}
              </span>
            )}
          </Button>

          <Button className="hidden sm:flex bg-green-600 hover:bg-green-700 text-white" onClick={openWhatsApp}>
            <MessageCircle className="w-4 h-4 mr-2" />
            WhatsApp
          </Button>

          {/* Mobile menu trigger */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden text-white hover:bg-gray-800"
            onClick={() => setIsMenuOpen(true)}
            aria-label="Open menu"
          >
            <Menu className="w-6 h-6" />
          </Button>
        </div>
      </div>

      {/* Mobile nav drawer */}
      <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
        <SheetContent side="right" className="bg-black border-gray-800 text-white">
          <SheetTitle className="text-yellow-400 px-4 pt-4">Menu</SheetTitle>
          <nav className="flex flex-col px-4 gap-2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsMenuOpen(false)}
                className="py-3 text-lg text-white hover:text-yellow-400 border-b border-gray-800 transition-colors"
              >
                {link.name}
              </Link>
            ))}
            
            {/* Mobile Cart Trigger */}
            <Button
              variant="outline"
              className="mt-4 border-yellow-500 text-yellow-500 hover:bg-yellow-500/10 flex items-center justify-center gap-2"
              onClick={() => {
                setIsMenuOpen(false);
                setIsCartOpen(true);
              }}
            >
              <ShoppingBag className="w-4 h-4" />
              View Cart ({getCartItemCount()})
            </Button>

            <Button
              className="mt-2 bg-green-600 hover:bg-green-700 text-white"
              onClick={() => {
                setIsMenuOpen(false)
                openWhatsApp()
              }}
            >
              <MessageCircle className="w-4 h-4 mr-2" />
              WhatsApp
            </Button>
          </nav>
        </SheetContent>
      </Sheet>
    </header>
  )
}