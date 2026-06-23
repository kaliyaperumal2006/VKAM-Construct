import React, { useState } from 'react';

export const ContactUs = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !email || !message) {
      alert('Please fill out all required fields.');
      return;
    }
    // Mock submit
    setSubmitted(true);
  };

  const handleReset = () => {
    setSubmitted(false);
    setName('');
    setEmail('');
    setPhone('');
    setSubject('');
    setMessage('');
  };

  return (
    <div className="contact-container container fade-in">
      <div className="guide-header text-center">
        <span className="gold-text uppercase font-bold text-xs">Get in Touch</span>
        <h1 className="gold-gradient-text">Contact Our Construction Desk</h1>
        <p>Have questions about structural blueprints, material grades, or custom estimates? Reach out to our design and engineering office.</p>
      </div>

      <div className="contact-grid">
        {/* Contact Info Cards */}
        <div className="info-panel-column">
          <div className="info-item-card glass-panel">
            <span className="info-card-icon">📞</span>
            <div>
              <h4>Call Our Engineer Desk</h4>
              <p className="info-card-detail">+91 98765 43210</p>
              <p className="info-card-detail">+91 80 4123 5678</p>
              <span className="info-card-hint">Mon - Sat: 9:00 AM - 6:00 PM</span>
            </div>
          </div>

          <div className="info-item-card glass-panel">
            <span className="info-card-icon">✉️</span>
            <div>
              <h4>Email Inquiries</h4>
              <p className="info-card-detail">support@apexconstruct.com</p>
              <p className="info-card-detail">estimates@apexconstruct.com</p>
              <span className="info-card-hint">We reply within 24 business hours.</span>
            </div>
          </div>

          <div className="info-item-card glass-panel">
            <span className="info-card-icon">📍</span>
            <div>
              <h4>Design Studio & Headquarters</h4>
              <p className="info-card-detail">4th Floor, Apex Towers,</p>
              <p className="info-card-detail">100 Feet Road, Indiranagar, Bangalore - 560038</p>
              <span className="info-card-hint">Karnataka, India</span>
            </div>
          </div>
        </div>

        {/* Message Form */}
        <div className="form-panel-column glass-panel">
          {submitted ? (
            <div className="contact-success text-center py-4">
              <span className="success-check-icon">✉️</span>
              <h2 className="gold-gradient-text mt-1">Message Sent!</h2>
              <p className="mt-1">Thank you, <strong>{name}</strong>. Our construction coordinator has received your message and will get back to you via <strong>{email}</strong> shortly.</p>
              <button onClick={handleReset} className="gold-button mt-2">Send Another Message</button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="contact-form">
              <h3>Send Us a Quick Message</h3>
              <p className="form-description">Submit your general construction questions or request a call back from our site engineers.</p>
              
              <div className="form-group">
                <label className="form-label">Full Name *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="form-input"
                  placeholder="e.g. John Doe"
                />
              </div>

              <div className="grid-2 gap-1">
                <div className="form-group">
                  <label className="form-label">Email Address *</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="form-input"
                    placeholder="john@example.com"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Phone Number</label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="form-input"
                    placeholder="9876543210"
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Subject</label>
                <input
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="form-input"
                  placeholder="e.g. Duplex material queries"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Your Message *</label>
                <textarea
                  required
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="form-textarea"
                  placeholder="Type your message or design requirement here..."
                ></textarea>
              </div>

              <button type="submit" className="gold-button w-100 justify-content-center">
                Send Message
              </button>
            </form>
          )}
        </div>
      </div>

      <style>{`
        .contact-container {
          padding-top: 2.5rem;
          display: flex;
          flex-direction: column;
          gap: 2rem;
        }
        .contact-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 2rem;
        }
        @media (min-width: 992px) {
          .contact-grid {
            grid-template-columns: 0.8fr 1.2fr;
          }
        }
        
        .info-panel-column {
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
        }
        
        .info-item-card {
          display: flex;
          gap: 1.5rem;
          align-items: flex-start;
          border-color: rgba(255,255,255,0.02);
          transition: var(--transition);
        }
        
        .info-item-card:hover {
          transform: translateY(-6px);
          border-color: var(--accent-gold);
          box-shadow: 0 10px 25px rgba(212, 175, 55, 0.1);
          background: rgba(23, 28, 36, 0.85);
        }
        
        .info-card-icon {
          font-size: 2.25rem;
          background: rgba(212, 175, 55, 0.1);
          width: 55px;
          height: 55px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 8px;
          border: 1px solid rgba(212, 175, 55, 0.2);
          flex-shrink: 0;
          transition: var(--transition);
        }
        
        .info-item-card:hover .info-card-icon {
          transform: rotate(10deg) scale(1.05);
          background: rgba(212, 175, 55, 0.2);
          border-color: var(--accent-gold);
        }
        
        .info-item-card h4 {
          font-size: 1.1rem;
          margin-bottom: 0.5rem;
          color: var(--text-primary);
        }
        
        .info-card-detail {
          color: var(--text-secondary);
          font-size: 0.95rem;
          font-weight: 500;
        }
        
        .info-card-hint {
          display: block;
          margin-top: 0.5rem;
          font-size: 0.75rem;
          color: var(--text-muted);
        }
        
        .form-panel-column {
          transition: var(--transition);
        }
        .form-panel-column:hover {
          border-color: rgba(212, 175, 55, 0.3);
          box-shadow: 0 12px 30px rgba(0, 0, 0, 0.5), 0 0 15px rgba(212, 175, 55, 0.05);
        }
        
        .form-panel-column h3 {
          font-size: 1.35rem;
          border-bottom: 1px solid rgba(255,255,255,0.05);
          padding-bottom: 0.5rem;
          margin-bottom: 0.5rem;
        }
        
        .form-description {
          font-size: 0.875rem;
          color: var(--text-secondary);
          margin-bottom: 1.5rem;
        }
        
        .contact-success {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1rem;
        }
        
        .success-check-icon {
          font-size: 3rem;
          background: rgba(212,175,55,0.1);
          color: var(--accent-gold);
          width: 70px;
          height: 70px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 1px solid var(--border-color);
        }
        
        .gap-1 { gap: 1rem; }
        .mt-1 { margin-top: 0.5rem; }
        .mt-2 { margin-top: 1rem; }
        .uppercase { text-transform: uppercase; }
        .text-xs { font-size: 0.75rem; }
        .font-bold { font-weight: 700; }
        .w-100 { width: 100%; }
      `}</style>
    </div>
  );
};

export default ContactUs;
