import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { registerUser, clearAuthError } from '../redux/slices/authSlice';
import Loader from '../components/Loader';
import Message from '../components/Message';
import { UserPlus, User, Mail, Lock } from 'lucide-react';

const RegisterPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState(null);

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
    if (password !== confirmPassword) {
      setMessage('Passwords do not match');
    } else {
      setMessage(null);
      dispatch(registerUser({ name, email, password }));
    }
  };

  return (
    <div className="auth-card">
      <div className="auth-header">
        <div className="brand-logo-icon" style={{ margin: '0 auto 1rem auto', width: '50px', height: '50px' }}>
          <UserPlus size={26} />
        </div>
        <h2>Create Account</h2>
        <p className="text-muted">Join PulseMarket for fast checkout & order tracking</p>
      </div>

      {message && <Message variant="danger">{message}</Message>}
      {error && <Message variant="danger">{error}</Message>}
      {loading && <Loader />}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Full Name</label>
          <div style={{ position: 'relative' }}>
            <input
              type="text"
              required
              className="form-control"
              placeholder="e.g. Sarah Jenkins"
              value={name}
              onChange={(e) => setName(e.target.value)}
              style={{ paddingLeft: '2.5rem' }}
            />
            <User size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }} />
          </div>
        </div>

        <div className="form-group">
          <label>Email Address</label>
          <div style={{ position: 'relative' }}>
            <input
              type="email"
              required
              className="form-control"
              placeholder="e.g. sarah@example.com"
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
              type="password"
              required
              className="form-control"
              placeholder="Create a strong password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{ paddingLeft: '2.5rem' }}
            />
            <Lock size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }} />
          </div>
        </div>

        <div className="form-group">
          <label>Confirm Password</label>
          <div style={{ position: 'relative' }}>
            <input
              type="password"
              required
              className="form-control"
              placeholder="Re-enter password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              style={{ paddingLeft: '2.5rem' }}
            />
            <Lock size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }} />
          </div>
        </div>

        <button type="submit" className="btn btn-primary btn-full btn-lg" style={{ marginTop: '1.25rem' }}>
          <span>Register Account</span>
        </button>
      </form>

      <div style={{ marginTop: '1.75rem', textAlign: 'center', fontSize: '0.95rem' }}>
        Already have an account?{' '}
        <Link to={redirect ? `/login?redirect=${redirect.slice(1)}` : '/login'} style={{ fontWeight: 700, color: 'var(--color-primary)' }}>
          Sign In Here
        </Link>
      </div>
    </div>
  );
};

export default RegisterPage;
