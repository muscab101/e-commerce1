"use client"

import React, { useState, useEffect } from 'react'
import { ChevronRight, ArrowLeft, Loader2, CreditCard } from 'lucide-react'
import { useCartStore } from '@/app/store/useCartStore'
import { useRouter } from 'next/navigation'
import { db } from '@/lib/firebase'
import { collection, addDoc, serverTimestamp } from 'firebase/firestore'
import { toast } from 'sonner'
import { loadStripe } from '@stripe/stripe-js'

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

const CheckoutPage = () => {
  const { cart, clearCart } = useCartStore()
  const [mounted, setMounted] = useState(false)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const [formData, setFormData] = useState({
    email: '',
    phone: '',
    firstName: '',
    lastName: '',
    address: '',
    postcode: '',
    city: '',
    country: 'Somalia',
  })

  useEffect(() => { setMounted(true) }, [])

  const subtotal = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleConfirmOrder = async (e: React.FormEvent) => {
    e.preventDefault()
    if (cart.length === 0) return toast.error("Your cart is empty!")
    
    setLoading(true)

    try {
      const orderPayload = {
        customer: formData,
        items: cart,
        total: subtotal,
        paymentStatus: "awaiting_payment",
        status: "pending",
        createdAt: serverTimestamp()
      }
      const docRef = await addDoc(collection(db, "orders"), orderPayload)

      const response = await fetch("/api/create-payment-intent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: subtotal }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error);

      router.push(`/payment?intent=${data.clientSecret}&orderId=${docRef.id}`);

    } catch (error: any) {
      console.error(error)
      toast.error("Checkout failed: " + error.message)
    } finally {
      setLoading(false)
    }
  }

  if (!mounted) return null

  return (
    <div className="min-h-screen bg-background text-foreground font-sans">
      <div className="max-w-7xl mx-auto px-6 py-16">
        {/* Back Button */}
        <button 
          onClick={() => router.back()} 
          className="mb-12 flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors group"
        >
          <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
          Back to Bag
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          {/* LEFT: FORM FIELDS */}
          <form onSubmit={handleConfirmOrder} className="lg:col-span-7 space-y-12 text-left">
            <header className="space-y-4">
              <h1 className="text-6xl font-semibold tracking-tighter text-foreground font-[Beatrice_Deck_Trial]">
                Checkout
              </h1>
              <p className="text-xs font-semibold text-muted-foreground flex items-center gap-2">
                Information <ChevronRight size={12} /> Shipping <ChevronRight size={12} /> Payment
              </p>
            </header>

            <div className="space-y-12">
              {/* Contact Section */}
              <section className="space-y-6">
                <h2 className="text-sm font-semibold text-foreground border-b border-border pb-2">Contact Information</h2>
                <div className="grid md:grid-cols-2 gap-4">
                  <input name="email" type="email" required onChange={handleInputChange} placeholder="Email Address" className="w-full bg-background border border-border p-4 text-sm font-medium focus:border-foreground outline-none transition-all rounded-md" />
                  <input name="phone" type="tel" required onChange={handleInputChange} placeholder="Phone Number" className="w-full bg-background border border-border p-4 text-sm font-medium focus:border-foreground outline-none transition-all rounded-md" />
                </div>
              </section>

              {/* Shipping Section */}
              <section className="space-y-6">
                <h2 className="text-sm font-semibold text-foreground border-b border-border pb-2">Shipping Details</h2>
                <div className="grid gap-4">
                  <div className="grid grid-cols-2 gap-4">
                    <input name="firstName" required onChange={handleInputChange} placeholder="First Name" className="bg-background border border-border p-4 text-sm font-medium focus:border-foreground outline-none rounded-md" />
                    <input name="lastName" required onChange={handleInputChange} placeholder="Last Name" className="bg-background border border-border p-4 text-sm font-medium focus:border-foreground outline-none rounded-md" />
                  </div>
                  <input name="address" required onChange={handleInputChange} placeholder="Full Address" className="w-full bg-background border border-border p-4 text-sm font-medium focus:border-foreground outline-none rounded-md" />
                  <div className="grid grid-cols-2 gap-4">
                    <input name="postcode" required onChange={handleInputChange} placeholder="Postcode" className="bg-background border border-border p-4 text-sm font-medium focus:border-foreground outline-none rounded-md" />
                    <input name="city" required onChange={handleInputChange} placeholder="City" className="bg-background border border-border p-4 text-sm font-medium focus:border-foreground outline-none rounded-md" />
                  </div>
                </div>
              </section>

              <button 
                type="submit" 
                disabled={loading}
                className="w-full md:w-auto min-w-[280px] bg-foreground text-background font-semibold text-sm py-3 px-10 rounded-sm flex items-center justify-between hover:opacity-90 transition-all disabled:opacity-50 shadow-sm shadow-black/5"
              >
                {loading ? "Processing..." : "Continue to Payment"}
                {loading ? <Loader2 className="animate-spin ml-4" size={20} /> : <CreditCard className="ml-4" size={20} />}
              </button>
            </div>
          </form>

          {/* RIGHT: SUMMARY SIDEBAR */}
          <div className="lg:col-span-5">
            <div className="bg-muted/30 backdrop-blur-xl border border-border p-10 sticky top-10 shadow-sm rounded-2xl text-left">
              <h2 className="font-semibold text-base mb-8 text-foreground">Order Summary</h2>
              
              <div className="space-y-6 mb-8 max-h-[400px] overflow-y-auto pr-4 custom-scrollbar">
                {cart.map((item) => (
                  <div key={`${item.id}-${item.selectedSize}`} className="flex gap-5 items-center">
                    <div className="w-20 h-24 bg-muted border border-border rounded-lg overflow-hidden flex-shrink-0">
                      <img 
                        src={item.image} 
                        alt={item.name} 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    
                    <div className="flex-1 space-y-1">
                      <h3 className="text-sm font-semibold text-foreground leading-tight">{item.name}</h3>
                      <p className="text-[11px] text-muted-foreground font-medium">
                        {item.selectedSize} / {item.selectedColor} — Qty {item.quantity}
                      </p>
                      <p className="text-sm font-semibold mt-1">${(item.price * item.quantity).toFixed(2)}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t border-border pt-6 space-y-4">
                <div className="flex justify-between items-center text-sm font-medium text-muted-foreground">
                  <span>Subtotal</span>
                  <span className="text-foreground">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center text-sm font-medium text-muted-foreground">
                  <span>Shipping</span>
                  <span className="text-primary font-semibold">Complimentary</span>
                </div>
                <div className="flex justify-between items-center pt-4 border-t border-border/50">
                  <span className="font-semibold text-base">Total Due</span>
                  <span className="text-4xl font-semibold tracking-tighter text-foreground">${subtotal.toFixed(2)}</span>
                </div>
              </div>
              
              <p className="mt-8 text-[10px] text-muted-foreground leading-relaxed">
                By clicking "Continue to Payment", you agree to our Terms of Service. Your data is protected.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CheckoutPage