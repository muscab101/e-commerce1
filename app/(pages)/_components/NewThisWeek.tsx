"use client"

import React, { useEffect, useState, useRef } from 'react'
import { db, auth } from '@/lib/firebase'
import { collection, query, orderBy, limit, onSnapshot } from 'firebase/firestore'
import { useRouter } from 'next/navigation'
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react'
import Link from 'next/link'
import { toast } from 'sonner'
import { useCartStore } from '@/app/store/useCartStore'

// 1. Qeex Interface-ka ProductProps
interface ProductCardProps {
  id: string;
  name: string;
  category: string;
  price: number;
  image: string;
  onAddToCart: (e: React.MouseEvent) => void;
}

// 2. ProductCard Component oo leh Design-ka cusub ee aad codsatay
const ProductCard = ({ id, name, category, price, image, onAddToCart }: ProductCardProps) => {
  return (
    <div className="group relative w-full font-sans">
      {/* Sawirka iyo Badhanka Plus-ka */}
      <div className="relative aspect-[3/4] overflow-hidden bg-[#F2F2F2]">
        <Link href={`/products/${id}`} className="block w-full h-full">
          <img 
            src={image} 
            alt={name} 
            className="object-cover w-full h-full transition-transform duration-1000 group-hover:scale-105" 
          />
        </Link>
        
        {/* Badhanka Plus-ka ee dhexda kaga jira sawirka */}
        <button 
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onAddToCart(e);
          }}
          className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-white/90 p-3 shadow-sm hover:bg-[#5D4037] hover:text-white transition-all duration-300"
        >
          <Plus size={18} strokeWidth={1.5} />
        </button>
      </div>

      {/* Macluumaadka Alaabta */}
      <div className="mt-6">
        <Link href={`/products/${id}`} className="block">
          <div className="flex justify-between items-center gap-4">
            <div className="space-y-1">
              <p className="text-[10px] text-gray-500 tracking-widest uppercase">{category}</p>
              <h3 className="text-[13px] font-medium text-[#1A1A1A] leading-tight tracking-tight uppercase">
                {name}
              </h3>
            </div>
            <p className="text-[13px] font-semibold text-[#1A1A1A]">${price}</p>
          </div>
        </Link>

        {/* Badhanka Quick Add ee Design-ka cusub */}
        <button 
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onAddToCart(e);
          }}
          className="mt-4 w-full bg-[#5D4037] text-white py-3 text-sm font-semibold flex items-center justify-center gap-2 "
        >
          <Plus size={14} /> Quick Add
        </button>
      </div>
    </div>
  )
}

const NewThisWeek = () => {
  const [products, setProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const scrollRef = useRef<HTMLDivElement>(null)
  const router = useRouter()
  const addToCart = useCartStore((state) => state.addToCart)

  useEffect(() => {
    const q = query(
      collection(db, "products"), 
      orderBy("createdAt", "desc"), 
      limit(10) 
    );
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const productData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }))
      setProducts(productData)
      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  const handleAddToCart = (product: any) => {
    const user = auth.currentUser;
    if (!user) {
      toast.error("Please login to make a purchase")
      router.push('/login');
      return;
    }
    // U gudbi xogta cart-ka
    addToCart({
      ...product,
      image: product.images?.[0] || "/placeholder.png",
      quantity: 1
    });
    toast.success(`${product.name.toUpperCase()} HAS BEEN ADDED`);
  }

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const scrollAmount = clientWidth / 2;
      const scrollTo = direction === 'left' ? scrollLeft - scrollAmount : scrollLeft + scrollAmount;
      scrollRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' });
    }
  }

  return (
    <section className="w-full py-24 bg-white overflow-hidden border-t border-gray-100">
      <div className="max-w-[1440px] mx-auto px-6 md:px-10">
        
        <div className="flex justify-between items-end mb-12">
          <div className="flex items-start gap-2">
            <h2 className="text-6xl md:text-7xl font-black tracking-tighter text-black ">
              NEW <br /> THIS WEEK
            </h2>
            <span className="text-primary font-bold text-xl">({products.length})</span>
          </div>
          <Link href="/products" className="text-sm  text-primary hover:text-black  border-b border-transparent hover:border-black pb-1 transition-all">
            View All Collection
          </Link>
        </div>

        <div className="relative group">
          <div 
            ref={scrollRef}
            className="flex flex-nowrap gap-8 overflow-x-auto no-scrollbar scroll-smooth snap-x snap-mandatory pb-12"
          >
            {loading ? (
              [...Array(4)].map((_, i) => (
                <div key={i} className="min-w-[300px] md:min-w-[400px] aspect-[3/4] bg-gray-50 animate-pulse" />
              ))
            ) : (
              products.map((product) => (
                <div key={product.id} className="min-w-[300px] md:min-w-[400px] flex-shrink-0 snap-start">
                  <ProductCard 
                    id={product.id}
                    name={product.name}
                    category={product.category || "General"}
                    price={product.price}
                    image={product.images ? product.images[0] : "/placeholder.png"}
                    onAddToCart={(e) => handleAddToCart(product)}
                  />
                </div>
              ))
            )}
          </div>

          {/* Navigation Controls */}
          <div className="flex justify-center gap-4 mt-8">
             <button onClick={() => scroll('left')} className="size-14 flex items-center justify-center border border-gray-100 bg-white hover:bg-primary hover:text-white transition-all duration-300">
                <ChevronLeft size={24} strokeWidth={1} />
             </button>
             <button onClick={() => scroll('right')} className="size-14 flex items-center justify-center border border-gray-100 bg-white hover:bg-primary hover:text-white transition-all duration-300">
                <ChevronRight size={24} strokeWidth={1} />
             </button>
          </div>
        </div>
      </div>

      <style jsx global>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </section>
  )
}

export default NewThisWeek;