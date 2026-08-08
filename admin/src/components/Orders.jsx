import React, { useEffect, useMemo, useState } from 'react'
import { styles } from '../assets/dummyStyles'
import {
  Search, ChevronUp, ChevronDown, Truck, CreditCard, DollarSign, CheckCircle, Clock, AlertCircle,
  BookOpen, User, MapPin, Mail, Phone, X, Package, RefreshCw
} from 'lucide-react'
import axios from 'axios'

const API_BASE = import.meta.env.VITE_BACKEND_URL ? (import.meta.env.VITE_BACKEND_URL.startsWith('http') ? import.meta.env.VITE_BACKEND_URL : `https://${import.meta.env.VITE_BACKEND_URL}`) : 'http://localhost:4000';

const statusOptions = [
  { value: "Pending", label: "Pending", icon: Clock, color: "bg-yellow-100 text-yellow-800", iconColor: "text-yellow-500" },
  { value: "Processing", label: "Processing", icon: RefreshCw, color: "bg-blue-100 text-blue-800", iconColor: "text-blue-500" },
  { value: "Shipped", label: "Shipped", icon: Truck, color: "bg-green-100 text-green-800", iconColor: "text-green-500" },
  { value: "Delivered", label: "Delivered", icon: CheckCircle, color: "bg-green-100 text-green-800", iconColor: "text-green-500" },
  { value: "Cancelled", label: "Cancelled", icon: AlertCircle, color: "bg-red-100 text-red-800", iconColor: "text-red-500" },
];

const tabs = [
  { id: 'all', label: 'All Orders' },
  ...statusOptions.map(o => ({ id: o.value, label: o.label })),
];

const statCards = [
  { key: 'totalOrders', label: 'Total Orders', icon: Package, color: 'bg-indigo-100 text-indigo-600' },
  { key: 'pending', label: 'Pending', icon: Clock, color: 'bg-yellow-100 text-yellow-600' },
  { key: 'processing', label: 'Processing', icon: RefreshCw, color: 'bg-blue-100 text-blue-600' },
  { key: 'pendingPayment', label: 'Unpaid', icon: CreditCard, color: 'bg-orange-100 text-orange-600' },
];

const getStatusStyle = (status) =>
  statusOptions.find(o => o.value === status)?.color || 'bg-gray-100 text-gray-800';

const formatDate = (date) =>
  date ? new Date(date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : '—';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [activeTab, setActiveTab] = useState('all');
  const [counts, setCounts] = useState({
    totalOrders: 0, pending: 0, processing: 0, shipped: 0, delivered: 0, cancelled: 0, pendingPayment: 0
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [trackingIdInput, setTrackingIdInput] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const params = {
        ...(searchTerm && { search: searchTerm }),
        ...(activeTab !== "all" && { status: activeTab }),
      };
      const { data } = await axios.get(`${API_BASE}/api/order`, { params });
      setOrders(data.orders);
      setCounts(data.counts);
    } catch (err) {
      console.error("Error fetching orders:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(fetchOrders, 300);
    return () => clearTimeout(timer);
  }, [searchTerm, activeTab]);

  const sortedOrders = useMemo(() => {
    if (!sortConfig.key) return orders;
    return [...orders].sort((a, b) => {
      const aVal = sortConfig.key === "placedAt" ? new Date(a.placedAt) : a[sortConfig.key];
      const bVal = sortConfig.key === "placedAt" ? new Date(b.placedAt) : b[sortConfig.key];
      if (aVal < bVal) return sortConfig.direction === "asc" ? -1 : 1;
      if (aVal > bVal) return sortConfig.direction === "asc" ? 1 : -1;
      return 0;
    });
  }, [orders, sortConfig]);

  const handleSort = (key) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc",
    }));
  };

  const SortIcon = ({ column }) => {
    if (sortConfig.key !== column) return null;
    return sortConfig.direction === "asc"
      ? <ChevronUp className="w-4 h-4 ml-1" />
      : <ChevronDown className="w-4 h-4 ml-1" />;
  };

  const viewOrder = async (orderId) => {
    try {
      const { data } = await axios.get(`${API_BASE}/api/order/${orderId}`);
      setSelectedOrder(data);
      setTrackingIdInput(data.trackingId || "");
    } catch (err) {
      console.error("Failed to fetch order details:", err);
    }
  };

  const updateStatus = async (id, newStatus) => {
    try {
      await axios.put(`${API_BASE}/api/order/${id}`, { orderStatus: newStatus });
      await fetchOrders();
      if (selectedOrder?._id === id) {
        const { data: fresh } = await axios.get(`${API_BASE}/api/order/${id}`);
        setSelectedOrder(fresh);
      }
    } catch (err) {
      console.error("Failed to update order status:", err);
    }
  };

  const updatePaymentStatus = async (id, newPaymentStatus) => {
    try {
      await axios.put(`${API_BASE}/api/order/${id}`, { paymentStatus: newPaymentStatus });
      await fetchOrders();
      if (selectedOrder?._id === id) {
        const { data: fresh } = await axios.get(`${API_BASE}/api/order/${id}`);
        setSelectedOrder(fresh);
      }
    } catch (err) {
      console.error("Failed to update payment status:", err);
    }
  };

  const updateTrackingId = async (id) => {
    try {
      await axios.put(`${API_BASE}/api/order/${id}`, { trackingId: trackingIdInput });
      await fetchOrders();
      if (selectedOrder?._id === id) {
        const { data: fresh } = await axios.get(`${API_BASE}/api/order/${id}`);
        setSelectedOrder(fresh);
        setTrackingIdInput(fresh.trackingId || "");
      }
    } catch (err) {
      console.error("Failed to update tracking ID:", err);
    }
  };

  return (
    <div className={styles.pageBackground}>
      <div className={styles.container}>
        <div className="mb-8">
          <h1 className={styles.headerTitle}>Orders Management</h1>
          <p className={styles.headerSubtitle}>Track and manage all your orders</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statCards.map(({ key, label, icon: Icon, color }) => (
            <div key={key} className={styles.statsCard}>
              <div className={styles.statsCardContent}>
                <div>
                  <p className={styles.statsCardLabel}>{label}</p>
                  <p className={styles.statsCardValue}>{counts[key] ?? 0}</p>
                </div>
                <div className={styles.statsIconContainer(color.split(' ')[0])}>
                  <Icon className={`w-6 h-6 ${color.split(' ').slice(1).join(' ')}`} />
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className={styles.controlsContainer}>
          <div className={styles.controlsInner}>
            <div className={styles.tabsContainer}>
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={styles.tabButton(activeTab === tab.id)}
                >
                  {tab.label}
                </button>
              ))}
            </div>
            <div className={styles.searchContainer}>
              <div className={styles.searchIcon}>
                <Search className="w-5 h-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search by order ID, customer, or book..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={styles.searchInput}
              />
            </div>
          </div>
        </div>

        <div className={styles.ordersTableContainer}>
          {loading ? (
            <p className="text-center py-12 text-gray-500">Loading orders...</p>
          ) : sortedOrders.length === 0 ? (
            <div className={styles.emptyState}>
              <div className={styles.emptyIconContainer}>
                <Package className={styles.emptyIcon} />
              </div>
              <h3 className={styles.emptyTitle}>No orders found</h3>
              <p className={styles.emptyMessage}>Orders will appear here once customers place them.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className={styles.table}>
                <thead className={styles.tableHead}>
                  <tr>
                    {[
                      { key: 'orderId', label: 'Order ID' },
                      { key: 'shippingAddress.fullname', label: 'Customer' },
                      { key: 'placedAt', label: 'Date' },
                      { key: 'finalAmount', label: 'Amount' },
                      { key: 'paymentStatus', label: 'Payment Status' },
                      { key: 'orderStatus', label: 'Status' },
                      { key: null, label: 'Actions' },
                    ].map(col => (
                      <th
                        key={col.label}
                        className={styles.tableHeader}
                        onClick={() => col.key && handleSort(col.key === 'shippingAddress.fullname' ? 'orderId' : col.key)}
                      >
                        <div className={styles.tableHeaderContent}>
                          {col.label}
                          {col.key && col.key !== 'shippingAddress.fullname' && <SortIcon column={col.key} />}
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {sortedOrders.map(order => (
                    <tr key={order._id} className={styles.tableRow}>
                      <td className={styles.tableCell}>
                        <span className={styles.idCell}>{order.orderId}</span>
                      </td>
                      <td className={styles.tableCell}>
                        <div className={styles.customerCell}>{order.shippingAddress?.fullname}</div>
                        <div className="text-xs text-gray-500">{order.shippingAddress?.email}</div>
                      </td>
                      <td className={styles.tableCell}>
                        <span className={styles.dateCell}>{formatDate(order.placedAt)}</span>
                      </td>
                      <td className={styles.tableCell}>
                        <span className={styles.amountCell}>₹{order.finalAmount?.toFixed(2)}</span>
                      </td>
                      <td className={styles.tableCell}>
                        <span className={styles.paymentBadge(order.paymentStatus === 'Paid')}>
                          <DollarSign className="w-3 h-3" />
                          {order.paymentStatus}
                        </span>
                      </td>
                      <td className={styles.tableCell}>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusStyle(order.orderStatus)}`}>
                          {order.orderStatus}
                        </span>
                      </td>
                      <td className={styles.tableCell}>
                        <button onClick={() => viewOrder(order._id)} className={styles.viewButton}>
                          View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {selectedOrder && (
        <div className={styles.modalOverlay} onClick={() => setSelectedOrder(null)}>
          <div className={styles.modalContainer} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <div>
                <h2 className={styles.modalTitle}>Order {selectedOrder.orderId}</h2>
                <p className={styles.modalSubtitle}>Placed on {formatDate(selectedOrder.placedAt)}</p>
              </div>
              <button onClick={() => setSelectedOrder(null)} className={styles.closeButton}>
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className={styles.modalGrid}>
              <div className={styles.modalSection}>
                <h3 className={styles.sectionTitle}>
                  <User className={styles.sectionIcon} /> Customer
                </h3>
                <div className={styles.sectionContent}>
                  <div className={styles.infoItem}>
                    <User className={styles.infoIcon} />
                    <div>
                      <p className={styles.infoLabel}>Name</p>
                      <p className={styles.infoValue}>{selectedOrder.shippingAddress?.fullname}</p>
                    </div>
                  </div>
                  <div className={styles.infoItem}>
                    <Mail className={styles.infoIcon} />
                    <div>
                      <p className={styles.infoLabel}>Email</p>
                      <p className={styles.infoValue}>{selectedOrder.shippingAddress?.email}</p>
                    </div>
                  </div>
                  <div className={styles.infoItem}>
                    <Phone className={styles.infoIcon} />
                    <div>
                      <p className={styles.infoLabel}>Phone</p>
                      <p className={styles.infoValue}>{selectedOrder.shippingAddress?.phoneNumber}</p>
                    </div>
                  </div>
                  <div className={styles.infoItem}>
                    <MapPin className={styles.infoIcon} />
                    <div>
                      <p className={styles.infoLabel}>Address</p>
                      <p className={styles.infoValue}>
                        {selectedOrder.shippingAddress?.street}, {selectedOrder.shippingAddress?.city},{' '}
                        {selectedOrder.shippingAddress?.state} - {selectedOrder.shippingAddress?.zipCode}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className={styles.modalSection}>
                <h3 className={styles.sectionTitle}>
                  <BookOpen className={styles.sectionIcon} /> Order Items
                </h3>
                <div className={styles.sectionContent}>
                  {selectedOrder.books?.map((item, idx) => (
                    <div key={idx} className={styles.summaryItem}>
                      <div>
                        <p className={styles.summaryTitle}>{item.title}</p>
                        <p className={styles.summaryCategory}>by {item.author} × {item.quantity}</p>
                      </div>
                      <p className={styles.summaryPrice}>₹{(item.price * item.quantity).toFixed(2)}</p>
                    </div>
                  ))}
                  <div className={styles.totalItem(false)}>
                    <span className={styles.totalLabel}>Subtotal</span>
                    <span>₹{selectedOrder.totalAmount?.toFixed(2)}</span>
                  </div>
                  <div className={styles.totalItem(false)}>
                    <span className={styles.totalLabel}>Tax (5%)</span>
                    <span>₹{selectedOrder.taxAmount?.toFixed(2)}</span>
                  </div>
                  <div className={styles.totalItem(true)}>
                    <span className={styles.totalLabel}>Total</span>
                    <span className={styles.totalValue(true)}>₹{selectedOrder.finalAmount?.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <div className={styles.modalSection}>
                <h3 className={styles.sectionTitle}>
                  <CreditCard className={styles.sectionIcon} /> Payment
                </h3>
                <div className={styles.sectionContent}>
                  <div className={styles.paymentInfoItem}>
                    <span className={styles.paymentLabel}>Method</span>
                    <span>{selectedOrder.paymentMethod}</span>
                  </div>
                  {selectedOrder.transactionId && (
                    <div className={styles.paymentInfoItem}>
                      <span className={styles.paymentLabel}>Transaction ID</span>
                      <span className="font-mono text-sm text-gray-700">{selectedOrder.transactionId}</span>
                    </div>
                  )}
                  <div className={styles.paymentInfoItem}>
                    <span className={styles.paymentLabel}>Status</span>
                    <span className={styles.paymentBadgeModal(
                      selectedOrder.paymentStatus === 'Paid' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    )}>
                      {selectedOrder.paymentStatus}
                    </span>
                  </div>
                  {(selectedOrder.paymentMethod === 'Cash on Delivery' || selectedOrder.paymentMethod === 'QR Payment') && (
                    <div className={styles.paymentInfoItem}>
                      <span className={styles.paymentLabel}>Action</span>
                      {selectedOrder.paymentStatus === 'Unpaid' ? (
                        <button
                          id="mark-paid-btn"
                          onClick={() => updatePaymentStatus(selectedOrder._id, 'Paid')}
                          className="flex items-center gap-1.5 px-3 py-1.5 bg-green-600 hover:bg-green-700 active:scale-95 text-white text-xs font-semibold rounded-lg transition-all duration-150 shadow-sm"
                        >
                          <CheckCircle className="w-3.5 h-3.5" />
                          Mark as Paid
                        </button>
                      ) : (
                        <button
                          id="mark-unpaid-btn"
                          onClick={() => updatePaymentStatus(selectedOrder._id, 'Unpaid')}
                          className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-200 hover:bg-red-100 hover:text-red-700 active:scale-95 text-gray-600 text-xs font-semibold rounded-lg transition-all duration-150 shadow-sm"
                        >
                          <AlertCircle className="w-3.5 h-3.5" />
                          Mark as Unpaid
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>

              <div className={styles.modalSection}>
                <h3 className={styles.sectionTitle}>
                  <Truck className={styles.sectionIcon} /> Update Status
                </h3>
                <label className={styles.statusLabel}>Order Status</label>
                <select
                  value={selectedOrder.orderStatus}
                  onChange={(e) => updateStatus(selectedOrder._id, e.target.value)}
                  className={styles.statusSelect}
                >
                  {statusOptions.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>

              <div className={styles.modalSection}>
                <h3 className={styles.sectionTitle}>
                  <Package className={styles.sectionIcon} /> Tracking Information
                </h3>
                <label className={styles.statusLabel}>Tracking ID</label>
                <div className="flex gap-2">
                  <input 
                    type="text" 
                    value={trackingIdInput} 
                    onChange={(e) => setTrackingIdInput(e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-[#43C6AC] focus:border-[#43C6AC] text-sm"
                    placeholder="Enter Tracking ID"
                  />
                  <button 
                    onClick={() => updateTrackingId(selectedOrder._id)}
                    className="px-4 py-2 bg-[#43C6AC] text-white rounded-lg text-sm font-medium hover:bg-[#368f7a]"
                  >
                    Save
                  </button>
                </div>
              </div>
            </div>

            <div className={styles.modalFooter}>
              <button onClick={() => setSelectedOrder(null)} className={styles.footerButtonClose}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Orders;
