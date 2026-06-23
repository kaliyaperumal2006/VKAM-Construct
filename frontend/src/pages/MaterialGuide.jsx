import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

// Hardcoded fallback data in case backend is loading/unreachable
const mockStructuresFallback = [
  {
    _id: 'mock-home',
    name: 'Home',
    description: 'Residential home construction, including individual villas, duplexes, and bungalows.',
    basePricePerSqFt: 1600,
    packages: [
      {
        name: 'Standard',
        priceMultiplier: 1.0,
        materials: [
          { category: 'Foundation & RCC', details: 'OPC 43 Grade Cement (Ultratech/ACC), Fe 500 TMT Steel (Local/Vizag Steel)' },
          { category: 'Walls & Bricks', details: 'High-quality local red clay bricks with 1:6 cement sand mortar' },
          { category: 'Flooring', details: 'Ceramic tiles (2x2 ft) in living/bedroom, anti-skid tiles in bathrooms' },
          { category: 'Woodwork & Doors', details: 'Main door: solid flush door with veneer. Internal doors: painted flush doors' },
          { category: 'Plumbing & Bath Fittings', details: 'PVC pipeline (Supreme/Ashirvad), basic CP fittings (Parryware/Cera)' },
          { category: 'Electricals', details: 'Concealed wiring (Finolex/Poly Cab), basic switches (Anchor/GM)' },
          { category: 'Paint & Finishes', details: 'Interior: 2 coats OBD over putty. Exterior: 1 coat primer & weather-proof paint' }
        ]
      },
      {
        name: 'Premium',
        priceMultiplier: 1.3,
        materials: [
          { category: 'Foundation & RCC', details: 'PPC/OPC 53 Grade Cement (Ultratech/Ambuja), Fe 550 TMT Steel (Tata Tiscon/JSW)' },
          { category: 'Walls & Bricks', details: '8-inch solid concrete blocks or premium wirecut red bricks' },
          { category: 'Flooring', details: 'Double charged vitrified tiles (Kajaria/Somany), granite staircases' },
          { category: 'Woodwork & Doors', details: 'Main door: Teakwood frame and shutter. Internal doors: flush doors with laminate' },
          { category: 'Plumbing & Bath Fittings', details: 'CPVC & UPVC piping (Astral/Supreme), Jaguar CP & sanitary fittings' },
          { category: 'Electricals', details: 'FR concealed wiring (Havells/Finolex), Modular switches (Legrand/Havells)' },
          { category: 'Paint & Finishes', details: 'Interior: premium acrylic emulsion paint (Asian Paints). Exterior: Apex weather-proof paint' }
        ]
      },
      {
        name: 'Luxury',
        priceMultiplier: 1.7,
        materials: [
          { category: 'Foundation & RCC', details: 'Corrosion resistant premium cement, Fe 550D Super Premium Steel (Tata Tiscon)' },
          { category: 'Walls & Bricks', details: 'Fly-ash lightweight blocks / premium AAC blocks for superior thermal insulation' },
          { category: 'Flooring', details: 'Italian marble in living area, engineered wooden flooring in master bedroom' },
          { category: 'Woodwork & Doors', details: 'Full Teakwood frame & shutters for all doors, premium UPVC sound-proof windows' },
          { category: 'Plumbing & Bath Fittings', details: 'Noise-less piping (Astral Silencio), premium Jaguar/Kohler wall-hung sanitary ware' },
          { category: 'Electricals', details: 'FRLS Copper wiring (Finolex), touch/smart modular switches (Legrand/Schneider)' },
          { category: 'Paint & Finishes', details: 'Interior: Royal shine/velvet touch paint. Exterior: Apex Ultima protection paint' }
        ]
      }
    ]
  },
  {
    _id: 'mock-shop',
    name: 'Shop',
    description: 'Commercial retail shops, grocery stores, showrooms, and open-front commercial outlets.',
    basePricePerSqFt: 1300,
    packages: [
      {
        name: 'Standard',
        priceMultiplier: 1.0,
        materials: [
          { category: 'Foundation & RCC', details: 'Standard concrete mixes, local structural steel' },
          { category: 'Frontage', details: 'Manual rolling shutter (galvanized iron)' },
          { category: 'Flooring', details: 'Polished Kota stone or basic ceramic tiles' },
          { category: 'Electricals', details: 'Basic commercial wiring, non-modular boards for high-load appliances' },
          { category: 'Ceiling & Paint', details: 'Exposed roof with whitewash or basic paint' }
        ]
      },
      {
        name: 'Premium',
        priceMultiplier: 1.3,
        materials: [
          { category: 'Foundation & RCC', details: 'Ultratech/Ambuja cement, JSW steel' },
          { category: 'Frontage', details: 'Motorized rolling shutter & clear glass storefront window' },
          { category: 'Flooring', details: 'Premium vitrified tiles or polished concrete floors' },
          { category: 'Electricals', details: 'Modular switchboards, separate circuit breakers, LED track light preparation' },
          { category: 'Ceiling & Paint', details: 'Grid false ceiling with LED panel layout, premium emulsion paint' }
        ]
      },
      {
        name: 'Luxury',
        priceMultiplier: 1.7,
        materials: [
          { category: 'Foundation & RCC', details: 'Tata Tiscon steel, premium grade RCC' },
          { category: 'Frontage', details: 'Automatic sliding glass doors, double-glazed toughened glass facade' },
          { category: 'Flooring', details: 'Polished granite slabs or epoxy floor finish' },
          { category: 'Electricals', details: 'Fully integrated smart lighting prep, architectural lighting, fire alarm wiring' },
          { category: 'Ceiling & Paint', details: 'Designer gypsum false ceiling, texture paint finishes' }
        ]
      }
    ]
  },
  {
    _id: 'mock-building',
    name: 'Commercial Building',
    description: 'Multi-story office spaces, commercial complex, shopping centers, or co-working buildings.',
    basePricePerSqFt: 1900,
    packages: [
      {
        name: 'Standard',
        priceMultiplier: 1.0,
        materials: [
          { category: 'Structure & Facade', details: 'Standard RCC frame structure, brick masonry outer walls, basic aluminum windows' },
          { category: 'Flooring & Lobby', details: 'Ceramic tiles in common corridors, IPS concrete flooring inside office spaces' },
          { category: 'Utilities & Lift', details: 'Standard 6-passenger gear lift, basic overhead water tanks' },
          { category: 'Safety & Electrical', details: 'Standard conduit wiring, manual fire extinguishers on each floor' }
        ]
      },
      {
        name: 'Premium',
        priceMultiplier: 1.3,
        materials: [
          { category: 'Structure & Facade', details: 'Strong RCC structure, structural glass glazing facade, UPVC windows' },
          { category: 'Flooring & Lobby', details: 'Polished granite in main lobby and stairs, vitrified tiles in office areas' },
          { category: 'Utilities & Lift', details: '10-passenger automatic lift (OTIS/Kone), continuous backup generator wiring' },
          { category: 'Safety & Electrical', details: 'Modular switchgear, automatic fire hydrant pipes, sprinkler system prep' }
        ]
      },
      {
        name: 'Luxury',
        priceMultiplier: 1.7,
        materials: [
          { category: 'Structure & Facade', details: 'Premium RCC structure, Double Glazed Unit (DGU) glass curtain wall facade' },
          { category: 'Flooring & Lobby', details: 'Imported marble in lobby, premium tile/carpet tiles, designer corridors' },
          { category: 'Utilities & Lift', details: 'High-speed smart lifts, fully integrated central HVAC system ducting, 100% generator backup' },
          { category: 'Safety & Electrical', details: 'Fully automated fire detection and suppression, building management system (BMS) wiring' }
        ]
      }
    ]
  }
];

export const MaterialGuide = () => {
  const { apiUrl } = useAuth();
  const [structures, setStructures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedStructureId, setSelectedStructureId] = useState('');
  const [selectedPackageName, setSelectedPackageName] = useState('Standard');
  const [backendStatus, setBackendStatus] = useState('connecting'); // connecting, online, offline

  useEffect(() => {
    const fetchStructures = async () => {
      try {
        const res = await fetch(`${apiUrl}/structures`);
        if (res.ok) {
          const data = await res.json();
          if (data && data.length > 0) {
            setStructures(data);
            setSelectedStructureId(data[0]._id);
            setBackendStatus('online');
          } else {
            // Seed is empty, use fallback
            setStructures(mockStructuresFallback);
            setSelectedStructureId(mockStructuresFallback[0]._id);
            setBackendStatus('online-empty');
          }
        } else {
          throw new Error('Non-ok response');
        }
      } catch (error) {
        console.warn('Backend unavailable, loading local fallback data.', error);
        setStructures(mockStructuresFallback);
        setSelectedStructureId(mockStructuresFallback[0]._id);
        setBackendStatus('offline');
      } finally {
        setLoading(false);
      }
    };

    fetchStructures();
  }, [apiUrl]);

  const currentStructure = structures.find(s => s._id === selectedStructureId);
  const currentPackage = currentStructure?.packages.find(p => p.name === selectedPackageName);

  if (loading) {
    return (
      <div className="container text-center loader-container">
        <div className="spinner"></div>
        <p>Loading Material Guides...</p>
        <style>{`
          .loader-container { padding: 5rem 0; }
          .spinner {
            border: 4px solid rgba(212, 175, 55, 0.1);
            width: 50px;
            height: 50px;
            border-radius: 50%;
            border-left-color: var(--accent-gold);
            animation: spin 1s linear infinite;
            margin: 0 auto 1.5rem auto;
          }
          @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
        `}</style>
      </div>
    );
  }

  return (
    <div className="material-guide-container container fade-in">
      {backendStatus === 'offline' && (
        <div className="warning-banner">
          ⚠️ Running in <strong>Offline Demo Mode</strong> (Backend database is not connected/online). Displaying local mockup data.
        </div>
      )}

      <div className="guide-header">
        <h1 className="gold-gradient-text">Material Specifications</h1>
        <p>Browse the exact construction material specifications and brand guides used for different building types and quality packages.</p>
      </div>

      {/* Structure Type Select tabs */}
      <div className="structure-tabs glass-panel">
        {structures.map((s) => (
          <button
            key={s._id}
            onClick={() => {
              setSelectedStructureId(s._id);
              // Maintain standard packages across tab changes
              if (!s.packages.some(p => p.name === selectedPackageName)) {
                setSelectedPackageName(s.packages[0]?.name || 'Standard');
              }
            }}
            className={`structure-tab-btn ${selectedStructureId === s._id ? 'active' : ''}`}
          >
            {s.name === 'Home' ? '🏡 Home Construction' : s.name === 'Shop' ? '🏬 Retail Shop' : '🏢 Commercial Building'}
          </button>
        ))}
      </div>

      <div className="guide-details-grid">
        {/* Structure description & pricing details */}
        <div className="structure-info-panel glass-panel">
          <h3>About {currentStructure?.name} Construction</h3>
          <p className="structure-description">{currentStructure?.description}</p>
          
          <div className="pricing-meta">
            <div className="price-metric">
              <span className="price-label">Base Rate (Standard):</span>
              <span className="price-value">₹{currentStructure?.basePricePerSqFt} / sq.ft</span>
            </div>
            
            <div className="price-metric mt-1">
              <span className="price-label">Selected Package:</span>
              <span className="price-value gold-text">{selectedPackageName}</span>
            </div>

            <div className="price-metric">
              <span className="price-label">Cost Multiplier:</span>
              <span className="price-value">{currentPackage?.priceMultiplier}x</span>
            </div>

            <div className="price-metric estimated-total-rate">
              <span className="price-label">Estimated Rate:</span>
              <span className="price-value gold-text">₹{Math.round((currentStructure?.basePricePerSqFt || 0) * (currentPackage?.priceMultiplier || 1))} / sq.ft</span>
            </div>
          </div>

          <div className="estimator-redirect">
            <p>Ready to calculate the budget for your space size?</p>
            <a href="#estimator" className="gold-button w-100 text-center justify-content-center">Go to Cost Estimator</a>
          </div>
        </div>

        {/* Package Tabs & Material Specifications list */}
        <div className="material-specifications-panel">
          <div className="package-tabs">
            {currentStructure?.packages.map((pkg) => (
              <button
                key={pkg.name}
                onClick={() => setSelectedPackageName(pkg.name)}
                className={`package-tab-btn pkg-${pkg.name.toLowerCase()} ${selectedPackageName === pkg.name ? 'active' : ''}`}
              >
                {pkg.name} Tier
              </button>
            ))}
          </div>

          <div className="materials-list glass-panel">
            <h4 className="list-title">Materials Checklist for {currentStructure?.name} ({selectedPackageName})</h4>
            
            <div className="material-rows">
              {currentPackage?.materials && currentPackage.materials.length > 0 ? (
                currentPackage.materials.map((m, idx) => (
                  <div key={idx} className="material-row-item">
                    <div className="mat-main-info">
                      <span className="material-category">{m.category}</span>
                      <span className="material-details">{m.details}</span>
                    </div>
                    {(m.quantity || (m.approxCost !== undefined && m.approxCost > 0)) && (
                      <div className="mat-metrics-info">
                        {m.quantity && (
                          <div className="mat-metric-badge">
                            <span className="metric-label">Qty:</span>
                            <span className="metric-val">{m.quantity}</span>
                          </div>
                        )}
                        {m.approxCost !== undefined && m.approxCost > 0 && (
                          <div className="mat-metric-badge cost-badge">
                            <span className="metric-label">Est. Cost:</span>
                            <span className="metric-val gold-text">₹{m.approxCost.toLocaleString('en-IN')}</span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <div className="text-center p-3 text-secondary">No materials specified for this package.</div>
              )}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .material-guide-container {
          padding-top: 2.5rem;
          display: flex;
          flex-direction: column;
          gap: 2rem;
        }
        .warning-banner {
          background-color: rgba(236, 201, 75, 0.1);
          border: 1px solid var(--status-pending);
          color: var(--status-pending);
          padding: 0.75rem 1.25rem;
          border-radius: 6px;
          font-size: 0.9rem;
          text-align: center;
        }
        .guide-header {
          text-align: center;
          max-width: 600px;
          margin: 0 auto;
        }
        .guide-header h1 {
          font-size: 2.25rem;
          margin-bottom: 0.5rem;
        }
        .guide-header p {
          color: var(--text-secondary);
        }
        .structure-tabs {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
          padding: 0.75rem;
        }
        @media (min-width: 768px) {
          .structure-tabs {
            flex-direction: row;
            justify-content: space-around;
          }
        }
        .structure-tab-btn {
          flex: 1;
          background: transparent;
          border: 1px solid transparent;
          color: var(--text-secondary);
          padding: 1rem;
          border-radius: 6px;
          cursor: pointer;
          font-family: var(--font-heading);
          font-weight: 600;
          font-size: 1.1rem;
          transition: var(--transition);
          text-align: center;
        }
        .structure-tab-btn:hover {
          background: rgba(255, 255, 255, 0.02);
          color: var(--text-primary);
        }
        .structure-tab-btn.active {
          background: rgba(212, 175, 55, 0.1);
          color: var(--accent-gold);
          border-color: var(--border-color);
        }
        .guide-details-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 2rem;
        }
        @media (min-width: 992px) {
          .guide-details-grid {
            grid-template-columns: 0.8fr 1.2fr;
          }
        }
        .structure-info-panel {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
          height: fit-content;
        }
        .structure-info-panel h3 {
          font-size: 1.4rem;
          border-bottom: 1px solid rgba(255,255,255,0.05);
          padding-bottom: 0.5rem;
        }
        .structure-description {
          color: var(--text-secondary);
          font-size: 0.95rem;
          line-height: 1.6;
        }
        .pricing-meta {
          background: rgba(0,0,0,0.2);
          border-radius: 6px;
          padding: 1.25rem;
          border: 1px solid rgba(255,255,255,0.02);
        }
        .price-metric {
          display: flex;
          justify-content: space-between;
          font-size: 0.95rem;
          padding: 0.4rem 0;
          border-bottom: 1px dashed rgba(255,255,255,0.05);
        }
        .price-metric:last-child {
          border-bottom: none;
        }
        .price-label {
          color: var(--text-secondary);
        }
        .price-value {
          font-weight: 600;
        }
        .estimated-total-rate {
          margin-top: 0.75rem;
          padding-top: 0.75rem;
          border-top: 1px solid rgba(212, 175, 55, 0.2);
          font-size: 1.1rem;
        }
        .estimator-redirect {
          margin-top: 1rem;
          border-top: 1px solid rgba(255,255,255,0.05);
          padding-top: 1rem;
          font-size: 0.9rem;
          text-align: center;
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }
        .estimator-redirect p {
          color: var(--text-muted);
        }
        .package-tabs {
          display: flex;
          gap: 0.5rem;
          margin-bottom: 1rem;
        }
        .package-tab-btn {
          flex: 1;
          padding: 0.75rem;
          border-radius: 6px;
          border: 1px solid var(--glass-border);
          background: var(--bg-secondary);
          color: var(--text-secondary);
          font-weight: 600;
          cursor: pointer;
          transition: var(--transition);
        }
        .package-tab-btn:hover {
          color: var(--text-primary);
          border-color: rgba(255,255,255,0.1);
        }
        .package-tab-btn.active.pkg-standard {
          background-color: rgba(255, 255, 255, 0.05);
          color: var(--text-primary);
          border-color: var(--text-secondary);
        }
        .package-tab-btn.active.pkg-premium {
          background-color: rgba(66, 153, 225, 0.15);
          color: #63b3ed;
          border-color: #4299e1;
        }
        .package-tab-btn.active.pkg-luxury {
          background-color: rgba(212, 175, 55, 0.15);
          color: var(--accent-gold-hover);
          border-color: var(--accent-gold);
        }
        .materials-list {
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
        }
        .list-title {
          font-size: 1.15rem;
          border-bottom: 1px solid rgba(255,255,255,0.05);
          padding-bottom: 0.5rem;
          color: var(--text-primary);
        }
        .material-rows {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }
        .material-row-item {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
          padding: 0.75rem 1rem;
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid rgba(255, 255, 255, 0.03);
          border-radius: 6px;
        }
        @media (min-width: 768px) {
          .material-row-item {
            flex-direction: row;
            justify-content: space-between;
            align-items: center;
          }
        }
        .mat-main-info {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
          flex: 1;
        }
        @media (min-width: 576px) {
          .mat-main-info {
            display: grid;
            grid-template-columns: 180px 1fr;
            gap: 1.5rem;
            align-items: baseline;
          }
        }
        .material-category {
          font-weight: 600;
          color: var(--accent-gold);
          font-size: 0.9rem;
        }
        .material-details {
          color: var(--text-primary);
          font-size: 0.95rem;
        }
        .mat-metrics-info {
          display: flex;
          gap: 1rem;
          flex-shrink: 0;
          margin-top: 0.25rem;
        }
        @media (min-width: 768px) {
          .mat-metrics-info {
            margin-top: 0;
          }
        }
        .mat-metric-badge {
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.05);
          border-radius: 4px;
          padding: 0.25rem 0.5rem;
          font-size: 0.8rem;
          display: flex;
          gap: 0.35rem;
        }
        .cost-badge {
          background: rgba(212,175,55,0.08);
          border-color: var(--border-color);
        }
        .metric-label {
          color: var(--text-secondary);
        }
        .metric-val {
          font-weight: 600;
        }
        .w-100 { width: 100%; }
        .mt-1 { margin-top: 0.25rem; }
      `}</style>
    </div>
  );
};

export default MaterialGuide;
