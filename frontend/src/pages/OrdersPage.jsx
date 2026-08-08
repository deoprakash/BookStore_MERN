import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { Package, Clock, Truck, CheckCircle, AlertCircle, RefreshCw } from 'lucide-react'
import EmptyOrdersImage from '../assets/Book8.png'

const API_BASE = import.meta.env.VITE_BACKEND_URL ? (import.meta.env.VITE_BACKEND_URL.startsWith('http') ? import.meta.env.VITE_BACKEND_URL : `https://${import.meta.env.VITE_BACKEND_URL}`) : 'http://localhost:4000';

const statusConfig = {
  Pending: { icon: Clock, color: 'bg-yellow-100 text-yellow-800' },
  Processing: { icon: RefreshCw, color: 'bg-blue-100 text-blue-800' },
  Shipped: { icon: Truck, color: 'bg-indigo-100 text-indigo-800' },
  Delivered: { icon: CheckCircle, color: 'bg-green-100 text-green-800' },
  Cancelled: { icon: AlertCircle, color: 'bg-red-100 text-red-800' },
}

const OrdersPage = () => {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    window.scrollTo(0, 0)
    const token = localStorage.getItem('authToken')
    if (!token) {
      navigate('/login')
      return
    }

    const fetchOrders = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/order/user`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        const data = await res.json()
        if (res.ok) setOrders(data)
      } catch (err) {
        console.error('Failed to fetch orders', err)
      } finally {
        setLoading(false)
      }
    }
    fetchOrders()
  }, [navigate])

  const formatDate = (date) =>
    new Date(date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 pt-24 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 flex items-center justify-center gap-3">
              <Package className="w-8 h-8 text-emerald-600" />
              My Orders
            </h1>
            <p className="text-gray-600 mt-2">Track your book orders from BookHub</p>
          </div>

          {loading ? (
            <p className="text-center text-gray-500 py-12">Loading your orders...</p>
          ) : orders.length === 0 ? (
            <div className="bg-white rounded-2xl p-8 text-center shadow-sm border border-gray-100 max-w-md mx-auto">
              <img src={EmptyOrdersImage} alt="Empty Orders" className="w-32 h-32 mx-auto mb-6 object-contain opacity-80" />
              <h2 className="text-xl font-semibold text-gray-900 mb-2">No orders yet</h2>
              <p className="text-gray-600 mb-6">Browse our collection and place your first order.</p>
              <Link to="/books" className="inline-flex px-6 py-3 bg-[#43C6AC] text-white rounded-lg font-medium hover:bg-[#368f7a]">
                Browse Books
              </Link>
            </div>
          ) : (
            <div className="space-y-6">
              {orders.map(order => {
                const status = statusConfig[order.orderStatus] || statusConfig.Pending
                const StatusIcon = status.icon
                return (
                  <div 
                    key={order._id} 
                    onClick={() => navigate(`/order/${order._id}`)}
                    className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 cursor-pointer hover:shadow-md transition-shadow"
                  >
                    <div className="flex flex-wrap justify-between items-start gap-4 mb-4">
                      <div>
                        <p className="text-sm text-gray-500">Order ID</p>
                        <p className="font-semibold text-[#43C6AC]">{order.orderId}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-500">{formatDate(order.placedAt)}</p>
                        <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium mt-1 ${status.color}`}>
                          <StatusIcon className="w-3 h-3" />
                          {order.orderStatus}
                        </span>
                      </div>
                    </div>

                    <div className="border-t border-gray-100 pt-4 space-y-2">
                      {order.books?.map((item, idx) => (
                        <div key={idx} className="flex justify-between text-sm">
                          <span className="text-gray-700">{item.title} × {item.quantity}</span>
                          <span className="font-medium">₹{(item.price * item.quantity).toFixed(2)}</span>
                        </div>
                      ))}
                    </div>

                    <div className="border-t border-gray-100 mt-4 pt-4 flex flex-wrap justify-between items-center gap-2">
                      <div className="text-sm text-gray-600">
                        {order.paymentMethod} · <span className={order.paymentStatus === 'Paid' ? 'text-green-600' : 'text-orange-600'}>{order.paymentStatus}</span>
                      </div>
                      <p className="text-lg font-bold text-gray-900">₹{order.finalAmount?.toFixed(2)}</p>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  )
}

export default OrdersPage
