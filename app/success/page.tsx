"use client"

import { useEffect, Suspense } from 'react'
import { useCartStore } from '@/app/store/useCartStore'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Check, Package, ArrowRight, Mail } from 'lucide-react'

function SuccessContent() {
  const { clearCart } = useCartStore()
  const searchParams = useSearchParams()
  const orderId = searchParams.get('orderId')

  useEffect(() => {
    // Nadiifinta dambiisha marka lacag bixintu guulaysato
    clearCart()
  }, [clearCart])

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-6 font-sans">
      <div className="max-w-2xl w-full text-center space-y-16">
        
        {/* Animated Check Icon */}
        <div className="relative mx-auto size-20 bg-foreground rounded-full flex items-center justify-center text-background shadow-xl">
          <Check size={32} strokeWidth={2.5} />
          <div className="absolute inset-0 rounded-full border border-foreground animate-ping opacity-20"></div>
        </div>

        {/* Text Section */}
        <div className="space-y-6">
          <h1 className="text-7xl md:text-8xl font-semibold tracking-tighter leading-none text-foreground font-[Beatrice_Deck_Trial]">
            Confirmed.
          </h1>
          <div className="space-y-2">
            <p className="text-sm font-semibold text-foreground">
              Thank you for your purchase.
            </p>
            <p className="text-xs font-medium text-muted-foreground tracking-tight max-w-sm mx-auto">
              Your order has been received and is currently being processed by our logistics team.
            </p>
          </div>
        </div>

        {/* Order Details Card */}
        {orderId && (
          <div className="bg-muted/30 backdrop-blur-sm border border-border p-8 rounded-2xl inline-block min-w-[300px] text-left">
            <div className="flex justify-between items-center mb-4">
              <p className="text-[11px] text-muted-foreground font-semibold uppercase tracking-wider">Order Reference</p>
              <Package size={14} className="text-muted-foreground" />
            </div>
            <p className="text-xl font-semibold tracking-tight text-foreground">
              #{orderId.slice(-8).toUpperCase()}
            </p>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <Link 
            href="/orders" 
            className="flex items-center justify-center gap-3 bg-foreground text-background px-10 py-3 text-xs font-semibold rounded-sm hover:opacity-90 transition-all w-full sm:w-auto shadow-sm shadow-black/5"
          >
            Track My Order
          </Link>
          
          <Link 
            href="/products" 
            className="flex items-center justify-center gap-3 border border-border bg-background text-foreground px-10 py-3 text-xs font-semibold rounded-sm hover:bg-muted transition-all w-full sm:w-auto"
          >
            Continue Shopping
            <ArrowRight size={16} />
          </Link>
        </div>

        {/* Support Info */}
        <div className="pt-12 space-y-4 border-t border-border/50 max-w-xs mx-auto">
          <div className="flex items-center justify-center gap-2 text-muted-foreground">
            <Mail size={14} />
            <p className="text-[11px] font-medium tracking-tight">
              A confirmation email is on its way.
            </p>
          </div>
          <p className="text-[10px] text-muted-foreground font-medium italic">
            Need assistance? <span className="text-foreground underline font-semibold cursor-pointer not-italic">Contact our concierge</span>
          </p>
        </div>
      </div>
    </div>
  )
}

export default function SuccessPage() {
  return (
    <Suspense fallback={
      <div className="h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="font-semibold text-[11px] tracking-widest text-muted-foreground uppercase">Finalizing Order...</p>
        </div>
      </div>
    }>
      <SuccessContent />
    </Suspense>
  )
}