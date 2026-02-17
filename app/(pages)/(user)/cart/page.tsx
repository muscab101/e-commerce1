"use client"

import React, { useEffect, useState } from 'react'
import { useCartStore } from '@/app/store/useCartStore'
import { Trash2, Plus, Minus, ShoppingBag } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'

const CartPage = () => {
  const { cart, removeFromCart, updateQuantity } = useCartStore()
  const [mounted, setMounted] = useState(false)
  const router = useRouter()

  useEffect(() => { setMounted(true) }, [])

  const totalPrice = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0)

  if (!mounted) return null

  if (cart.length === 0) {
    return (
      <div className="h-[70vh] flex flex-col items-center justify-center space-y-4 font-sans">
        <div className="size-20 bg-muted rounded-full flex items-center justify-center">
            <ShoppingBag size={40} className="text-muted-foreground" />
        </div>
        <h2 className="text-xl font-black uppercase tracking-widest">Your bag is empty</h2>
        <Link href="/products">
          <Button variant="outline" className="text-[10px] font-bold uppercase tracking-widest px-8">Return to Shop</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto px-6 pt-32 pb-20 font-sans">
      <h1 className="text-3xl font-black uppercase mb-10 tracking-tighter">Shopping Bag ({cart.length})</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Cart Items List */}
        <div className="lg:col-span-8 space-y-8">
          {cart.map((item) => (
            <div key={`${item.id}-${item.selectedSize}`} className="flex flex-col md:flex-row gap-6 border-b pb-8 border-border">
              
              <div className="flex gap-4">
                {/* Thumbnails */}
                <div className="hidden md:flex flex-col gap-2">
                  {(item as any).allImages?.slice(0, 3).map((img: string, idx: number) => (
                    <div key={idx} className="size-10 bg-muted border overflow-hidden">
                      <img src={img} alt="" className="w-full h-full object-cover opacity-60" />
                    </div>
                  ))}
                </div>

                {/* Main Image */}
                <div className="size-40 bg-muted overflow-hidden border relative group">
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                </div>
              </div>
              
              {/* Product Info */}
              <div className="flex-1 flex flex-col justify-between text-left">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold uppercase text-base tracking-tight">{item.name}</h3>
                    <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2">
                      <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground bg-muted px-2 py-0.5 rounded">
                        Size: {item.selectedSize}
                      </p>
                      <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground bg-muted px-2 py-0.5 rounded">
                        Color: {item.selectedColor}
                      </p>
                    </div>
                  </div>
                  <p className="font-black text-lg">${item.price}</p>
                </div>

                <div className="flex justify-between items-center mt-6">
                  <div className="flex items-center border rounded-sm overflow-hidden bg-background">
                    <button 
                      onClick={() => updateQuantity(item.id, item.selectedSize, item.quantity - 1)} 
                      className="p-2.5 hover:bg-muted transition-colors"
                    >
                      <Minus size={14} />
                    </button>
                    <span className="w-10 text-center text-xs font-black">{item.quantity}</span>
                    <button 
                      onClick={() => updateQuantity(item.id, item.selectedSize, item.quantity + 1)} 
                      className="p-2.5 hover:bg-muted transition-colors"
                    >
                      <Plus size={14} />
                    </button>
                  </div>

                  <button 
                    onClick={() => removeFromCart(item.id, item.selectedSize)} 
                    className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-red-500 hover:text-red-700 transition-all hover:translate-x-1"
                  >
                    <Trash2 size={16} />
                    <span>Remove</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-4">
          <div className="bg-muted/30 p-8 rounded-lg border border-border sticky top-32 space-y-6 text-left">
            <h2 className="font-black uppercase text-sm tracking-[0.2em]">Order Summary</h2>
            
            <div className="space-y-4 border-b pb-6 border-border/50">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground font-medium uppercase tracking-wider text-[11px]">Subtotal</span>
                <span className="font-bold">${totalPrice}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground font-medium uppercase tracking-wider text-[11px]">Estimated Shipping</span>
                <span className="text-emerald-600 font-bold uppercase text-[11px]">Free</span>
              </div>
            </div>

            <div className="flex justify-between items-center pb-2">
              <span className="font-black uppercase text-sm">Total</span>
              <span className="font-black text-2xl tracking-tighter">${totalPrice}</span>
            </div>

            <Link href="/checkout" className="block w-full">
              <Button className="w-full py-7 uppercase font-black tracking-[0.2em] text-[11px] shadow-xl hover:shadow-primary/20 transition-all">
                Proceed to Checkout
              </Button>
            </Link>
            
            <p className="text-[9px] text-center text-muted-foreground uppercase tracking-widest leading-relaxed">
              Shipping & taxes calculated at checkout.<br/>Secure encrypted payment.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CartPage