"use client"

import * as React from "react"
import { db } from "@/lib/firebase"
import { collection, onSnapshot, query, orderBy, limit } from "firebase/firestore"
import { ChartAreaInteractive } from "@/components/chart-area-interactive"
import { SectionCards } from "@/components/section-cards"
import { ProductAdminTable } from "@/components/product-admin-table"

export default function DashboardPage() {
  const [recentProducts, setRecentProducts] = React.useState<any[]>([])
  const [loading, setLoading] = React.useState(true)

  // Fetch only the 5 most recently added/updated products
  React.useEffect(() => {
    const q = query(
      collection(db, "products"), 
      orderBy("createdAt", "desc"), 
      limit(5)
    )

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const products = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }))
      setRecentProducts(products)
      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  return (
    <div className="space-y-6 py-6">
      {/* 1. Summary Cards (Total Sales, Orders, etc.) */}
      <SectionCards />
      
      {/* 2. Sales Analytics Chart */}
      <div className="px-4 lg:px-6">
        <ChartAreaInteractive />
      </div>

      {/* 3. Recently Updated Inventory from Firebase */}
      <div className="px-4 lg:px-6 pb-10">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold tracking-tight">Recently Updated Inventory</h3>
          <span className="text-xs text-muted-foreground uppercase font-medium">Real-time Sync</span>
        </div>
        
        {loading ? (
          <div className="h-40 flex items-center justify-center border rounded-xl bg-muted/10 animate-pulse">
            <p className="text-sm text-muted-foreground">Updating inventory...</p>
          </div>
        ) : (
          <ProductAdminTable data={recentProducts} />
        )}
      </div>
    </div>
  )
}