"use client"

import React, { useEffect, useState, useRef } from 'react'
import { db, auth } from '@/lib/firebase'
import { collection, query, orderBy, limit, onSnapshot } from 'firebase/firestore'
import { useRouter } from 'next/navigation'
import { ChevronLeft, ChevronRight, ShoppingCart } from 'lucide-react'
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
  onAddToCart: () => void;
}

// 2. ProductCard Component (Gudaha ama File kale)
const ProductCard = ({ id, name, category, price, image, onAddToCart }: ProductCardProps) => {
  return (
    <div className="group relative w-full">
      <Link href={`/products/${id}`} className="block">
        <div className="aspect-[3/4] overflow-hidden bg-[#F5F5F5] relative">
          <img 
            src={image} 
            alt={name} 
            className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-110" 
          />
        </div>
        <div className="mt-6 space-y-1">
          <div className="flex justify-between items-start">
            <h3 className="text-[11px] font-black uppercase tracking-[0.2em] leading-tight max-w-[70%]">{name}</h3>
            <p className="text-[11px] font-bold italic tracking-tighter">${price}</p>
          </div>
          <p className="text-[9px] text-gray-400 uppercase tracking-[0.3em]">{category}</p>
        </div>
      </Link>
      
      <button 
        onClick={(e) => {
          e.preventDefault(); // Jooji inuu Link-ga ku kaxeeyo
          onAddToCart();
        }}
        className="mt-4 w-full border border-black py-4 text-[9px] font-black uppercase tracking-[0.3em] flex items-center justify-center gap-2 hover:bg-black hover:text-white transition-all duration-300"
      >
        <ShoppingCart size={12} />
        Add to Cart
      </button>
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
      toast.error("Fadlan login soo samey si aad wax u iibsato")
      router.push('/login');
      return;
    }
    addToCart(product);
    toast.success(`${product.name} waa lagu daray cart-ga!`);
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
            <h2 className="text-6xl md:text-7xl font-black tracking-tighter text-black uppercase leading-[0.85] font-[Beatrice_Deck_Trial]">
              NEW <br /> THIS WEEK
            </h2>
            <span className="text-gray-300 font-bold text-xl">({products.length})</span>
          </div>
          <Link href="/products" className="text-[10px] font-black text-gray-400 hover:text-black uppercase tracking-[0.4em] border-b border-transparent hover:border-black pb-1 transition-all">
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
                    onAddToCart={() => handleAddToCart(product)}
                  />
                </div>
              ))
            )}
          </div>

          <div className="flex justify-center gap-4 mt-8">
             <button onClick={() => scroll('left')} className="size-14 flex items-center justify-center border border-gray-100 bg-white hover:bg-black hover:text-white transition-all duration-300">
                <ChevronLeft size={24} strokeWidth={1} />
             </button>
             <button onClick={() => scroll('right')} className="size-14 flex items-center justify-center border border-gray-100 bg-white hover:bg-black hover:text-white transition-all duration-300">
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

export default NewThisWeek