import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser, clearAuthError } from '../redux/slices/authSlice';
import Loader from '../components/Loader';
import Message from '../components/Message';
import { LogIn, Lock, Mail, Eye, EyeOff } from 'lucide-react';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const [searchParams] = useSearchParams();
  const redirect = searchParams.get('redirect') ? `/${searchParams.get('redirect')}` : '/';

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { userInfo, loading, error } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(clearAuthError());
    if (userInfo) {
      navigate(redirect);
    }
  }, [userInfo, navigate, redirect, dispatch]);

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(loginUser({ email, password }));
  };

  return (
    <div className="auth-card">
      <div className="auth-header">
        <div className="brand-logo-icon" style={{ margin: '0 auto 1rem auto', width: '50px', height: '50px' }}>
          <LogIn size={26} />
        </div>
        <h2>Welcome Back</h2>
        <p className="text-muted">Sign in to access your orders and checkout cart</p>
      </div>

      {error && <Message variant="danger">{error}</Message>}
      {loading && <Loader />}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Email Address</label>
          <div style={{ position: 'relative' }}>
            <input
              type="email"
              required
              className="form-control"
              placeholder="e.g. john@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{ paddingLeft: '2.5rem' }}
            />
            <Mail size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }} />
          </div>
        </div>

        <div className="form-group">
          <label>Password</label>
          <div style={{ position: 'relative' }}>
            <input
              type={showPassword ? 'text' : 'password'}
              required
              className="form-control"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{ paddingLeft: '2.5rem', paddingRight: '2.5rem' }}
            />
            <Lock size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }} />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              style={{ position: 'absolute', right: '0.8rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        <button type="submit" className="btn btn-primary btn-full btn-lg" style={{ marginTop: '1.25rem' }}>
          <span>Sign In</span>
        </button>
      </form>

      <div style={{ marginTop: '1.75rem', textAlign: 'center', fontSize: '0.95rem' }}>
        New to PulseMarket?{' '}
        <Link to={redirect ? `/register?redirect=${redirect.slice(1)}` : '/register'} style={{ fontWeight: 700, color: 'var(--color-primary)' }}>
          Create an Account
        </Link>
      </div>

      <div style={{ marginTop: '1.5rem', padding: '0.85rem', background: 'var(--color-bg-warm)', borderRadius: 'var(--radius-md)', fontSize: '0.8rem', color: 'var(--color-text-muted)', border: '1px solid var(--color-border)' }}>
        <strong>Demo Login Credentials:</strong><br />
        Email: <code>admin@example.com</code> or <code>john@example.com</code><br />
        Password: <code>password123</code>
      </div>
    </div>
  );
};

export default LoginPage;
