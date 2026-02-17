"use client"

import * as React from "react"
import { db } from "@/lib/firebase"
import { 
  collection, 
  onSnapshot, 
  query, 
  orderBy, 
  doc, 
  deleteDoc, 
  addDoc, 
  serverTimestamp 
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import { 
  IconDotsVertical, 
  IconTrash, 
  IconSearch, 
  IconMail,
  IconPhone,
  IconPlus,
  IconLoader2
} from "@tabler/icons-react"

interface Customer {
  id: string
  name: string
  email: string
  phone: string
  totalOrders: number
  totalSpent: number
}

export default function CustomersPage() {
  const [customers, setCustomers] = React.useState<Customer[]>([])
  const [loading, setLoading] = React.useState(true)
  const [addLoading, setAddLoading] = React.useState(false)
  const [search, setSearch] = React.useState("")
  const [open, setOpen] = React.useState(false)

  React.useEffect(() => {
    const q = query(collection(db, "customers"), orderBy("name", "asc"))
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Customer[]
      setCustomers(data)
      setLoading(false)
    }, (error) => {
      toast.error("Wuu ku guuldareystay akhrinta macmiisha")
      setLoading(false)
    })
    return () => unsubscribe()
  }, [])

  async function handleAddCustomer(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setAddLoading(true)
    const formData = new FormData(e.currentTarget)
    try {
      await addDoc(collection(db, "customers"), {
        name: formData.get("name"),
        email: formData.get("email"),
        phone: formData.get("phone"),
        totalOrders: 0,
        totalSpent: 0,
        createdAt: serverTimestamp(),
      })
      toast.success("Macmiilka waa la keydiyay")
      setOpen(false)
      e.currentTarget.reset()
    } catch (error) {
      toast.error("Cillad ayaa dhacday")
    } finally {
      setAddLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (confirm("Ma hubtaa inaad tirtirto macmiilkan?")) {
      try {
        await deleteDoc(doc(db, "customers", id))
        toast.success("Macmiilka waa la tirtiray")
      } catch (error) {
        toast.error("Wuu ku guuldareystay tirtirista")
      }
    }
  }

  const filteredCustomers = customers.filter(c => {
    const name = c.name?.toLowerCase() || ""
    const email = c.email?.toLowerCase() || ""
    return name.includes(search.toLowerCase()) || email.includes(search.toLowerCase())
  })

  return (
    <div className="p-8 space-y-10 font-sans bg-background min-h-screen">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-1">
          <p className="text-[10px] tracking-widest text-muted-foreground font-bold uppercase">Management / Directory</p>
          <h2 className="text-4xl font-bold tracking-tight text-foreground">Customers</h2>
        </div>

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2 bg-primary text-primary-foreground font-bold text-xs tracking-wide uppercase rounded-md px-6 h-10 transition-all">
              <IconPlus size={16} /> Add Customer
            </Button>
          </DialogTrigger>
          <DialogContent className="border-border bg-background font-sans">
            <DialogHeader>
              <DialogTitle className="font-bold text-xl">New Customer Profile</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleAddCustomer} className="grid gap-5 py-4">
              <div className="space-y-2 text-left">
                <Label className="text-xs font-bold text-muted-foreground uppercase">Full Name</Label>
                <Input name="name" placeholder="John Doe" className="border-border rounded-md" required />
              </div>
              <div className="space-y-2 text-left">
                <Label className="text-xs font-bold text-muted-foreground uppercase">Email Address</Label>
                <Input name="email" type="email" placeholder="john@example.com" className="border-border rounded-md" required />
              </div>
              <div className="space-y-2 text-left">
                <Label className="text-xs font-bold text-muted-foreground uppercase">Phone Number</Label>
                <Input name="phone" placeholder="+252..." className="border-border rounded-md" required />
              </div>
              <DialogFooter>
                <Button type="submit" disabled={addLoading} className="w-full bg-primary font-bold text-xs uppercase h-11">
                  {addLoading ? <IconLoader2 className="h-4 w-4 animate-spin" /> : "Save Customer"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search */}
      <div className="relative w-full max-w-sm">
        <IconSearch className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search by name or email..."
          className="pl-10 border-border bg-muted/10 rounded-md text-sm"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Table */}
      <Card className="border-border bg-card shadow-sm overflow-hidden rounded-md">
        <CardHeader className="border-b border-border bg-muted/30 py-4">
          <CardTitle className="text-[10px] font-bold tracking-widest uppercase text-muted-foreground">Customer Database</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-muted/10">
              <TableRow className="border-border">
                <TableHead className="text-[10px] font-bold uppercase tracking-wider py-4">Customer</TableHead>
                <TableHead className="text-[10px] font-bold uppercase tracking-wider">Contact</TableHead>
                <TableHead className="text-[10px] font-bold uppercase tracking-wider">Activity</TableHead>
                <TableHead className="text-[10px] font-bold uppercase tracking-wider">Total Spent</TableHead>
                <TableHead className="text-right py-4 pr-6 font-bold text-[10px] uppercase">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={5} className="h-40 text-center text-primary"><IconLoader2 className="mx-auto animate-spin" /></TableCell>
                </TableRow>
              ) : filteredCustomers.map((customer) => (
                <TableRow key={customer.id} className="border-border hover:bg-muted/5 transition-colors">
                  <TableCell className="py-4">
                    <div className="flex items-center gap-3">
                      <div className="h-9 w-9 rounded-md bg-primary/10 flex items-center justify-center font-bold text-primary text-sm">
                        {customer.name?.[0]?.toUpperCase()}
                      </div>
                      <span className="font-bold text-foreground text-sm">{customer.name}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col text-xs text-muted-foreground font-medium">
                      <span className="flex items-center gap-1.5">{customer.email}</span>
                      <span className="flex items-center gap-1.5">{customer.phone}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="bg-muted border border-border px-2 py-1 text-[10px] font-bold uppercase rounded text-muted-foreground">
                      {customer.totalOrders || 0} Orders
                    </span>
                  </TableCell>
                  <TableCell className="font-bold text-foreground text-sm">
                    ${Number(customer.totalSpent || 0).toLocaleString()}
                  </TableCell>
                  <TableCell className="text-right pr-6">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0 hover:bg-muted"><IconDotsVertical className="h-4 w-4 text-muted-foreground" /></Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-[180px] border-border font-sans">
                        <DropdownMenuLabel className="text-[10px] font-bold uppercase text-muted-foreground">Options</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => handleDelete(customer.id)} className="text-destructive font-bold text-xs py-2 cursor-pointer">
                          <IconTrash className="mr-2 h-3.5 w-3.5" /> Delete Customer
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