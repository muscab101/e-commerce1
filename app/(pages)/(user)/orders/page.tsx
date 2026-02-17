"use client"

import React, { useEffect, useState } from 'react'
import { db, auth } from '@/lib/firebase'
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore'
import { onAuthStateChanged } from 'firebase/auth'
import { Loader2, Package, AlertCircle, ChevronRight, Clock, ShoppingBag } from 'lucide-react'
import Link from 'next/link'

export default function OrdersPage() {
  const [orders, setOrders] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        fetchOrders(user.email!.toLowerCase())
      } else {
        setLoading(false)
        setError("Please sign in to view your order history.")
      }
    })
    return () => unsubscribe()
  }, [])

  const fetchOrders = async (email: string) => {
    try {
      const q = query(
        collection(db, "orders"),
        where("customer.email", "==", email),
        orderBy("createdAt", "desc")
      )
      
      const querySnapshot = await getDocs(q)
      const ordersData = querySnapshot.docs.map(doc => {
        const data = doc.data();
        const calculatedTotal = data.items?.reduce((acc: number, item: any) => 
          acc + (item.price * (item.quantity || 1)), 0
        ) || 0;

        return { 
          id: doc.id, 
          ...data,
          displayTotal: calculatedTotal 
        }
      })
      
      setOrders(ordersData)
    } catch (err: any) {
      console.error("Firebase Error:", err)
      if (err.message.includes("index")) {
        setError("Database is optimizing. Please refresh in a moment.")
      } else {
        setError("Unable to load order history at this time.")
      }
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="h-screen flex flex-col items-center justify-center gap-6 bg-background">
        <div className="relative">
           <div className="w-10 h-10 border-2 border-primary/20 border-t-primary rounded-full animate-spin" />
        </div>
        <p className="text-[11px] font-semibold tracking-widest text-muted-foreground uppercase">Accessing Archives</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background pt-32 pb-20 px-6 font-sans">
      <div className="max-w-5xl mx-auto space-y-16">
        
        {/* Header Section */}
        <header className="space-y-4 text-left">
            <p className="text-[11px] font-semibold tracking-[0.2em] text-primary uppercase">Account</p>
            <h1 className="text-5xl md:text-7xl font-semibold tracking-tighter leading-none text-foreground font-[Beatrice_Deck_Trial]">
                Order History
            </h1>
        </header>

        {error && (
          <div className="border border-border p-6 rounded-2xl text-muted-foreground flex items-center gap-4 bg-muted/20 backdrop-blur-sm">
            <AlertCircle size={18} className="text-primary" />
            <p className="text-sm font-medium tracking-tight">{error}</p>
          </div>
        )}

        {/* Orders List */}
        <div className="grid gap-0">
          {orders.length > 0 ? (
            <div className="border-t border-border">
              {orders.map((order) => (
                <Link 
                  key={order.id} 
                  href={`/orders/${order.id}`}
                  className="group flex flex-col md:flex-row justify-between items-start md:items-center py-10 border-b border-border/60 hover:bg-muted/30 transition-all px-4 rounded-xl md:rounded-none"
                >
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                        <span className="text-[10px] font-bold px-3 py-1 rounded-full bg-foreground text-background tracking-wide">
                            {order.status || 'Processing'}
                        </span>
                        <h3 className="text-base font-semibold tracking-tight text-foreground">
                            Order #{order.id.slice(-8).toUpperCase()}
                        </h3>
                    </div>
                    
                    <div className="flex items-center gap-6 text-muted-foreground text-xs font-medium">
                        <p className="flex items-center gap-2">
                            <Clock size={14} />
                            {order.createdAt?.toDate().toLocaleDateString('en-GB', { 
                              day: '2-digit', 
                              month: 'long', 
                              year: 'numeric' 
                            })}
                        </p>
                        <p className="flex items-center gap-2">
                            <ShoppingBag size={14} />
                            {order.items?.length || 0} Items
                        </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between w-full md:w-auto md:gap-12 mt-6 md:mt-0">
                    <p className="text-3xl font-semibold tracking-tighter text-foreground">
                        ${order.displayTotal.toFixed(2)}
                    </p>
                    <div className="hidden md:flex p-3 border border-border rounded-full group-hover:bg-foreground group-hover:text-background transition-all duration-500">
                        <ChevronRight size={20} />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : !error && (
            <div className="py-32 text-center border-2 border-dashed border-border rounded-3xl flex flex-col items-center gap-6 bg-muted/5">
              <div className="p-5 bg-muted rounded-full">
                <Package size={40} strokeWidth={1.5} className="text-muted-foreground" />
              </div>
              <div className="space-y-2">
                <p className="text-sm font-semibold text-foreground">No purchase history found</p>
                <p className="text-xs text-muted-foreground max-w-[250px] mx-auto leading-relaxed">
                  You haven't placed any orders yet. Explore our latest collection to get started.
                </p>
              </div>
              <Link 
                href="/products" 
                className="mt-2 inline-flex items-center gap-2 bg-foreground text-background px-8 py-4 rounded-full text-xs font-semibold hover:opacity-90 transition-all"
              >
                Start Shopping
                <ArrowRight size={14} />
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// Icon-ka loo baahan yahay dhamaadka
function ArrowRight({ size, className }: { size: number, className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M5 12h14M12 5l7 7-7 7"/></svg>
  )
}