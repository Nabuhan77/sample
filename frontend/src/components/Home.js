import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="card">
      <h1 style={{ textAlign: 'center', marginBottom: '30px', color: '#333' }}>
        🔐 Welcome to FreqVault
      </h1>
      <p style={{ textAlign: 'center', fontSize: '18px', marginBottom: '40px', color: '#666' }}>
        Secure File Encryption System with Hybrid RSA-AES Encryption
      </p>
      
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px', marginBottom: '40px' }}>
        <div className="card" style={{ textAlign: 'center', padding: '20px' }}>
          <h3 style={{ color: '#667eea', marginBottom: '15px' }}>👨‍💼 Admin Access</h3>
          <p style={{ marginBottom: '20px', color: '#666' }}>
            Upload files and encrypt them using hybrid RSA-AES encryption with quantum random number generation.
          </p>
          <div>
            <Link to="/admin/login" className="btn">Admin Login</Link>
            <Link to="/admin/register" className="btn">Admin Register</Link>
          </div>
        </div>
        
        <div className="card" style={{ textAlign: 'center', padding: '20px' }}>
          <h3 style={{ color: '#667eea', marginBottom: '15px' }}>👤 User Access</h3>
          <p style={{ marginBottom: '20px', color: '#666' }}>
            View and access encrypted files uploaded by administrators.
          </p>
          <div>
            <Link to="/user/login" className="btn">User Login</Link>
            <Link to="/user/register" className="btn">User Register</Link>
          </div>
        </div>
      </div>
      
      <div className="card" style={{ backgroundColor: '#f8f9fa' }}>
        <h3 style={{ color: '#333', marginBottom: '15px' }}>🔒 Security Features</h3>
        <ul style={{ listStyle: 'none', padding: 0 }}>
          <li style={{ marginBottom: '10px', padding: '8px 0' }}>✅ Hybrid RSA-AES Encryption</li>
          <li style={{ marginBottom: '10px', padding: '8px 0' }}>✅ Quantum Random Number Generation</li>
          <li style={{ marginBottom: '10px', padding: '8px 0' }}>✅ Secure File Storage in MongoDB</li>
          <li style={{ marginBottom: '10px', padding: '8px 0' }}>✅ Role-based Access Control</li>
          <li style={{ marginBottom: '10px', padding: '8px 0' }}>✅ Password Hashing with bcrypt</li>
        </ul>
      </div>
    </div>
  );
};

export default Home; 