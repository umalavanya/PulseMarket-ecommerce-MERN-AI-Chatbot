import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchOrderDetails } from '../redux/slices/orderSlice';
import Loader from '../components/Loader';
import Message from '../components/Message';
import { ArrowLeft, CheckCircle2, Clock, MapPin, CreditCard, Package } from 'lucide-react';

const OrderDetailsPage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();

  const { order, loading, error } = useSelector((state) => state.orders);

  useEffect(() => {
    dispatch(fetchOrderDetails(id));
  }, [dispatch, id]);

  return (
    <div>
      <Link to="/orders" className="btn btn-outline btn-sm" style={{ marginBottom: '1.5rem' }}>
        <ArrowLeft size={16} />
        <span>Back to Order History</span>
      </Link>

      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : order ? (
        <div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem' }}>
            <div>
              <h1 style={{ fontSize: '2rem', color: 'var(--color-primary-dark)', margin: 0 }}>
                Order #{order._id}
              </h1>
              <span className="text-muted" style={{ fontSize: '0.9rem' }}>
                Placed on {new Date(order.createdAt || Date.now()).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>

            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <span className={`badge ${order.isPaid ? 'badge-success' : 'badge-danger'}`}>
                {order.isPaid ? <CheckCircle2 size={14} /> : <Clock size={14} />}
                {order.isPaid ? `Paid on ${new Date(order.paidAt || Date.now()).toLocaleDateString()}` : 'Payment Pending'}
              </span>

              <span className={`badge ${order.isDelivered ? 'badge-success' : 'badge-warning'}`}>
                {order.isDelivered ? <CheckCircle2 size={14} /> : <Package size={14} />}
                {order.isDelivered ? `Delivered on ${new Date(order.deliveredAt).toLocaleDateString()}` : 'Processing & In Transit'}
              </span>
            </div>
          </div>

          <div className="cart-layout">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {/* Shipping Address */}
              <div className="cart-table-card">
                <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem', color: 'var(--color-primary-dark)' }}>
                  <MapPin size={20} color="var(--color-primary)" />
                  <span>Shipping Address</span>
                </h3>
                <p style={{ fontWeight: 600, color: 'var(--color-text-main)', marginBottom: '0.25rem' }}>
                  {order.user?.name || 'Customer'}
                </p>
                <p style={{ color: 'var(--color-text-muted)' }}>
                  {order.shippingAddress?.address}, {order.shippingAddress?.city}, {order.shippingAddress?.postalCode}, {order.shippingAddress?.country}
                </p>
              </div>

              {/* Payment Method */}
              <div className="cart-table-card">
                <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem', color: 'var(--color-primary-dark)' }}>
                  <CreditCard size={20} color="var(--color-primary)" />
                  <span>Payment Method</span>
                </h3>
                <p style={{ fontWeight: 600, color: 'var(--color-text-main)' }}>
                  Method: {order.paymentMethod || 'Credit Card'}
                </p>
              </div>

              {/* Order Items Table */}
              <div className="cart-table-card">
                <h3 style={{ marginBottom: '1.25rem', color: 'var(--color-primary-dark)' }}>
                  Ordered Items
                </h3>
                {order.orderItems?.map((item, index) => (
                  <div key={index} className="cart-item">
                    <img src={item.image} alt={item.name} className="cart-item-img" />
                    <div>
                      <Link to={`/product/${item.product}`} style={{ fontWeight: 700, color: 'var(--color-text-main)' }}>
                        {item.name}
                      </Link>
                      <div style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', marginTop: '0.2rem' }}>
                        {item.qty} x ${item.price.toFixed(2)}
                      </div>
                    </div>
                    <div style={{ fontWeight: 800, fontSize: '1.1rem', color: 'var(--color-primary-dark)', gridColumn: 'span 3', textAlign: 'right' }}>
                      ${(item.qty * item.price).toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Price Breakdown Card */}
            <div className="summary-card">
              <h3 style={{ marginBottom: '1.25rem', color: 'var(--color-primary-dark)', paddingBottom: '0.75rem', borderBottom: '2px solid var(--color-bg-warm)' }}>
                Order Summary
              </h3>

              <div className="summary-row">
                <span>Items Subtotal:</span>
                <span>${order.itemsPrice?.toFixed(2)}</span>
              </div>

              <div className="summary-row">
                <span>Shipping:</span>
                <span>{order.shippingPrice === 0 ? 'FREE' : `$${order.shippingPrice?.toFixed(2)}`}</span>
              </div>

              <div className="summary-row">
                <span>Tax:</span>
                <span>${order.taxPrice?.toFixed(2)}</span>
              </div>

              <div className="summary-row total">
                <span>Total Amount:</span>
                <span>${order.totalPrice?.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default OrderDetailsPage;
