"use client"

import * as React from "react"
import { db } from "@/lib/firebase"
import { doc, updateDoc, getDoc } from "firebase/firestore"
import { 
  IconUser, 
  IconBell, 
  IconLock,
  IconLoader2,
  IconCheck,
  IconCurrencyDollar,
  IconCurrencyPound,
  IconCoin
} from "@tabler/icons-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { GrStorage } from "react-icons/gr"

export default function SettingsPage() {
  const [loading, setLoading] = React.useState(false)
  const [storeName, setStoreName] = React.useState("My Awesome Store")
  const [currency, setCurrency] = React.useState("USD")

  // Soo aqri xogta hadda jirta marka bogga la furo
  React.useEffect(() => {
    async function fetchSettings() {
      try {
        const docRef = doc(db, "settings", "store_config")
        const docSnap = await getDoc(docRef)
        if (docSnap.exists()) {
          setStoreName(docSnap.data().storeName)
          setCurrency(docSnap.data().currency)
        }
      } catch (error) {
        console.error("Error fetching settings:", error)
      }
    }
    fetchSettings()
  }, [])

  const handleSaveStore = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    
    try {
      const settingsRef = doc(db, "settings", "store_config")
      await updateDoc(settingsRef, {
        storeName,
        currency,
        updatedAt: new Date()
      })
      
      // Sidoo kale ku kaydi localStorage si Orders page uu u arko
      const symbol = currency === "USD" ? "$" : currency === "GBP" ? "£" : "$"
      localStorage.setItem("preferred-currency", symbol)
      
      toast.success("Settings-ka waa la cusboonaysiiyay!")
    } catch (error) {
      toast.error("Wuu ku guuldareystay inuu keydiyo")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-10 space-y-10 max-w-5xl mx-auto font-sans">
      
      {/* --- HEADER --- */}
      <div className="text-left space-y-1 border-b border-border pb-8">
        <p className="text-[10px] tracking-[0.2em] text-muted-foreground font-bold uppercase">System / Configuration</p>
        <h2 className="text-4xl font-bold tracking-tight">Admin Settings</h2>
      </div>

      <Tabs defaultValue="general" className="grid grid-cols-1 md:grid-cols-[240px_1fr] gap-12 items-start mt-4">
        
        {/* --- SIDEBAR TABS --- */}
        <TabsList className="flex flex-col h-auto bg-transparent space-y-1 p-0 mt-5 ">
          <TabsTrigger 
            value="general" 
            className="w-full justify-start gap-3 px-4 py-3 font-bold text-xs uppercase tracking-wider data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-md transition-all"
          >
            <GrStorage size={16} /> Store Info
          </TabsTrigger>
          <TabsTrigger 
            value="account" 
            className="w-full justify-start gap-3 px-4 py-3 font-bold text-xs uppercase tracking-wider data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-md transition-all"
          >
            <IconUser size={18} /> Account
          </TabsTrigger>
          <TabsTrigger 
            value="notifications" 
            className="w-full justify-start gap-3 px-4 py-3 font-bold text-xs uppercase tracking-wider data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-md transition-all"
          >
            <IconBell size={18} /> Notifications
          </TabsTrigger>
        </TabsList>

        <div className="w-full">
          {/* --- STORE SETTINGS --- */}
          <TabsContent value="general" className="m-0 space-y-6">
            <Card className="shadow-sm border-border rounded-md overflow-hidden">
              <form onSubmit={handleSaveStore}>
                <CardHeader className="text-left pb-6 border-b bg-muted/20">
                  <CardTitle className="text-xl font-bold uppercase tracking-tight">Store Information</CardTitle>
                  <CardDescription className="font-medium text-xs">Habee macluumaadka guud ee dukaankaaga.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6 text-left pt-8">
                  <div className="grid gap-3">
                    <Label htmlFor="name" className="text-xs font-bold uppercase text-muted-foreground">Store Name</Label>
                    <Input 
                      id="name" 
                      value={storeName} 
                      onChange={(e) => setStoreName(e.target.value)}
                      className="h-11 border-border font-bold rounded-md"
                    />
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="grid gap-3">
                      <Label htmlFor="currency" className="text-xs font-bold uppercase text-muted-foreground flex items-center gap-2">
                        <IconCoin size={14} /> Global Currency
                      </Label>
                      <Select value={currency} onValueChange={setCurrency}>
                        <SelectTrigger id="currency" className="h-11 font-bold border-border rounded-md">
                          <SelectValue placeholder="Select currency" />
                        </SelectTrigger>
                        <SelectContent className="font-sans">
                          <SelectItem value="USD" className="font-bold text-xs uppercase tracking-wide">USD ($) - Dollar</SelectItem>
                          <SelectItem value="GBP" className="font-bold text-xs uppercase tracking-wide">GBP (£) - Pound</SelectItem>
                          <SelectItem value="EUR" className="font-bold text-xs uppercase tracking-wide">EUR (€) - Euro</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid gap-3">
                      <Label htmlFor="email" className="text-xs font-bold uppercase text-muted-foreground">Support Email</Label>
                      <Input id="email" type="email" placeholder="support@example.com" className="h-11 border-border font-bold rounded-md" />
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="border-t px-6 py-5 justify-end bg-muted/10">
                  <Button type="submit" disabled={loading} className="px-8 h-11 font-bold uppercase text-xs tracking-widest rounded-md">
                    {loading ? <IconLoader2 className="animate-spin mr-2 size-4" /> : <IconCheck className="mr-2 size-4" />}
                    Save Changes
                  </Button>
                </CardFooter>
              </form>
            </Card>
          </TabsContent>

          {/* --- ACCOUNT SETTINGS --- */}
          <TabsContent value="account" className="m-0">
            <Card className="shadow-sm border-border rounded-md overflow-hidden">
              <CardHeader className="text-left border-b bg-muted/20 pb-6">
                <CardTitle className="text-xl font-bold uppercase tracking-tight">Account Details</CardTitle>
                <CardDescription className="font-medium text-xs">Update your personal information and password.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-8 text-left pt-8">
                <div className="flex items-center gap-6 p-4 rounded-md border border-border border-dashed bg-muted/5">
                  <div className="h-16 w-16 rounded-md bg-primary/10 flex items-center justify-center text-primary border border-primary/20">
                    <IconUser size={32} />
                  </div>
                  <div className="space-y-1">
                    <p className="font-bold text-sm uppercase tracking-wide">Profile Photo</p>
                    <Button variant="outline" size="sm" className="h-8 font-bold text-[10px] uppercase rounded-md">Change Avatar</Button>
                  </div>
                </div>
                <div className="grid md:grid-cols-2 gap-6 pt-4">
                  <div className="grid gap-3">
                    <Label className="text-xs font-bold uppercase text-muted-foreground">Admin Name</Label>
                    <Input placeholder="Your Name" className="h-11 font-bold border-border" />
                  </div>
                  <div className="grid gap-3">
                    <Label className="text-xs font-bold uppercase text-muted-foreground">Current Password</Label>
                    <Input type="password" placeholder="••••••••" className="h-11 border-border" />
                  </div>
                </div>
              </CardContent>
              <CardFooter className="border-t px-6 py-5 justify-end bg-muted/10">
                <Button variant="destructive" className="gap-2 px-8 h-11 font-bold uppercase text-xs tracking-widest rounded-md">
                  <IconLock size={16} /> Update Password
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          {/* --- NOTIFICATIONS --- */}
          <TabsContent value="notifications" className="m-0">
            <Card className="shadow-sm border-border rounded-md overflow-hidden">
              <CardHeader className="text-left border-b bg-muted/20 pb-6">
                <CardTitle className="text-xl font-bold uppercase tracking-tight">Alert Preferences</CardTitle>
                <CardDescription className="font-medium text-xs">Maarey ogeysiisyada nidaamka.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 pt-6">
                 {[
                   { title: "New Orders", desc: "Receive an email when a customer places an order." },
                   { title: "Low Stock Alert", desc: "Get notified when product inventory is low." }
                 ].map((item, i) => (
                   <div key={i} className="flex items-center justify-between p-5 border border-border rounded-md hover:bg-muted/5 transition-colors">
                      <div className="space-y-1 text-left">
                        <Label className="text-sm font-bold uppercase tracking-tight">{item.title}</Label>
                        <p className="text-xs text-muted-foreground font-medium">{item.desc}</p>
                      </div>
                      <input type="checkbox" className="h-5 w-5 accent-primary cursor-pointer" defaultChecked />
                   </div>
                 ))}
              </CardContent>
            </Card>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  )
}