import { create } from 'zustand'
import load from '../lib/load'

export interface ProductResponse {
  id: number
  name: string
  description: string
  price: string
  stock: number
}

type ProductRequest = Omit<ProductResponse, 'id'>

interface ProductStore {
  products: ProductResponse[]
  fetchProducts: () => Promise<void>
  addProduct: (body: ProductRequest) => Promise<void>
}

export const useProductStore = create<ProductStore>((set) => ({
  products: [],
  fetchProducts: async () => {
    const data = await load<void, ProductResponse[]>({ endpoint: 'products/' });

    set({ products: data ?? [] });
  },

  addProduct: async (body: ProductRequest) => {
    const data = await load<ProductRequest, ProductResponse>({ endpoint: 'products/create/', method: 'POST', body });
    if (data) {
      set((state) => ({ products: [...state.products, data] }));
    }
  },

}))