import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { useCart } from '../CartContext/CartContext'
import { styles } from '../assets/dummystyles'
import { CreditCard, CheckCircle, Loader } from 'lucide-react'
import qrCodeImg from '../assets/qr_code.png'

const API_BASE = import.meta.env.VITE_BACKEND_URL || 'http://localhost:4000';

const PaymentPage = () => {
  const { cart, dispatch } = useCart()
  const navigate = useNavigate()
  const location = useLocation()
  
  const formDetails = location.state?.formDetails;
  
  const [transactionId, setTransactionId] = useState('')
  const [loading, setLoading] = useState(false)

  const subtotal = cart.items.reduce((sum, i) => sum + i.price * i.quantity, 0)
  const tax = +(subtotal * 0.05).toFixed(2)
  const total = subtotal + tax

  useEffect(() => {
    window.scrollTo(0, 0)
    const token = localStorage.getItem('authToken')
    if (!token) navigate('/login')
    else if (!formDetails) navigate('/checkout') // if accessed directly without form details
    else if (cart.items.length === 0) navigate('/cart')
  }, [navigate])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!transactionId) {
      alert('Please enter your transaction ID.')
      return
    }

    const token = localStorage.getItem('authToken')
    if (!token) return navigate('/login')

    setLoading(true)
    const payload = {
      customer: {
        name: formDetails.name,
        email: formDetails.email,
        phone: formDetails.phone,
        address: { 
          street: formDetails.street, 
          city: formDetails.city, 
          state: formDetails.state, 
          zip: formDetails.zip 
        },
      },
      items: cart.items.map(i => ({
        id: i._id || i.id,
        name: i.title,
        price: i.price,
        quantity: i.quantity,
      })),
      paymentMethod: 'QR Payment',
      transactionId: transactionId,
      notes: formDetails.notes,
    }

    try {
      const res = await fetch(`${API_BASE}/api/order`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      })
      const data = await res.json()
      if (!res.ok) {
        alert(data.message || 'Payment submission failed')
        setLoading(false)
        return
      }

      dispatch({ type: 'CLEAR_CART' })
      navigate('/orders')
    } catch (err) {
      console.error('Payment error', err)
      alert('Something went wrong. Please try again.')
      setLoading(false)
    }
  }

  const inputClass = "w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#43C6AC] focus:border-transparent"

  return (
    <>
      <Navbar />
      <div className={styles.container}>
        <div className={styles.wrapper}>
          <div className={styles.header}>
            <h1 className={styles.title}>Complete Payment</h1>
            <p className={styles.subtitle}>Scan the QR code to finish your order</p>
          </div>

          <form onSubmit={handleSubmit} className="max-w-2xl mx-auto space-y-6">
            <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100 flex flex-col items-center">
                <p className="text-gray-700 mb-6 text-center text-lg">Total Amount to Pay: <span className="font-bold text-xl text-[#43C6AC]">₹{total.toFixed(2)}</span></p>
                <img src={qrCodeImg} alt="Payment QR Code" className="w-56 h-56 mb-8 rounded-lg shadow-md border border-gray-200" />
                
                <div className="w-full max-w-md">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Transaction ID <span className="text-red-500">*</span></label>
                    <input 
                      name="transactionId" 
                      value={transactionId} 
                      onChange={(e) => setTransactionId(e.target.value)} 
                      required
                      placeholder="Enter your UPI/Bank transaction ID"
                      className={inputClass} 
                    />
                </div>
            </div>

            <button type="submit" disabled={loading} className={`${styles.checkoutBtn} w-full justify-center text-lg py-4`}>
              {loading ? (
                <span className="flex items-center gap-2">
                  <Loader className="w-5 h-5 animate-spin" /> Processing...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5" /> Submit Payment
                </span>
              )}
            </button>
          </form>
        </div>
      </div>
      <Footer />
    </>
  )
}

export default PaymentPage
