import React from 'react';

export const Home = () => {
  return (
    <div className="home-container container fade-in">
      {/* Hero Section */}
      <section className="hero-section glass-panel">
        <div className="hero-info">
          <span className="hero-sub">PREMIUM CONSTRUCTION & ESTIMATION</span>
          <h1 className="hero-title">
            Crafting Structures of <span className="gold-gradient-text">Enduring Luxury</span>
          </h1>
          <p className="hero-desc">
            Explore premium construction materials, calculate instant budget estimates, and submit your project applications. Experience full transparency from foundation to finish.
          </p>
          <div className="hero-buttons">
            <a href="#estimator" className="gold-button">Estimate Project Cost</a>
            <a href="#materials" className="outline-button">Explore Materials</a>
          </div>
        </div>
        <div className="hero-graphic">
          <div className="blueprint-lines"></div>
          <div className="blueprint-outline"></div>
        </div>
      </section>

      {/* Services Section */}
      <section className="services-section">
        <h2 className="section-title text-center">Our Construction Offerings</h2>
        <p className="section-subtitle text-center">We build customized spaces tailored to your functional needs and budget range.</p>
        
        <div className="grid-3">
          <div className="service-card glass-panel">
            <div className="service-icon">🏡</div>
            <h3>Residential Homes</h3>
            <p>From modern compact duplexes to premium luxury estates. Customized floorplans, robust structural design, and superior interior finishes.</p>
            <a href="#materials" className="service-link">View Home Materials &rarr;</a>
          </div>

          <div className="service-card glass-panel">
            <div className="service-icon">🏬</div>
            <h3>Commercial Shops</h3>
            <p>Functional retail outlets, supermarkets, and showrooms. High-durability flooring, glass storefronts, secure automated rolling shutters.</p>
            <a href="#materials" className="service-link">View Shop Materials &rarr;</a>
          </div>

          <div className="service-card glass-panel">
            <div className="service-icon">🏢</div>
            <h3>Commercial Buildings</h3>
            <p>Multi-story complex structures, office centers, and co-working hubs. Integrated elevator systems, structural glazing facades, HVAC readiness.</p>
            <a href="#materials" className="service-link">View Building Materials &rarr;</a>
          </div>
        </div>
      </section>

      {/* Quick Action Banner */}
      <section className="action-banner glass-panel">
        <div className="action-text">
          <h2>Ready to calculate your budget?</h2>
          <p>Get a granular estimate based on your square footage and desired material package instantly.</p>
        </div>
        <a href="#estimator" className="gold-button">Open Cost Estimator</a>
      </section>

      {/* Why Choose Us */}
      <section className="benefits-section">
        <h2 className="section-title text-center">Why Build With Us?</h2>
        <div className="grid-2 benefits-grid">
          <div className="benefit-item">
            <span className="benefit-num">01</span>
            <div>
              <h4>Material Transparency</h4>
              <p>No mystery materials. We provide a detailed bill of materials specifying brands (like Tata Steel, Ultratech Cement, Jaguar Fittings) before work starts.</p>
            </div>
          </div>
          
          <div className="benefit-item">
            <span className="benefit-num">02</span>
            <div>
              <h4>Instant Status Tracking</h4>
              <p>Once you apply, track your application through our online portal. Watch your request move from pending to approved with live administrator notes.</p>
            </div>
          </div>

          <div className="benefit-item">
            <span className="benefit-num">03</span>
            <div>
              <h4>Accurate Budget Ranges</h4>
              <p>Our cost estimators use up-to-date base material prices to generate reliable budgets, ensuring you face no unexpected overruns.</p>
            </div>
          </div>

          <div className="benefit-item">
            <span className="benefit-num">04</span>
            <div>
              <h4>Admin Managed Settings</h4>
              <p>Our constructors actively update rates and material configurations on the admin dashboard, keeping prices aligned with the local market.</p>
            </div>
          </div>
        </div>
      </section>

      <style>{`
        .home-container {
          display: flex;
          flex-direction: column;
          gap: 5rem;
          padding-top: 2.5rem;
        }
        .hero-section {
          display: grid;
          grid-template-columns: 1fr;
          gap: 2rem;
          align-items: center;
          padding: 3rem;
          min-height: 400px;
          position: relative;
          overflow: hidden;
        }
        @media (min-width: 992px) {
          .hero-section {
            grid-template-columns: 1.2fr 0.8fr;
          }
        }
        .hero-info {
          display: flex;
          flex-direction: column;
          gap: 1.2rem;
          z-index: 2;
        }
        .hero-sub {
          color: var(--accent-gold);
          font-weight: 700;
          font-size: 0.8rem;
          letter-spacing: 0.15em;
        }
        .hero-title {
          font-size: 2.5rem;
          line-height: 1.1;
        }
        @media (min-width: 768px) {
          .hero-title {
            font-size: 3.5rem;
          }
        }
        .hero-desc {
          color: var(--text-secondary);
          font-size: 1.1rem;
          max-width: 500px;
        }
        .hero-buttons {
          display: flex;
          flex-wrap: wrap;
          gap: 1rem;
          margin-top: 1rem;
        }
        .hero-graphic {
          position: relative;
          width: 100%;
          height: 250px;
          border: 1px dashed rgba(212, 175, 55, 0.25);
          border-radius: 8px;
          background-color: rgba(10, 12, 16, 0.4);
          overflow: hidden;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        @media (min-width: 992px) {
          .hero-graphic {
            height: 100%;
            min-height: 300px;
          }
        }
        .blueprint-lines {
          position: absolute;
          width: 200%;
          height: 200%;
          background-image: 
            linear-gradient(rgba(212, 175, 55, 0.05) 1px, transparent 1px),
            linear-gradient(90deg, rgba(212, 175, 55, 0.05) 1px, transparent 1px);
          background-size: 20px 20px;
          transform: rotate(15deg);
        }
        .blueprint-outline {
          width: 60%;
          height: 60%;
          border: 2px solid var(--accent-gold);
          position: relative;
          opacity: 0.4;
          box-shadow: 0 0 20px rgba(212, 175, 55, 0.15);
        }
        .blueprint-outline::before {
          content: '🏡';
          position: absolute;
          font-size: 3rem;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
        }
        .section-title {
          font-size: 2rem;
          margin-bottom: 0.75rem;
          position: relative;
          width: fit-content;
          margin-left: auto;
          margin-right: auto;
        }
        .section-title::after {
          content: '';
          position: absolute;
          bottom: -8px;
          left: 10%;
          width: 80%;
          height: 2px;
          background: linear-gradient(90deg, transparent, var(--accent-gold), transparent);
        }
        .section-subtitle {
          color: var(--text-secondary);
          max-width: 600px;
          margin: 0 auto 3rem auto;
        }
        .text-center {
          text-align: center;
        }
        .service-card {
          display: flex;
          flex-direction: column;
          gap: 1rem;
          text-align: left;
        }
        .service-icon {
          font-size: 2.5rem;
          background: rgba(212, 175, 55, 0.1);
          width: 60px;
          height: 60px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 8px;
          border: 1px solid rgba(212, 175, 55, 0.2);
        }
        .service-card h3 {
          font-size: 1.35rem;
          color: var(--text-primary);
        }
        .service-card p {
          color: var(--text-secondary);
          font-size: 0.95rem;
          flex: 1;
        }
        .service-link {
          color: var(--accent-gold);
          font-weight: 600;
          font-size: 0.9rem;
          margin-top: 0.5rem;
        }
        .service-link:hover {
          color: var(--accent-gold-hover);
        }
        .action-banner {
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          align-items: flex-start;
          gap: 1.5rem;
          background: linear-gradient(135deg, rgba(23, 28, 36, 0.8) 0%, rgba(212, 175, 55, 0.05) 100%);
          border-left: 4px solid var(--accent-gold);
          padding: 2.5rem;
        }
        @media (min-width: 768px) {
          .action-banner {
            flex-direction: row;
            align-items: center;
          }
        }
        .action-text h2 {
          font-size: 1.75rem;
          margin-bottom: 0.5rem;
        }
        .action-text p {
          color: var(--text-secondary);
        }
        .benefits-grid {
          margin-top: 1rem;
        }
        .benefit-item {
          display: flex;
          gap: 1.5rem;
          padding: 1.5rem;
          background: rgba(255, 255, 255, 0.01);
          border: 1px solid rgba(255, 255, 255, 0.03);
          border-radius: 8px;
        }
        .benefit-num {
          font-family: var(--font-heading);
          font-size: 2rem;
          font-weight: 800;
          color: var(--accent-gold);
          opacity: 0.5;
          line-height: 1;
        }
        .benefit-item h4 {
          font-size: 1.15rem;
          margin-bottom: 0.5rem;
        }
        .benefit-item p {
          color: var(--text-secondary);
          font-size: 0.9rem;
        }
      `}</style>
    </div>
  );
};

export default Home;
