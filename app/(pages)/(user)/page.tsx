import React from 'react'
import Navbar from '../_components/Navbar'
import Hero from '../_components/Hero'
import { ProductCard } from '../_components/ProductCard'
import NewThisWeek from '../_components/NewThisWeek'
import AboutSection from '../_components/AboutSection'
import Footer from '../_components/Footer'

const page = () => {
  return (
    <main className='' >
      <Navbar />
      <Hero />
      <NewThisWeek />
      <AboutSection/>
      <Footer/>
    </main>
  )
}

export default page