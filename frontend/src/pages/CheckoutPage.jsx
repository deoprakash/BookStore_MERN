import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { useCart } from '../CartContext/CartContext'
import { styles } from '../assets/dummystyles'
import { ArrowRight, MapPin, User, Mail, Phone } from 'lucide-react'

const API_BASE = import.meta.env.VITE_BACKEND_URL ? (import.meta.env.VITE_BACKEND_URL.startsWith('http') ? import.meta.env.VITE_BACKEND_URL : `https://${import.meta.env.VITE_BACKEND_URL}`) : 'http://localhost:4000';

const CheckoutPage = () => {
  const { cart, dispatch } = useCart()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    name: localStorage.getItem('userName') || '',
    email: localStorage.getItem('userEmail') || '',
    phone: '',
    street: '',
    city: '',
    state: '',
    zip: '',
    notes: '',
  })

  const subtotal = cart.items.reduce((sum, i) => sum + i.price * i.quantity, 0)
  const tax = +(subtotal * 0.05).toFixed(2)
  const total = subtotal + tax

  useEffect(() => {
    window.scrollTo(0, 0)
    const token = localStorage.getItem('authToken')
    if (!token) navigate('/login')
    if (cart.items.length === 0) navigate('/cart')
  }, [navigate])

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const token = localStorage.getItem('authToken')
    if (!token) return navigate('/login')

    navigate('/payment', { state: { formDetails: form } })
  }

  const inputClass = "w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#43C6AC] focus:border-transparent"

  return (
    <>
      <Navbar />
      <div className={styles.container}>
        <div className={styles.wrapper}>
          <div className={styles.header}>
            <h1 className={styles.title}>Checkout</h1>
            <p className={styles.subtitle}>Complete your order details</p>
          </div>

          <form onSubmit={handleSubmit} className={styles.cartGrid}>
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <User className="w-5 h-5 text-[#43C6AC]" /> Contact Information
                </h2>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                    <input name="name" value={form.name} onChange={handleChange} required className={inputClass} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input name="email" type="email" value={form.email} onChange={handleChange} required className={inputClass} />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                    <input name="phone" value={form.phone} onChange={handleChange} required className={inputClass} placeholder="+91..." />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-[#43C6AC]" /> Shipping Address
                </h2>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Street Address</label>
                    <input name="street" value={form.street} onChange={handleChange} required className={inputClass} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                    <input name="city" value={form.city} onChange={handleChange} required className={inputClass} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
                    <input name="state" value={form.state} onChange={handleChange} required className={inputClass} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">PIN Code</label>
                    <input name="zip" value={form.zip} onChange={handleChange} required className={inputClass} />
                  </div>
                </div>
              </div>

              {/* Payment selection removed */}
            </div>

            <div className={styles.summaryCard}>
              <h2 className={styles.summaryTitle}>Order Summary</h2>
              <div className="space-y-3 mb-6">
                {cart.items.map(item => (
                  <div key={`${item.source}-${item.id || item._id}`} className="flex justify-between text-sm">
                    <span className="text-gray-600">{item.title} × {item.quantity}</span>
                    <span className="font-medium">₹{(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>
              <div className={styles.summaryBreakdown}>
                <div className={styles.summaryRow}>
                  <span className={styles.summaryLabel}>Subtotal</span>
                  <span className={styles.summaryValue}>₹{subtotal.toFixed(2)}</span>
                </div>
                <div className={styles.summaryRow}>
                  <span className={styles.summaryLabel}>Tax (5%)</span>
                  <span className={styles.summaryValue}>₹{tax.toFixed(2)}</span>
                </div>
                <div className={styles.summaryRow}>
                  <span className={styles.summaryLabel}>Shipping</span>
                  <span className={styles.summaryShipping}>Free</span>
                </div>
              </div>
              <div className={styles.summaryTotalSection}>
                <div className={styles.totalRow}>
                  <span className={styles.totalLabel}>Total</span>
                  <span className={styles.totalAmount}>₹{total.toFixed(2)}</span>
                </div>
              </div>
              <button type="submit" className={styles.checkoutBtn}>
                Proceed to Payment
                <ArrowRight className={styles.checkoutIcon} />
              </button>
            </div>
          </form>
        </div>
      </div>
      <Footer />
    </>
  )
}

export default CheckoutPage
