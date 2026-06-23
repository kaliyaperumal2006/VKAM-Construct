import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

const mockStructuresFallback = [
  {
    _id: 'mock-home',
    name: 'Home',
    description: 'Residential home construction, including individual villas, duplexes, and bungalows.',
    basePricePerSqFt: 1600,
    packages: [
      { name: 'Standard', priceMultiplier: 1.0, materials: [{ category: 'Foundation', details: 'OPC 43 Grade Cement' }] },
      { name: 'Premium', priceMultiplier: 1.3, materials: [{ category: 'Foundation', details: 'PPC 53 Grade Cement' }] },
      { name: 'Luxury', priceMultiplier: 1.7, materials: [{ category: 'Foundation', details: 'Corrosion resistant premium cement' }] }
    ]
  },
  {
    _id: 'mock-shop',
    name: 'Shop',
    description: 'Commercial retail shops, grocery stores, showrooms, and open-front commercial outlets.',
    basePricePerSqFt: 1300,
    packages: [
      { name: 'Standard', priceMultiplier: 1.0, materials: [{ category: 'Structure', details: 'Galvanized iron shutters' }] },
      { name: 'Premium', priceMultiplier: 1.3, materials: [{ category: 'Structure', details: 'Motorized rolling shutters' }] },
      { name: 'Luxury', priceMultiplier: 1.7, materials: [{ category: 'Structure', details: 'Automatic sliding glass doors' }] }
    ]
  },
  {
    _id: 'mock-building',
    name: 'Commercial Building',
    description: 'Multi-story office spaces, commercial complex, shopping centers, or co-working buildings.',
    basePricePerSqFt: 1900,
    packages: [
      { name: 'Standard', priceMultiplier: 1.0, materials: [{ category: 'Structure', details: 'Standard RCC frame' }] },
      { name: 'Premium', priceMultiplier: 1.3, materials: [{ category: 'Structure', details: 'Glazing facade' }] },
      { name: 'Luxury', priceMultiplier: 1.7, materials: [{ category: 'Structure', details: 'DGU glass curtain wall facade' }] }
    ]
  }
];

export const Estimator = () => {
  const { apiUrl } = useAuth();
  
  // Data State
  const [structures, setStructures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  
  // Selection State
  const [structureType, setStructureType] = useState('Home');
  const [packageType, setPackageType] = useState('Standard');
  const [areaSqFt, setAreaSqFt] = useState(1000);

  // Form State
  const [clientName, setClientName] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [location, setLocation] = useState('');
  const [preferences, setPreferences] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submittedData, setSubmittedData] = useState(null);

  // Load structures
  useEffect(() => {
    const fetchStructures = async () => {
      try {
        const res = await fetch(`${apiUrl}/structures`);
        if (res.ok) {
          const data = await res.json();
          if (data && data.length > 0) {
            setStructures(data);
            setStructureType(data[0].name);
          } else {
            setStructures(mockStructuresFallback);
          }
        } else {
          throw new Error();
        }
      } catch (error) {
        setStructures(mockStructuresFallback);
      } finally {
        setLoading(false);
      }
    };
    fetchStructures();
  }, [apiUrl]);

  // Find currently selected configs
  const currentStructure = structures.find(s => s.name === structureType) || mockStructuresFallback[0];
  const currentPackage = currentStructure?.packages.find(p => p.name === packageType) || currentStructure?.packages[0];

  // Calculation logic
  const ratePerSqFt = currentStructure ? Math.round(currentStructure.basePricePerSqFt * (currentPackage?.priceMultiplier || 1)) : 0;
  const approximateCost = ratePerSqFt * areaSqFt;
  const budgetMin = Math.round(approximateCost * 0.95);
  const budgetMax = Math.round(approximateCost * 1.10);

  const handleAreaChange = (e) => {
    const val = parseInt(e.target.value);
    setAreaSqFt(isNaN(val) ? '' : val);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!areaSqFt || areaSqFt < 100) {
      alert('Minimum building area is 100 sq ft.');
      return;
    }
    if (!clientName || !clientEmail || !clientPhone || !location) {
      alert('All contact details are required.');
      return;
    }

    setSubmitting(true);
    setErrorMsg('');

    const payload = {
      clientName,
      clientEmail,
      clientPhone,
      location,
      structureType,
      packageType,
      areaSqFt,
      preferences
    };

    try {
      const res = await fetch(`${apiUrl}/applications`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      
      const data = await res.json();
      
      if (res.ok) {
        setSubmittedData(data);
      } else {
        // Fallback simulate submission if backend is offline
        console.warn('Backend failed, simulating mock success response.');
        const ref = `BC-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;
        const mockSuccess = {
          _id: `mock-${ref}`,
          referenceId: ref,
          clientName,
          clientEmail,
          clientPhone,
          location,
          structureType,
          packageType,
          areaSqFt,
          approximateCost,
          budgetMin,
          budgetMax,
          status: 'Pending',
          createdAt: new Date().toISOString()
        };
        
        // Save to local storage
        const localApps = JSON.parse(localStorage.getItem('my_local_applications') || '{}');
        localApps[ref] = mockSuccess;
        localStorage.setItem('my_local_applications', JSON.stringify(localApps));

        setSubmittedData(mockSuccess);
      }
    } catch (err) {
      console.warn('Backend offline, simulating mock success response.', err);
      const ref = `BC-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;
      const mockSuccess = {
        _id: `mock-${ref}`,
        referenceId: ref,
        clientName,
        clientEmail,
        clientPhone,
        location,
        structureType,
        packageType,
        areaSqFt,
        approximateCost,
        budgetMin,
        budgetMax,
        status: 'Pending',
        createdAt: new Date().toISOString()
      };
      
      // Save to local storage
      const localApps = JSON.parse(localStorage.getItem('my_local_applications') || '{}');
      localApps[ref] = mockSuccess;
      localStorage.setItem('my_local_applications', JSON.stringify(localApps));

      setSubmittedData(mockSuccess);
    } finally {
      setSubmitting(false);
    }
  };

  const resetForm = () => {
    setSubmittedData(null);
    setClientName('');
    setClientEmail('');
    setClientPhone('');
    setLocation('');
    setPreferences('');
  };

  if (loading) {
    return (
      <div className="container text-center py-5">
        <div className="spinner"></div>
        <p>Loading Cost Estimator...</p>
      </div>
    );
  }

  // Success view
  if (submittedData) {
    return (
      <div className="container estimator-success-container fade-in">
        <div className="glass-panel success-card text-center">
          <div className="success-icon">✓</div>
          <h1 className="gold-gradient-text">Application Submitted!</h1>
          <p className="success-intro">Thank you for submitting your project request. An administrator will review your estimation shortly.</p>
          
          <div className="ref-box">
            <span className="ref-label">YOUR STATUS TRACKING ID</span>
            <span className="ref-value">{submittedData.referenceId}</span>
            <p className="ref-hint">Copy and save this ID to track your construction progress in the <strong>"Track Status"</strong> portal.</p>
          </div>

          <div className="estimate-summary">
            <h3>Project Summary</h3>
            <div className="summary-grid">
              <div className="summary-item"><span className="label">Structure:</span><span className="val">{submittedData.structureType}</span></div>
              <div className="summary-item"><span className="label">Package Tier:</span><span className="val">{submittedData.packageType}</span></div>
              <div className="summary-item"><span className="label">Area (Sq Ft):</span><span className="val">{submittedData.areaSqFt} sq.ft</span></div>
              <div className="summary-item"><span className="label">Approx. Cost:</span><span className="val gold-text">₹{submittedData.approximateCost?.toLocaleString('en-IN')}</span></div>
              <div className="summary-item"><span className="label">Budget Range:</span><span className="val">₹{submittedData.budgetMin?.toLocaleString('en-IN')} - ₹{submittedData.budgetMax?.toLocaleString('en-IN')}</span></div>
              <div className="summary-item"><span className="label">Location:</span><span className="val">{submittedData.location}</span></div>
            </div>
          </div>

          <div className="success-buttons">
            <a href="#tracker" className="outline-button">Track Status Now</a>
            <button onClick={resetForm} className="gold-button">Calculate Another Project</button>
          </div>
        </div>

        <style>{`
          .estimator-success-container { padding-top: 3rem; max-width: 700px; }
          .success-card { display: flex; flex-direction: column; gap: 1.5rem; align-items: center; border-color: var(--accent-gold); }
          .success-icon {
            font-size: 3rem;
            color: #48bb78;
            background: rgba(72,187,120,0.1);
            width: 80px;
            height: 80px;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 50%;
            border: 2px solid rgba(72,187,120,0.3);
          }
          .success-intro { color: var(--text-secondary); max-width: 500px; }
          .ref-box {
            background: rgba(212,175,55,0.08);
            border: 1px solid var(--border-color);
            padding: 1.5rem;
            border-radius: 8px;
            width: 100%;
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 0.5rem;
          }
          .ref-label { font-size: 0.75rem; font-weight: 700; color: var(--text-secondary); letter-spacing: 0.1em; }
          .ref-value { font-size: 2.25rem; font-weight: 800; color: var(--accent-gold); letter-spacing: 0.05em; font-family: var(--font-heading); }
          .ref-hint { font-size: 0.85rem; color: var(--text-secondary); }
          .estimate-summary { width: 100%; text-align: left; background: rgba(0,0,0,0.2); padding: 1.25rem; border-radius: 8px; }
          .estimate-summary h3 { font-size: 1.2rem; margin-bottom: 0.75rem; border-bottom: 1px solid rgba(255,255,255,0.05); padding-bottom: 0.5rem; }
          .summary-grid { display: grid; grid-template-columns: 1fr; gap: 0.75rem; }
          @media (min-width: 576px) { .summary-grid { grid-template-columns: repeat(2, 1fr); } }
          .summary-item { display: flex; justify-content: space-between; font-size: 0.9rem; border-bottom: 1px dashed rgba(255,255,255,0.03); padding-bottom: 0.4rem; }
          .summary-item .label { color: var(--text-secondary); }
          .summary-item .val { font-weight: 600; text-align: right; }
          .success-buttons { display: flex; gap: 1rem; flex-wrap: wrap; margin-top: 1rem; }
        `}</style>
      </div>
    );
  }

  // Calculator Form view
  return (
    <div className="estimator-container container fade-in">
      <div className="guide-header text-center">
        <h1 className="gold-gradient-text">Cost Estimator & Apply</h1>
        <p>Input your construction area and select a quality package to calculate your approximate budget and submit a builder request.</p>
      </div>

      <div className="estimator-grid">
        {/* Cost Calculator Section */}
        <div className="calculator-panel glass-panel">
          <h2>1. Select Project Parameters</h2>
          
          <div className="form-group mt-2">
            <label className="form-label">Structure Category</label>
            <select 
              value={structureType} 
              onChange={(e) => setStructureType(e.target.value)} 
              className="form-select"
            >
              {structures.map(s => <option key={s._id} value={s.name}>{s.name} Construction</option>)}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Package / Quality Tier</label>
            <div className="package-selector-grid">
              {currentStructure?.packages.map(p => (
                <button
                  key={p.name}
                  type="button"
                  onClick={() => setPackageType(p.name)}
                  className={`pkg-select-btn pkg-${p.name.toLowerCase()} ${packageType === p.name ? 'active' : ''}`}
                >
                  <span className="pkg-title">{p.name}</span>
                  <span className="pkg-multiplier">{p.priceMultiplier}x rate</span>
                </button>
              ))}
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Built-up Area (Square Feet)</label>
            <div className="input-range-container">
              <input
                type="number"
                min="100"
                max="100000"
                value={areaSqFt}
                onChange={handleAreaChange}
                className="form-input"
                placeholder="e.g. 1500"
              />
              <span className="area-unit">sq.ft</span>
            </div>
            <input
              type="range"
              min="100"
              max="5000"
              step="50"
              value={areaSqFt || 100}
              onChange={handleAreaChange}
              className="form-range-slider"
            />
            <span className="range-hints">Range: 100 sq.ft to 5,000+ sq.ft</span>
          </div>

          <div className="calculations-display">
            <div className="calc-row">
              <span>Standard Base Price:</span>
              <span>₹{currentStructure?.basePricePerSqFt} / sq.ft</span>
            </div>
            <div className="calc-row">
              <span>Package Multiplier ({packageType}):</span>
              <span>{currentPackage?.priceMultiplier || 1.0}x</span>
            </div>
            <div className="calc-row rate-row">
              <span>Effective Rate / sq.ft:</span>
              <span className="gold-text font-bold">₹{ratePerSqFt} / sq.ft</span>
            </div>
            <div className="calc-row total-row">
              <span>Approx. Total Cost:</span>
              <span className="gold-text total-price">₹{approximateCost.toLocaleString('en-IN')}</span>
            </div>
            <div className="calc-row range-row">
              <span>Estimated Budget Range:</span>
              <span className="text-primary font-bold">₹{budgetMin.toLocaleString('en-IN')} - ₹{budgetMax.toLocaleString('en-IN')}</span>
            </div>
          </div>
        </div>

        {/* Builder Request Form */}
        <div className="request-panel glass-panel">
          <h2>2. Apply for Construction</h2>
          <p className="panel-desc">Submit this cost estimate to our constructor desk. We will review your site details and contact you to schedule an inspection.</p>
          
          <form onSubmit={handleFormSubmit} className="request-form">
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input
                type="text"
                required
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                className="form-input"
                placeholder="John Doe"
              />
            </div>

            <div className="grid-2 gap-1">
              <div className="form-group">
                <label className="form-label">Email Address</label>
                <input
                  type="email"
                  required
                  value={clientEmail}
                  onChange={(e) => setClientEmail(e.target.value)}
                  className="form-input"
                  placeholder="john@example.com"
                />
              </div>
              <div className="form-group">
                <label className="form-label">Phone Number</label>
                <input
                  type="tel"
                  required
                  value={clientPhone}
                  onChange={(e) => setClientPhone(e.target.value)}
                  className="form-input"
                  placeholder="9876543210"
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Site Location / Address</label>
              <input
                type="text"
                required
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="form-input"
                placeholder="e.g. 5th Cross, Indiranagar, Bangalore"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Custom Preferences & Design Suggestions (Colors, layouts, style...)</label>
              <textarea
                value={preferences}
                onChange={(e) => setPreferences(e.target.value)}
                className="form-textarea"
                placeholder="e.g. Cream exterior walls, teakwood flooring in living room, modular kitchen layout..."
                rows="3"
              ></textarea>
            </div>

            <div className="project-highlight-box">
              <p>Project: <strong>{areaSqFt || 0} sq.ft {structureType}</strong> ({packageType} Tier)</p>
              <p>Requested Budget: <strong>₹{approximateCost.toLocaleString('en-IN')}</strong></p>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="gold-button w-100 justify-content-center"
            >
              {submitting ? 'Submitting Application...' : 'Submit Application to Build'}
            </button>
          </form>
        </div>
      </div>

      <style>{`
        .estimator-container { padding-top: 2.5rem; display: flex; flex-direction: column; gap: 2rem; }
        .estimator-grid { display: grid; grid-template-columns: 1fr; gap: 2rem; }
        @media (min-width: 992px) { .estimator-grid { grid-template-columns: 1fr 1fr; } }
        .calculator-panel h2, .request-panel h2 { font-size: 1.35rem; margin-bottom: 0.75rem; border-bottom: 1px solid rgba(255,255,255,0.05); padding-bottom: 0.5rem; }
        .panel-desc { font-size: 0.875rem; color: var(--text-secondary); margin-bottom: 1.25rem; }
        .package-selector-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 0.5rem; margin-top: 0.5rem; }
        .pkg-select-btn {
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 0.75rem 0.5rem;
          border-radius: 6px;
          border: 1px solid var(--glass-border);
          background: var(--bg-secondary);
          color: var(--text-secondary);
          cursor: pointer;
          transition: var(--transition);
        }
        .pkg-select-btn:hover { border-color: rgba(255,255,255,0.1); color: var(--text-primary); }
        .pkg-select-btn.active.pkg-standard { background-color: rgba(255, 255, 255, 0.05); border-color: var(--text-secondary); color: var(--text-primary); }
        .pkg-select-btn.active.pkg-premium { background-color: rgba(66, 153, 225, 0.1); border-color: var(--status-review); color: #63b3ed; }
        .pkg-select-btn.active.pkg-luxury { background-color: rgba(212, 175, 55, 0.1); border-color: var(--accent-gold); color: var(--accent-gold-hover); }
        .pkg-title { font-weight: 600; font-size: 0.95rem; }
        .pkg-multiplier { font-size: 0.75rem; color: var(--text-muted); }
        
        .input-range-container { position: relative; display: flex; align-items: center; }
        .area-unit { position: absolute; right: 1rem; color: var(--text-muted); font-size: 0.9rem; }
        .form-range-slider {
          width: 100%;
          margin-top: 0.75rem;
          accent-color: var(--accent-gold);
          cursor: pointer;
        }
        .range-hints { font-size: 0.75rem; color: var(--text-muted); display: block; text-align: right; }
        
        .calculations-display {
          margin-top: 1.5rem;
          background: rgba(0,0,0,0.3);
          border-radius: 8px;
          padding: 1.25rem;
          border: 1px solid rgba(255,255,255,0.02);
          display: flex;
          flex-direction: column;
          gap: 0.6rem;
        }
        .calc-row { display: flex; justify-content: space-between; font-size: 0.9rem; color: var(--text-secondary); }
        .rate-row { border-top: 1px dashed rgba(255,255,255,0.05); margin-top: 0.5rem; padding-top: 0.5rem; }
        .total-row { border-top: 1px solid rgba(255,255,255,0.08); margin-top: 0.5rem; padding-top: 0.5rem; align-items: center; }
        .total-price { font-size: 1.5rem; font-weight: 800; font-family: var(--font-heading); }
        .range-row { border-top: 1px dashed rgba(255,255,255,0.05); padding-top: 0.5rem; font-size: 0.95rem; }
        .font-bold { font-weight: 600; }
        .project-highlight-box {
          background: rgba(212,175,55,0.05);
          border: 1px dashed var(--border-color);
          padding: 1rem;
          border-radius: 6px;
          margin-bottom: 1.25rem;
          font-size: 0.9rem;
          color: var(--text-primary);
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }
        .gap-1 { gap: 1rem; }
      `}</style>
    </div>
  );
};

export default Estimator;
