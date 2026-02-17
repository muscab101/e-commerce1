"use client"

import * as React from "react"
import { auth, db } from "@/lib/firebase"
import { updateProfile } from "firebase/auth"
import { doc, getDoc, updateDoc } from "firebase/firestore"
import { 
  IconUser, 
  IconMail, 
  IconPhone, 
  IconMapPin, 
  IconCamera,
  IconLoader2,
  IconCheck,
  IconShieldLock
} from "@tabler/icons-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"

export default function AdminProfile() {
  const [loading, setLoading] = React.useState(false)
  const [adminData, setAdminData] = React.useState({
    displayName: auth.currentUser?.displayName || "Admin User",
    email: auth.currentUser?.email || "",
    phone: "",
    role: "Super Admin",
    location: "Somlia, mogadishu"
  })

  // 1. Soo aqri xogta dheeriga ah ee Firestore ku jirta
  React.useEffect(() => {
    async function getAdminExtraInfo() {
      if (auth.currentUser) {
        const docRef = doc(db, "admins", auth.currentUser.uid)
        const docSnap = await getDoc(docRef)
        if (docSnap.exists()) {
          setAdminData(prev => ({ ...prev, ...docSnap.data() }))
        }
      }
    }
    getAdminExtraInfo()
  }, [])

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      if (auth.currentUser) {
        // Update Firebase Auth Profile
        await updateProfile(auth.currentUser, {
          displayName: adminData.displayName
        })

        // Update Firestore Admin Collection
        const adminRef = doc(db, "admins", auth.currentUser.uid)
        await updateDoc(adminRef, {
          displayName: adminData.displayName,
          phone: adminData.phone,
          location: adminData.location,
          updatedAt: new Date()
        })

        toast.success("Profile updated successfully!")
      }
    } catch (error) {
      toast.error("Failed to update profile")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-10 space-y-10 max-w-5xl mx-auto">
      {/* Header */}
      <div className="text-left border-b pb-8">
        <h2 className="text-4xl font-extrabold tracking-tight">My Profile</h2>
        <p className="text-muted-foreground text-lg">Manage your personal information and how it appears.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
        {/* Left Column: Avatar & Quick Info */}
        <div className="space-y-6">
          <Card className="text-center overflow-hidden border-none shadow-md bg-muted/20">
            <CardContent className="pt-10 pb-8">
              <div className="relative inline-block">
                <div className="h-32 w-32 rounded-full bg-primary/10 border-4 border-white shadow-sm flex items-center justify-center text-primary mx-auto overflow-hidden">
                  {auth.currentUser?.photoURL ? (
                    <img src={auth.currentUser.photoURL} alt="avatar" className="h-full w-full object-cover" />
                  ) : (
                    <IconUser size={64} />
                  )}
                </div>
                <button className="absolute bottom-0 right-0 p-2 bg-white rounded-full shadow-lg border hover:bg-muted transition-colors">
                  <IconCamera size={18} />
                </button>
              </div>
              <div className="mt-4 space-y-1">
                <h3 className="text-xl font-bold">{adminData.displayName}</h3>
                <Badge variant="secondary" className="bg-primary/10 text-primary border-none">
                  {adminData.role}
                </Badge>
              </div>
            </CardContent>
            <div className="bg-muted/50 p-4 flex justify-around border-t">
               <div className="text-center">
                  <p className="text-xs text-muted-foreground uppercase font-bold">Status</p>
                  <p className="text-sm font-medium text-green-600 flex items-center gap-1 justify-center">
                    <span className="h-2 w-2 rounded-full bg-green-600 animate-pulse" /> Active
                  </p>
               </div>
               <div className="text-center">
                  <p className="text-xs text-muted-foreground uppercase font-bold">Joined</p>
                  <p className="text-sm font-medium">Jan 2024</p>
               </div>
            </div>
          </Card>

          <Card className="border-none shadow-sm bg-blue-50/30">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2">
                <IconShieldLock size={18} className="text-blue-600" /> Account Security
              </CardTitle>
            </CardHeader>
            <CardContent className="text-xs text-left text-muted-foreground">
              Your account is protected with Two-Factor Authentication. Keep your recovery codes safe.
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Edit Form */}
        <div className="md:col-span-2">
          <Card className="shadow-sm border-muted">
            <form onSubmit={handleUpdateProfile}>
              <CardHeader className="text-left border-b pb-6">
                <CardTitle className="text-2xl">Public Information</CardTitle>
                <CardDescription>These details will be visible to other team members.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6 pt-8 text-left">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="grid gap-3">
                    <Label className="font-semibold flex items-center gap-2">
                      <IconUser size={16} /> Full Name
                    </Label>
                    <Input 
                      value={adminData.displayName} 
                      onChange={(e) => setAdminData({...adminData, displayName: e.target.value})}
                      className="h-11"
                    />
                  </div>
                  <div className="grid gap-3 opacity-70">
                    <Label className="font-semibold flex items-center gap-2">
                      <IconMail size={16} /> Email Address
                    </Label>
                    <Input value={adminData.email} disabled className="h-11 bg-muted/30 cursor-not-allowed" />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="grid gap-3">
                    <Label className="font-semibold flex items-center gap-2">
                      <IconPhone size={16} /> Phone Number
                    </Label>
                    <Input 
                      placeholder="+252 63..." 
                      value={adminData.phone}
                      onChange={(e) => setAdminData({...adminData, phone: e.target.value})}
                      className="h-11" 
                    />
                  </div>
                  <div className="grid gap-3">
                    <Label className="font-semibold flex items-center gap-2">
                      <IconMapPin size={16} /> Location
                    </Label>
                    <Input 
                      value={adminData.location}
                      onChange={(e) => setAdminData({...adminData, location: e.target.value})}
                      className="h-11" 
                    />
                  </div>
                </div>
              </CardContent>
              <CardFooter className="border-t px-6 py-6 justify-end bg-muted/10">
                <Button type="submit" disabled={loading} className="px-10 h-11">
                  {loading ? <IconLoader2 className="animate-spin mr-2" /> : <IconCheck className="mr-2" />}
                  Update Profile
                </Button>
              </CardFooter>
            </form>
          </Card>
        </div>
      </div>
    </div>
  )
}