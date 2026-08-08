import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { 
  Package, Clock, Truck, CheckCircle, AlertCircle, 
  RefreshCw, MapPin, CreditCard, ArrowLeft, User, Phone, Mail
} from 'lucide-react';

const API_BASE = import.meta.env.VITE_BACKEND_URL ? (import.meta.env.VITE_BACKEND_URL.startsWith('http') ? import.meta.env.VITE_BACKEND_URL : `https://${import.meta.env.VITE_BACKEND_URL}`) : 'http://localhost:4000';

const statusConfig = {
  Pending: { icon: Clock, color: 'bg-yellow-100 text-yellow-800' },
  Processing: { icon: RefreshCw, color: 'bg-blue-100 text-blue-800' },
  Shipped: { icon: Truck, color: 'bg-indigo-100 text-indigo-800' },
  Delivered: { icon: CheckCircle, color: 'bg-green-100 text-green-800' },
  Cancelled: { icon: AlertCircle, color: 'bg-red-100 text-red-800' },
};

const OrderDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
    const fetchOrder = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/order/${id}`);
        const data = await res.json();
        if (res.ok) setOrder(data);
      } catch (err) {
        console.error('Failed to fetch order details', err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [id]);

  const formatDate = (date) =>
    new Date(date).toLocaleDateString('en-IN', { 
      day: 'numeric', month: 'short', year: 'numeric',
      hour: '2-digit', minute: '2-digit'
    });

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center bg-gray-50 pt-24">
          <p className="text-gray-500 text-lg">Loading order details...</p>
        </div>
        <Footer />
      </>
    );
  }

  if (!order) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 pt-24">
          <AlertCircle className="w-16 h-16 text-red-400 mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Order Not Found</h2>
          <p className="text-gray-600 mb-6">We couldn't find the order you're looking for.</p>
          <button 
            onClick={() => navigate('/orders')}
            className="px-6 py-3 bg-[#43C6AC] text-white rounded-lg font-medium hover:bg-[#368f7a] flex items-center gap-2"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Orders
          </button>
        </div>
        <Footer />
      </>
    );
  }

  const status = statusConfig[order.orderStatus] || statusConfig.Pending;
  const StatusIcon = status.icon;

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 pt-24 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
            <div>
              <button 
                onClick={() => navigate('/orders')}
                className="text-gray-500 hover:text-gray-900 flex items-center gap-2 mb-2 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Orders
              </button>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 flex items-center gap-3">
                Order <span className="text-[#43C6AC]">#{order.orderId}</span>
              </h1>
              <p className="text-gray-500 mt-1">Placed on {formatDate(order.placedAt)}</p>
            </div>
            <div className="text-right">
              <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold ${status.color}`}>
                <StatusIcon className="w-4 h-4" />
                {order.orderStatus}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Left Column - Order Items */}
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <Package className="w-5 h-5 text-[#43C6AC]" />
                  Order Items
                </h2>
                
                <div className="space-y-6">
                  {order.books?.map((item, idx) => (
                    <div key={idx} className="flex gap-4 items-start border-b border-gray-50 pb-6 last:border-0 last:pb-0">
                      {item.image ? (
                        <img 
                          src={item.image.startsWith('http') ? item.image : (item.image.startsWith('http') ? item.image : `${API_BASE}${ item.image.startsWith('/') ? '' : '/' }${item.image}`)}
                          alt={item.title} 
                          className="w-20 h-28 object-cover rounded-lg shadow-sm"
                        />
                      ) : (
                        <div className="w-20 h-28 bg-gray-100 rounded-lg flex items-center justify-center">
                          <Package className="w-8 h-8 text-gray-400" />
                        </div>
                      )}
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 text-lg">{item.title}</h3>
                        <p className="text-gray-500 text-sm">by {item.author}</p>
                        <div className="mt-2 flex items-center justify-between">
                          <span className="text-gray-600 bg-gray-100 px-3 py-1 rounded-lg text-sm">Qty: {item.quantity}</span>
                          <span className="font-bold text-gray-900">₹{(item.price * item.quantity).toFixed(2)}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Order Summary */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <h2 className="text-lg font-bold text-gray-900 mb-4">Price Details</h2>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal</span>
                    <span>₹{order.totalAmount?.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Tax Amount</span>
                    <span>₹{order.taxAmount?.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Shipping</span>
                    <span>{order.shippingCharges > 0 ? `₹${order.shippingCharges.toFixed(2)}` : 'Free'}</span>
                  </div>
                  <div className="pt-3 border-t border-gray-100 flex justify-between items-center">
                    <span className="font-bold text-gray-900 text-base">Total Amount</span>
                    <span className="font-bold text-xl text-[#43C6AC]">₹{order.finalAmount?.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Customer Info, Payment, Tracking */}
            <div className="space-y-6">
              
              {/* Tracking Information */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-5">
                  <Truck className="w-24 h-24" />
                </div>
                <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2 relative z-10">
                  <Truck className="w-5 h-5 text-[#43C6AC]" />
                  Tracking Details
                </h2>
                <div className="relative z-10">
                  {order.trackingId ? (
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Tracking ID</p>
                      <p className="font-mono text-lg font-semibold text-gray-900 bg-gray-50 p-3 rounded-lg border border-gray-100">
                        {order.trackingId}
                      </p>
                    </div>
                  ) : (
                    <div className="bg-orange-50 text-orange-700 p-4 rounded-lg flex items-start gap-3">
                      <Clock className="w-5 h-5 shrink-0 mt-0.5" />
                      <p className="text-sm">Tracking information is not available yet. It will be updated once your order is shipped.</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Payment Information */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-[#43C6AC]" />
                  Payment Info
                </h2>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Payment Method</p>
                    <p className="font-medium text-gray-900">{order.paymentMethod}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Payment Status</p>
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium ${
                      order.paymentStatus === 'Paid' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {order.paymentStatus}
                    </span>
                  </div>
                  {order.transactionId && (
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Transaction ID</p>
                      <p className="font-mono text-sm text-gray-900 break-all">{order.transactionId}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Shipping Address */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-[#43C6AC]" />
                  Shipping Address
                </h2>
                <div className="space-y-3 text-sm text-gray-700">
                  <p className="font-semibold text-gray-900 flex items-center gap-2">
                    <User className="w-4 h-4 text-gray-400" />
                    {order.shippingAddress?.fullname}
                  </p>
                  <p className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-gray-400" />
                    {order.shippingAddress?.phoneNumber}
                  </p>
                  <p className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-gray-400" />
                    {order.shippingAddress?.email}
                  </p>
                  <div className="flex items-start gap-2 pt-2 border-t border-gray-50">
                    <MapPin className="w-4 h-4 text-gray-400 shrink-0 mt-0.5" />
                    <p>
                      {order.shippingAddress?.street},<br/>
                      {order.shippingAddress?.city}, {order.shippingAddress?.state}<br/>
                      {order.shippingAddress?.zipCode}
                    </p>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default OrderDetailsPage;
