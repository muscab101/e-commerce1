"use client"

import React, { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { db, auth } from '@/lib/firebase'
import { doc, getDoc } from 'firebase/firestore'
import { toast } from 'sonner'
import { Loader2, ChevronLeft, Star, ShieldCheck, Truck } from 'lucide-react'
import { useCartStore } from '@/app/store/useCartStore'

const ProductDetails = () => {
  const { id } = useParams()
  const router = useRouter()
  const [product, setProduct] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [selectedSize, setSelectedSize] = useState<string>("")
  const [selectedColor, setSelectedColor] = useState<string>("")
  const [activeImage, setActiveImage] = useState(0)

  const addToCart = useCartStore((state) => state.addToCart)

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) return
      try {
        const docRef = doc(db, "products", id as string)
        const docSnap = await getDoc(docRef)
        
        if (docSnap.exists()) {
          const data = docSnap.data()
          setProduct({ id: docSnap.id, ...data })
          if (data.sizes?.length > 0) setSelectedSize(data.sizes[0])
          if (data.colors?.length > 0) setSelectedColor(data.colors[0])
        } else {
          toast.error("Product not found")
          router.push('/products')
        }
      } catch (error) {
        toast.error("An error occurred while fetching product")
      } finally {
        setLoading(false)
      }
    }
    fetchProduct()
  }, [id, router])

  const handleAddToCart = () => {
    const user = auth.currentUser;
    if (!user) {
      toast.error("Please login to proceed with your purchase")
      router.push('/login')
      return
    }

    const hasSizes = product.sizes && product.sizes.length > 0;
    if (hasSizes && !selectedSize) {
      toast.error("Please select a size first")
      return
    }

    addToCart({ 
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.images?.[activeImage] || product.images?.[0] || "/placeholder.png",
      selectedSize: hasSizes ? selectedSize : "Standard", 
      selectedColor: selectedColor || "N/A",
      quantity: 1
    })

    toast.success(`${product.name} added to bag!`)
  }

  if (loading) return (
    <div className="h-screen flex items-center justify-center bg-white">
      <Loader2 className="animate-spin text-black" size={40} />
    </div>
  )

  if (!product) return null

  return (
    <div className="min-h-screen bg-white pt-32 pb-20 selection:bg-black selection:text-white font-sans">
      <div className="max-w-[1440px] mx-auto px-6 md:px-10">
        
        <button 
          onClick={() => router.back()}
          className="flex items-center gap-2 text-[10px] font-bold tracking-widest uppercase mb-12 hover:text-gray-400 transition-colors text-black"
        >
          <ChevronLeft size={14} /> Back to collection
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          {/* Images Section */}
          <div className="lg:col-span-7 grid grid-cols-12 gap-4">
            <div className="col-span-2 flex flex-col gap-4">
              {product.images?.map((img: string, index: number) => (
                <div 
                  key={index}
                  onClick={() => setActiveImage(index)}
                  className={`aspect-[3/4] border cursor-pointer overflow-hidden transition-all duration-300 ${activeImage === index ? 'border-black ring-1 ring-black' : 'border-gray-100 hover:border-black'}`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
            
            <div className="col-span-10 aspect-[3/4] bg-gray-50 border border-gray-100 overflow-hidden group">
              <img 
                src={product.images?.[activeImage]} 
                alt={product.name} 
                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
              />
            </div>
          </div>

          {/* Content Section */}
          <div className="lg:col-span-5 space-y-10 text-left">
            <div className="space-y-4">
              <p className="text-[10px] tracking-[0.3em] text-gray-400 font-bold uppercase">{product.category}</p>
              <h1 className="text-5xl font-black tracking-tighter leading-none text-black uppercase">{product.name}</h1>
              <div className="flex items-center gap-4">
                <p className="text-3xl font-bold text-black">${product.price}</p>
                <div className="flex items-center gap-1 border-l border-gray-100 pl-4">
                  <Star size={14} fill="black" />
                  <span className="text-[10px] font-bold text-black mt-0.5 tracking-widest uppercase">Premium Quality</span>
                </div>
              </div>
            </div>

            <p className="text-sm text-gray-500 leading-relaxed font-medium">
              {product.description || "No description provided for this premium item."}
            </p>

            {product.colors?.length > 0 && (
              <div className="space-y-4">
                <p className="text-[10px] font-bold tracking-widest uppercase text-gray-400">Color: {selectedColor}</p>
                <div className="flex gap-3">
                  {product.colors?.map((color: string) => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={`size-8 rounded-full border-2 transition-all ${selectedColor === color ? 'ring-2 ring-black ring-offset-2 border-transparent' : 'border-gray-100'}`}
                      style={{ backgroundColor: color.toLowerCase() }}
                    />
                  ))}
                </div>
              </div>
            )}

            {product.sizes?.length > 0 && (
              <div className="space-y-4">
                <p className="text-[10px] font-bold tracking-widest uppercase text-gray-400">Select Size</p>
                <div className="grid grid-cols-4 gap-2">
                  {product.sizes?.map((size: string) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`h-12 border text-[10px] font-bold transition-all ${selectedSize === size ? 'bg-black text-white border-black' : 'bg-white border-gray-100 text-black hover:border-black'}`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <button 
              onClick={handleAddToCart}
              className="w-full bg-black text-white py-5 text-[10px] font-bold uppercase tracking-[0.3em] hover:bg-gray-900 transition-all duration-500 shadow-2xl active:scale-95"
            >
              Add to shopping bag
            </button>

            <div className="grid grid-cols-2 gap-6 pt-10 border-t border-gray-100">
              <div className="flex items-center gap-3">
                <Truck size={18} className="text-black" />
                <span className="text-[9px] font-bold uppercase tracking-widest">Fast Delivery</span>
              </div>
              <div className="flex items-center gap-3">
                <ShieldCheck size={18} className="text-black" />
                <span className="text-[9px] font-bold uppercase tracking-widest">Secure Checkout</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductDetails