import { create } from 'zustand'
import load from '../lib/load'

type OrderItem = {
  product_id: number
  quantity: number
}

type ProductSimple = {
  id: number
  name: string
  description: string
  price: string
}

export type Item = {
  id: number
  product: ProductSimple
  quantity: number
  total_price: string
}

export type OrderResponse = {
  id: number
  items: Item[]
  created_at?: string
}

interface OrderStore {
  orders?: OrderResponse[]
  createOrder: (items: OrderItem[]) => Promise<OrderResponse | void>
  fetchOrders?: () => Promise<void>
}

export const useOrderStore = create<OrderStore>((set) => ({
  orders: [],
  fetchOrders: async () => {
    const data = await load<void, OrderResponse[]>({ endpoint: 'orders/' });
    if (data) {
      set({ orders: data });
    }
  },

  createOrder: async (items: OrderItem[]) => {
    const data = await load<{ items: OrderItem[] }, OrderResponse>({ endpoint: 'orders/create/', method: 'POST', body: { items } });
    return data;
  }
}))

