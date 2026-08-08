import React, { useEffect, useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { useCart } from '../CartContext/CartContext'
import { CheckCircle, XCircle, Loader } from 'lucide-react'

const API_BASE = import.meta.env.VITE_BACKEND_URL || 'http://localhost:4000';

const OrderVerifyPage = () => {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const { dispatch } = useCart()
  const [status, setStatus] = useState('loading')
  const [order, setOrder] = useState(null)

  useEffect(() => {
    window.scrollTo(0, 0)
    const sessionId = searchParams.get('session_id')
    const token = localStorage.getItem('authToken')

    if (!sessionId || !token) {
      setStatus('error')
      return
    }

    const verify = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/order/confirm?session_id=${sessionId}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        const data = await res.json()
        if (res.ok) {
          setOrder(data)
          dispatch({ type: 'CLEAR_CART' })
          setStatus('success')
        } else {
          setStatus('error')
        }
      } catch {
        setStatus('error')
      }
    }
    verify()
  }, [searchParams])

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 pt-24 pb-12 px-4 flex items-center justify-center">
        <div className="max-w-md w-full bg-white rounded-2xl p-8 text-center shadow-sm border border-gray-100">
          {status === 'loading' && (
            <>
              <Loader className="w-16 h-16 text-[#43C6AC] mx-auto mb-4 animate-spin" />
              <h2 className="text-xl font-semibold text-gray-900">Verifying payment...</h2>
            </>
          )}
          {status === 'success' && (
            <>
              <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Payment Successful!</h2>
              <p className="text-gray-600 mb-2">Your order has been confirmed.</p>
              {order?.orderId && (
                <p className="text-sm text-[#43C6AC] font-medium mb-6">Order ID: {order.orderId}</p>
              )}
              <Link to="/orders" className="inline-flex px-6 py-3 bg-[#43C6AC] text-white rounded-lg font-medium hover:bg-[#368f7a]">
                View My Orders
              </Link>
            </>
          )}
          {status === 'error' && (
            <>
              <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Payment Verification Failed</h2>
              <p className="text-gray-600 mb-6">Something went wrong. Please contact support if amount was deducted.</p>
              <button onClick={() => navigate('/cart')} className="inline-flex px-6 py-3 bg-gray-200 text-gray-800 rounded-lg font-medium hover:bg-gray-300">
                Back to Cart
              </button>
            </>
          )}
        </div>
      </div>
      <Footer />
    </>
  )
}

export default OrderVerifyPage
