"use client"

import React, { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { db, auth } from '@/lib/firebase'
import { doc, onSnapshot, updateDoc } from 'firebase/firestore'
import { ArrowLeft, Check, Loader2, MapPin, CreditCard } from 'lucide-react'

export default function OrderTrackingPage() {
  const { id } = useParams()
  const router = useRouter()
  const [order, setOrder] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [isAdmin, setIsAdmin] = useState(false)

  useEffect(() => {
    if (!id) return;

    const user = auth.currentUser;
    if (user?.email === "muscabmusa27@gmail.com") {
      setIsAdmin(true)
    }

    const docRef = doc(db, "orders", id as string)
    const unsubscribe = onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        const calculatedTotal = data.items?.reduce((acc: number, item: any) => 
          acc + (item.price * (item.quantity || 1)), 0
        ) || 0;
        setOrder({ id: docSnap.id, ...data, displayTotal: calculatedTotal })
      }
      setLoading(false)
    })

    return () => unsubscribe()
  }, [id])

  const updateStatus = async (newStatus: string) => {
    const docRef = doc(db, "orders", id as string)
    await updateDoc(docRef, { status: newStatus })
  }

  if (loading) return (
    <div className="h-screen flex items-center justify-center bg-background">
      <Loader2 className="animate-spin text-primary" size={24} strokeWidth={1.5} />
    </div>
  )

  if (!order) return <div className="h-screen flex items-center justify-center font-serif italic text-muted-foreground">Order not found.</div>

  const statusSteps = ['pending', 'preparing', 'shipped', 'delivered']
  const currentStep = statusSteps.indexOf(order.status?.toLowerCase() || 'pending')

  return (
    <div className="min-h-screen bg-background pt-32 pb-20 px-6 font-sans text-foreground">
      <div className="max-w-5xl mx-auto space-y-16">
        
        {/* Back Button */}
        <button onClick={() => router.back()} className="group flex items-center gap-3 text-[10px] tracking-widest text-muted-foreground hover:text-primary transition-colors">
          <ArrowLeft size={14} strokeWidth={1} />
          BACK TO ORDERS
        </button>

        {/* Admin Section - Using Primary Color */}
        {isAdmin && (
          <div className="bg-muted/30 border border-border p-6 rounded-md space-y-4">
            <p className="text-[10px] font-semibold tracking-widest text-muted-foreground">ADMIN CONTROL</p>
            <div className="flex flex-wrap gap-2">
              {statusSteps.map((s) => (
                <button 
                  key={s}
                  onClick={() => updateStatus(s)}
                  className={`px-4 py-1.5 text-[10px] font-semibold rounded-md border transition-all ${order.status === s ? 'bg-primary text-primary-foreground border-primary' : 'bg-background border-border text-muted-foreground hover:border-primary/50'}`}
                >
                  {s.toUpperCase()}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="grid lg:grid-cols-3 gap-16">
          <div className="lg:col-span-2 space-y-20">
            <header className="space-y-4">
              <h1 className="text-5xl font-serif italic tracking-tighter text-foreground">Track shipment</h1>
              <p className="text-[11px] text-muted-foreground">Order ID: <span className="text-foreground font-semibold italic">#{order.id.slice(-10)}</span></p>
            </header>

            {/* Tracker using Primary Color */}
            <div className="relative pt-10">
              <div className="absolute top-0 left-0 w-full h-[1px] bg-border">
                <div 
                  className="h-full bg-primary transition-all duration-1000 ease-in-out shadow-[0_0_8px_var(--primary)]" 
                  style={{ width: `${(currentStep / (statusSteps.length - 1)) * 100}%` }}
                />
              </div>
              <div className="flex justify-between -mt-[11px]">
                {statusSteps.map((step, index) => (
                  <div key={step} className="flex flex-col items-center">
                    <div className={`size-5 rounded-full flex items-center justify-center border-2 border-background transition-all duration-500 ${index <= currentStep ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>
                      {index <= currentStep && <Check size={10} strokeWidth={3} />}
                    </div>
                    <p className={`text-[9px] mt-6 tracking-widest font-semibold ${index <= currentStep ? 'text-primary' : 'text-muted-foreground'}`}>
                      {step.toUpperCase()}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Content List */}
            <div className="pt-16 border-t border-border space-y-8">
              <h3 className="text-xs font-semibold italic tracking-tight text-foreground">Shipment details</h3>
              <div className="grid gap-8">
                {order.items?.map((item: any, i: number) => (
                  <div key={i} className="flex gap-6 group">
                    <div className="w-20 h-24 bg-muted/20 overflow-hidden rounded-sm border border-border/50">
                      <img src={item.image} className="w-full h-full object-cover grayscale-[0.5] group-hover:grayscale-0 transition-all duration-500" alt="" />
                    </div>
                    <div className="flex flex-col justify-center space-y-1">
                      <p className="text-sm font-semibold text-foreground">{item.name}</p>
                      <p className="text-[10px] text-muted-foreground">Size: <span className="font-semibold text-foreground italic">{item.selectedSize}</span></p>
                      <p className="text-[10px] text-muted-foreground font-medium">${item.price} × {item.quantity}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar using Card/Muted variables */}
          <div className="space-y-10">
            <div className="border border-border p-8 space-y-10 bg-card">
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-primary">
                  <MapPin size={14} strokeWidth={1.5} />
                  <h4 className="text-[10px] font-semibold tracking-widest">DESTINATION</h4>
                </div>
                <div className="text-[11px] leading-relaxed text-muted-foreground font-medium">
                  <p className="font-semibold text-foreground mb-1">{order.customer?.firstName} {order.customer?.lastName}</p>
                  <p>{order.customer?.address}</p>
                  <p>{order.customer?.city}, {order.customer?.country}</p>
                </div>
              </div>

              <div className="space-y-4 pt-8 border-t border-border">
                <div className="flex items-center gap-2 text-primary">
                  <CreditCard size={14} strokeWidth={1.5} />
                  <h4 className="text-[10px] font-semibold tracking-widest">PAYMENT SUMMARY</h4>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-[11px]">
                    <span className="text-muted-foreground font-medium">Subtotal</span>
                    <span className="font-semibold text-foreground">${order.displayTotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-2xl font-semibold italic pt-4 text-primary">
                    <span className="font-serif">Total</span>
                    <span>${order.displayTotal.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 border border-primary/20 bg-primary/5 rounded-sm">
               <p className="text-[9px] font-medium leading-relaxed text-muted-foreground italic">
                 "All items in this shipment are handled with care from our archive to your door."
               </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}