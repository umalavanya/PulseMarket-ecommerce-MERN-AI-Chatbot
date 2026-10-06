import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { ShoppingBag, Search, User, LogOut, Package, ShoppingCart, ChevronDown, Shield, Layers, Users } from 'lucide-react';
import { logout } from '../redux/slices/authSlice';

const Navbar = () => {
  const [keyword, setKeyword] = useState('');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [adminDropdownOpen, setAdminDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { userInfo } = useSelector((state) => state.auth);
  const { cartItems } = useSelector((state) => state.cart);

  const totalCartCount = cartItems.reduce((acc, item) => acc + item.qty, 0);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (keyword.trim()) {
      navigate(`/?keyword=${encodeURIComponent(keyword.trim())}`);
    } else {
      navigate('/');
    }
  };

  const handleLogout = () => {
    dispatch(logout());
    setDropdownOpen(false);
    setAdminDropdownOpen(false);
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="app-container navbar-inner">
        {/* Brand Logo */}
        <Link to="/" className="brand-logo">
          <div className="brand-logo-icon">
            <ShoppingBag size={22} />
          </div>
          <span>Pulse<span className="brand-highlight">Market</span></span>
        </Link>

        {/* Search Bar */}
        <form onSubmit={handleSearchSubmit} className="nav-search">
          <input
            type="text"
            placeholder="Search headphones, sneakers, laptops..."
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
          />
          <Search size={18} className="search-icon" />
        </form>

        {/* Navigation Links */}
        <div className="nav-actions">
          <Link to="/cart" className="nav-link cart-badge-container">
            <ShoppingCart size={22} />
            <span>Cart</span>
            {totalCartCount > 0 && (
              <span className="cart-badge">{totalCartCount}</span>
            )}
          </Link>

          {/* Admin Navigation Dropdown */}
          {userInfo && userInfo.isAdmin && (
            <div className="user-menu" style={{ position: 'relative' }}>
              <button
                onClick={() => {
                  setAdminDropdownOpen(!adminDropdownOpen);
                  setDropdownOpen(false);
                }}
                className="user-menu-btn"
                style={{ background: 'rgba(245, 158, 11, 0.15)', borderColor: 'rgba(245, 158, 11, 0.4)', color: '#F59E0B' }}
              >
                <Shield size={16} />
                <span>Admin</span>
                <ChevronDown size={14} />
              </button>

              {adminDropdownOpen && (
                <div className="user-dropdown" style={{ right: 0 }}>
                  <Link
                    to="/admin/productlist"
                    className="user-dropdown-item"
                    onClick={() => setAdminDropdownOpen(false)}
                  >
                    <Layers size={16} />
                    <span>Manage Products</span>
                  </Link>
                  <Link
                    to="/admin/orderlist"
                    className="user-dropdown-item"
                    onClick={() => setAdminDropdownOpen(false)}
                  >
                    <Package size={16} />
                    <span>Manage Orders</span>
                  </Link>
                  <Link
                    to="/admin/userlist"
                    className="user-dropdown-item"
                    onClick={() => setAdminDropdownOpen(false)}
                  >
                    <Users size={16} />
                    <span>Manage Users</span>
                  </Link>
                </div>
              )}
            </div>
          )}

          {userInfo ? (
            <div className="user-menu">
              <button
                onClick={() => {
                  setDropdownOpen(!dropdownOpen);
                  setAdminDropdownOpen(false);
                }}
                className="user-menu-btn"
              >
                <User size={18} />
                <span>{userInfo.name.split(' ')[0]}</span>
                <ChevronDown size={16} />
              </button>

              {dropdownOpen && (
                <div className="user-dropdown">
                  <Link
                    to="/orders"
                    className="user-dropdown-item"
                    onClick={() => setDropdownOpen(false)}
                  >
                    <Package size={18} />
                    <span>My Order History</span>
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="user-dropdown-item"
                    style={{ width: '100%', textAlign: 'left', border: 'none', background: 'none', cursor: 'pointer' }}
                  >
                    <LogOut size={18} />
                    <span>Logout</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link to="/login" className="btn btn-accent btn-sm">
              <User size={16} />
              <span>Login / Register</span>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
