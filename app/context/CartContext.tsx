"use client"
import React, { createContext, useContext, useState } from 'react'

const CartContext = createContext<any>(null)

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [cartItems, setCartItems] = useState<any[]>([])

  const addToCart = (product: any) => {
    setCartItems((prev) => [...prev, product])
  }

  return (
    <CartContext.Provider value={{ cartItems, addToCart }}>
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => useContext(CartContext)