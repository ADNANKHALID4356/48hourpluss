// components/CartDrawer.tsx
'use client';

import { useCart } from './CartProvider';
import { Sheet, SheetContent, SheetTitle } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { MessageCircle, Trash2, Plus, Minus, ShoppingBag } from 'lucide-react';
import Image from 'next/image';

const WHATSAPP_NUMBER = "923194405935"; // Replace with your number

export default function CartDrawer() {
  const {
    cart,
    isCartOpen,
    setIsCartOpen,
    updateQuantity,
    removeFromCart,
    getCartSubtotal,
    getCartItemCount,
  } = useCart();

  const handleCheckout = () => {
    if (cart.length === 0) return;

    // Compile dynamic structured text block for order confirmation
    let messageText = `Hello 48hoursplus! I'd like to place an order:\n\n🛒 *ORDER DETAILS*:\n`;
    
    cart.forEach((item, index) => {
      messageText += `${index + 1}. *${item.product.name}*\n`;
      messageText += `   - Quantity: ${item.quantity}\n`;
      messageText += `   - Price: ${item.product.price} each\n`;
    });

    messageText += `\n--------------------------------\n`;
    messageText += `💵 *Subtotal*: $${getCartSubtotal().toFixed(2)}\n`;
    messageText += `🚚 *Delivery*: Calculated upon address validation\n\n`;
    messageText += `📋 *CUSTOMER INFO*:\n`;
    messageText += `Name: [Enter Name]\n`;
    messageText += `Delivery Address: [Enter Delivery Address]\n`;

    const encodedText = encodeURIComponent(messageText);
    const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodedText}`;
    
    window.open(whatsappUrl, '_blank');
  };

  return (
    <Sheet open={isCartOpen} onOpenChange={setIsCartOpen}>
      <SheetContent side="right" className="bg-black border-gray-800 text-white flex flex-col justify-between w-full sm:max-w-md">
        <div>
          <SheetTitle className="text-yellow-400 border-b border-gray-800 pb-4 flex items-center gap-2">
            <ShoppingBag className="w-5 h-5" />
            Your Shopping Cart ({getCartItemCount()})
          </SheetTitle>

          {cart.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-gray-500 gap-4">
              <ShoppingBag className="w-12 h-12 stroke-1" />
              <p className="text-sm">Your shopping cart is empty.</p>
            </div>
          ) : (
            <div className="flex flex-col gap-4 mt-6 overflow-y-auto max-h-[60vh] pr-1">
              {cart.map((item) => (
                <div key={item.product.id} className="flex gap-4 border-b border-gray-900 pb-4">
                  <div className="relative w-20 h-20 rounded-md overflow-hidden bg-gray-950 border border-gray-800 flex-shrink-0">
                    <Image
                      src={item.product.images[0] || 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=100&auto=format&fit=crop&q=80'}
                      alt={item.product.name}
                      fill
                      className="object-cover"
                    />
                  </div>

                  <div className="flex flex-col justify-between flex-grow">
                    <div>
                      <h4 className="text-sm font-semibold text-white line-clamp-1">{item.product.name}</h4>
                      <p className="text-xs text-yellow-400 font-bold mt-1">{item.product.price}</p>
                    </div>

                    <div className="flex items-center justify-between mt-2">
                      {/* Quantity Toggles */}
                      <div className="flex items-center border border-gray-800 rounded-md">
                        <button
                          onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                          className="p-1 px-2 hover:bg-gray-900 transition-colors text-gray-400 hover:text-white"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="text-xs px-2 font-medium">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                          className="p-1 px-2 hover:bg-gray-900 transition-colors text-gray-400 hover:text-white"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      {/* Delete Trigger */}
                      <button
                        onClick={() => removeFromCart(item.product.id)}
                        className="text-gray-500 hover:text-red-500 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {cart.length > 0 && (
          <div className="border-t border-gray-800 pt-6 bg-black">
            <div className="flex justify-between items-center mb-4">
              <span className="text-sm text-gray-400">Estimated Subtotal</span>
              <span className="text-xl font-bold text-yellow-400">${getCartSubtotal().toFixed(2)}</span>
            </div>

            <Button
              className="w-full bg-green-600 hover:bg-green-700 text-white py-6 text-md font-semibold flex items-center justify-center gap-2"
              onClick={handleCheckout}
            >
              <MessageCircle className="w-5 h-5" />
              Checkout via WhatsApp
            </Button>
            <p className="text-center text-xs text-gray-500 mt-2">
              Review details inside WhatsApp before sending.
            </p>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}