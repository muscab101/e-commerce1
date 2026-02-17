"use client"

import React, { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { db, auth } from '@/lib/firebase'
import { doc, onSnapshot, updateDoc } from 'firebase/firestore'
import { ArrowLeft, Check, Loader2, MapPin, CreditCard, Package, Truck, Home, Search } from 'lucide-react'

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
      <Loader2 className="animate-spin text-primary" size={24} />
    </div>
  )

  if (!order) return (
    <div className="h-screen flex items-center justify-center bg-background">
      <p className="font-semibold text-sm text-muted-foreground">Order not found.</p>
    </div>
  )

  const statusSteps = ['pending', 'preparing', 'shipped', 'delivered']
  const currentStep = statusSteps.indexOf(order.status?.toLowerCase() || 'pending')

  return (
    <div className="min-h-screen bg-background pt-32 pb-20 px-6 font-sans text-foreground">
      <div className="max-w-6xl mx-auto space-y-12">
        
        {/* Navigation */}
        <button 
          onClick={() => router.back()} 
          className="group flex items-center gap-2 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          Back to History
        </button>

        {/* Admin Control Panel */}
        {isAdmin && (
          <div className="bg-muted/40 backdrop-blur-sm border border-border p-8 rounded-2xl space-y-6 shadow-sm">
            <div className="flex items-center gap-2">
                <div className="size-2 bg-primary rounded-full animate-pulse" />
                <p className="text-[11px] font-bold tracking-widest text-foreground uppercase">Logistics Control</p>
            </div>
            <div className="flex flex-wrap gap-3">
              {statusSteps.map((s) => (
                <button 
                  key={s}
                  onClick={() => updateStatus(s)}
                  className={`px-6 py-2.5 text-[10px] font-bold rounded-full border transition-all ${order.status === s ? 'bg-foreground text-background border-foreground shadow-lg' : 'bg-background border-border text-muted-foreground hover:border-foreground hover:text-foreground'}`}
                >
                  {s.toUpperCase()}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="grid lg:grid-cols-12 gap-16">
          <div className="lg:col-span-8 space-y-20">
            {/* Order Header */}
            <header className="space-y-4">
              <h1 className="text-6xl md:text-7xl font-semibold tracking-tighter text-foreground font-[Beatrice_Deck_Trial]">
                Track Order
              </h1>
              <div className="flex items-center gap-3">
                <span className="text-xs font-semibold bg-muted px-3 py-1 rounded-md text-muted-foreground">
                    Ref: #{order.id.slice(-10).toUpperCase()}
                </span>
                <span className="text-xs font-semibold text-primary">
                    {order.status?.charAt(0).toUpperCase() + order.status?.slice(1)}
                </span>
              </div>
            </header>

            {/* Visual Status Tracker */}
            <div className="relative py-12 px-2">
              <div className="absolute top-[50%] left-0 w-full h-[2px] bg-muted -translate-y-[50%]">
                <div 
                  className="h-full bg-primary transition-all duration-1000 ease-in-out" 
                  style={{ width: `${(currentStep / (statusSteps.length - 1)) * 100}%` }}
                />
              </div>
              <div className="relative flex justify-between">
                {statusSteps.map((step, index) => {
                  const Icon = [Search, Package, Truck, Home][index];
                  return (
                    <div key={step} className="flex flex-col items-center gap-4">
                      <div className={`size-12 rounded-full flex items-center justify-center border-4 border-background transition-all duration-700 z-10 ${index <= currentStep ? 'bg-primary text-background' : 'bg-muted text-muted-foreground'}`}>
                        {index < currentStep ? <Check size={18} strokeWidth={3} /> : <Icon size={18} strokeWidth={2.5} />}
                      </div>
                      <p className={`text-[10px] font-bold tracking-widest uppercase ${index <= currentStep ? 'text-foreground' : 'text-muted-foreground'}`}>
                        {step}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Shipment Items */}
            <div className="pt-16 border-t border-border space-y-10">
              <h3 className="text-sm font-semibold tracking-tight text-foreground uppercase tracking-widest">Shipment Contents</h3>
              <div className="grid gap-10">
                {order.items?.map((item: any, i: number) => (
                  <div key={i} className="flex gap-8 items-center group">
                    <div className="w-24 h-32 bg-muted border border-border rounded-xl overflow-hidden flex-shrink-0">
                      <img src={item.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt="" />
                    </div>
                    <div className="flex-1 space-y-2">
                      <h4 className="text-base font-semibold text-foreground tracking-tight">{item.name}</h4>
                      <div className="flex items-center gap-4 text-xs font-medium text-muted-foreground">
                        <p>Size: <span className="text-foreground">{item.selectedSize}</span></p>
                        <p>Quantity: <span className="text-foreground">{item.quantity}</span></p>
                      </div>
                      <p className="text-sm font-semibold text-foreground">${item.price.toFixed(2)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar Information */}
          <div className="lg:col-span-4 space-y-8">
            <div className="bg-card border border-border p-10 rounded-2xl space-y-12">
              {/* Delivery Address */}
              <div className="space-y-6">
                <div className="flex items-center gap-3 text-primary">
                  <MapPin size={18} />
                  <h4 className="text-xs font-bold tracking-widest uppercase">Shipping To</h4>
                </div>
                <div className="text-sm font-medium leading-relaxed text-muted-foreground space-y-1">
                  <p className="font-semibold text-foreground text-base mb-2">
                    {order.customer?.firstName} {order.customer?.lastName}
                  </p>
                  <p>{order.customer?.address}</p>
                  <p>{order.customer?.postcode}, {order.customer?.city}</p>
                  <p>{order.customer?.country}</p>
                </div>
              </div>

              {/* Payment Info */}
              <div className="space-y-6 pt-10 border-t border-border">
                <div className="flex items-center gap-3 text-primary">
                  <CreditCard size={18} />
                  <h4 className="text-xs font-bold tracking-widest uppercase">Summary</h4>
                </div>
                <div className="space-y-4">
                  <div className="flex justify-between text-sm font-medium">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span className="text-foreground">${order.displayTotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm font-medium">
                    <span className="text-muted-foreground">Shipping</span>
                    <span className="text-primary font-semibold italic">Complimentary</span>
                  </div>
                  <div className="flex justify-between pt-6 border-t border-border">
                    <span className="text-lg font-semibold">Total Paid</span>
                    <span className="text-3xl font-semibold tracking-tighter text-foreground">
                        ${order.displayTotal.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Assistance Note */}
            <div className="p-8 border border-border rounded-2xl bg-muted/20">
               <p className="text-[11px] font-medium leading-relaxed text-muted-foreground">
                 Questions about your shipment? <br />
                 Contact our concierge at <span className="text-foreground font-semibold underline">support@archives.com</span>
               </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}