"use client"

import * as React from "react"
import { db } from "@/lib/firebase"
import { 
  collection, 
  onSnapshot, 
  query, 
  orderBy, 
  doc, 
  updateDoc, 
  deleteDoc 
} from "firebase/firestore"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"
import { 
  IconDotsVertical, 
  IconTruck, 
  IconCheck, 
  IconTrash, 
  IconClock,
  IconLoader2
} from "@tabler/icons-react"

interface Order {
  id: string
  customer?: {
    firstName: string
    lastName: string
    email: string
  }
  items?: any[]
  amount: number
  status: "pending" | "preparing" | "shipped" | "delivered"
  createdAt: any
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = React.useState<Order[]>([])
  const [loading, setLoading] = React.useState(true)

  React.useEffect(() => {
    const q = query(collection(db, "orders"), orderBy("createdAt", "desc"))
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => {
        const d = doc.data();
        const total = d.amount || d.items?.reduce((acc: number, item: any) => acc + (item.price * (item.quantity || 1)), 0) || 0;
        
        return {
          id: doc.id,
          ...d,
          amount: total
        }
      }) as Order[]
      setOrders(data)
      setLoading(false)
    }, (error) => {
      toast.error("Wuu ku guuldareystay akhrinta dalabaadka")
      setLoading(false)
    })
    return () => unsubscribe()
  }, [])

  const updateStatus = async (id: string, newStatus: string) => {
    try {
      await updateDoc(doc(db, "orders", id), { status: newStatus })
      toast.success(`Dalabka waxaa loo beddelay ${newStatus}`)
    } catch (error) {
      toast.error("Cillad ayaa dhacday")
    }
  }

  const handleDelete = async (id: string) => {
    if (confirm("Ma hubtaa inaad tirtirto dalabkan?")) {
      try {
        await deleteDoc(doc(db, "orders", id))
        toast.success("Dalabka waa la tirtiray")
      } catch (error) {
        toast.error("Wuu ku guuldareystay tirtirista")
      }
    }
  }

  return (
    <div className="p-8 space-y-10 font-sans bg-background min-h-screen">
      
      {/* Header */}
      <header className="space-y-1">
        <p className="text-[10px] tracking-[0.2em] text-muted-foreground font-bold uppercase">Management / Fulfillment</p>
        <h2 className="text-4xl font-bold tracking-tight text-foreground text-left">Orders</h2>
      </header>

      {/* Orders Table Card */}
      <Card className="border-border bg-card shadow-sm overflow-hidden rounded-md">
        <CardHeader className="border-b border-border bg-muted/30 py-4">
          <CardTitle className="text-[10px] font-bold tracking-widest uppercase text-muted-foreground text-left">Recent Transactions</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-muted/10">
              <TableRow className="border-border">
                <TableHead className="text-[10px] font-bold uppercase tracking-wider py-4">Order ID</TableHead>
                <TableHead className="text-[10px] font-bold uppercase tracking-wider">Customer</TableHead>
                <TableHead className="text-[10px] font-bold uppercase tracking-wider">Status</TableHead>
                <TableHead className="text-[10px] font-bold uppercase tracking-wider text-right">Amount</TableHead>
                <TableHead className="text-[10px] font-bold uppercase tracking-wider text-right pr-6">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={5} className="h-40 text-center text-primary">
                    <IconLoader2 className="mx-auto animate-spin" size={24} />
                  </TableCell>
                </TableRow>
              ) : orders.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="h-40 text-center text-muted-foreground font-medium text-sm">
                    Wax dalabaad ah laguma helin database-ka.
                  </TableCell>
                </TableRow>
              ) : orders.map((order) => (
                <TableRow key={order.id} className="border-border hover:bg-muted/5 transition-colors">
                  <TableCell className="font-mono text-[10px] font-bold text-muted-foreground uppercase">
                    #{order.id.slice(-8)}
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col text-left">
                      <span className="font-bold text-foreground text-sm leading-tight">
                        {order.customer?.firstName} {order.customer?.lastName}
                      </span>
                      <span className="text-[10px] text-muted-foreground lowercase font-semibold">
                        {order.customer?.email}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge 
                      variant="outline"
                      className={`text-[9px] font-bold uppercase tracking-tighter px-2.5 py-0.5 rounded-md border-none ${
                        order.status === "delivered" ? "bg-green-500/10 text-green-600" :
                        order.status === "shipped" ? "bg-primary/10 text-primary" :
                        "bg-amber-500/10 text-amber-600"
                      }`}
                    >
                      {order.status || 'pending'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right font-bold text-foreground text-sm">
                    ${(order.amount || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </TableCell>
                  <TableCell className="text-right pr-6">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0 hover:bg-muted rounded-md">
                          <IconDotsVertical className="h-4 w-4 text-muted-foreground" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-[180px] border-border font-sans">
                        <DropdownMenuLabel className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase">Update Status</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => updateStatus(order.id, "preparing")} className="text-xs font-bold py-2 cursor-pointer">
                          <IconClock className="mr-2 h-3.5 w-3.5 text-amber-500" /> Preparing
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => updateStatus(order.id, "shipped")} className="text-xs font-bold py-2 cursor-pointer">
                          <IconTruck className="mr-2 h-3.5 w-3.5 text-primary" /> Mark Shipped
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => updateStatus(order.id, "delivered")} className="text-xs font-bold py-2 cursor-pointer">
                          <IconCheck className="mr-2 h-3.5 w-3.5 text-green-500" /> Mark Delivered
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem 
                          onClick={() => handleDelete(order.id)}
                          className="text-destructive focus:bg-destructive/10 focus:text-destructive text-xs font-bold py-2 cursor-pointer"
                        >
                          <IconTrash className="mr-2 h-3.5 w-3.5" /> Delete Order
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}