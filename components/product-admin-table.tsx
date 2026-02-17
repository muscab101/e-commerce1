"use client"

import * as React from "react"
import { db } from "@/lib/firebase"
import { doc, deleteDoc, updateDoc } from "firebase/firestore"
import {
  IconDotsVertical,
  IconLoader2,
  IconTrash,
  IconEdit,
  IconPhoto,
  IconX
} from "@tabler/icons-react"
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  type ColumnDef,
} from "@tanstack/react-table"
import { toast } from "sonner"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

export type Product = {
  id: string
  name: string
  category: string
  status: "Active" | "Draft" | "Out of Stock"
  price: number
  stock: number
  sku: string
  images: string[]
}

export function ProductAdminTable({ data = [] }: { data?: Product[] }) {
  const [deleteId, setDeleteId] = React.useState<string | null>(null)
  const [editProduct, setEditProduct] = React.useState<Product | null>(null)
  const [isUpdating, setIsUpdating] = React.useState(false)
  const [uploadingFiles, setUploadingFiles] = React.useState<File[]>([])

  const CLOUD_NAME = "du3nhkp4t" 
  const UPLOAD_PRESET = "e-commerce1" 

  const confirmDelete = async () => {
    if (!deleteId) return
    try {
      await deleteDoc(doc(db, "products", deleteId))
      toast.success("Product deleted successfully")
    } catch (error) {
      toast.error("Failed to delete product")
    } finally {
      setDeleteId(null)
    }
  }

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editProduct) return
    setIsUpdating(true)

    try {
      let finalImages = [...(editProduct.images || [])]

      if (uploadingFiles.length > 0) {
        for (const file of uploadingFiles) {
          const formData = new FormData()
          formData.append("file", file)
          formData.append("upload_preset", UPLOAD_PRESET)

          const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, {
            method: "POST",
            body: formData,
          })
          const result = await res.json()
          if (result.secure_url) {
            finalImages.push(result.secure_url)
          }
        }
      }

      const updatedImages = finalImages.slice(0, 5)
      const productRef = doc(db, "products", editProduct.id)
      
      await updateDoc(productRef, {
        name: editProduct.name,
        price: Number(editProduct.price),
        stock: Number(editProduct.stock),
        sku: editProduct.sku,
        images: updatedImages
      })

      toast.success("Product updated successfully")
      setEditProduct(null)
      setUploadingFiles([])
    } catch (error) {
      console.error(error)
      toast.error("Failed to update product")
    } finally {
      setIsUpdating(false)
    }
  }

  const removeExistingImage = (urlToRemove: string) => {
    if (!editProduct) return
    const currentImages = editProduct.images || []
    setEditProduct({
      ...editProduct,
      images: currentImages.filter((url) => url !== urlToRemove)
    })
  }

  const columns: ColumnDef<Product>[] = [
    // --- TIIRKA ID-GA ---
    {
      id: "index",
      header: "ID",
      cell: ({ row }) => (
        <span className="text-muted-foreground font-medium">
          {row.index + 1}
        </span>
      ),
    },
    {
      accessorKey: "images",
      header: "Media",
      cell: ({ row }) => {
        const images = row.original.images || []
        return (
          <div className="flex -space-x-2">
            {images.length > 0 ? (
              images.slice(0, 3).map((url, i) => (
                <img 
                  key={i} 
                  src={url} 
                  className="h-8 w-8 rounded-full border-2 border-white object-cover bg-muted" 
                  alt="prod"
                />
              ))
            ) : (
              <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center border-2 border-white text-muted-foreground">
                 <IconPhoto size={14} />
              </div>
            )}
            {images.length > 3 && (
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-secondary text-[10px] font-bold border-2 border-white">
                +{images.length - 3}
              </div>
            )}
          </div>
        )
      }
    },
    {
      accessorKey: "name",
      header: "Product Details",
      cell: ({ row }) => (
        <div className="flex flex-col text-left">
          <span className="font-medium">{row.original.name}</span>
          <span className="text-xs text-muted-foreground">{row.original.sku}</span>
        </div>
      ),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => (
        <Badge variant="outline" className={row.original.status === "Active" ? "bg-green-50 text-green-700 border-green-200" : "bg-muted"}>
          {row.original.status || "Draft"}
        </Badge>
      ),
    },
    {
      accessorKey: "price",
      header: "Price",
      cell: ({ row }) => <span>${Number(row.original.price || 0).toFixed(2)}</span>,
    },
    {
      id: "actions",
      cell: ({ row }) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon"><IconDotsVertical className="size-4" /></Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-40">
            <DropdownMenuItem onClick={() => {
                setEditProduct(row.original)
                setUploadingFiles([])
            }}>
              <IconEdit className="mr-2 size-4" /> Edit
            </DropdownMenuItem>
            <DropdownMenuItem 
              className="text-red-600 focus:bg-red-50" 
              onClick={() => setDeleteId(row.original.id)}
            >
              <IconTrash className="mr-2 size-4" /> Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ]

  const table = useReactTable({ data, columns, getCoreRowModel: getCoreRowModel() })

  return (
    <div className="rounded-lg border bg-white shadow-sm overflow-hidden">
      <Table>
        <TableHeader className="bg-muted/50">
          {table.getHeaderGroups().map(hg => (
            <TableRow key={hg.id}>
              {hg.headers.map(header => (
                <TableHead key={header.id}>{flexRender(header.column.columnDef.header, header.getContext())}</TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows.map(row => (
            <TableRow key={row.id}>
              {row.getVisibleCells().map(cell => (
                <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>This action will permanently delete the product.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-red-600 hover:bg-red-700 text-white">Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Dialog open={!!editProduct} onOpenChange={() => { setEditProduct(null); setUploadingFiles([]); }}>
        <DialogContent className="max-w-2xl">
          <DialogHeader><DialogTitle>Edit Product Information</DialogTitle></DialogHeader>
          {editProduct && (
            <form onSubmit={handleUpdate} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4 text-left">
                  <div className="grid gap-2">
                    <Label>Product Name</Label>
                    <Input value={editProduct.name} onChange={(e) => setEditProduct({...editProduct, name: e.target.value})} />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2 text-left">
                      <Label>Price ($)</Label>
                      <Input type="number" step="0.01" value={editProduct.price} onChange={(e) => setEditProduct({...editProduct, price: Number(e.target.value)})} />
                    </div>
                    <div className="grid gap-2 text-left">
                      <Label>Stock</Label>
                      <Input type="number" value={editProduct.stock} onChange={(e) => setEditProduct({...editProduct, stock: Number(e.target.value)})} />
                    </div>
                  </div>
                  <div className="grid gap-2">
                    <Label>SKU</Label>
                    <Input value={editProduct.sku} onChange={(e) => setEditProduct({...editProduct, sku: e.target.value})} />
                  </div>
                </div>

                <div className="space-y-4 text-left">
                  <Label>Images ({(editProduct.images?.length || 0) + uploadingFiles.length}/5)</Label>
                  <div className="grid grid-cols-5 gap-2">
                    {editProduct.images?.map((url, i) => (
                      <div key={i} className="relative aspect-square rounded border overflow-hidden">
                        <img src={url} className="h-full w-full object-cover" alt="prod" />
                        <button type="button" onClick={() => removeExistingImage(url)} className="absolute top-0 right-0 bg-red-500 text-white p-0.5 hover:bg-red-600"><IconX size={12}/></button>
                      </div>
                    ))}
                    {uploadingFiles.map((file, i) => (
                      <div key={i} className="aspect-square rounded border overflow-hidden opacity-50 relative">
                        <img src={URL.createObjectURL(file)} className="h-full w-full object-cover" alt="preview" />
                        <div className="absolute inset-0 flex items-center justify-center"><IconLoader2 className="animate-spin size-4 text-white" /></div>
                      </div>
                    ))}
                  </div>
                  <Input 
                    type="file" 
                    accept="image/*" 
                    multiple 
                    disabled={(editProduct.images?.length || 0) + uploadingFiles.length >= 5}
                    onChange={(e) => {
                      if (e.target.files) {
                        const newFiles = Array.from(e.target.files);
                        const existingCount = editProduct.images?.length || 0;
                        setUploadingFiles((prev) => [...prev, ...newFiles].slice(0, 5 - existingCount));
                      }
                    }} 
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setEditProduct(null)}>Cancel</Button>
                <Button type="submit" disabled={isUpdating}>
                  {isUpdating ? <><IconLoader2 className="animate-spin mr-2 size-4" /> Updating...</> : "Save Changes"}
                </Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}