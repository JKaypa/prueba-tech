import React from 'react'

type Item = {
  product: {
    id?: number | string
    name: string
    description?: string
    price: string
  }
  quantity: number
  total_price: string
}

type Order = {
  id: number | string
  created_at?: string | null
  items: Item[]
}

export default function OrderCard({ order }: { order: Order }) {
  return (
    <div className="bg-white p-4 rounded border border-gray-200">
      <div className="flex items-center justify-between">
        <strong>Order #{order.id}</strong>
        <span className="text-sm text-gray-500">{order.created_at ? new Date(order.created_at).toLocaleString() : ''}</span>
      </div>

      <div className="mt-2">
        {order.items.map((it, idx) => (
          <div key={it.product.id ?? idx} className="flex items-center justify-between py-1 border-t border-gray-100">
            <div>
              <div className="font-medium">{it.product.name}</div>
              {it.product.description && <div className="text-sm text-gray-500">{it.product.description}</div>}
            </div>
            <div className="text-right">
              <div>{it.quantity} x {parseFloat(it.product.price).toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</div>
              <div className="text-sm text-gray-600">Total: {parseFloat(it.total_price).toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-3 flex items-center justify-end">
        <span className="text-indigo-600 font-bold">
          {(order.items || []).reduce((sum, item) => sum + Number(item.total_price), 0)
            .toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
        </span>
      </div>
    </div>
  )
}
