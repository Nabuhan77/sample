import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

const AdminLogin = ({ onLogin }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const response = await axios.post('/api/admin/login', formData);
      setMessage(response.data.message);
      onLogin();
      setTimeout(() => {
        navigate('/admin/dashboard');
      }, 1000);
    } catch (error) {
      setMessage(error.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card">
      <h2 style={{ textAlign: 'center', marginBottom: '30px', color: '#333' }}>
        👨‍💼 Admin Login
      </h2>
      
      {message && (
        <div className={`alert ${message.includes('success') ? 'alert-success' : 'alert-error'}`}>
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            placeholder="Enter your email"
          />
        </div>

        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            placeholder="Enter your password"
            minLength="8"
          />
        </div>

        <button type="submit" className="btn" disabled={loading}>
          {loading ? <span className="loading"></span> : 'Login'}
        </button>
      </form>

      <div style={{ textAlign: 'center', marginTop: '20px' }}>
        <p style={{ color: '#666' }}>
          Don't have an admin account?{' '}
          <Link to="/admin/register" style={{ color: '#667eea', textDecoration: 'none' }}>
            Register here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default AdminLogin; 