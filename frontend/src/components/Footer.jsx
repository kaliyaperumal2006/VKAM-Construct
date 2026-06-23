import React from 'react';

export const Footer = () => {
  return (
    <footer className="footer-container">
      <div className="container footer-content">
        <div className="footer-brand">
          <div className="footer-logo">
            <span className="logo-icon">⚜</span>
            <span>VKAM<span className="gold-text"> Contruct</span></span>
          </div>
          <p className="footer-tagline">Building luxury homes, commercial shops, and high-rise office developments with transparency, precision, and state-of-the-art materials.</p>
        </div>
        
        <div className="footer-links-group">
          <h4 className="footer-title">Navigation</h4>
          <ul className="footer-links">
            <li><a href="#home">Home</a></li>
            <li><a href="#materials">Material Guide</a></li>
            <li><a href="#estimator">Cost Estimator</a></li>
            <li><a href="#tracker">Track Application</a></li>
            <li><a href="#contact">Contact Us</a></li>
          </ul>
        </div>

        <div className="footer-links-group">
          <h4 className="footer-title">Quality Standards</h4>
          <ul className="footer-links">
            <li><span className="footer-item">Premium Grade Concrete</span></li>
            <li><span className="footer-item">Corrosion-Resistant Steel</span></li>
            <li><span className="footer-item">Modular Electrical layouts</span></li>
            <li><span className="footer-item">Thermal & Sound Insulation</span></li>
          </ul>
        </div>
      </div>
      
      <div className="footer-bottom">
        <div className="container footer-bottom-content">
          <p>&copy; {new Date().getFullYear()} VKAM Contruct. All Rights Reserved.</p>
          <div className="footer-security">
            <a href="#login" className="admin-portal-link">Admin Access</a>
          </div>
        </div>
      </div>

      <style>{`
        .footer-container {
          background-color: var(--bg-secondary);
          border-top: 1px solid rgba(255, 255, 255, 0.05);
          padding: 3rem 0 0 0;
          color: var(--text-secondary);
          font-size: 0.9rem;
          margin-top: auto;
        }
        .footer-content {
          display: grid;
          grid-template-columns: 1fr;
          gap: 2.5rem;
          padding-bottom: 3rem;
        }
        @media (min-width: 768px) {
          .footer-content {
            grid-template-columns: 2fr 1fr 1fr;
          }
        }
        .footer-brand {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }
        .footer-logo {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-family: var(--font-heading);
          font-size: 1.25rem;
          font-weight: 700;
          color: var(--text-primary);
        }
        .logo-icon {
          color: var(--accent-gold);
        }
        .gold-text {
          color: var(--accent-gold);
        }
        .footer-tagline {
          max-width: 400px;
          line-height: 1.6;
        }
        .footer-links-group {
          display: flex;
          flex-direction: column;
          gap: 1.2rem;
        }
        .footer-title {
          color: var(--text-primary);
          font-size: 1.1rem;
          font-weight: 600;
          border-bottom: 2px solid var(--accent-gold);
          width: fit-content;
          padding-bottom: 0.25rem;
        }
        .footer-links {
          list-style: none;
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }
        .footer-links a:hover {
          color: var(--accent-gold);
          padding-left: 5px;
        }
        .footer-item {
          color: var(--text-muted);
        }
        .footer-bottom {
          background-color: var(--bg-primary);
          border-top: 1px solid rgba(255, 255, 255, 0.03);
          padding: 1.5rem 0;
          font-size: 0.8rem;
          color: var(--text-muted);
        }
        .footer-bottom-content {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.75rem;
          text-align: center;
        }
        @media (min-width: 576px) {
          .footer-bottom-content {
            flex-direction: row;
            justify-content: space-between;
          }
        }
        .admin-portal-link {
          color: var(--text-muted);
          transition: var(--transition);
        }
        .admin-portal-link:hover {
          color: var(--accent-gold);
        }
      `}</style>
    </footer>
  );
};

export default Footer;
