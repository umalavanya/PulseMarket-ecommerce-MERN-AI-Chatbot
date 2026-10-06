import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { ShoppingBag, CheckCircle, Clock, Truck, RefreshCw, Eye } from 'lucide-react';
import Loader from '../components/Loader';
import Message from '../components/Message';

const OrderListPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState('');

  const { userInfo } = useSelector((state) => state.auth);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError(null);
      const config = {
        headers: {
          Authorization: `Bearer ${userInfo?.token}`,
        },
      };
      const { data } = await axios.get('/api/orders', config);
      setOrders(data);
      setLoading(false);
    } catch (err) {
      // Fallback local storage orders if backend offline
      const localOrders = JSON.parse(localStorage.getItem('localOrders') || '[]');
      setOrders(localOrders);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [userInfo]);

  const handleDeliver = async (orderId) => {
    if (window.confirm('Mark this order as delivered?')) {
      try {
        const config = {
          headers: {
            Authorization: `Bearer ${userInfo?.token}`,
          },
        };
        await axios.put(`/api/orders/${orderId}/deliver`, {}, config);
        setMessage(`Order ${orderId} marked as delivered!`);
        setTimeout(() => setMessage(''), 4000);
        fetchOrders();
      } catch (err) {
        // Fallback for local storage orders
        const localOrders = JSON.parse(localStorage.getItem('localOrders') || '[]');
        const updated = localOrders.map((o) =>
          o._id === orderId ? { ...o, isDelivered: true, deliveredAt: new Date().toISOString() } : o
        );
        localStorage.setItem('localOrders', JSON.stringify(updated));
        setMessage(`Order ${orderId} marked as delivered!`);
        setTimeout(() => setMessage(''), 4000);
        fetchOrders();
      }
    }
  };

  return (
    <div className="section" style={{ padding: '2rem 0' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--color-text-main)', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <ShoppingBag size={28} style={{ color: 'var(--color-accent)' }} /> All Customer Orders
          </h1>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>
            View system-wide orders, track fulfillment status, and update shipment delivery.
          </p>
        </div>
        <button className="btn btn-secondary btn-sm" onClick={fetchOrders} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <RefreshCw size={16} /> Refresh Orders
        </button>
      </div>

      {message && <Message variant="success">{message}</Message>}
      {error && <Message variant="danger">{error}</Message>}

      {loading ? (
        <Loader />
      ) : orders.length === 0 ? (
        <Message variant="info">No orders have been placed in the system yet.</Message>
      ) : (
        <div style={{ background: 'var(--color-bg-surface)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-lg)', overflow: 'hidden', boxShadow: 'var(--shadow-md)' }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.92rem' }}>
              <thead>
                <tr style={{ background: 'var(--color-bg-elevated)', borderBottom: '1px solid var(--color-border)', color: 'var(--color-text-muted)', textTransform: 'uppercase', fontSize: '0.78rem', letterSpacing: '0.5px' }}>
                  <th style={{ padding: '1rem 1.2rem' }}>Order ID</th>
                  <th style={{ padding: '1rem 1.2rem' }}>User / Customer</th>
                  <th style={{ padding: '1rem 1.2rem' }}>Date</th>
                  <th style={{ padding: '1rem 1.2rem' }}>Total</th>
                  <th style={{ padding: '1rem 1.2rem' }}>Paid</th>
                  <th style={{ padding: '1rem 1.2rem' }}>Delivered</th>
                  <th style={{ padding: '1rem 1.2rem', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((o) => (
                  <tr key={o._id} style={{ borderBottom: '1px solid var(--color-border)' }}>
                    <td style={{ padding: '1rem 1.2rem', fontFamily: 'monospace', fontSize: '0.82rem', color: 'var(--color-text-muted)' }}>
                      {o._id}
                    </td>
                    <td style={{ padding: '1rem 1.2rem', fontWeight: 600, color: 'var(--color-text-main)' }}>
                      {o.user ? o.user.name : (o.shippingAddress?.fullName || 'Customer')}
                    </td>
                    <td style={{ padding: '1rem 1.2rem', color: 'var(--color-text-muted)' }}>
                      {new Date(o.createdAt).toLocaleDateString()}
                    </td>
                    <td style={{ padding: '1rem 1.2rem', fontWeight: 700, color: 'var(--color-accent)' }}>
                      ${Number(o.totalPrice).toFixed(2)}
                    </td>
                    <td style={{ padding: '1rem 1.2rem' }}>
                      {o.isPaid ? (
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', background: 'rgba(16, 185, 129, 0.15)', color: '#10B981', padding: '0.2rem 0.5rem', borderRadius: 'var(--radius-full)', fontSize: '0.78rem', fontWeight: 700 }}>
                          <CheckCircle size={14} /> Paid
                        </span>
                      ) : (
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', background: 'rgba(239, 68, 68, 0.15)', color: '#EF4444', padding: '0.2rem 0.5rem', borderRadius: 'var(--radius-full)', fontSize: '0.78rem', fontWeight: 600 }}>
                          Unpaid
                        </span>
                      )}
                    </td>
                    <td style={{ padding: '1rem 1.2rem' }}>
                      {o.isDelivered ? (
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', background: 'rgba(16, 185, 129, 0.15)', color: '#10B981', padding: '0.2rem 0.5rem', borderRadius: 'var(--radius-full)', fontSize: '0.78rem', fontWeight: 700 }}>
                          <Truck size={14} /> Delivered
                        </span>
                      ) : (
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', background: 'rgba(245, 158, 11, 0.15)', color: '#F59E0B', padding: '0.2rem 0.5rem', borderRadius: 'var(--radius-full)', fontSize: '0.78rem', fontWeight: 600 }}>
                          <Clock size={14} /> Pending
                        </span>
                      )}
                    </td>
                    <td style={{ padding: '1rem 1.2rem', textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', gap: '0.5rem' }}>
                        <Link
                          to={`/order/${o._id}`}
                          className="btn btn-secondary btn-sm"
                          style={{ padding: '0.35rem 0.6rem', fontSize: '0.8rem', display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}
                        >
                          <Eye size={14} /> View
                        </Link>
                        {!o.isDelivered && (
                          <button
                            onClick={() => handleDeliver(o._id)}
                            className="btn btn-accent btn-sm"
                            style={{ padding: '0.35rem 0.6rem', fontSize: '0.8rem', display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}
                          >
                            <Truck size={14} /> Mark Delivered
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderListPage;
