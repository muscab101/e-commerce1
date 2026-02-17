"use client"

import React, { useState } from 'react'
import { PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js'
import { db, auth } from '@/lib/firebase'
import { doc, updateDoc, serverTimestamp } from 'firebase/firestore'
import { useCartStore } from '@/app/store/useCartStore'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { Loader2 } from 'lucide-react'

// Waxaan ku darnay 'orderId' interface-ka si TypeScript uusan u dhibsan
interface CheckoutFormProps {
  totalPrice: number;
  customerData: {
    firstName: string;
    lastName: string;
    email: string;
    address: string;
    city: string;
    postcode: string;
  };
  orderId: string; // <--- Tani waa muhiim si Build-ku u guuleysto
}

export default function CheckoutForm({ totalPrice, customerData, orderId }: CheckoutFormProps) {
  const stripe = useStripe()
  const elements = useElements()
  const router = useRouter()
  const { cart, clearCart } = useCartStore()
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!stripe || !elements) return
    setLoading(true)

    try {
      // 1. Stripe Payment Verification
      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        redirect: 'if_required',
      })

      if (error) {
        toast.error(error.message)
        setLoading(false)
        return
      }

      // 2. Haddii lacagtu dhacdo (Succeeded), u update-garee Order-ka Firebase ku jira
      if (paymentIntent && paymentIntent.status === 'succeeded') {
        const orderRef = doc(db, "orders", orderId);
        
        await updateDoc(orderRef, {
          paymentStatus: "paid", // Waxaan u beddelaynaa in la bixiyey
          status: "processing",  // Status-ka guud
          paymentId: paymentIntent.id,
          paidAt: serverTimestamp(),
          // Waxaan hubineynaa in userId-ga uu sax yahay xataa hadduu guest yahay
          userId: auth.currentUser?.uid || "guest",
        })

        // 3. Nadiifi Cart-ka & u weeci Success Page
        clearCart()
        toast.success("PAYMENT SUCCESSFUL")
        router.push('/success')
      }
    } catch (err) {
      console.error(err)
      toast.error("DATABASE_ERROR: COULD NOT UPDATE ORDER")
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Stripe Card Input UI */}
      <div className="bg-white p-4 border border-border rounded-md shadow-sm">
        <PaymentElement />
      </div>
      
      {/* Submit Button */}
      <button
        disabled={loading || !stripe}
        className="w-full bg-black text-white font-black uppercase text-[11px] tracking-[0.3em] py-6 flex items-center justify-center gap-3 hover:bg-zinc-900 transition-all disabled:opacity-20 disabled:cursor-not-allowed"
      >
        {loading ? (
          <Loader2 className="animate-spin" size={18} />
        ) : (
          `Complete Purchase — $${(totalPrice || 0).toFixed(2)}`
        )}
      </button>

      {/* Security Badge */}
      <p className="text-[10px] text-center text-muted-foreground uppercase tracking-widest opacity-60">
        Secure encrypted checkout provided by Stripe
      </p>
    </form>
  )
}