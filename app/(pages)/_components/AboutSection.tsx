// components/AboutSection.tsx
import React from 'react'

const AboutSection = () => {
  return (
    <section className="w-full py-24 bg-[#F9F9F9] overflow-hidden">
      <div className="max-w-[1440px] mx-auto px-6 md:px-10">
        
        {/* Header Section: Qoraalka Dhexda */}
        <div className="max-w-3xl mx-auto text-center mb-20">
          <h2 className="text-4xl md:text-5xl font-medium tracking-tight text-black mb-6 uppercase">
            OUR APPROACH TO FASHION DESIGN
          </h2>
          <p className="text-sm md:text-base text-gray-500 leading-relaxed tracking-wide uppercase">
            at elegant vogue, we blend creativity with craftsmanship to create 
            fashion that transcends trends and stands the test of time each 
            design is meticulously crafted, ensuring the highest quality 
            exquisite finish
          </p>
        </div>

        {/* Image Grid: Habka sawirrada la isku dhaafiyay (Asymmetric) */}
        <div className="relative flex flex-col md:flex-row items-center justify-between gap-8 md:gap-4">
          
          {/* Sawirka 1: Bidix (Dheer) */}
          <div className="w-full md:w-[23%] mt-0">
            <div className="aspect-[3/4] overflow-hidden bg-gray-100 border border-white shadow-sm">
              <img 
                src="/a1.png" 
                alt="Model 1" 
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
              />
            </div>
          </div>

          {/* Sawirka 2: Bartamaha (Hoos u dhacsan) */}
          <div className="w-full md:w-[23%] md:mt-24">
            <div className="aspect-[3/4] overflow-hidden bg-gray-100 border border-white shadow-sm">
              <img 
                src="/a2.png" 
                alt="Model 2" 
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
              />
            </div>
          </div>

          {/* Sawirka 3: Midig (Sare u kacsan) */}
          <div className="w-full md:w-[23%] md:-mt-12">
            <div className="aspect-[3/4] overflow-hidden bg-gray-100 border border-white shadow-sm">
              <img 
                src="/model1.png" 
                alt="Model 3" 
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
              />
            </div>
          </div>

          {/* Sawirka 4: Midig daraf (Aad u dheer ama go'an) */}
          <div className="w-full md:w-[23%] md:mt-32 opacity-80">
            <div className="aspect-[3/4] overflow-hidden bg-gray-100 border border-white shadow-sm">
              <img 
                src="https://images.unsplash.com/photo-1523381210434-271e8be1f52b?q=80&w=1000" 
                alt="Product" 
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
              />
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}

export default AboutSection