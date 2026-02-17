"use client"

import { useEffect, Suspense } from 'react'
import { useCartStore } from '@/app/store/useCartStore'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Check, Package, ArrowRight } from 'lucide-react'

function SuccessContent() {
  const { clearCart } = useCartStore()
  const searchParams = useSearchParams()
  const orderId = searchParams.get('orderId')

  useEffect(() => {
    // Hubinta ugu dambaysa ee dambiisha
    clearCart()
  }, [clearCart])

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-6">
      <div className="max-w-2xl w-full text-center space-y-12">
        
        {/* Animated Check Icon */}
        <div className="relative mx-auto size-24 bg-black rounded-full flex items-center justify-center text-white shadow-2xl">
          <Check size={40} strokeWidth={3} />
          <div className="absolute inset-0 rounded-full border border-black animate-ping opacity-20"></div>
        </div>

        {/* Text Section */}
        <div className="space-y-4">
          <h1 className="text-6xl md:text-8xl font-black tracking-tighter italic uppercase font-[Beatrice_Deck_Trial]">
            Confirmed
          </h1>
          <p className="text-[11px] font-bold uppercase tracking-[0.4em] text-muted-foreground">
            Thank you for your purchase. Your order is being processed.
          </p>
        </div>

        {/* Order ID Box */}
        {orderId && (
          <div className="bg-white border border-border p-6 inline-block">
            <p className="text-[10px] text-gray-400 uppercase font-bold tracking-widest mb-1">Order Reference</p>
            <p className="text-sm font-black tracking-widest uppercase">#{orderId.slice(-8).toUpperCase()}</p>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex flex-col md:flex-row items-center justify-center gap-6 pt-8">
          <Link 
            href="/orders" 
            className="flex items-center gap-3 bg-black text-white px-10 py-5 text-[10px] font-black uppercase tracking-[0.2em] hover:bg-zinc-800 transition-all w-full md:w-auto"
          >
            <Package size={16} />
            Track My Order
          </Link>
          
          <Link 
            href="/products" 
            className="flex items-center gap-3 border border-black px-10 py-5 text-[10px] font-black uppercase tracking-[0.2em] hover:bg-black hover:text-white transition-all w-full md:w-auto"
          >
            Continue Shopping
            <ArrowRight size={16} />
          </Link>
        </div>

        {/* Support Info */}
        <p className="text-[9px] text-gray-400 uppercase tracking-[0.2em] pt-12">
          A confirmation email has been sent to your address. <br />
          Need help? <span className="text-black underline cursor-pointer">Contact Support</span>
        </p>
      </div>
    </div>
  )
}

// Suspense wrapper is required when using useSearchParams
export default function SuccessPage() {
  return (
    <Suspense fallback={
      <div className="h-screen flex items-center justify-center bg-background">
        <p className="font-black uppercase tracking-widest text-[10px] animate-pulse">Confirming Transaction...</p>
      </div>
    }>
      <SuccessContent />
    </Suspense>
  )
}