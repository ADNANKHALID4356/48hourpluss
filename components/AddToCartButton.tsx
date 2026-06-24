// components/AddToCartButton.tsx
'use client';

import { useState } from 'react';
import { useCart } from './CartProvider';
import { Product } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { ShoppingBag, Plus, Minus } from 'lucide-react';

interface AddToCartButtonProps {
  product: Product;
}

export default function AddToCartButton({ product }: AddToCartButtonProps) {
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);

  const handleIncrement = () => setQuantity((prev) => prev + 1);
  const handleDecrement = () => setQuantity((prev) => (prev > 1 ? prev - 1 : 1));

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <span className="text-sm font-medium text-gray-400">Quantity:</span>
        <div className="flex items-center border border-gray-800 rounded-md bg-gray-900/50">
          <button
            onClick={handleDecrement}
            className="p-2 px-4 hover:bg-gray-800 transition-colors text-gray-400 hover:text-white"
            aria-label="Decrease quantity"
          >
            <Minus className="w-4 h-4" />
          </button>
          <span className="text-sm font-semibold px-4 w-12 text-center">{quantity}</span>
          <button
            onClick={handleIncrement}
            className="p-2 px-4 hover:bg-gray-800 transition-colors text-gray-400 hover:text-white"
            aria-label="Increase quantity"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
      </div>

      <Button
        className="w-full bg-yellow-500 hover:bg-yellow-400 text-black py-6 text-md font-semibold flex items-center justify-center gap-3 transition-transform duration-300 hover:scale-105"
        onClick={() => addToCart(product, quantity)}
      >
        <ShoppingBag className="w-5 h-5" />
        Add to Shopping Cart
      </Button>
    </div>
  );
}