import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

const UserRegister = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: ''
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

    if (formData.password !== formData.confirmPassword) {
      setMessage('Passwords do not match');
      setLoading(false);
      return;
    }

    if (formData.password.length < 8) {
      setMessage('Password must be at least 8 characters long');
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post('/api/user', {
        email: formData.email,
        password: formData.password
      });
      setMessage(response.data.message);
      setTimeout(() => {
        navigate('/user/login');
      }, 2000);
    } catch (error) {
      setMessage(error.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card">
      <h2 style={{ textAlign: 'center', marginBottom: '30px', color: '#333' }}>
        👤 User Registration
      </h2>
      
      {message && (
        <div className={`alert ${message.includes('successfully') ? 'alert-success' : 'alert-error'}`}>
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
            placeholder="Enter your password (min 8 characters)"
            minLength="8"
          />
        </div>

        <div className="form-group">
          <label htmlFor="confirmPassword">Confirm Password</label>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
            placeholder="Confirm your password"
            minLength="8"
          />
        </div>

        <button type="submit" className="btn" disabled={loading}>
          {loading ? <span className="loading"></span> : 'Register'}
        </button>
      </form>

      <div style={{ textAlign: 'center', marginTop: '20px' }}>
        <p style={{ color: '#666' }}>
          Already have a user account?{' '}
          <Link to="/user/login" style={{ color: '#667eea', textDecoration: 'none' }}>
            Login here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default UserRegister; 