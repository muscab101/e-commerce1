"use client"

import * as React from "react"
import { db } from "@/lib/firebase"
import { collection, onSnapshot, query } from "firebase/firestore"
import { IconTrendingDown, IconTrendingUp, IconLoader2 } from "@tabler/icons-react"
import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export function SectionCards() {
  const [stats, setStats] = React.useState({
    totalRevenue: 0,
    totalCustomers: 0,
    activeAccounts: 0,
    growthRate: 4.5, // Static or calculated based on your logic
  })
  const [loading, setLoading] = React.useState(true)
  const [currency, setCurrency] = React.useState("$")

  React.useEffect(() => {
    // Get currency from local storage
    const savedCurrency = localStorage.getItem("preferred-currency")
    if (savedCurrency) setCurrency(savedCurrency)

    // Listen to Orders for Revenue
    const qOrders = query(collection(db, "orders"))
    const unsubOrders = onSnapshot(qOrders, (snapshot) => {
      const total = snapshot.docs.reduce((acc, doc) => acc + (doc.data().amount || 0), 0)
      setStats(prev => ({ ...prev, totalRevenue: total }))
    })

    // Listen to Customers for Count
    const qCustomers = query(collection(db, "customers"))
    const unsubCustomers = onSnapshot(qCustomers, (snapshot) => {
      const count = snapshot.docs.length
      setStats(prev => ({ ...prev, totalCustomers: count, activeAccounts: count }))
      setLoading(false)
    })

    return () => {
      unsubOrders()
      unsubCustomers()
    }
  }, [])

  if (loading) {
    return (
      <div className="flex justify-center p-10">
        <IconLoader2 className="animate-spin text-primary" size={32} />
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 gap-4 px-4 lg:px-6 md:grid-cols-2 lg:grid-cols-4 font-sans">
      
      {/* Total Revenue */}
      <Card className="@container/card relative overflow-hidden bg-gradient-to-t from-primary/5 to-card shadow-sm border-border rounded-md">
        <CardHeader className="space-y-1">
          <div className="flex items-center justify-between">
            <CardDescription className="text-xs font-bold uppercase tracking-wider">Total Revenue</CardDescription>
            <Badge variant="outline" className="flex gap-1 items-center border-green-500/50 text-green-600 font-bold bg-green-500/5 px-2 py-0">
              <IconTrendingUp className="size-3" />
              +12.5%
            </Badge>
          </div>
          <CardTitle className="text-2xl font-bold tabular-nums @[250px]/card:text-3xl text-left">
            {currency}{stats.totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </CardTitle>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1 text-[10px] uppercase tracking-tight">
          <div className="flex items-center gap-1 font-bold text-green-600">
            Trending up this month <IconTrendingUp className="size-3" />
          </div>
          <div className="text-muted-foreground font-medium">
            Based on real-time firebase data
          </div>
        </CardFooter>
      </Card>

      {/* New Customers */}
      <Card className="@container/card relative overflow-hidden bg-gradient-to-t from-primary/5 to-card shadow-sm border-border rounded-md">
        <CardHeader className="space-y-1">
          <div className="flex items-center justify-between">
            <CardDescription className="text-xs font-bold uppercase tracking-wider">Total Customers</CardDescription>
            <Badge variant="outline" className="flex gap-1 items-center border-primary/50 text-primary font-bold bg-primary/5 px-2 py-0">
              <IconTrendingUp className="size-3" />
              +5%
            </Badge>
          </div>
          <CardTitle className="text-2xl font-bold tabular-nums @[250px]/card:text-3xl text-left">
            {stats.totalCustomers.toLocaleString()}
          </CardTitle>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1 text-[10px] uppercase tracking-tight">
          <div className="flex items-center gap-1 font-bold text-primary">
            Customer base growing <IconTrendingUp className="size-3" />
          </div>
          <div className="text-muted-foreground font-medium">
            Active in your database
          </div>
        </CardFooter>
      </Card>

      {/* Active Accounts */}
      <Card className="@container/card relative overflow-hidden bg-gradient-to-t from-primary/5 to-card shadow-sm border-border rounded-md">
        <CardHeader className="space-y-1">
          <div className="flex items-center justify-between">
            <CardDescription className="text-xs font-bold uppercase tracking-wider">Active Accounts</CardDescription>
            <Badge variant="outline" className="flex gap-1 items-center border-green-500/50 text-green-600 font-bold bg-green-500/5 px-2 py-0">
              <IconTrendingUp className="size-3" />
              +12.5%
            </Badge>
          </div>
          <CardTitle className="text-2xl font-bold tabular-nums @[250px]/card:text-3xl text-left">
            {stats.activeAccounts.toLocaleString()}
          </CardTitle>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1 text-[10px] uppercase tracking-tight">
          <div className="flex items-center gap-1 font-bold text-green-600">
            Strong user retention <IconTrendingUp className="size-3" />
          </div>
          <div className="text-muted-foreground font-medium italic-none">Engagement targets met</div>
        </CardFooter>
      </Card>

      {/* Growth Rate */}
      <Card className="@container/card relative overflow-hidden bg-gradient-to-t from-primary/5 to-card shadow-sm border-border rounded-md">
        <CardHeader className="space-y-1">
          <div className="flex items-center justify-between">
            <CardDescription className="text-xs font-bold uppercase tracking-wider">Growth Rate</CardDescription>
            <Badge variant="outline" className="flex gap-1 items-center border-green-500/50 text-green-600 font-bold bg-green-500/5 px-2 py-0">
              <IconTrendingUp className="size-3" />
              +4.5%
            </Badge>
          </div>
          <CardTitle className="text-2xl font-bold tabular-nums @[250px]/card:text-3xl text-left">
            {stats.growthRate}%
          </CardTitle>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1 text-[10px] uppercase tracking-tight">
          <div className="flex items-center gap-1 font-bold text-green-600">
            Steady performance <IconTrendingUp className="size-3" />
          </div>
          <div className="text-muted-foreground font-medium">Meets growth projections</div>
        </CardFooter>
      </Card>
    </div>
  )
}