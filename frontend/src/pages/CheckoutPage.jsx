import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { saveShippingAddress, clearCart } from '../redux/slices/cartSlice';
import { createOrder, resetOrderState } from '../redux/slices/orderSlice';
import Loader from '../components/Loader';
import Message from '../components/Message';
import { MapPin, CreditCard, ShieldCheck, CheckCircle2 } from 'lucide-react';

const CheckoutPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const cart = useSelector((state) => state.cart);
  const { cartItems, shippingAddress, itemsPrice, shippingPrice, taxPrice, totalPrice } = cart;
  const { userInfo } = useSelector((state) => state.auth);
  const { order, success, loading, error } = useSelector((state) => state.orders);

  const [address, setAddress] = useState(shippingAddress.address || '');
  const [city, setCity] = useState(shippingAddress.city || '');
  const [postalCode, setPostalCode] = useState(shippingAddress.postalCode || '');
  const [country, setCountry] = useState(shippingAddress.country || '');
  const [paymentMethod, setPaymentMethod] = useState('Credit Card / Cash on Delivery');

  useEffect(() => {
    if (!userInfo) {
      navigate('/login?redirect=checkout');
    }
    if (cartItems.length === 0 && !success) {
      navigate('/cart');
    }
    if (success && order) {
      dispatch(clearCart());
      const orderId = order._id;
      dispatch(resetOrderState());
      navigate(`/order/${orderId}`);
    }
  }, [userInfo, cartItems, success, order, navigate, dispatch]);

  const handlePlaceOrder = (e) => {
    e.preventDefault();
    if (!address || !city || !postalCode || !country) {
      alert('Please complete all shipping address fields.');
      return;
    }

    const shippingData = { address, city, postalCode, country };
    dispatch(saveShippingAddress(shippingData));

    dispatch(
      createOrder({
        orderItems: cartItems,
        shippingAddress: shippingData,
        paymentMethod,
        itemsPrice,
        shippingPrice,
        taxPrice,
        totalPrice,
      })
    );
  };

  return (
    <div>
      <h1 style={{ fontSize: '2.2rem', marginBottom: '1.5rem', color: 'var(--color-primary-dark)' }}>
        Checkout & Place Order
      </h1>

      {error && <Message variant="danger">{error}</Message>}
      {loading && <Loader />}

      <div className="cart-layout">
        {/* Shipping Form & Order Review */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Shipping Address Box */}
          <div className="cart-table-card">
            <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem', color: 'var(--color-primary-dark)' }}>
              <MapPin size={22} color="var(--color-primary)" />
              <span>1. Shipping Destination</span>
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1rem' }}>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label>Street Address</label>
                <input
                  type="text"
                  required
                  className="form-control"
                  placeholder="123 Innovation Tech Boulevard, Suite 400"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '1rem' }}>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label>City</label>
                  <input
                    type="text"
                    required
                    className="form-control"
                    placeholder="New York"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                  />
                </div>

                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label>Postal Code</label>
                  <input
                    type="text"
                    required
                    className="form-control"
                    placeholder="10001"
                    value={postalCode}
                    onChange={(e) => setPostalCode(e.target.value)}
                  />
                </div>

                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label>Country</label>
                  <input
                    type="text"
                    required
                    className="form-control"
                    placeholder="United States"
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Payment Method */}
          <div className="cart-table-card">
            <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', color: 'var(--color-primary-dark)' }}>
              <CreditCard size={22} color="var(--color-primary)" />
              <span>2. Payment Option</span>
            </h3>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.85rem', background: 'var(--color-bg-warm)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)' }}>
              <input
                type="radio"
                id="paymentMethod"
                name="paymentMethod"
                checked
                onChange={() => setPaymentMethod('Credit Card / Cash on Delivery')}
              />
              <label htmlFor="paymentMethod" style={{ fontWeight: 600, cursor: 'pointer' }}>
                Credit / Debit Card (Simulated Instant Authorization)
              </label>
            </div>
          </div>

          {/* Order Items Review */}
          <div className="cart-table-card">
            <h3 style={{ marginBottom: '1.25rem', color: 'var(--color-primary-dark)' }}>
              3. Review Order Items ({cartItems.length})
            </h3>
            {cartItems.map((item) => (
              <div key={item.product} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.75rem 0', borderBottom: '1px solid var(--color-border)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <img src={item.image} alt={item.name} style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: 'var(--radius-sm)' }} />
                  <div>
                    <div style={{ fontWeight: 700 }}>{item.name}</div>
                    <div style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
                      {item.qty} x ${item.price.toFixed(2)}
                    </div>
                  </div>
                </div>
                <div style={{ fontWeight: 800, color: 'var(--color-primary-dark)' }}>
                  ${(item.qty * item.price).toFixed(2)}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Total Pricing & Confirmation */}
        <div className="summary-card">
          <h3 style={{ marginBottom: '1.25rem', color: 'var(--color-primary-dark)', paddingBottom: '0.75rem', borderBottom: '2px solid var(--color-bg-warm)' }}>
            Payment Summary
          </h3>

          <div className="summary-row">
            <span>Items Subtotal:</span>
            <span>${itemsPrice.toFixed(2)}</span>
          </div>

          <div className="summary-row">
            <span>Shipping Fee:</span>
            <span>{shippingPrice === 0 ? 'FREE' : `$${shippingPrice.toFixed(2)}`}</span>
          </div>

          <div className="summary-row">
            <span>Tax (8%):</span>
            <span>${taxPrice.toFixed(2)}</span>
          </div>

          <div className="summary-row total">
            <span>Total Payable:</span>
            <span>${totalPrice.toFixed(2)}</span>
          </div>

          <button
            onClick={handlePlaceOrder}
            className="btn btn-accent btn-full btn-lg"
            style={{ marginTop: '1.5rem' }}
          >
            <CheckCircle2 size={20} />
            <span>Place Order Now</span>
          </button>

          <div style={{ marginTop: '1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
            <ShieldCheck size={16} color="var(--color-primary)" />
            256-bit Encrypted SSL Secure Checkout
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
