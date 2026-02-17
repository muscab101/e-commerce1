"use client"

import React, { Suspense, useEffect, useState } from 'react'
import { loadStripe, Appearance } from '@stripe/stripe-js'
import { Elements } from '@stripe/react-stripe-js'
import { useSearchParams } from 'next/navigation'
import { useCartStore } from '@/app/store/useCartStore'
import { db } from '@/lib/firebase'
import { doc, getDoc } from 'firebase/firestore'
import CheckoutForm from '@/components/CheckoutForm'
import { Loader2 } from 'lucide-react'

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

function PaymentContent() {
  const searchParams = useSearchParams()
  const clientSecret = searchParams.get('intent')
  const orderId = searchParams.get('orderId')
  const { totalPrice } = useCartStore()
  
  const [customerData, setCustomerData] = useState<any>(null)
  const [fetching, setFetching] = useState(true)

  useEffect(() => {
    const fetchOrder = async () => {
      if (!orderId) {
        setFetching(false)
        return
      }
      try {
        const orderDoc = await getDoc(doc(db, "orders", orderId as string))
        if (orderDoc.exists()) {
          setCustomerData(orderDoc.data().customer)
        }
      } catch (error) {
        console.error("Error fetching order:", error)
      } finally {
        setFetching(false)
      }
    }
    fetchOrder()
  }, [orderId])

  // --- HALKAN AYUU QALADKU KA JIRAY ---
  const appearance: Appearance = {
    theme: 'flat', // 'none' halkan kama shaqeynayo TypeScript darteed
    variables: {
      fontFamily: 'Inter, sans-serif',
      borderRadius: '12px',
      colorPrimary: 'oklch(0.6361 0.1162 259.7710)', 
      colorBackground: 'oklch(1.0000 0 0)',         
      colorText: 'oklch(0.3211 0 0)',               
      colorDanger: 'oklch(0.6322 0.1310 21.4751)',   
      spacingGridRow: '24px',
    },
    rules: {
      '.Input': {
        border: '1px solid oklch(0.9281 0.0042 271.3672)', 
        boxShadow: 'none',
        padding: '14px',
        backgroundColor: 'oklch(0.9848 0 0)', 
      },
      '.Input:focus': {
        border: '1px solid oklch(0.3211 0 0)',
        boxShadow: 'none',
      },
      '.Label': {
        fontSize: '13px',
        fontWeight: '600',
        color: 'oklch(0.3211 0 0)',
        marginBottom: '8px',
      }
    }
  }

  if (fetching) {
    return (
      <div className="h-screen flex items-center justify-center bg-background">
        <Loader2 className="animate-spin text-primary" size={24} />
      </div>
    )
  }

  if (!clientSecret || !customerData) {
    return (
      <div className="h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-4 px-6">
          <p className="font-semibold text-sm text-muted-foreground tracking-tighter">
            Invalid or expired session.
          </p>
          <button onClick={() => window.location.href = '/products'} className="text-xs font-semibold underline uppercase tracking-widest">
            Return to shop
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background pt-32 pb-20 px-6 font-sans text-foreground">
      <div className="max-w-xl mx-auto text-left">
        <header className="mb-12">
          <p className="text-[11px] font-bold text-primary mb-4 tracking-[0.2em] uppercase">
            Step 3: Secure Payment
          </p>
          <h1 className="text-5xl md:text-7xl font-semibold tracking-tighter leading-[0.9] text-foreground font-[Beatrice_Deck_Trial]">
            Finalize <br /> Payment
          </h1>
          <div className="mt-6 flex items-center gap-2 text-muted-foreground">
            <span className="text-sm font-medium">{customerData.email}</span>
            <span className="text-muted-foreground/30">•</span>
            <span className="text-sm font-bold text-foreground">${totalPrice} Due</span>
          </div>
        </header>

        <div className="border-t border-border pt-12">
          <Elements 
            stripe={stripePromise} 
            options={{ clientSecret, appearance }}
          >
            <CheckoutForm 
              totalPrice={totalPrice || 0} 
              customerData={customerData} 
              orderId={orderId as string}
            />
          </Elements>
        </div>

        <div className="mt-16 pt-8 border-t border-border/50">
          <div className="flex items-start gap-4 text-muted-foreground">
            <div className="p-2 bg-muted/50 rounded-lg shrink-0">
               <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-4 h-4 text-primary">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
               </svg>
            </div>
            <div>
              <p className="text-[11px] font-bold text-foreground mb-1 uppercase tracking-wider">Encrypted Transaction</p>
              <p className="text-[10px] font-medium leading-relaxed opacity-70">
                Your payment is processed securely by Stripe. We do not store your card details.
                All data is transmitted via a secure 256-bit SSL connection.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function PaymentPage() {
  return (
    <Suspense fallback={
      <div className="h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="font-semibold text-[11px] tracking-widest text-muted-foreground uppercase">Verifying Security...</p>
        </div>
      </div>
    }>
      <PaymentContent />
    </Suspense>
  )
}