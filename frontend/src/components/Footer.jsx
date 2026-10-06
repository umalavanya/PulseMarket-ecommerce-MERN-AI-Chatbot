import React from 'react';
import { ShoppingBag, ShieldCheck, Truck, RefreshCw, Mail } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="app-container">
        <div className="footer-inner">
          <div className="footer-brand">
            <Link to="/" className="brand-logo" style={{ fontSize: '1.4rem' }}>
              <div className="brand-logo-icon" style={{ width: '34px', height: '34px' }}>
                <ShoppingBag size={18} />
              </div>
              <span>Pulse<span className="brand-highlight">Market</span></span>
            </Link>
            <p>
              Your premier destination for high-performance audio, wearables, next-gen electronics, and modern footwear.
            </p>
          </div>

          <div className="footer-col">
            <h4>Customer Support</h4>
            <ul>
              <li><a href="#shipping"><Truck size={14} style={{ display: 'inline', marginRight: '6px' }} /> Free Express Shipping</a></li>
              <li><a href="#returns"><RefreshCw size={14} style={{ display: 'inline', marginRight: '6px' }} /> 30-Day Hassle Returns</a></li>
              <li><a href="#warranty"><ShieldCheck size={14} style={{ display: 'inline', marginRight: '6px' }} /> 2-Year Warranty</a></li>
            </ul>
          </div>

          <div className="footer-col">
            <h4>Quick Links</h4>
            <ul>
              <li><Link to="/">Explore Products</Link></li>
              <li><Link to="/cart">Shopping Cart</Link></li>
              <li><Link to="/orders">Order History</Link></li>
              <li><Link to="/login">Account Login</Link></li>
            </ul>
          </div>

          <div className="footer-col">
            <h4>Stay Connected</h4>
            <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.9rem', marginBottom: '1rem' }}>
              Subscribe for exclusive release drops and special discounts.
            </p>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <input
                type="email"
                placeholder="Enter email address..."
                style={{
                  padding: '0.55rem 0.85rem',
                  borderRadius: '8px',
                  border: '1px solid rgba(255,255,255,0.2)',
                  background: 'rgba(255,255,255,0.1)',
                  color: 'white',
                  fontSize: '0.85rem',
                  flex: 1,
                }}
              />
              <button className="btn btn-accent btn-sm">
                <Mail size={16} />
              </button>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p>© {new Date().getFullYear()} PulseMarket. All rights reserved. MERN Stack E-Commerce Solution.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
