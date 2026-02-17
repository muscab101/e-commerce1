"use client"

import React, { useEffect, useState } from 'react'
import { db, auth } from '@/lib/firebase'
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore'
import { onAuthStateChanged } from 'firebase/auth'
import { Loader2, Package, AlertCircle, ChevronRight, Clock } from 'lucide-react'
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
        setError("Fadlan login soo samee si aad u aragto dalabaadkaaga.")
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
        setError("Habaynta xogta ayaa socota. Fadlan dib u soo laabo waxyar ka dib.")
      } else {
        setError("Wax baa khaldamay markii xogta la soo akhrinayay.")
      }
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="h-screen flex flex-col items-center justify-center gap-4 bg-background">
        <Loader2 className="animate-spin text-primary" size={30} strokeWidth={1} />
        <p className="italic text-[10px] tracking-widest text-muted-foreground font-light">Loading archives...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background pt-32 pb-20 px-6 font-sans font-light">
      <div className="max-w-4xl mx-auto space-y-16">
        
        <header className="space-y-2">
            <p className="text-[10px] tracking-[0.2em] text-muted-foreground font-medium">ACCOUNT / HISTORY</p>
            <h1 className="text-5xl md:text-6xl tracking-tighter leading-none italic font-serif text-foreground">
                My orders
            </h1>
        </header>

        {error && (
          <div className="border border-border p-6 text-muted-foreground flex items-center gap-4 bg-muted/20">
            <AlertCircle size={18} strokeWidth={1} />
            <p className="text-[11px] tracking-wide font-medium">{error}</p>
          </div>
        )}

        <div className="grid gap-0">
          {orders.length > 0 ? orders.map((order) => (
            <div key={order.id} className="group border-t border-border py-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 hover:bg-muted/30 transition-all px-2">
              <div className="space-y-3">
                <div className="flex items-center gap-4">
                    <span className="text-[9px] text-primary border border-primary/20 px-3 py-1 rounded-full font-semibold bg-primary/5 tracking-wider">
                        {order.status?.toUpperCase() || 'PROCESSING'}
                    </span>
                    <h3 className="text-sm tracking-tight text-foreground font-semibold italic">
                        Order #{order.id.slice(-8)}
                    </h3>
                </div>
                <div className="flex items-center gap-6 text-muted-foreground text-[10px] tracking-wide">
                    <p className="flex items-center gap-2">
                        <Clock size={12} strokeWidth={1} />
                        {order.createdAt?.toDate().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                    </p>
                    <p className="font-medium">{order.items?.length || 0} ITEMS</p>
                </div>
              </div>

              <div className="flex items-center justify-between w-full md:w-auto md:gap-12">
                <p className="text-2xl italic tracking-tighter text-foreground font-semibold">
                    ${order.displayTotal.toFixed(2)}
                </p>
                <Link href={`/orders/${order.id}`} className="p-3 border border-border rounded-full hover:border-primary hover:text-primary transition-all duration-300">
                    <ChevronRight size={18} strokeWidth={1} />
                </Link>
              </div>
            </div>
          )) : !error && (
            <div className="py-32 text-center border border-dashed border-border flex flex-col items-center gap-4 bg-muted/10">
              <Package size={30} strokeWidth={1} className="text-muted" />
              <p className="text-[11px] tracking-widest text-muted-foreground font-medium uppercase">No purchase history found</p>
              <Link href="/products" className="text-[10px] tracking-widest border-b border-primary pb-1 text-foreground hover:text-primary transition-all font-semibold uppercase">
                Shop collection
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}