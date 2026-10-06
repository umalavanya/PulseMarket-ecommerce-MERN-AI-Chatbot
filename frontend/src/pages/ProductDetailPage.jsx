import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProductDetails } from '../redux/slices/productSlice';
import { addToCart } from '../redux/slices/cartSlice';
import Rating from '../components/Rating';
import Loader from '../components/Loader';
import Message from '../components/Message';
import { ArrowLeft, ShoppingCart, ShieldCheck, Truck, RotateCcw } from 'lucide-react';

const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [qty, setQty] = useState(1);

  const { product, loading, error } = useSelector((state) => state.products);

  useEffect(() => {
    dispatch(fetchProductDetails(id));
  }, [dispatch, id]);

  const handleAddToCart = () => {
    dispatch(
      addToCart({
        product: product._id,
        name: product.name,
        image: product.image,
        price: product.price,
        countInStock: product.countInStock,
        qty: Number(qty),
      })
    );
    navigate('/cart');
  };

  return (
    <div>
      <Link to="/" className="btn btn-outline btn-sm" style={{ marginBottom: '1.5rem' }}>
        <ArrowLeft size={16} />
        <span>Back to Catalog</span>
      </Link>

      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : product ? (
        <div style={{ background: 'white', borderRadius: 'var(--radius-lg)', padding: '2rem', border: '1px solid var(--color-border)', boxShadow: 'var(--shadow-md)' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2.5rem', alignItems: 'center' }}>
            {/* Product Image */}
            <div style={{ background: 'var(--color-bg-light)', borderRadius: 'var(--radius-md)', padding: '1rem', overflow: 'hidden', textAlign: 'center' }}>
              <img
                src={product.image}
                alt={product.name}
                style={{ width: '100%', maxHeight: '420px', objectFit: 'contain', borderRadius: 'var(--radius-md)' }}
              />
            </div>

            {/* Product Meta & Actions */}
            <div>
              <span className="product-category-tag" style={{ position: 'static', display: 'inline-block', marginBottom: '0.75rem' }}>
                {product.category}
              </span>
              <span className="product-brand" style={{ display: 'block', marginBottom: '0.25rem' }}>{product.brand}</span>
              <h1 style={{ fontSize: '2rem', marginBottom: '1rem', color: 'var(--color-primary-dark)' }}>{product.name}</h1>

              <Rating value={product.rating} text={`${product.rating} / 5.0 (${product.numReviews} verified reviews)`} />

              <div style={{ fontSize: '2.2rem', fontWeight: 800, color: 'var(--color-primary-dark)', margin: '1.25rem 0' }}>
                ${product.price.toFixed(2)}
              </div>

              <p style={{ color: 'var(--color-text-muted)', fontSize: '1rem', lineHeight: '1.6', marginBottom: '1.5rem' }}>
                {product.description}
              </p>

              {/* Purchase Card Box */}
              <div style={{ background: 'var(--color-bg-warm)', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', marginBottom: '1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', fontWeight: 600 }}>
                  <span>Status:</span>
                  <span className={product.countInStock > 0 ? 'text-primary' : 'text-muted'}>
                    {product.countInStock > 0 ? `In Stock (${product.countInStock} available)` : 'Out of Stock'}
                  </span>
                </div>

                {product.countInStock > 0 && (
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
                    <span style={{ fontWeight: 600 }}>Quantity:</span>
                    <select
                      value={qty}
                      onChange={(e) => setQty(e.target.value)}
                      className="form-control"
                      style={{ width: '100px', padding: '0.4rem 0.75rem' }}
                    >
                      {[...Array(product.countInStock).keys()].slice(0, 10).map((x) => (
                        <option key={x + 1} value={x + 1}>
                          {x + 1}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                <button
                  onClick={handleAddToCart}
                  disabled={product.countInStock === 0}
                  className="btn btn-primary btn-full btn-lg"
                >
                  <ShoppingCart size={20} />
                  <span>{product.countInStock > 0 ? 'Add to Shopping Cart' : 'Currently Unavailable'}</span>
                </button>
              </div>

              {/* Perks */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.75rem', textAlign: 'center', fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
                <div><Truck size={18} color="var(--color-primary)" /><br />Free Delivery</div>
                <div><ShieldCheck size={18} color="var(--color-primary)" /><br />2 Year Warranty</div>
                <div><RotateCcw size={18} color="var(--color-primary)" /><br />Easy 30-Day Returns</div>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default ProductDetailPage;
