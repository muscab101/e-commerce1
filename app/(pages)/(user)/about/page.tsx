"use client"

import React from 'react'
import { MoveRight, Globe, ShieldCheck, Zap } from 'lucide-react'

const AboutPage = () => {
  return (
    // Grain texture-ka wuxuu si toos ah uga imanayaa body-gaaga CSS-ka
    <div className="min-h-screen pt-32 pb-20 selection:bg-primary selection:text-white">
      <div className="max-w-[1440px] mx-auto px-6 md:px-10">
        
        {/* Section 1: Hero Header */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-32">
          <div className="space-y-8">
            <p className="text-[10px] tracking-[0.4em] text-primary font-bold uppercase">
              Our Philosophy
            </p>
            <h1 className="text-6xl md:text-8xl font-black tracking-tighter leading-[0.9] text-foreground font-sans">
              CRAFTING <br /> 
              <span className="text-primary italic">THE FUTURE</span> <br /> 
              OF STYLE.
            </h1>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-md">
              Waxaan rumaysanahay in dharku uusan ahayn kaliya maro la gashado, laakiin uu yahay luqad aad kula hadasho caalamka. Waxaan isku xirnaa farsamada soo jireenka ah iyo naqshadaha casriga ah.
            </p>
          </div>
          <div className="aspect-[4/5] bg-muted overflow-hidden relative border border-border">
            <img 
              src="https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?q=80&w=2070&auto=format&fit=crop" 
              alt="Fashion Workshop" 
              className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700"
            />
          </div>
        </div>

        {/* Section 2: Stats / Grid - Isticmaalaya Secondary/Muted background */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-32 border-y border-border py-16 bg-muted/30">
          {[
            { label: "Founded", value: "2024" },
            { label: "Global Stores", value: "12+" },
            { label: "Happy Clients", value: "50k" },
            { label: "Sustainability", value: "100%" },
          ].map((stat, i) => (
            <div key={i} className="text-center">
              <p className="text-[10px] tracking-widest text-primary font-bold uppercase mb-2">{stat.label}</p>
              <h4 className="text-4xl font-black tracking-tighter text-foreground">{stat.value}</h4>
            </div>
          ))}
        </div>

        {/* Section 3: Our Values */}
        <div className="mb-32">
          <div className="flex justify-between items-end mb-16">
            <h2 className="text-4xl font-black tracking-tighter uppercase text-foreground">Why Choose Us</h2>
            <button className="text-[10px] font-bold tracking-widest flex items-center gap-2 group border-b-2 border-primary pb-1 text-foreground hover:text-primary transition-colors">
              LEARN MORE <MoveRight size={14} className="group-hover:translate-x-2 transition-transform" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              { icon: ShieldCheck, title: "Premium Quality", desc: "Dhamaan agabkayagu waa kuwo la soo xulay si ay u dammaanad qaadaan raaxada." },
              { icon: Globe, title: "Eco-Conscious", desc: "Waxaan daryeelnaa deegaanka, annagoo adeegsanayna qalab dib loo warshadeeyay." },
              { icon: Zap, title: "Fast Delivery", desc: "Dalabkaagu waa muhiim, waxaanu xaqiijinaynaa inuu kugu soo gaaro waqtiga ugu dhaqsaha badan." }
            ].map((item, idx) => (
              <div key={idx} className="space-y-4 group">
                <div className="size-14 bg-foreground group-hover:bg-primary text-background flex items-center justify-center transition-colors duration-300">
                  <item.icon size={24} />
                </div>
                <h3 className="font-bold text-lg uppercase tracking-tight text-foreground">{item.title}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Section 4: Call to Action - Isticmaalaya Primary Color-kaaga */}
        <div className="relative h-[50vh] bg-primary overflow-hidden flex items-center justify-center text-center px-6">
          <img 
            src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=2070&auto=format&fit=crop" 
            alt="Fashion Banner" 
            className="absolute inset-0 w-full h-full object-cover opacity-20 grayscale"
          />
          <div className="relative z-20 space-y-8">
            <h2 className="text-4xl md:text-6xl font-black text-primary-foreground tracking-tighter">
              "FASHION IS ART, AND <span className="italic opacity-80 underline underline-offset-8">YOU</span> ARE THE CANVAS."
            </h2>
            <button className="bg-background text-foreground px-10 py-4 text-[10px] font-bold tracking-[0.3em] uppercase hover:invert transition-all duration-300 shadow-xl">
              Join the movement
            </button>
          </div>
        </div>

      </div>
    </div>
  )
}

export default AboutPage