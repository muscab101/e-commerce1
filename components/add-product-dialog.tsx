"use client"

import * as React from "react"
import { db } from "@/lib/firebase"
import { collection, addDoc, serverTimestamp } from "firebase/firestore"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea" // Added for description
import { toast } from "sonner"
import { IconPlus, IconLoader2, IconX } from "@tabler/icons-react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export function AddProductDialog() {
  const [open, setOpen] = React.useState(false)
  const [loading, setLoading] = React.useState(false)
  const [files, setFiles] = React.useState<File[]>([])
  const [category, setCategory] = React.useState("")

  const CLOUD_NAME = "du3nhkp4t" 
  const UPLOAD_PRESET = "e-commerce1" 

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files)
      if (files.length + selectedFiles.length > 5) {
        toast.error("You can only upload a maximum of 5 images.")
        return
      }
      setFiles((prev) => [...prev, ...selectedFiles])
    }
  }

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index))
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (files.length === 0) {
      toast.error("Please upload at least one image.")
      return
    }
    if (!category) {
      toast.error("Please select a category.")
      return
    }

    setLoading(true)
    const formData = new FormData(e.currentTarget)
    const name = formData.get("name") as string
    const description = formData.get("description") as string // Added
    const price = parseFloat(formData.get("price") as string)
    const stock = parseInt(formData.get("stock") as string)
    const sku = formData.get("sku") as string
    
    const sizesRaw = formData.get("sizes") as string
    const colorsRaw = formData.get("colors") as string
    
    const sizes = sizesRaw ? sizesRaw.split(",").map(s => s.trim()) : []
    const colors = colorsRaw ? colorsRaw.split(",").map(c => c.trim()) : []

    try {
      const imageUrls: string[] = []

      for (const file of files) {
        const data = new FormData()
        data.append("file", file)
        data.append("upload_preset", UPLOAD_PRESET)

        const response = await fetch(
          `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
          { method: "POST", body: data }
        )
        
        if (!response.ok) throw new Error("Failed to upload an image")
        
        const result = await response.json()
        imageUrls.push(result.secure_url)
      }

      await addDoc(collection(db, "products"), {
        name,
        description, // Added to Firebase
        price,
        stock,
        sku,
        category,
        sizes,
        colors,
        images: imageUrls,
        status: "Active",
        createdAt: serverTimestamp(),
      })

      toast.success("Product successfully created!")
      setOpen(false)
      setFiles([])
      setCategory("")
      e.currentTarget.reset()
    } catch (error: any) {
      toast.error("Error: " + error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="font-bold uppercase tracking-widest text-xs">
          <IconPlus className="mr-2 size-4" /> Add Product
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[550px] max-h-[90vh] overflow-y-auto font-sans">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold uppercase tracking-tight">Add New Product</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid gap-4 py-4">
          
          <div className="grid gap-2">
            <Label className="text-xs font-bold uppercase text-muted-foreground">Product Name</Label>
            <Input name="name" required placeholder="iPhone 15 Pro" disabled={loading} className="font-medium" />
          </div>

          <div className="grid gap-2">
            <Label className="text-xs font-bold uppercase text-muted-foreground">Description</Label>
            <Textarea 
              name="description" 
              required 
              placeholder="Provide a detailed description of the product..." 
              disabled={loading}
              className="min-h-[100px] font-medium"
            />
          </div>
          
          <div className="grid gap-2">
            <Label className="text-xs font-bold uppercase text-muted-foreground">Category</Label>
            <Select onValueChange={setCategory} disabled={loading} required>
              <SelectTrigger className="font-medium">
                <SelectValue placeholder="Select Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="men">Men</SelectItem>
                <SelectItem value="women">Women</SelectItem>
                <SelectItem value="kids">Kids</SelectItem>
                <SelectItem value="tech">Tech Gear</SelectItem>
                <SelectItem value="accessories">Accessories</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label className="text-xs font-bold uppercase text-muted-foreground">Price ($)</Label>
              <Input name="price" type="number" step="0.01" required placeholder="999.99" disabled={loading} className="font-bold" />
            </div>
            <div className="grid gap-2">
              <Label className="text-xs font-bold uppercase text-muted-foreground">Stock Count</Label>
              <Input name="stock" type="number" required placeholder="50" disabled={loading} className="font-bold" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label className="text-xs font-bold uppercase text-muted-foreground">Sizes (Optional)</Label>
              <Input name="sizes" placeholder="S, M, L, XL" disabled={loading} />
              <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-tighter">Use commas to separate</p>
            </div>
            <div className="grid gap-2">
              <Label className="text-xs font-bold uppercase text-muted-foreground">Colors (Optional)</Label>
              <Input name="colors" placeholder="Red, Blue, Black" disabled={loading} />
              <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-tighter">Use commas to separate</p>
            </div>
          </div>

          <div className="grid gap-2">
            <Label className="text-xs font-bold uppercase text-muted-foreground">SKU Number</Label>
            <Input name="sku" required placeholder="IPH-15-PRO-BLK" disabled={loading} className="font-medium" />
          </div>

          <div className="grid gap-2">
            <Label className="text-xs font-bold uppercase text-muted-foreground">Product Images (1-5)</Label>
            <Input 
              type="file" 
              accept="image/*" 
              multiple 
              onChange={handleFileChange} 
              disabled={loading || files.length >= 5} 
              className="cursor-pointer"
            />
            {files.length > 0 && (
              <div className="grid grid-cols-5 gap-2 mt-2">
                {files.map((file, index) => (
                  <div key={index} className="relative group aspect-square border rounded-md overflow-hidden bg-muted">
                    <img 
                      src={URL.createObjectURL(file)} 
                      alt="preview" 
                      className="object-cover w-full h-full"
                    />
                    <button
                      type="button"
                      onClick={() => removeFile(index)}
                      className="absolute top-0 right-0 bg-destructive text-destructive-foreground rounded-bl-md p-1"
                    >
                      <IconX size={12} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <DialogFooter className="pt-4">
            <Button type="submit" disabled={loading} className="w-full h-11 font-bold uppercase tracking-widest text-xs">
              {loading ? <IconLoader2 className="animate-spin mr-2" /> : "Save Product"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}