import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface CartItem {
  id: string
  name: string
  price: number
  image: string
  selectedSize: string
  selectedColor: string
  quantity: number
}

interface CartStore {
  cart: CartItem[]
  totalPrice: number // 1. Halkan ayaan ku darnay
  addToCart: (product: any) => void
  removeFromCart: (id: string, size: string) => void
  updateQuantity: (id: string, size: string, quantity: number) => void
  clearCart: () => void
}

// Function yar oo xisaabiya wadarta guud
const calculateTotal = (items: CartItem[]) => {
  return items.reduce((total, item) => total + (item.price * item.quantity), 0)
}

export const useCartStore = create<CartStore>()(
  persist(
    (set) => ({
      cart: [],
      totalPrice: 0, // 2. Bilowga waa eber

      addToCart: (product) => set((state) => {
        const existingItem = state.cart.find(
          (item) => item.id === product.id && item.selectedSize === product.selectedSize
        );

        let newCart;
        if (existingItem) {
          newCart = state.cart.map((item) =>
            item.id === product.id && item.selectedSize === product.selectedSize
              ? { ...item, quantity: item.quantity + 1 }
              : item
          );
        } else {
          newCart = [...state.cart, { ...product, quantity: 1 }];
        }

        return { 
          cart: newCart,
          totalPrice: calculateTotal(newCart) // 3. Cusboonaysii Total-ka
        };
      }),

      removeFromCart: (id, size) => set((state) => {
        const newCart = state.cart.filter((item) => !(item.id === id && item.selectedSize === size));
        return {
          cart: newCart,
          totalPrice: calculateTotal(newCart) // 4. Cusboonaysii Total-ka
        };
      }),

      updateQuantity: (id, size, quantity) => set((state) => {
        const newCart = state.cart.map((item) => 
          item.id === id && item.selectedSize === size 
            ? { ...item, quantity: Math.max(1, quantity) } 
            : item
        );
        return {
          cart: newCart,
          totalPrice: calculateTotal(newCart) // 5. Cusboonaysii Total-ka
        };
      }),

      clearCart: () => set({ cart: [], totalPrice: 0 }), // 6. Ebar ka dhig labadaba
    }),
    { name: 'cart-storage' }
  )
)