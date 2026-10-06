import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';
import { Package, Plus, Trash2, Edit, RefreshCw, DollarSign } from 'lucide-react';
import Loader from '../components/Loader';
import Message from '../components/Message';
import { fetchProducts } from '../redux/slices/productSlice';

const ProductListPage = () => {
  const dispatch = useDispatch();
  const { products, loading, error } = useSelector((state) => state.products);
  const { userInfo } = useSelector((state) => state.auth);

  const [message, setMessage] = useState('');
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    dispatch(fetchProducts({ pageSize: 50 }));
  }, [dispatch]);

  const handleDeleteProduct = async (id, name) => {
    if (window.confirm(`Are you sure you want to delete product "${name}"?`)) {
      try {
        const config = {
          headers: {
            Authorization: `Bearer ${userInfo?.token}`,
          },
        };
        await axios.delete(`/api/products/${id}`, config);
        setMessage(`Product "${name}" deleted successfully.`);
        setTimeout(() => setMessage(''), 4000);
        dispatch(fetchProducts({ pageSize: 50 }));
      } catch (err) {
        alert(err.response?.data?.message || 'Error deleting product');
      }
    }
  };

  const handleCreateProduct = async () => {
    try {
      setCreating(true);
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userInfo?.token}`,
        },
      };
      const sampleProduct = {
        name: `New Product ${Math.floor(Math.random() * 1000)}`,
        price: 99.99,
        image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80',
        brand: 'BrandName',
        category: 'Electronics',
        countInStock: 15,
        description: 'High performance e-commerce item with modern features.',
      };
      const { data } = await axios.post('/api/products', sampleProduct, config);
      setCreating(false);
      setMessage(`Created new product "${data.name}"`);
      setTimeout(() => setMessage(''), 4000);
      dispatch(fetchProducts({ pageSize: 50 }));
    } catch (err) {
      setCreating(false);
      alert(err.response?.data?.message || 'Error creating product');
    }
  };

  return (
    <div className="section" style={{ padding: '2rem 0' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--color-text-main)', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <Package size={28} style={{ color: 'var(--color-accent)' }} /> Product Catalog Management
          </h1>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>
            Create, update, and manage inventory stock across all store items.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '0.6rem' }}>
          <button
            className="btn btn-accent btn-sm"
            onClick={handleCreateProduct}
            disabled={creating}
            style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}
          >
            <Plus size={16} /> {creating ? 'Creating...' : 'Create Product'}
          </button>
          <button
            className="btn btn-secondary btn-sm"
            onClick={() => dispatch(fetchProducts({ pageSize: 50 }))}
            style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}
          >
            <RefreshCw size={16} /> Refresh
          </button>
        </div>
      </div>

      {message && <Message variant="success">{message}</Message>}
      {error && <Message variant="danger">{error}</Message>}

      {loading ? (
        <Loader />
      ) : (
        <div style={{ background: 'var(--color-bg-surface)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-lg)', overflow: 'hidden', boxShadow: 'var(--shadow-md)' }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.92rem' }}>
              <thead>
                <tr style={{ background: 'var(--color-bg-elevated)', borderBottom: '1px solid var(--color-border)', color: 'var(--color-text-muted)', textTransform: 'uppercase', fontSize: '0.78rem', letterSpacing: '0.5px' }}>
                  <th style={{ padding: '1rem 1.2rem' }}>Item</th>
                  <th style={{ padding: '1rem 1.2rem' }}>Category</th>
                  <th style={{ padding: '1rem 1.2rem' }}>Brand</th>
                  <th style={{ padding: '1rem 1.2rem' }}>Price</th>
                  <th style={{ padding: '1rem 1.2rem' }}>In Stock</th>
                  <th style={{ padding: '1rem 1.2rem', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((prod) => (
                  <tr key={prod._id} style={{ borderBottom: '1px solid var(--color-border)' }}>
                    <td style={{ padding: '1rem 1.2rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <img
                          src={prod.image}
                          alt={prod.name}
                          style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: 'var(--radius-md)' }}
                        />
                        <span style={{ fontWeight: 600, color: 'var(--color-text-main)' }}>{prod.name}</span>
                      </div>
                    </td>
                    <td style={{ padding: '1rem 1.2rem', color: 'var(--color-text-muted)' }}>{prod.category}</td>
                    <td style={{ padding: '1rem 1.2rem', color: 'var(--color-text-muted)' }}>{prod.brand}</td>
                    <td style={{ padding: '1rem 1.2rem', fontWeight: 700, color: 'var(--color-accent)' }}>
                      ${Number(prod.price).toFixed(2)}
                    </td>
                    <td style={{ padding: '1rem 1.2rem' }}>
                      <span
                        style={{
                          padding: '0.2rem 0.5rem',
                          borderRadius: 'var(--radius-full)',
                          fontSize: '0.78rem',
                          fontWeight: 700,
                          background: prod.countInStock > 0 ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                          color: prod.countInStock > 0 ? '#10B981' : '#EF4444',
                        }}
                      >
                        {prod.countInStock} units
                      </span>
                    </td>
                    <td style={{ padding: '1rem 1.2rem', textAlign: 'right' }}>
                      <button
                        onClick={() => handleDeleteProduct(prod._id, prod.name)}
                        className="btn btn-danger btn-sm"
                        style={{ padding: '0.35rem 0.6rem', background: '#EF4444', color: '#fff', border: 'none', borderRadius: 'var(--radius-md)', cursor: 'pointer' }}
                        title="Delete Product"
                      >
                        <Trash2 size={14} /> Delete
                      </button>
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

export default ProductListPage;
