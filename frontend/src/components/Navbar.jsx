import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

export const Navbar = ({ currentHash }) => {
  const { isAuthenticated, logoutAdmin, adminUser } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isActive = (hash) => {
    if (hash === '#home' && (!currentHash || currentHash === '')) return 'active';
    return currentHash === hash ? 'active' : '';
  };

  const handleLogout = () => {
    logoutAdmin();
    window.location.hash = '#home';
  };

  return (
    <nav className="navbar-container">
      <div className="container nav-content">
        <a href="#home" className="nav-logo">
          <span className="logo-icon">⚜</span>
          <span className="logo-text">VKAM<span className="gold-text"> Contruct</span></span>
        </a>

        {/* Desktop Navigation */}
        <div className="nav-links">
          <a href="#home" className={`nav-link ${isActive('#home')}`}>Home</a>
          <a href="#materials" className={`nav-link ${isActive('#materials')}`}>Materials</a>
          <a href="#estimator" className={`nav-link ${isActive('#estimator')}`}>Estimator</a>
          <a href="#tracker" className={`nav-link ${isActive('#tracker')}`}>Track Status</a>
          <a href="#contact" className={`nav-link ${isActive('#contact')}`}>Contact</a>
          {isAuthenticated ? (
            <>
              <a href="#admin" className={`nav-link admin-link ${isActive('#admin')}`}>Dashboard</a>
              <span className="admin-badge">Admin: {adminUser?.username}</span>
              <button onClick={handleLogout} className="logout-btn">Logout</button>
            </>
          ) : (
            <a href="#login" className={`nav-link login-link ${isActive('#login')}`}>Staff Portal</a>
          )}
        </div>

        {/* Mobile Toggle Button */}
        <button 
          className={`mobile-toggle ${mobileMenuOpen ? 'open' : ''}`} 
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle menu"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>

      {/* Mobile Navigation Dropdown */}
      <div className={`mobile-nav ${mobileMenuOpen ? 'open' : ''}`}>
        <a href="#home" onClick={() => setMobileMenuOpen(false)} className={`mobile-link ${isActive('#home')}`}>Home</a>
        <a href="#materials" onClick={() => setMobileMenuOpen(false)} className={`mobile-link ${isActive('#materials')}`}>Materials</a>
        <a href="#estimator" onClick={() => setMobileMenuOpen(false)} className={`mobile-link ${isActive('#estimator')}`}>Estimator</a>
        <a href="#tracker" onClick={() => setMobileMenuOpen(false)} className={`mobile-link ${isActive('#tracker')}`}>Track Status</a>
        <a href="#contact" onClick={() => setMobileMenuOpen(false)} className={`mobile-link ${isActive('#contact')}`}>Contact Us</a>
        {isAuthenticated ? (
          <>
            <a href="#admin" onClick={() => setMobileMenuOpen(false)} className={`mobile-link ${isActive('#admin')}`}>Admin Dashboard</a>
            <div className="mobile-admin-info">
              <span>Logged in as {adminUser?.username}</span>
              <button onClick={() => { handleLogout(); setMobileMenuOpen(false); }} className="logout-btn mobile-logout">Logout</button>
            </div>
          </>
        ) : (
          <a href="#login" onClick={() => setMobileMenuOpen(false)} className={`mobile-link ${isActive('#login')}`}>Staff Portal</a>
        )}
      </div>

      <style>{`
        .navbar-container {
          position: sticky;
          top: 0;
          z-index: 1000;
          background: rgba(10, 12, 16, 0.85);
          backdrop-filter: blur(12px);
          border-bottom: 1px solid rgba(255, 255, 255, 0.05);
          transition: var(--transition);
        }
        .nav-content {
          display: flex;
          align-items: center;
          justify-content: space-between;
          height: 70px;
        }
        .nav-logo {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-family: var(--font-heading);
          font-size: 1.5rem;
          font-weight: 800;
          letter-spacing: -0.03em;
        }
        .logo-icon {
          color: var(--accent-gold);
          font-size: 1.75rem;
        }
        .gold-text {
          color: var(--accent-gold);
        }
        .nav-links {
          display: none;
          align-items: center;
          gap: 1.5rem;
        }
        @media (min-width: 768px) {
          .nav-links {
            display: flex;
          }
        }
        .nav-link {
          font-size: 0.95rem;
          font-weight: 500;
          color: var(--text-secondary);
          position: relative;
          padding: 0.5rem 0;
        }
        .nav-link:hover {
          color: var(--accent-gold);
        }
        .nav-link::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 0;
          width: 0;
          height: 2px;
          background-color: var(--accent-gold);
          transition: var(--transition);
        }
        .nav-link:hover::after, .nav-link.active::after {
          width: 100%;
        }
        .nav-link.active {
          color: var(--accent-gold);
        }
        .admin-link {
          border-left: 1px solid var(--border-color);
          padding-left: 1.5rem;
        }
        .admin-badge {
          background-color: rgba(212, 175, 55, 0.1);
          border: 1px solid var(--border-color);
          color: var(--accent-gold);
          font-size: 0.75rem;
          padding: 0.2rem 0.6rem;
          border-radius: 4px;
          font-weight: 600;
        }
        .logout-btn {
          background: transparent;
          border: 1px solid rgba(245, 101, 101, 0.4);
          color: var(--status-declined);
          padding: 0.35rem 0.8rem;
          border-radius: 4px;
          cursor: pointer;
          font-weight: 500;
          font-size: 0.85rem;
          transition: var(--transition);
        }
        .logout-btn:hover {
          background-color: rgba(245, 101, 101, 0.1);
        }
        .login-link {
          border: 1px solid var(--border-color);
          padding: 0.35rem 0.8rem;
          border-radius: 4px;
          color: var(--accent-gold);
        }
        .login-link:hover {
          background-color: rgba(212, 175, 55, 0.1);
          color: var(--accent-gold-hover);
        }
        .login-link::after {
          display: none;
        }
        /* Mobile menu styling */
        .mobile-toggle {
          display: block;
          background: transparent;
          border: none;
          width: 30px;
          height: 24px;
          position: relative;
          cursor: pointer;
          z-index: 1001;
        }
        @media (min-width: 768px) {
          .mobile-toggle {
            display: none;
          }
        }
        .mobile-toggle span {
          display: block;
          position: absolute;
          height: 2px;
          width: 100%;
          background: var(--text-primary);
          border-radius: 9px;
          opacity: 1;
          left: 0;
          transform: rotate(0deg);
          transition: 0.25s ease-in-out;
        }
        .mobile-toggle span:nth-child(1) { top: 0px; }
        .mobile-toggle span:nth-child(2) { top: 10px; }
        .mobile-toggle span:nth-child(3) { top: 20px; }
        .mobile-toggle.open span:nth-child(1) { top: 10px; transform: rotate(135deg); }
        .mobile-toggle.open span:nth-child(2) { opacity: 0; left: -60px; }
        .mobile-toggle.open span:nth-child(3) { top: 10px; transform: rotate(-135deg); }
        
        .mobile-nav {
          position: fixed;
          top: 70px;
          left: 0;
          width: 100%;
          height: calc(100vh - 70px);
          background: var(--bg-secondary);
          display: flex;
          flex-direction: column;
          padding: 2rem;
          gap: 1.5rem;
          transform: translateX(100%);
          transition: transform 0.3s ease-in-out;
          z-index: 999;
          box-shadow: -10px 0 30px rgba(0,0,0,0.5);
        }
        .mobile-nav.open {
          transform: translateX(0);
        }
        .mobile-link {
          font-size: 1.25rem;
          font-weight: 600;
          color: var(--text-secondary);
          padding-bottom: 0.5rem;
          border-bottom: 1px solid rgba(255,255,255,0.05);
        }
        .mobile-link.active {
          color: var(--accent-gold);
          border-color: var(--accent-gold);
        }
        .mobile-admin-info {
          margin-top: auto;
          display: flex;
          flex-direction: column;
          gap: 1rem;
          border-top: 1px solid rgba(255,255,255,0.05);
          padding-top: 1.5rem;
        }
        .mobile-logout {
          align-self: flex-start;
          font-size: 1rem;
          padding: 0.5rem 1rem;
        }
      `}</style>
    </nav>
  );
};

export default Navbar;
