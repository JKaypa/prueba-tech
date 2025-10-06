"use client"

import React, { useEffect, useState } from 'react'
import { Protect } from '../components/auth/withAuth'
import { useProductStore } from '../store/product.store'
import { useOrderStore } from '../store/order.store'
import ProductCard from '../components/product/ProductCard'
import OrderCard from '../components/order/OrderCard'

type ProductRequest = {
  name: string
  description: string
  price: string
  stock: number
}

function AdminPage() {
  const { products, fetchProducts, addProduct } = useProductStore()
  const { orders, fetchOrders } = useOrderStore()
  const [loadingCreate, setLoadingCreate] = useState(false)
  const [form, setForm] = useState<ProductRequest>({
    name: '',
    description: '',
    price: '',
    stock: 0
  })

  useEffect(() => {
    fetchProducts()
    if (fetchOrders) fetchOrders()
  }, [fetchProducts, fetchOrders])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setForm((s) => ({ ...s, [name]: name === 'stock' ? Number(value) : value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoadingCreate(true)
    try {
      await addProduct({ name: form.name, description: form.description, price: form.price, stock: form.stock })
      setForm({ name: '', description: '', price: '', stock: 0 })
      await fetchProducts()
      alert('Product created')
    } catch {
      alert('Could not create product')
    } finally {
      setLoadingCreate(false)
    }
  }

  return (
    <div className="flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl w-full">
        <h1 className="text-3xl font-extrabold text-center mb-8">Admin</h1>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Create product</h2>
          <form onSubmit={handleSubmit} className="grid gap-3 sm:grid-cols-2 bg-white p-6 rounded shadow border border-gray-200">
            <label className="flex flex-col">
              <span className="text-sm font-medium mb-1">Name</span>
              <input name="name" value={form.name} onChange={handleChange} placeholder="Name" required className="px-3 py-2 border rounded" />
            </label>

            <label className="flex flex-col">
              <span className="text-sm font-medium mb-1">Price</span>
              <input name="price" value={form.price} onChange={handleChange} placeholder="Price (e.g. 9.99)" required className="px-3 py-2 border rounded" />
            </label>

            <label className="flex flex-col col-span-2">
              <span className="text-sm font-medium mb-1">Description</span>
              <textarea name="description" value={form.description} onChange={handleChange} placeholder="Description" required className="px-3 py-2 border rounded w-full" />
            </label>

            <label className="flex flex-col">
              <span className="text-sm font-medium mb-1">Stock</span>
              <input name="stock" value={form.stock} onChange={handleChange} type="number" min={0} placeholder="Stock" required className="px-3 py-2 border rounded" />
            </label>

            <div className="col-span-2 flex items-center justify-end">
              <button type="submit" disabled={loadingCreate} className="px-4 py-2 bg-indigo-600 text-white rounded">{loadingCreate ? 'Creating...' : 'Create'}</button>
            </div>
          </form>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Products</h2>
          {products.length === 0 ? (
            <div className="text-gray-500">No products</div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {products.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-4">Orders</h2>
          {!orders || orders.length === 0 ? (
            <div className="text-gray-500">No orders</div>
          ) : (
            <div className="space-y-4">
              {orders.map(o => (
                <OrderCard key={o.id} order={o} />
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  )
}

export default Protect(AdminPage, 'admin')