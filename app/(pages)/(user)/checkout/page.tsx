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
      // 1. SAVE TO FIREBASE
      const orderPayload = {
        customer: formData,
        items: cart,
        total: subtotal,
        paymentStatus: "awaiting_payment",
        status: "pending",
        createdAt: serverTimestamp()
      }
      const docRef = await addDoc(collection(db, "orders"), orderPayload)

      // 2. CALL STRIPE API
      const response = await fetch("/api/create-payment-intent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: subtotal }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error);

      // 3. REDIRECT TO PAYMENT
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
      <div className="max-w-7xl mx-auto px-6 py-12">
        <button onClick={() => router.back()} className="mb-8 p-2 hover:bg-muted border border-border rounded-full transition-colors">
          <ArrowLeft size={20} />
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          {/* LEFT: FORM FIELDS */}
          <form onSubmit={handleConfirmOrder} className="lg:col-span-7 space-y-10">
            <header className="space-y-4">
              <h1 className="text-5xl font-bold uppercase tracking-tighter italic font-[Beatrice_Deck_Trial]">Checkout</h1>
              <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Information → Shipping → Payment</p>
            </header>

            <div className="grid gap-10">
              {/* Contact Section */}
              <section className="space-y-4">
                <h2 className="text-[11px] font-black uppercase tracking-[0.2em] text-primary">Contact Info</h2>
                <div className="grid md:grid-cols-2 gap-4">
                  <input name="email" type="email" required onChange={handleInputChange} placeholder="Email Address" className="w-full bg-card border border-input p-4 text-sm focus:border-primary outline-none transition-all" />
                  <input name="phone" type="tel" required onChange={handleInputChange} placeholder="Phone Number" className="w-full bg-card border border-input p-4 text-sm focus:border-primary outline-none transition-all" />
                </div>
              </section>

              {/* Shipping Section */}
              <section className="space-y-4">
                <h2 className="text-[11px] font-black uppercase tracking-[0.2em] text-primary">Shipping Details</h2>
                <div className="grid gap-4">
                  <div className="grid grid-cols-2 gap-4">
                    <input name="firstName" required onChange={handleInputChange} placeholder="First Name" className="bg-card border border-input p-4 text-sm focus:border-primary outline-none" />
                    <input name="lastName" required onChange={handleInputChange} placeholder="Last Name" className="bg-card border border-input p-4 text-sm focus:border-primary outline-none" />
                  </div>
                  <input name="address" required onChange={handleInputChange} placeholder="Full Address (Street, House No.)" className="w-full bg-card border border-input p-4 text-sm focus:border-primary outline-none" />
                  <div className="grid grid-cols-2 gap-4">
                    <input name="postcode" required onChange={handleInputChange} placeholder="Postcode / ZIP" className="bg-card border border-input p-4 text-sm focus:border-primary outline-none" />
                    <input name="city" required onChange={handleInputChange} placeholder="City" className="bg-card border border-input p-4 text-sm focus:border-primary outline-none" />
                  </div>
                </div>
              </section>

              <button 
                type="submit" 
                disabled={loading}
                className="w-full md:w-80 bg-primary text-primary-foreground font-bold uppercase text-xs tracking-[0.2em] py-6 flex items-center justify-between px-8 hover:brightness-110 transition-all disabled:opacity-50"
              >
                {loading ? "Processing..." : "Proceed to Payment"}
                {loading ? <Loader2 className="animate-spin" size={18} /> : <CreditCard size={18} />}
              </button>
            </div>
          </form>

          {/* RIGHT: SUMMARY SIDEBAR WITH IMAGES */}
          <div className="lg:col-span-5">
            <div className="bg-card border border-border p-8 sticky top-10 shadow-sm rounded-sm">
              <h2 className="font-bold uppercase text-xs tracking-widest mb-6 pb-4 border-b">Order Summary</h2>
              
              <div className="space-y-6 mb-8 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                {cart.map((item) => (
                  <div key={item.id} className="flex gap-4 items-center">
                    {/* Product Image */}
                    <div className="w-20 h-20 bg-muted border border-border rounded-sm overflow-hidden flex-shrink-0">
                      <img 
                        src={item.image} 
                        alt={item.name} 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    
                    {/* Product Details */}
                    <div className="flex-1">
                      <h3 className="text-xs font-bold uppercase tracking-tight leading-tight">{item.name}</h3>
                      <p className="text-[10px] text-muted-foreground uppercase font-bold mt-1">
                        Qty: {item.quantity}
                      </p>
                      <p className="text-xs font-black mt-1">${(item.price * item.quantity).toFixed(2)}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t border-border pt-6 space-y-2">
                <div className="flex justify-between items-center text-[10px] font-bold uppercase text-muted-foreground">
                  <span>Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center pt-4">
                  <span className="font-bold uppercase text-sm">Total</span>
                  <span className="text-3xl font-black tracking-tighter">${subtotal.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CheckoutPage