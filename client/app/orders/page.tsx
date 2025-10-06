"use client"

import React, { useEffect } from 'react'
import { Protect } from '../components/auth/withAuth'
import { OrderResponse, useOrderStore } from '../store/order.store'
import OrderCard from '../components/order/OrderCard'

function OrdersPage() {
  const { orders, fetchOrders } = useOrderStore()

  useEffect(() => {
    if (fetchOrders) fetchOrders()
  }, [fetchOrders])

  return (
    <div className="flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl w-full">
        <h1 className="text-3xl font-extrabold text-center mb-8">My Orders</h1>

        <section>
          {(!orders || orders.length === 0) ? (
            <div className="text-gray-500">No orders</div>
          ) : (
            <div className="space-y-4">
              {orders.map((order: OrderResponse) => (
                <OrderCard key={order.id} order={order} />
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  )
}

export default Protect(OrdersPage)
