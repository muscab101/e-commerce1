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
    toast.success(`${product.name} has been added`)
  }

  return (
    <div className="min-h-screen bg-background pt-32 pb-20 font-sans">
      <div className="max-w-[1440px] mx-auto px-6 md:px-10">
        
        {/* Header Section */}
        <div className="mb-20 text-left">
          <p className="text-sm text-muted-foreground mb-6 font-semibold">
            Collections / {selectedCategory}
          </p>
          <h1 className="text-7xl md:text-9xl font-semibold tracking-tighter leading-[0.8] text-foreground font-[Beatrice_Deck_Trial]">
            {selectedCategory === "All" ? "Global" : selectedCategory} <br /> 
            <span className="text-primary">Archives</span>
          </h1>
        </div>

        <div className="flex flex-col lg:flex-row gap-16">
          <aside className="w-full lg:w-64 flex-shrink-0">
            <div className="sticky top-32 space-y-16 text-left">
              
              {/* Category Filter */}
              <section>
                <h3 className="text-sm font-semibold mb-8 text-foreground">Category</h3>
                <div className="flex flex-col gap-4">
                  {["All", "Men", "Women", "Kids", "Accessories"].map((cat) => (
                    <button 
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={`text-sm text-left transition-all duration-300 ${
                        selectedCategory === cat 
                        ? "font-semibold text-foreground border-l-2 border-primary pl-4" 
                        : "text-muted-foreground hover:text-foreground hover:pl-2"
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </section>

              {/* Color Filter - Integrated with your theme */}
              <section>
                <h3 className="text-sm font-semibold mb-8 text-foreground">Color</h3>
                <div className="flex flex-wrap gap-3">
                  {[
                    { name: "Black", var: "var(--foreground)" },
                    { name: "White", var: "var(--background)" },
                    { name: "Primary", var: "var(--primary)" },
                    { name: "Secondary", var: "var(--secondary)" },
                    { name: "Muted", var: "var(--muted)" }
                  ].map((color) => (
                    <button
                      key={color.name}
                      onClick={() => setSelectedColor(selectedColor === color.name ? null : color.name)}
                      className={`size-8 rounded-full border transition-all duration-300 ${
                        selectedColor === color.name ? 'ring-2 ring-primary ring-offset-2 scale-110' : 'border-border'
                      }`}
                      style={{ backgroundColor: color.var }}
                      title={color.name}
                    />
                  ))}
                </div>
              </section>

              {/* Size Filter */}
              <section>
                <h3 className="text-sm font-semibold mb-8 text-foreground">Size</h3>
                <div className="grid grid-cols-3 gap-2">
                  {["XS", "S", "M", "L", "XL", "2X"].map((size) => (
                    <button 
                      key={size}
                      onClick={() => setSelectedSize(selectedSize === size ? null : size)}
                      className={`h-12 border flex items-center justify-center text-[11px] font-semibold transition-all duration-300
                        ${selectedSize === size 
                          ? "bg-foreground text-background border-foreground shadow-sm" 
                          : "bg-background border-border hover:border-foreground text-muted-foreground"}`}
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
                  className="w-full py-4 border border-border text-[11px] font-semibold hover:bg-foreground hover:text-background transition-all flex items-center justify-center gap-2"
                >
                  <X size={14} /> Reset Filters
                </button>
              )}
            </div>
          </aside>

          <main className="flex-1">
            {/* Search Input */}
            <div className="relative mb-16 group">
              <Search className="absolute left-0 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-foreground transition-colors" size={18} />
              <input 
                type="text"
                placeholder="Search collection..."
                className="w-full pl-10 py-4 bg-transparent border-b border-border outline-none text-sm font-medium focus:border-foreground transition-all placeholder:text-muted-foreground/50"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {loading ? (
              <div className="h-96 flex flex-col items-center justify-center gap-4">
                  <Loader2 className="animate-spin text-primary" size={32} />
                  <p className="text-xs font-semibold text-muted-foreground">Updating Gallery...</p>
              </div>
            ) : products.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-x-10 gap-y-20">
                {products.map((product) => (
                  <ProductCard 
                    key={product.id}
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
                ))}
              </div>
            ) : (
              <div className="h-[60vh] flex flex-col items-center justify-center border border-dashed border-border rounded-xl bg-muted/20">
                <p className="text-sm font-semibold text-muted-foreground">No items found in this archive.</p>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  )
}

export default ProductsPage