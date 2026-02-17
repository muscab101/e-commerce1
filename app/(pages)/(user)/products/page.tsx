"use client"

import React, { useEffect, useState } from 'react'
import { db, auth } from '@/lib/firebase'
import { collection, query, where, onSnapshot, orderBy } from 'firebase/firestore'
import { Search, X, Loader2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { useCartStore } from '@/app/store/useCartStore'
import Link from 'next/link'
import { ProductCard } from '../../_components/ProductCard'

interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  images?: string[];
  sizes?: string[];
  colors?: string[];
  description?: string;
  createdAt?: any;
}

const ProductsPage = () => {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string>("All")
  const [selectedSize, setSelectedSize] = useState<string | null>(null)
  const [selectedColor, setSelectedColor] = useState<string | null>(null)

  const router = useRouter()
  const addToCartStore = useCartStore((state) => state.addToCart)

  useEffect(() => {
    setLoading(true)
    let q;
    
    if (selectedCategory !== "All") {
      q = query(
        collection(db, "products"), 
        where("category", "==", selectedCategory.toLowerCase()),
        orderBy("createdAt", "desc")
      );
    } else {
      q = query(collection(db, "products"), orderBy("createdAt", "desc"));
    }

    const unsubscribe = onSnapshot(q, (snapshot) => {
      let productData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Product[]

      // Client-side Filtering
      if (selectedSize) {
        productData = productData.filter((p) => p.sizes?.includes(selectedSize))
      }
      if (selectedColor) {
        productData = productData.filter((p) => p.colors?.includes(selectedColor))
      }
      if (searchQuery) {
        productData = productData.filter((p) => 
          p.name.toLowerCase().includes(searchQuery.toLowerCase())
        )
      }

      setProducts(productData)
      setLoading(false)
    }, (error) => {
      console.error("Firestore Error:", error)
      setLoading(false)
    })

    return () => unsubscribe()
  }, [selectedCategory, selectedSize, selectedColor, searchQuery])

  const handleAddToCart = (product: Product) => {
    const user = auth.currentUser;
    if (!user) {
      toast.error("Please login to add items to cart")
      router.push('/login')
      return
    }
    
    addToCartStore({
        ...product,
        image: product.images?.[0] || "/placeholder.png",
        selectedSize: selectedSize || (product.sizes?.[0] || 'Standard'),
        selectedColor: selectedColor || (product.colors?.[0] || 'N/A'),
        quantity: 1
    } as any)
    toast.success(`${product.name.toUpperCase()} ADDED TO BAG`)
  }

  return (
    <div className="min-h-screen bg-white pt-32 pb-20 font-sans">
      <div className="max-w-[1440px] mx-auto px-6 md:px-10">
        
        <div className="mb-20 text-left">
          <p className="text-[10px] tracking-[0.4em] text-gray-400 mb-6 uppercase font-bold">
            Collections / {selectedCategory}
          </p>
          <h1 className="text-7xl md:text-9xl font-black tracking-tighter leading-[0.8] italic uppercase">
            {selectedCategory === "All" ? "Global" : selectedCategory} <br /> 
            <span className="text-gray-200">Archives</span>
          </h1>
        </div>

        <div className="flex flex-col lg:flex-row gap-16">
          <aside className="w-full lg:w-64 flex-shrink-0">
            <div className="sticky top-32 space-y-16 text-left">
              
              {/* Category Filter */}
              <section>
                <h3 className="text-[11px] font-black tracking-[0.3em] mb-8 uppercase">Category</h3>
                <div className="flex flex-col gap-4">
                  {["All", "Men", "Women", "Kids", "Accessories"].map((cat) => (
                    <button 
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={`text-[10px] text-left uppercase tracking-[0.2em] transition-all ${selectedCategory === cat ? "font-black text-black border-l-2 border-black pl-4" : "text-gray-400 hover:text-black hover:pl-2"}`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </section>

              {/* Color Filter */}
              <section>
                <h3 className="text-[11px] font-black tracking-[0.3em] mb-8 uppercase">Color</h3>
                <div className="flex flex-wrap gap-3">
                  {["Black", "White", "Red", "Blue", "Green", "Grey"].map((color) => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(selectedColor === color ? null : color)}
                      className={`size-6 rounded-full border transition-all ${selectedColor === color ? 'ring-2 ring-black ring-offset-2' : 'border-gray-200'}`}
                      style={{ backgroundColor: color.toLowerCase() }}
                      title={color}
                    />
                  ))}
                </div>
              </section>

              {/* Size Filter */}
              <section>
                <h3 className="text-[11px] font-black tracking-[0.3em] mb-8 uppercase">Size</h3>
                <div className="grid grid-cols-3 gap-2">
                  {["XS", "S", "M", "L", "XL", "2X"].map((size) => (
                    <button 
                      key={size}
                      onClick={() => setSelectedSize(selectedSize === size ? null : size)}
                      className={`h-12 border flex items-center justify-center text-[10px] font-black transition-all ${selectedSize === size ? "bg-black text-white border-black" : "bg-white border-gray-100 hover:border-black text-gray-400"}`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </section>

              {/* Reset All */}
              {(selectedSize || selectedColor || selectedCategory !== "All") && (
                <button 
                  onClick={() => { setSelectedCategory("All"); setSelectedSize(null); setSelectedColor(null); }}
                  className="w-full py-4 border-2 border-black text-[10px] font-black uppercase tracking-widest hover:bg-black hover:text-white transition-all flex items-center justify-center gap-2"
                >
                  <X size={14} /> Clear All
                </button>
              )}
            </div>
          </aside>

          <main className="flex-1">
            <div className="relative mb-16 group">
              <Search className="absolute left-0 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-black transition-colors" size={18} />
              <input 
                type="text"
                placeholder="TYPE TO SEARCH..."
                className="w-full pl-10 py-4 bg-transparent border-b border-gray-100 outline-none text-[11px] tracking-[0.3em] uppercase focus:border-black transition-all"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {loading ? (
              <div className="h-96 flex flex-col items-center justify-center gap-4">
                 <Loader2 className="animate-spin text-black" size={32} />
                 <p className="text-[10px] font-black uppercase tracking-widest animate-pulse">Syncing Archives...</p>
              </div>
            ) : products.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-x-10 gap-y-20">
                {products.map((product) => (
                    <Link href={`/products/${product.id}`} key={product.id}>
                      <ProductCard 
                        id={product.id}
                        name={product.name}
                        category={product.category}
                        price={product.price}
                        image={product.images?.[0] || "/placeholder.png"}
                        onAddToCart={(e: React.MouseEvent) => {
                          e.preventDefault(); 
                          e.stopPropagation(); 
                          handleAddToCart(product);
                        }}
                      />
                    </Link>
                ))}
              </div>
            ) : (
              <div className="h-[60vh] flex flex-col items-center justify-center border-2 border-dashed border-gray-100 rounded-lg">
                <p className="text-[11px] font-black tracking-[0.5em] text-gray-300 uppercase">Archive Empty</p>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  )
}

export default ProductsPage