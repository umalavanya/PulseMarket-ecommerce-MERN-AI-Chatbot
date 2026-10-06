import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { Shield, ShieldAlert, Trash2, UserCheck, RefreshCw, CheckCircle2, AlertCircle } from 'lucide-react';
import Loader from '../components/Loader';
import Message from '../components/Message';

const UserListPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');

  const { userInfo } = useSelector((state) => state.auth);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      const config = {
        headers: {
          Authorization: `Bearer ${userInfo?.token}`,
        },
      };
      const { data } = await axios.get('/api/users', config);
      setUsers(data);
      setLoading(false);
    } catch (err) {
      setError(err.response?.data?.message || err.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [userInfo]);

  const handleDeleteUser = async (id, name) => {
    if (window.confirm(`Are you sure you want to delete user "${name}"?`)) {
      try {
        const config = {
          headers: {
            Authorization: `Bearer ${userInfo?.token}`,
          },
        };
        await axios.delete(`/api/users/${id}`, config);
        setSuccessMessage(`User "${name}" deleted successfully.`);
        setTimeout(() => setSuccessMessage(''), 4000);
        fetchUsers();
      } catch (err) {
        alert(err.response?.data?.message || 'Error deleting user');
      }
    }
  };

  const handleToggleAdmin = async (user) => {
    const action = user.isAdmin ? 'revoke Admin rights from' : 'make Admin';
    if (window.confirm(`Are you sure you want to ${action} "${user.name}"?`)) {
      try {
        const config = {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${userInfo?.token}`,
          },
        };
        await axios.put(`/api/users/${user._id}`, { isAdmin: !user.isAdmin }, config);
        setSuccessMessage(`Updated role for ${user.name}`);
        setTimeout(() => setSuccessMessage(''), 4000);
        fetchUsers();
      } catch (err) {
        alert(err.response?.data?.message || 'Error updating user role');
      }
    }
  };

  return (
    <div className="section" style={{ padding: '2rem 0' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--color-text-main)', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <Shield size={28} style={{ color: 'var(--color-accent)' }} /> User Management
          </h1>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>
            Manage platform users, roles, and administrative permissions.
          </p>
        </div>
        <button className="btn btn-secondary btn-sm" onClick={fetchUsers} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <RefreshCw size={16} /> Refresh
        </button>
      </div>

      {successMessage && <Message variant="success">{successMessage}</Message>}
      {error && <Message variant="danger">{error}</Message>}

      {loading ? (
        <Loader />
      ) : (
        <div style={{ background: 'var(--color-bg-surface)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-lg)', overflow: 'hidden', boxShadow: 'var(--shadow-md)' }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.92rem' }}>
              <thead>
                <tr style={{ background: 'var(--color-bg-elevated)', borderBottom: '1px solid var(--color-border)', color: 'var(--color-text-muted)', textTransform: 'uppercase', fontSize: '0.78rem', letterSpacing: '0.5px' }}>
                  <th style={{ padding: '1rem 1.2rem' }}>User ID</th>
                  <th style={{ padding: '1rem 1.2rem' }}>Name</th>
                  <th style={{ padding: '1rem 1.2rem' }}>Email</th>
                  <th style={{ padding: '1rem 1.2rem' }}>Role</th>
                  <th style={{ padding: '1rem 1.2rem', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u._id} style={{ borderBottom: '1px solid var(--color-border)', transition: 'background 0.2s' }}>
                    <td style={{ padding: '1rem 1.2rem', fontFamily: 'monospace', fontSize: '0.82rem', color: 'var(--color-text-muted)' }}>
                      {u._id}
                    </td>
                    <td style={{ padding: '1rem 1.2rem', fontWeight: 600, color: 'var(--color-text-main)' }}>
                      {u.name}
                    </td>
                    <td style={{ padding: '1rem 1.2rem', color: 'var(--color-text-muted)' }}>
                      {u.email}
                    </td>
                    <td style={{ padding: '1rem 1.2rem' }}>
                      {u.isAdmin ? (
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', background: 'rgba(16, 185, 129, 0.15)', color: '#10B981', padding: '0.25rem 0.65rem', borderRadius: 'var(--radius-full)', fontSize: '0.78rem', fontWeight: 700 }}>
                          <ShieldCheck size={14} /> Admin
                        </span>
                      ) : (
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', background: 'rgba(148, 163, 184, 0.15)', color: 'var(--color-text-muted)', padding: '0.25rem 0.65rem', borderRadius: 'var(--radius-full)', fontSize: '0.78rem', fontWeight: 600 }}>
                          Customer
                        </span>
                      )}
                    </td>
                    <td style={{ padding: '1rem 1.2rem', textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                        <button
                          onClick={() => handleToggleAdmin(u)}
                          title={u.isAdmin ? 'Revoke Admin' : 'Grant Admin'}
                          className="btn btn-secondary btn-sm"
                          style={{ padding: '0.35rem 0.6rem', fontSize: '0.8rem' }}
                        >
                          <UserCheck size={14} /> {u.isAdmin ? 'Demote' : 'Promote'}
                        </button>
                        {u._id !== userInfo._id && (
                          <button
                            onClick={() => handleDeleteUser(u._id, u.name)}
                            title="Delete User"
                            className="btn btn-danger btn-sm"
                            style={{ padding: '0.35rem 0.6rem', background: '#EF4444', color: '#fff', border: 'none', borderRadius: 'var(--radius-md)', cursor: 'pointer' }}
                          >
                            <Trash2 size={14} />
                          </button>
                        )}
                      </div>
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

// Helper component icon
const ShieldCheck = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
    <polyline points="9 12 11 14 15 10"></polyline>
  </svg>
);

export default UserListPage;
