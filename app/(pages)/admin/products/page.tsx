"use client"

import * as React from "react"
import { db } from "@/lib/firebase"
import { collection, onSnapshot, query, orderBy } from "firebase/firestore"
import { ProductAdminTable, type Product } from "@/components/product-admin-table"
import { AddProductDialog } from "@/components/add-product-dialog"
import { 
  IconPackages, 
  IconAlertCircle, 
  IconCurrencyDollar, 
  IconSearch,
  IconLoader2 
} from "@tabler/icons-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"

export default function ProductsPage() {
  const [products, setProducts] = React.useState<Product[]>([])
  const [loading, setLoading] = React.useState(true)
  const [searchQuery, setSearchQuery] = React.useState("")

  // 1. Fetch data from Firebase (Real-time Updates)
  React.useEffect(() => {
    const q = query(collection(db, "products"), orderBy("createdAt", "desc"))
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const productList = snapshot.docs.map(doc => {
        const data = doc.data()
        return {
          id: doc.id,
          name: data.name || "",
          sku: data.sku || "",
          price: Number(data.price) || 0,
          stock: Number(data.stock) || 0,
          status: data.status || "Draft",
          category: data.category || ""
        }
      }) as Product[]
      
      setProducts(productList)
      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  // 2. Stats Calculation
  const totalItems = products.length
  const lowStockItems = products.filter(p => p.stock > 0 && p.stock < 10).length
  const inventoryValue = products.reduce((acc, curr) => acc + (curr.price * curr.stock), 0)

  // 3. Search Filtering
  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    p.sku.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="flex-1 space-y-6 p-4 md:p-8">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Inventory</h2>
          <p className="text-muted-foreground">Manage your products and monitor stock levels in real-time.</p>
        </div>
        <AddProductDialog />
      </div>

      {/* Stats Section */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="shadow-sm border-none bg-white">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Inventory Value</CardTitle>
            <IconCurrencyDollar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${inventoryValue.toLocaleString()}</div>
            <p className="text-xs text-green-600 mt-1">Total value of current stock</p>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-none bg-white">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Low Stock Alerts</CardTitle>
            <IconAlertCircle className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{lowStockItems} Items</div>
            <p className="text-xs text-muted-foreground mt-1">Products with less than 10 units</p>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-none bg-white">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Products</CardTitle>
            <IconPackages className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalItems}</div>
            <p className="text-xs text-muted-foreground mt-1">All active items in database</p>
          </CardContent>
        </Card>
      </div>

      {/* Search & Table Section */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <div className="relative flex-1 max-w-sm">
            <IconSearch className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search by name or SKU..." 
              className="pl-8 bg-white border-none shadow-sm" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {loading ? (
          <div className="h-[400px] flex flex-col items-center justify-center border-2 border-dashed rounded-xl bg-muted/5">
            <IconLoader2 className="h-10 w-10 animate-spin text-primary mb-2" />
            <p className="text-sm text-muted-foreground font-medium text-primary">Fetching inventory data...</p>
          </div>
        ) : (
          <ProductAdminTable data={filteredProducts} />
        )}
      </div>
    </div>
  )
}