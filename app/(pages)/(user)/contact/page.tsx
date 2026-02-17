"use client"

import React, { useState } from 'react'
import { Send, Phone, Mail, MapPin, Instagram, Twitter, Facebook } from 'lucide-react'
import { toast } from 'sonner'

const ContactPage = () => {
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    
    // Halkan waxaad dhex gelin kartaa Firebase logic-gaaga
    setTimeout(() => {
      setLoading(false)
      toast.success("Fariintaada waa la soo diray. Mahadsanid!")
    }, 2000)
  }

  return (
    <div className="min-h-screen pt-32 pb-20 selection:bg-primary selection:text-primary-foreground">
      <div className="max-w-[1440px] mx-auto px-6 md:px-10">
        
        {/* Header Section */}
        <div className="mb-20">
          <p className="text-[10px] tracking-[0.4em] text-primary font-bold uppercase mb-6">Connect With Us</p>
          <h1 className="text-6xl md:text-8xl font-black tracking-tighter leading-[0.9] text-foreground">
            GET IN <span className="text-primary italic">TOUCH.</span>
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
          
          {/* LEFT: Contact Information */}
          <div className="space-y-16">
            <div className="space-y-8">
              <p className="text-sm text-muted-foreground leading-relaxed max-w-sm">
                Ma qabtaa su'aal ku saabsan alaabtayada ama ma u baahan tahay caawinaad gaar ah? Kooxdayadu waxay diyaar u tahay inay ku caawiso 24/7.
              </p>
              
              <div className="space-y-6">
                <div className="flex items-center gap-6 group">
                  <div className="size-12 border border-border flex items-center justify-center group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300">
                    <Mail size={18} />
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-widest text-muted-foreground">Email Us</p>
                    <p className="text-sm font-bold">hello@yourbrand.com</p>
                  </div>
                </div>

                <div className="flex items-center gap-6 group">
                  <div className="size-12 border border-border flex items-center justify-center group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300">
                    <Phone size={18} />
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-widest text-muted-foreground">Call Us</p>
                    <p className="text-sm font-bold">+252 61 XXXXXXX</p>
                  </div>
                </div>

                <div className="flex items-center gap-6 group">
                  <div className="size-12 border border-border flex items-center justify-center group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300">
                    <MapPin size={18} />
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-widest text-muted-foreground">Visit Studio</p>
                    <p className="text-sm font-bold">Mogadishu, Somalia</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Social Links */}
            <div className="space-y-6 pt-10 border-t border-border">
              <p className="text-[10px] uppercase tracking-[0.2em] font-bold text-foreground">Follow Our Journey</p>
              <div className="flex gap-4">
                {[Instagram, Twitter, Facebook].map((Icon, i) => (
                  <a key={i} href="#" className="size-10 border border-border flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-all">
                    <Icon size={16} />
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT: Contact Form */}
          <div className="bg-muted/30 p-8 md:p-12 border border-border relative">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest font-bold">Full Name</label>
                  <input 
                    required
                    type="text" 
                    placeholder="Your Name"
                    className="w-full bg-background border-b border-border p-3 text-sm focus:border-primary outline-none transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest font-bold">Email Address</label>
                  <input 
                    required
                    type="email" 
                    placeholder="email@example.com"
                    className="w-full bg-background border-b border-border p-3 text-sm focus:border-primary outline-none transition-all"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest font-bold">Subject</label>
                <select className="w-full bg-background border-b border-border p-3 text-sm focus:border-primary outline-none transition-all appearance-none">
                  <option>General Inquiry</option>
                  <option>Order Support</option>
                  <option>Wholesale</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest font-bold">Message</label>
                <textarea 
                  required
                  rows={4}
                  placeholder="How can we help you?"
                  className="w-full bg-background border border-border p-3 text-sm focus:border-primary outline-none transition-all resize-none"
                />
              </div>

              <button 
                disabled={loading}
                className="w-full bg-primary text-primary-foreground py-4 text-[10px] font-bold uppercase tracking-[0.3em] hover:bg-foreground transition-all flex items-center justify-center gap-3 group"
              >
                {loading ? "Sending..." : "Send Message"}
                {!loading && <Send size={14} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ContactPage