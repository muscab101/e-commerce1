"use client"

import React, { Suspense } from 'react'
import { loadStripe } from '@stripe/stripe-js'
import { Elements } from '@stripe/react-stripe-js'
import { useSearchParams } from 'next/navigation'
import { useCartStore } from '@/app/store/useCartStore'
import CheckoutForm from '@/components/CheckoutForm'

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

function PaymentContent() {
  const searchParams = useSearchParams()
  const clientSecret = searchParams.get('intent')
  const { totalPrice } = useCartStore()

  // Xogta macmiilka (Tusaale ahaan - ka soo qaad Store haddii aad haysato)
  const customerData = {
    firstName: "Customer",
    lastName: "User",
    email: "customer@example.com",
    address: "Main Street 123",
    city: "Mogadishu",
    postcode: "252"
  }

  if (!clientSecret) {
    return (
      <div className="h-screen flex items-center justify-center bg-background">
        <p className="font-black uppercase tracking-[0.3em] text-[10px]">Invalid Session</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background pt-24 pb-20 px-6 font-sans">
      <div className="max-w-xl mx-auto">
        
        {/* Header - Beatrice Deck Trial Style */}
        <header className="mb-16">
          <p className="text-[10px] tracking-[0.3em] text-muted-foreground mb-4 uppercase font-bold">Checkout / Payment</p>
          <h1 className="text-6xl font-black tracking-tighter leading-[0.9] italic uppercase font-[Beatrice_Deck_Trial]">
            Secure <br /> Checkout
          </h1>
        </header>

        {/* Stripe Elements Container */}
        <div className="border-t-2 border-foreground pt-10">
          <Elements 
            stripe={stripePromise} 
            options={{ 
                clientSecret,
                appearance: {
                    theme: 'none',
                    variables: {
                        fontFamily: 'Inter, sans-serif',
                        borderRadius: '0px',
                        colorPrimary: '#000000',
                    },
                    rules: {
                      '.Input': {
                        border: '1px solid #e5e7eb',
                        padding: '16px',
                        fontSize: '12px',
                        textTransform: 'uppercase',
                        borderRadius: '0px',
                        backgroundColor: '#ffffff'
                      },
                      '.Label': {
                        fontSize: '10px',
                        fontWeight: '700',
                        textTransform: 'uppercase',
                        letterSpacing: '0.1em',
                        marginBottom: '8px',
                      }
                    }
                }
            }}
          >
            <CheckoutForm 
              totalPrice={totalPrice || 0} 
              customerData={customerData} 
            />
          </Elements>
        </div>

        {/* Footer info */}
        <div className="mt-12 pt-8 border-t border-border">
          <p className="text-[9px] text-muted-foreground uppercase tracking-[0.2em] leading-relaxed">
            All transactions are encrypted and secure. <br />
            Powered by Stripe Technology.
          </p>
        </div>
      </div>
    </div>
  )
}

export default function PaymentPage() {
  return (
    <Suspense fallback={
      <div className="h-screen flex items-center justify-center bg-background">
        <div className="animate-pulse font-black uppercase tracking-widest text-[10px]">INITIALIZING SECURE VAULT...</div>
      </div>
    }>
      <PaymentContent />
    </Suspense>
  )
}