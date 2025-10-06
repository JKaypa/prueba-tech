import { create } from 'zustand'

export type CartItem = {
  product_id: number
  quantity: number
}

interface CartStore {
  items: CartItem[]
  addItem: (product_id: number, quantity?: number) => void
  clearCart: () => void
}

export const useCartStore = create<CartStore>((set, get) => ({
  items: [],

  addItem: (product_id: number, quantity = 1) => {
    const items = get().items
    const existing = items.find((item) => item.product_id === product_id)
    
    if (existing) {
      set({ items: items.map(item => item.product_id === product_id ? { ...item, quantity } : item) })
    } else {
      set({ items: [...items, { product_id, quantity }] })
    }
  },

  clearCart: () => set({ items: [] })
}))
