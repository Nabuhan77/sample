import React, { useState } from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import AdminLogin from './components/AdminLogin';
import AdminRegister from './components/AdminRegister';
import AdminDashboard from './components/AdminDashboard';
import UserLogin from './components/UserLogin';
import UserRegister from './components/UserRegister';
import UserDashboard from './components/UserDashboard';
import Home from './components/Home';

function App() {
  const location = useLocation();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userType, setUserType] = useState(null);

  const handleLogin = (type) => {
    setIsLoggedIn(true);
    setUserType(type);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUserType(null);
  };

  return (
    <div className="App">
      <nav className="nav">
        <div className="nav-container">
          <div className="nav-brand">🔐 FreqVault</div>
          <div className="nav-links">
            <Link to="/" className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}>
              Home
            </Link>
            {!isLoggedIn ? (
              <>
                <Link to="/admin/login" className={`nav-link ${location.pathname === '/admin/login' ? 'active' : ''}`}>
                  Admin Login
                </Link>
                <Link to="/admin/register" className={`nav-link ${location.pathname === '/admin/register' ? 'active' : ''}`}>
                  Admin Register
                </Link>
                <Link to="/user/login" className={`nav-link ${location.pathname === '/user/login' ? 'active' : ''}`}>
                  User Login
                </Link>
                <Link to="/user/register" className={`nav-link ${location.pathname === '/user/register' ? 'active' : ''}`}>
                  User Register
                </Link>
              </>
            ) : (
              <>
                <Link to={userType === 'admin' ? '/admin/dashboard' : '/user/dashboard'} 
                      className={`nav-link ${location.pathname.includes('dashboard') ? 'active' : ''}`}>
                  Dashboard
                </Link>
                <button onClick={handleLogout} className="btn">
                  Logout
                </button>
              </>
            )}
          </div>
        </div>
      </nav>

      <div className="container">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/admin/login" element={<AdminLogin onLogin={() => handleLogin('admin')} />} />
          <Route path="/admin/register" element={<AdminRegister />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/user/login" element={<UserLogin onLogin={() => handleLogin('user')} />} />
          <Route path="/user/register" element={<UserRegister />} />
          <Route path="/user/dashboard" element={<UserDashboard />} />
        </Routes>
      </div>
    </div>
  );
}

export default App; 