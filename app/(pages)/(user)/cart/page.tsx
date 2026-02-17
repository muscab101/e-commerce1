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
      <div className="h-[70vh] flex flex-col items-center justify-center space-y-4 font-sans bg-background">
        <div className="size-20 bg-muted/50 backdrop-blur-sm rounded-full flex items-center justify-center border border-border">
            <ShoppingBag size={32} className="text-muted-foreground" />
        </div>
        <h2 className="text-xl font-semibold tracking-tight text-foreground">Your bag is empty</h2>
        <Link href="/products">
          <Button variant="outline" className="text-xs font-semibold px-8 border-border hover:bg-foreground hover:text-background transition-all">
            Return to Shop
          </Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto px-6 pt-32 pb-20 font-sans bg-background">
      <h1 className="text-4xl font-semibold mb-12 tracking-tighter text-foreground font-[Beatrice_Deck_Trial]">
        Shopping Bag <span className="text-muted-foreground text-2xl ml-2">({cart.length})</span>
      </h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
        {/* Cart Items List */}
        <div className="lg:col-span-8 space-y-10">
          {cart.map((item) => (
            <div key={`${item.id}-${item.selectedSize}`} className="flex flex-col md:flex-row gap-8 border-b pb-10 border-border/60">
              
              <div className="flex gap-4">
                {/* Thumbnails */}
                <div className="hidden md:flex flex-col gap-2">
                  {(item as any).allImages?.slice(0, 3).map((img: string, idx: number) => (
                    <div key={idx} className="size-12 bg-muted border border-border overflow-hidden rounded-sm">
                      <img src={img} alt="" className="w-full h-full object-cover opacity-40" />
                    </div>
                  ))}
                </div>

                {/* Main Image */}
                <div className="size-44 bg-muted overflow-hidden border border-border relative group rounded-sm shadow-sm">
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                </div>
              </div>
              
              {/* Product Info */}
              <div className="flex-1 flex flex-col justify-between text-left">
                <div className="flex justify-between items-start">
                  <div className="space-y-2">
                    <h3 className="font-semibold text-lg tracking-tight text-foreground">{item.name}</h3>
                    <div className="flex flex-wrap gap-x-3 gap-y-1">
                      <p className="text-[11px] font-medium text-muted-foreground bg-muted/50 px-2.5 py-1 rounded-sm border border-border/50">
                        Size: {item.selectedSize}
                      </p>
                      <p className="text-[11px] font-medium text-muted-foreground bg-muted/50 px-2.5 py-1 rounded-sm border border-border/50">
                        Color: {item.selectedColor}
                      </p>
                    </div>
                  </div>
                  <p className="font-semibold text-xl text-foreground">${item.price}</p>
                </div>

                <div className="flex justify-between items-center mt-8">
                  <div className="flex items-center border border-border rounded-md overflow-hidden bg-background/50 backdrop-blur-md shadow-sm">
                    <button 
                      onClick={() => updateQuantity(item.id, item.selectedSize, item.quantity - 1)} 
                      className="p-3 hover:bg-muted transition-colors text-muted-foreground hover:text-foreground border-r border-border"
                    >
                      <Minus size={14} />
                    </button>
                    <span className="w-12 text-center text-sm font-semibold text-foreground">{item.quantity}</span>
                    <button 
                      onClick={() => updateQuantity(item.id, item.selectedSize, item.quantity + 1)} 
                      className="p-3 hover:bg-muted transition-colors text-muted-foreground hover:text-foreground border-l border-border"
                    >
                      <Plus size={14} />
                    </button>
                  </div>

                  <button 
                    onClick={() => removeFromCart(item.id, item.selectedSize)} 
                    className="flex items-center gap-2 text-xs font-semibold text-muted-foreground hover:text-destructive transition-all group"
                  >
                    <Trash2 size={16} className="group-hover:rotate-12 transition-transform" />
                    <span>Remove</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-4">
          <div className="bg-muted/20 backdrop-blur-xl p-10 rounded-2xl border border-border sticky top-32 space-y-8 text-left shadow-2xl shadow-black/5">
            <h2 className="font-semibold text-lg tracking-tight text-foreground border-b border-border pb-4">Summary</h2>
            
            <div className="space-y-5">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground font-medium">Subtotal</span>
                <span className="font-semibold text-foreground">${totalPrice}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground font-medium">Shipping</span>
                <span className="text-primary font-semibold">Complimentary</span>
              </div>
            </div>

            <div className="pt-6 border-t border-border">
              <div className="flex justify-between items-center">
                <span className="font-semibold text-base text-foreground">Total</span>
                <span className="font-semibold text-3xl tracking-tighter text-foreground">${totalPrice}</span>
              </div>
            </div>

            <Link href="/checkout" className="block w-full">
              <Button className="w-full py-6 text-sm font-semibold rounded-sm bg-foreground text-background hover:opacity-90 transition-opacity shadow-sm">
                Proceed to Checkout
              </Button>
            </Link>
            
            <div className="space-y-2">
               <p className="text-[10px] text-center text-muted-foreground leading-relaxed">
                Taxes calculated at next step.<br/>Secure encrypted checkout.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CartPage