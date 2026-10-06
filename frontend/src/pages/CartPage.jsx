import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart, removeFromCart } from '../redux/slices/cartSlice';
import Message from '../components/Message';
import { Trash2, ArrowRight, ShoppingBag } from 'lucide-react';

const CartPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { cartItems, itemsPrice, shippingPrice, taxPrice, totalPrice } = useSelector(
    (state) => state.cart
  );
  const { userInfo } = useSelector((state) => state.auth);

  const handleQtyChange = (item, newQty) => {
    dispatch(
      addToCart({
        ...item,
        qty: Number(newQty),
      })
    );
  };

  const handleRemoveFromCart = (id) => {
    dispatch(removeFromCart(id));
  };

  const handleCheckout = () => {
    if (!userInfo) {
      navigate('/login?redirect=checkout');
    } else {
      navigate('/checkout');
    }
  };

  return (
    <div>
      <h1 style={{ fontSize: '2.2rem', marginBottom: '1.5rem', color: 'var(--color-primary-dark)' }}>
        Your Shopping Cart
      </h1>

      {cartItems.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '3rem 1rem', background: 'white', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-border)' }}>
          <ShoppingBag size={64} color="var(--color-text-light)" style={{ marginBottom: '1rem' }} />
          <h2>Your cart is currently empty</h2>
          <p style={{ color: 'var(--color-text-muted)', marginBottom: '1.5rem' }}>
            Discover our curated collection of high-tech products and add items to your cart.
          </p>
          <Link to="/" className="btn btn-primary">
            Browse Products Now
          </Link>
        </div>
      ) : (
        <div className="cart-layout">
          {/* Cart Items List */}
          <div className="cart-table-card">
            {cartItems.map((item) => (
              <div key={item.product} className="cart-item">
                <img src={item.image} alt={item.name} className="cart-item-img" />
                
                <div>
                  <Link to={`/product/${item.product}`} style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--color-text-main)' }}>
                    {item.name}
                  </Link>
                  <div style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', marginTop: '0.2rem' }}>
                    Unit Price: ${item.price.toFixed(2)}
                  </div>
                </div>

                <div>
                  <select
                    value={item.qty}
                    onChange={(e) => handleQtyChange(item, e.target.value)}
                    className="form-control"
                    style={{ padding: '0.35rem 0.6rem', width: '75px' }}
                  >
                    {[...Array(item.countInStock || 10).keys()].slice(0, 10).map((x) => (
                      <option key={x + 1} value={x + 1}>
                        {x + 1}
                      </option>
                    ))}
                  </select>
                </div>

                <div style={{ fontWeight: 800, fontSize: '1.1rem', color: 'var(--color-primary-dark)' }}>
                  ${(item.price * item.qty).toFixed(2)}
                </div>

                <button
                  onClick={() => handleRemoveFromCart(item.product)}
                  className="btn btn-outline btn-sm"
                  style={{ color: 'var(--color-danger)', borderColor: 'var(--color-danger)', padding: '0.35rem 0.5rem' }}
                  title="Remove Item"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>

          {/* Order Summary Box */}
          <div className="summary-card">
            <h3 style={{ marginBottom: '1.25rem', color: 'var(--color-primary-dark)', paddingBottom: '0.75rem', borderBottom: '2px solid var(--color-bg-warm)' }}>
              Order Summary
            </h3>

            <div className="summary-row">
              <span>Items ({cartItems.reduce((acc, i) => acc + i.qty, 0)}):</span>
              <span>${itemsPrice.toFixed(2)}</span>
            </div>
            
            <div className="summary-row">
              <span>Shipping Fee:</span>
              <span>{shippingPrice === 0 ? 'FREE' : `$${shippingPrice.toFixed(2)}`}</span>
            </div>

            <div className="summary-row">
              <span>Estimated Tax (8%):</span>
              <span>${taxPrice.toFixed(2)}</span>
            </div>

            <div className="summary-row total">
              <span>Total Price:</span>
              <span>${totalPrice.toFixed(2)}</span>
            </div>

            <button
              onClick={handleCheckout}
              className="btn btn-primary btn-full btn-lg"
              style={{ marginTop: '1.5rem' }}
            >
              <span>Proceed to Order</span>
              <ArrowRight size={20} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;
