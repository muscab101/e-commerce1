"use client"

import React from 'react'
import Link from 'next/link'
import { Plus } from 'lucide-react'

export interface ProductCardProps {
  id: string;
  name: string;
  category: string;
  price: number;
  image: string;
  onAddToCart: (e: React.MouseEvent) => void;
}

export const ProductCard = ({ id, name, category, price, image, onAddToCart }: ProductCardProps) => {
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
        
        {/* Badhanka Plus-ka ee dhexda kaga jira sawirka sidii sawirka aad soo dirtay */}
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
              <p className="text-[10px] text-gray-500 tracking-widest">{category}</p>
              <h3 className="text-[13px] font-medium text-[#1A1A1A] leading-tight tracking-tight">
                {name}
              </h3>
            </div>
            <p className="text-[13px] font-semibold text-[#1A1A1A]">${price}</p>
          </div>
        </Link>

        {/* Badhan "Quick View" ah oo u eg midka Quick Create ee aad soo dirtay (ikhtiyaari) */}
        <button 
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            // Waxaad halkan dhigi kartaa handleAddToCart haddii aad rabto badhan weyn
          }}
          className="mt-4 w-full bg-[#5D4037] text-white py-3 text-sm font-semibold flex items-center justify-center gap-2 "
        >
          <Plus size={14} /> Quick Add
        </button>
      </div>
    </div>
  )
}