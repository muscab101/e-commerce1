"use client"

import React, { useState } from 'react'
import { PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js'
import { db, auth } from '@/lib/firebase'
import { collection, addDoc, serverTimestamp } from 'firebase/firestore'
import { useCartStore } from '@/app/store/useCartStore'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { Loader2 } from 'lucide-react'

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
}

export default function CheckoutForm({ totalPrice, customerData }: CheckoutFormProps) {
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
      // 1. Stripe Payment
      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        redirect: 'if_required',
      })

      if (error) {
        toast.error(error.message)
        setLoading(false)
        return
      }

      // 2. Haddii lacagtu dhacdo, u dir Firebase
      if (paymentIntent && paymentIntent.status === 'succeeded') {
        await addDoc(collection(db, "orders"), {
          userId: auth.currentUser?.uid || "guest",
          customer: customerData,
          items: cart.map(item => ({
            id: item.id,
            name: item.name,
            price: item.price,
            quantity: item.quantity,
            image: item.image,
            size: item.selectedSize || null
          })),
          total: totalPrice,
          status: "pending",
          paymentId: paymentIntent.id,
          createdAt: serverTimestamp(),
        })

        // 3. Nadiifi Store-ka & u weeci Success
        clearCart()
        toast.success("PAYMENT SUCCESSFUL")
        router.push('/success')
      }
    } catch (err) {
      console.error(err)
      toast.error("DATABASE_ERROR: COULD NOT SAVE ORDER")
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="bg-white p-4 border border-border">
        <PaymentElement />
      </div>
      
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
    </form>
  )
}