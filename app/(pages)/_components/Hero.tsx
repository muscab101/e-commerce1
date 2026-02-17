"use client"

import React, { useState } from 'react'
import { Search, MoveRight, ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

const Hero = () => {
  const [currentSlide, setCurrentSlide] = useState(0)

  const slides = [
    { image: "/model1.png", title: "NEW COLLECTION", year: "Summer 2024" },
    { image: "/modal2.png", title: "URBAN STYLE", year: "Autumn 2024" },
  ]

  return (
    // 'bg-background' waxay isticmaalaysaa midabka stone-ka ah ee aad CSS-ka ku qeexday
    <section className="w-full min-h-screen bg-background pt-32 px-10 lg:mt-25 pb-20 transition-colors duration-500">
      <div className="max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* LEFT COLUMN */}
        <div className="lg:col-span-5 flex flex-col justify-between py-6">
          
          <div className="space-y-8">
            {/* 'text-muted-foreground' ee xubnaha menu-ga */}
            <div className="flex flex-col gap-1 text-sm font-beatrice font-medium tracking-widest text-muted-foreground">
              <a href="#" className="hover:text-foreground transition-colors">MEN</a>
              <a href="#" className="hover:text-foreground transition-colors">WOMEN</a>
              <a href="#" className="hover:text-foreground transition-colors">KIDS</a>
            </div>

            <div className="relative group max-w-[280px]">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input 
                placeholder="Search" 
                // 'bg-muted' wuxuu isticmaalayaa midabka cawlka qafiifka ah
                className="w-full h-13 bg-muted/50 border-none pl-10 focus:ring-1 focus:ring-primary transition-all outline-none text-sm text-foreground placeholder:text-muted-foreground" 
              />
            </div>
          </div>

          <div className="mt-16">
            {/* 'text-foreground' ee cinwaanka weyn */}
            <h1 className="text-6xl md:text-[5.5rem] font-beatrice font-black leading-[0.85] tracking-tighter text-foreground">
              NEW <br /> COLLECTION
            </h1>
            <p className="mt-4 text-lg font-beatrice text-muted-foreground tracking-wide uppercase">
              Summer <br /> 2024
            </p>
          </div>

          <div className="flex items-center gap-4 mt-10">
            {/* Button wuxuu isticmaalayaa midabka 'primary' (buluugga ama midabka aad dooratay) */}
            <Button className="h-9 px-6 rounded-sm bg-primary text-primary-foreground hover:opacity-90 flex gap-6 items-center group transition-all duration-300 border-none shadow-sm">
              <span className="text-xs">Go To Shop</span>
              <MoveRight size={18} className="group-hover:translate-x-2 transition-transform" />
            </Button>

            <div className="flex gap-1.5">
              <button 
                onClick={() => setCurrentSlide(prev => prev === 0 ? slides.length - 1 : prev - 1)}
                // Arrows-ku waxay isticmaalayaan 'bg-secondary'
                className="p-2.5 bg-primary text-primary-foreground hover:bg-primary/90 transition-all rounded-sm"
              >
                <ChevronLeft size={16} />
              </button>
              <button 
                onClick={() => setCurrentSlide(prev => prev === slides.length - 1 ? 0 : prev + 1)}
                className="p-2.5 bg-primary text-primary-foreground hover:bg-primary/90 transition-all rounded-sm"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN */}
        <div className="lg:col-span-7 flex items-end gap-6 h-full">
          {/* Image 1 - 'border-border' ayaa loo isticmaalay border-ka */}
          <div className="w-[45%] lg:h-[70%] aspect-[2/3] overflow-hidden bg-card border border-border shadow-sm">
            <img 
              src={slides[currentSlide].image} 
              className="w-full h-full object-cover transition-transform duration-[2000ms] hover:scale-110" 
              alt="Model 1"
            />
          </div>
          {/* Image 2 */}
          <div className="hidden md:block w-[45%] lg:h-[70%] aspect-[2/3] overflow-hidden bg-card border border-border shadow-sm">
            <img 
              src={slides[(currentSlide + 1) % slides.length].image} 
              className="w-full h-full object-cover opacity-90 transition-opacity hover:opacity-100" 
              alt="Model 2"
            />
          </div>
        </div>

      </div>
    </section>
  )
}

export default Hero