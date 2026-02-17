"use client"

import * as React from "react"
import { db } from "@/lib/firebase"
import { doc, getDoc } from "firebase/firestore"
import { 
  IconExternalLink, 
  IconEye, 
  IconDeviceDesktop, 
  IconDeviceMobile, 
  IconShoppingCart, 
  IconPackage,
  IconUsers
} from "@tabler/icons-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export default function ViewStore() {
  const [storeData, setStoreData] = React.useState({
    name: "My Awesome Store",
    status: "Online",
    url: "https://yourstore.com",
    totalProducts: 0,
    activeCustomers: 0
  })

  React.useEffect(() => {
    async function fetchStoreStats() {
      const docRef = doc(db, "settings", "store_config")
      const docSnap = await getDoc(docRef)
      if (docSnap.exists()) {
        const data = docSnap.data()
        setStoreData(prev => ({
          ...prev,
          name: data.storeName || prev.name,
          url: data.storeUrl || prev.url
        }))
      }
    }
    fetchStoreStats()
  }, [])

  return (
    <div className="p-10 space-y-10 max-w-6xl mx-auto">
      {/* --- HEADER --- */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b pb-8">
        <div className="text-left space-y-1">
          <h2 className="text-4xl font-extrabold tracking-tight">View Store</h2>
          <p className="text-muted-foreground text-lg">Monitor your storefront presence and live status.</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="gap-2">
            <IconEye size={18} /> Preview
          </Button>
          <Button className="gap-2" onClick={() => window.open(storeData.url, '_blank')}>
            <IconExternalLink size={18} /> Visit Live Store
          </Button>
        </div>
      </div>

      {/* --- QUICK STATS --- */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="shadow-sm border-none bg-primary/5">
          <CardContent className="pt-6 flex items-center gap-4">
            <div className="p-3 bg-primary/10 rounded-xl text-primary">
              <IconPackage size={24} />
            </div>
            <div className="text-left">
              <p className="text-sm text-muted-foreground font-medium">Total Products</p>
              <h4 className="text-2xl font-bold">124</h4>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-none bg-green-50/50">
          <CardContent className="pt-6 flex items-center gap-4">
            <div className="p-3 bg-green-100 rounded-xl text-green-600">
              <IconUsers size={24} />
            </div>
            <div className="text-left">
              <p className="text-sm text-muted-foreground font-medium">Active Visitors</p>
              <h4 className="text-2xl font-bold text-green-700">12</h4>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-none bg-orange-50/50">
          <CardContent className="pt-6 flex items-center gap-4">
            <div className="p-3 bg-orange-100 rounded-xl text-orange-600">
              <IconShoppingCart size={24} />
            </div>
            <div className="text-left">
              <p className="text-sm text-muted-foreground font-medium">Store Status</p>
              <div className="flex items-center gap-2">
                <h4 className="text-2xl font-bold">{storeData.status}</h4>
                <Badge className="bg-green-500 hover:bg-green-600 border-none px-2 h-5">Live</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* --- STORE PREVIEW SECTION --- */}
      <Card className="overflow-hidden border-muted shadow-lg">
        <CardHeader className="bg-muted/30 border-b flex flex-row items-center justify-between py-4">
          <div className="text-left">
            <CardTitle className="text-xl">Storefront Preview</CardTitle>
            <CardDescription>Current view of your home page.</CardDescription>
          </div>
          <div className="flex bg-white rounded-lg border p-1 gap-1">
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0 bg-muted">
              <IconDeviceDesktop size={18} />
            </Button>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
              <IconDeviceMobile size={18} />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-0 bg-slate-100 min-h-[400px] flex items-center justify-center relative group">
          {/* Mockup of a website */}
          <div className="w-[90%] h-[350px] bg-white rounded-t-lg shadow-2xl border border-b-0 overflow-hidden transition-transform duration-500 group-hover:scale-[1.01]">
             {/* Simple Navbar Mock */}
             <div className="h-12 border-b bg-white flex items-center justify-between px-6">
                <div className="font-bold text-primary">{storeData.name}</div>
                <div className="flex gap-4 text-[10px] text-muted-foreground font-medium">
                  <span>Home</span>
                  <span>Shop</span>
                  <span>About</span>
                </div>
             </div>
             {/* Simple Hero Mock */}
             <div className="p-10 space-y-4 text-center">
                <div className="h-20 w-full bg-muted/20 rounded-lg animate-pulse" />
                <div className="grid grid-cols-3 gap-4 pt-4">
                   {[1, 2, 3].map(i => (
                     <div key={i} className="h-24 bg-muted/10 rounded-md border border-dashed" />
                   ))}
                </div>
             </div>
          </div>
          
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
             <Button variant="secondary" className="gap-2 shadow-xl" onClick={() => window.open(storeData.url, '_blank')}>
                <IconExternalLink size={18} /> Open in New Tab
             </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}