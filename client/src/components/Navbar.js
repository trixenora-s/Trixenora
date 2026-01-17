import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaBars, FaTimes, FaUser, FaSignOutAlt } from 'react-icons/fa';
import '../styles/Navbar.css';

function Navbar({ user, onLogout }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    onLogout();
    navigate('/');
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          Trixenora
        </Link>

        <div className={`navbar-menu ${mobileMenuOpen ? 'active' : ''}`}>
          <Link to="/" className="nav-item">Home</Link>
          <Link to="/games" className="nav-item">Games</Link>
          <Link to="/ai-tools" className="nav-item">AI Tools</Link>
          
          {user ? (
            <div className="nav-user-menu">
              <Link to="/dashboard" className="nav-item">Dashboard</Link>
              <Link to="/upload" className="nav-item nav-upload">Upload</Link>
              <Link to={`/profile/${user.username}`} className="nav-item">
                <FaUser /> Profile
              </Link>
              <button onClick={handleLogout} className="nav-logout">
                <FaSignOutAlt /> Logout
              </button>
            </div>
          ) : (
            <Link to="/auth" className="nav-item nav-auth">Sign In</Link>
          )}
        </div>

        <div className="navbar-toggle">
          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
