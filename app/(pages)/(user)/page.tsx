import React from 'react'
import Navbar from '../_components/Navbar'
import Hero from '../_components/Hero'
import { ProductCard } from '../_components/ProductCard'
import NewThisWeek from '../_components/NewThisWeek'
import NewArrivals from '../_components/NewArrivals'
import AboutSection from '../_components/AboutSection'
import Footer from '../_components/Footer'

const page = () => {
  return (
    <main className='bg' >
      {/* Navbar-ka halkan ayaan dhigeynaa isagoo dusha ka saaran Hero */}
      <Navbar />
      
      {/* Hero-ga oo ah Full Screen */}
      <Hero />
      <NewThisWeek />
      <AboutSection/>
      <Footer/>
    </main>
  )
}

export default page