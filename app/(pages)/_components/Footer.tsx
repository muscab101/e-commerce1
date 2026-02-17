// components/Footer.tsx
import React from 'react'
import { Facebook, Instagram, Twitter, ArrowRight, GalleryVerticalEnd } from 'lucide-react'
import Link from 'next/link'

const Footer = () => {
  return (
    <footer className="w-full bg-white border-t border-gray-100 pt-20 pb-10">
      <div className="max-w-[1440px] mx-auto px-6 md:px-10">
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-20">
          
          {/* Qaybta 1: Brand & About */}
          <div className="space-y-6">
            <Link href="/" className="flex items-center gap-2">
                    <div className="flex size-10 items-center justify-center rounded-md bg-primary text-primary-foreground">
                        <GalleryVerticalEnd className="size-6" />
                    </div>
                </Link>
            <p className="text-sm text-gray-500 leading-relaxed max-w-[250px] uppercase">
              We create fashion that transcends trends and stands the test of time. Quality meets craftsmanship.
            </p>
            <div className="flex gap-4">
              <Instagram size={20} className="text-gray-400 hover:text-black cursor-pointer transition-colors" />
              <Facebook size={20} className="text-gray-400 hover:text-black cursor-pointer transition-colors" />
              <Twitter size={20} className="text-gray-400 hover:text-black cursor-pointer transition-colors" />
            </div>
          </div>

          {/* Qaybta 2: Quick Links */}
          <div>
            <h4 className="text-[12px] font-bold text-black uppercase tracking-widest mb-6">Shop</h4>
            <ul className="space-y-4 text-sm text-gray-500 uppercase font-medium">
              <li className="hover:text-black cursor-pointer transition-colors">Men's Collection</li>
              <li className="hover:text-black cursor-pointer transition-colors">Women's Collection</li>
              <li className="hover:text-black cursor-pointer transition-colors">Accessories</li>
              <li className="hover:text-black cursor-pointer transition-colors">New Arrivals</li>
            </ul>
          </div>

          {/* Qaybta 3: Company */}
          <div>
            <h4 className="text-[12px] font-bold text-black uppercase tracking-widest mb-6">Information</h4>
            <ul className="space-y-4 text-sm text-gray-500 uppercase font-medium">
              <li className="hover:text-black cursor-pointer transition-colors">About Us</li>
              <li className="hover:text-black cursor-pointer transition-colors">Shipping Policy</li>
              <li className="hover:text-black cursor-pointer transition-colors">Returns & Exchanges</li>
              <li className="hover:text-black cursor-pointer transition-colors">Contact Us</li>
            </ul>
          </div>

          {/* Qaybta 4: Newsletter */}
          <div className="space-y-6">
            <h4 className="text-[12px] font-bold text-black uppercase tracking-widest">Join our Newsletter</h4>
            <p className="text-sm text-gray-500 uppercase">Be the first to know about new releases.</p>
            <div className="relative border-b border-gray-300 pb-2">
              <input 
                type="email" 
                placeholder="EMAIL ADDRESS" 
                className="w-full bg-transparent outline-none text-xs uppercase tracking-widest placeholder:text-gray-300"
              />
              <button className="absolute right-0 top-0 hover:translate-x-1 transition-transform">
                <ArrowRight size={18} className="text-black" />
              </button>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-gray-100 gap-4">
          <p className="text-[10px] text-gray-400 uppercase tracking-widest">
            © 2026 Elegant Vogue. All Rights Reserved.
          </p>
          <div className="flex gap-8">
             <span className="text-[10px] text-gray-400 uppercase tracking-widest cursor-pointer hover:text-black transition-colors">Privacy Policy</span>
             <span className="text-[10px] text-gray-400 uppercase tracking-widest cursor-pointer hover:text-black transition-colors">Terms of Service</span>
          </div>
        </div>

      </div>
    </footer>
  )
}

export default Footer