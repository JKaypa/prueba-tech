"use client"

import { ChangeEvent, useEffect, useState } from 'react'
import { Protect } from './components/auth/withAuth'
import { ProductResponse, useProductStore } from './store/product.store'
import { useOrderStore } from './store/order.store'
import { useCartStore } from './store/cart.store'
import ProductCard from './components/product/ProductCard'

function Products() {
  const { products, fetchProducts } = useProductStore()
  const { createOrder } = useOrderStore()
  const [quantity, setQuantity] = useState<Record<number, number>>({})

  useEffect(() => {
    fetchProducts()
  }, [fetchProducts])

  const { items, addItem, clearCart } = useCartStore()

  const totalPrice = items.reduce((acc, item) => {
    const product = products.find((product) => product.id === item.product_id)
    const price = product ? parseFloat(product.price) : 0
    return acc + price * item.quantity
  }, 0)

  const formattedTotal = totalPrice.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  })

  const handleChange = (event: ChangeEvent<HTMLInputElement>, product: ProductResponse) => {
    setQuantity((quantity) => ({ ...quantity, [product.id]: Number(event.target.value) }))
  }

  const handleAddToCart = (productId: number) => {
    const quantityProduct = quantity[productId] ?? 1

    if (quantityProduct < 0) {
      alert('Quantity must be at least 1')
      return
    }

    addItem(productId, quantityProduct)
    setQuantity((s) => ({ ...s, [productId]: quantityProduct }))
  }

  const handleOrder = async () => {
    if (items.length === 0) {
      alert('Cart is empty')
      return
    }

    try {
      const res = await createOrder(items)
      if (res) {
        alert('Order placed successfully')
        await fetchProducts()
        clearCart()
      }
    } catch {
      alert('Could not place order')
    }
  }

  return (
    <div className="flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl w-full">
        <h1 className="text-3xl font-extrabold text-center mb-8">Products</h1>

        {products.length === 0 ? (
          <div className="text-center text-gray-500">No products available.</div>
        ) : (
          <>
            <div className="mb-6 flex items-center justify-between">
              <div className="flex items-baseline gap-4">
                <div>
                  <strong>Cart:</strong> {items.reduce((acc, item) => acc + item.quantity, 0)} item{items.length !== 1 ? 's' : ''}
                </div>
                <div className="text-lg font-semibold text-indigo-600">{formattedTotal}</div>
              </div>
              <div className="flex items-center gap-3">
                <button onClick={handleOrder} className="px-3 py-1 bg-green-600 text-white rounded">Order</button>
                <button onClick={clearCart} className="px-3 py-1 bg-gray-200 rounded">Clear</button>
              </div>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {products.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  quantity={quantity[product.id] ?? 1}
                  onQuantityChange={(event) => handleChange(event, product)}
                  onAdd={() => handleAddToCart(product.id)}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default Protect(Products)