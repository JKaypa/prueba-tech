import React from 'react'

type Product = {
  id: number | string
  name: string
  description?: string
  price: string
  stock: number
}

export default function ProductCard({
  product,
  quantity,
  onQuantityChange,
  onAdd,
}: {
  product: Product
  quantity?: number
  onQuantityChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
  onAdd?: () => void
}) {
  return (
    <div className="bg-white shadow rounded-lg p-6 border border-gray-200">
      <h2 className="text-xl font-semibold text-gray-900">{product.name}</h2>
      <p className="mt-2 text-sm min-h-[40px] text-gray-600">{product.description}</p>
      <div className="mt-4 flex items-center justify-between">
        <span className="text-indigo-600 font-bold">{parseFloat(product.price).toLocaleString("en-US", {
          style: "currency",
          currency: "USD",
          minimumFractionDigits: 2
        })}</span>
        <span className="text-sm text-gray-500">Stock: {product.stock}</span>
      </div>

      { (onAdd || onQuantityChange) && (
        <div className="mt-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <input
              aria-label={`quick-qty-${product.id}`}
              type="number"
              min={0}
              max={product.stock}
              value={quantity ?? 1}
              onChange={onQuantityChange}
              className="w-20 px-2 py-1 border rounded"
            />
            {onAdd && (
              <button
                onClick={onAdd}
                className="px-3 py-1 bg-indigo-600 text-white rounded"
              >
                Add to cart
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
