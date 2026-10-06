import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMyOrders } from '../redux/slices/orderSlice';
import Loader from '../components/Loader';
import Message from '../components/Message';
import { Package, Eye, CheckCircle2, Clock } from 'lucide-react';

const OrderHistoryPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { userInfo } = useSelector((state) => state.auth);
  const { orders, loading, error } = useSelector((state) => state.orders);

  useEffect(() => {
    if (!userInfo) {
      navigate('/login?redirect=orders');
    } else {
      dispatch(fetchMyOrders());
    }
  }, [userInfo, navigate, dispatch]);

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: '2.2rem', color: 'var(--color-primary-dark)', margin: 0 }}>
          My Order History
        </h1>
        <span className="text-muted" style={{ fontWeight: 600 }}>
          Account: {userInfo?.name} ({userInfo?.email})
        </span>
      </div>

      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : orders.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '3rem 1rem', background: 'white', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-border)' }}>
          <Package size={64} color="var(--color-text-light)" style={{ marginBottom: '1rem' }} />
          <h2>No orders placed yet</h2>
          <p style={{ color: 'var(--color-text-muted)', marginBottom: '1.5rem' }}>
            When you place an order, it will appear here with real-time status tracking.
          </p>
          <Link to="/" className="btn btn-primary">
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className="cart-table-card" style={{ padding: '1rem', overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid var(--color-bg-warm)', color: 'var(--color-text-muted)', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                <th style={{ padding: '0.85rem' }}>ORDER ID</th>
                <th style={{ padding: '0.85rem' }}>DATE</th>
                <th style={{ padding: '0.85rem' }}>TOTAL</th>
                <th style={{ padding: '0.85rem' }}>PAYMENT STATUS</th>
                <th style={{ padding: '0.85rem' }}>DELIVERY STATUS</th>
                <th style={{ padding: '0.85rem', textAlign: 'right' }}>ACTION</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order._id} style={{ borderBottom: '1px solid var(--color-border)' }}>
                  <td style={{ padding: '1rem 0.85rem', fontWeight: 700, color: 'var(--color-primary-dark)' }}>
                    #{order._id.substring(0, 10)}...
                  </td>
                  <td style={{ padding: '1rem 0.85rem', color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>
                    {new Date(order.createdAt || Date.now()).toLocaleDateString()}
                  </td>
                  <td style={{ padding: '1rem 0.85rem', fontWeight: 800, color: 'var(--color-primary-dark)' }}>
                    ${order.totalPrice?.toFixed(2)}
                  </td>
                  <td style={{ padding: '1rem 0.85rem' }}>
                    <span className={`badge ${order.isPaid ? 'badge-success' : 'badge-danger'}`}>
                      {order.isPaid ? <CheckCircle2 size={12} /> : <Clock size={12} />}
                      {order.isPaid ? 'Paid' : 'Pending'}
                    </span>
                  </td>
                  <td style={{ padding: '1rem 0.85rem' }}>
                    <span className={`badge ${order.isDelivered ? 'badge-success' : 'badge-warning'}`}>
                      {order.isDelivered ? <CheckCircle2 size={12} /> : <Package size={12} />}
                      {order.isDelivered ? 'Delivered' : 'In Transit'}
                    </span>
                  </td>
                  <td style={{ padding: '1rem 0.85rem', textAlign: 'right' }}>
                    <Link to={`/order/${order._id}`} className="btn btn-outline btn-sm">
                      <Eye size={14} />
                      <span>Details</span>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default OrderHistoryPage;
