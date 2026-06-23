import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

// Offline fallback structure details for material specifications breakdown
const mockStructuresFallback = [
  {
    name: 'Home',
    packages: [
      {
        name: 'Standard',
        materials: [
          { category: 'Foundation & RCC', details: 'OPC 43 Grade Cement, Fe 500 TMT Steel', quantity: '8.5 Tons', approxCost: 380000 },
          { category: 'Walls & Bricks', details: 'Local red clay bricks & sand mortar', quantity: '22,000 Pcs', approxCost: 180000 },
          { category: 'Flooring', details: 'Ceramic tiles (2x2 ft), basic anti-skid in bath', quantity: '1,400 sqft', approxCost: 95000 },
          { category: 'Woodwork & Doors', details: 'Veneer finish main door, painted flush internal doors', quantity: '8 Doors', approxCost: 75000 },
          { category: 'Plumbing & Fittings', details: 'Ashirvad PVC pipes, Parryware sanitary ware', quantity: 'Full Layout', approxCost: 110000 },
          { category: 'Electricals', details: 'Finolex wires, Anchor switches & boards', quantity: '65 Points', approxCost: 85000 },
          { category: 'Paint & Finishes', details: 'Interior: OBD paint. Exterior: weather-coat paint', quantity: '3,200 sqft', approxCost: 65000 }
        ]
      },
      {
        name: 'Premium',
        materials: [
          { category: 'Foundation & RCC', details: 'OPC 53 Grade Cement, Tata Tiscon/JSW Steel', quantity: '9.2 Tons', approxCost: 510000 },
          { category: 'Walls & Bricks', details: 'Solid concrete blocks, cement mortar 1:5', quantity: '18,500 Blocks', approxCost: 210000 },
          { category: 'Flooring', details: 'Double charged vitrified tiles, granite stairway', quantity: '1,500 sqft', approxCost: 160000 },
          { category: 'Woodwork & Doors', details: 'Teakwood main door frame, laminated internal doors', quantity: '9 Doors', approxCost: 140000 },
          { category: 'Plumbing & Fittings', details: 'Astral CPVC pipes, Jaquar sanitary fittings', quantity: 'Full Layout', approxCost: 195000 },
          { category: 'Electricals', details: 'Havells wires, Legrand modular switches', quantity: '80 Points', approxCost: 155000 },
          { category: 'Paint & Finishes', details: 'Interior: Asian Emulsion. Exterior: Apex weather-proof', quantity: '3,400 sqft', approxCost: 110000 }
        ]
      },
      {
        name: 'Luxury',
        materials: [
          { category: 'Foundation & RCC', details: 'Corrosion resistant cement, Tata Tiscon Fe 550D', quantity: '10.5 Tons', approxCost: 680000 },
          { category: 'Walls & Bricks', details: 'Premium AAC blocks for superior insulation', quantity: '16,000 Blocks', approxCost: 280000 },
          { category: 'Flooring', details: 'Italian marble in living, wooden floor in master bed', quantity: '1,650 sqft', approxCost: 380000 },
          { category: 'Woodwork & Doors', details: 'Full teakwood doors, soundproof UPVC windows', quantity: '10 Doors', approxCost: 260000 },
          { category: 'Plumbing & Fittings', details: 'Astral Silencio pipes, Kohler sanitary luxury tier', quantity: 'Full Layout', approxCost: 320000 },
          { category: 'Electricals', details: 'FRLS Finolex wiring, Legrand smart touch panels', quantity: '110 Points', approxCost: 290000 },
          { category: 'Paint & Finishes', details: 'Interior: Royal Shine finish. Exterior: Apex Ultima', quantity: '3,800 sqft', approxCost: 190000 }
        ]
      }
    ]
  },
  {
    name: 'Shop',
    packages: [
      {
        name: 'Standard',
        materials: [
          { category: 'Foundation & RCC', details: 'Standard cement & local structural steel reinforcement', quantity: '5.2 Tons', approxCost: 220000 },
          { category: 'Frontage', details: 'Galvanized iron rolling shutter (Manual)', quantity: '1 Shutter', approxCost: 32000 },
          { category: 'Flooring', details: 'Polished Kota stone or vitrified ceramic tiles', quantity: '800 sqft', approxCost: 45000 },
          { category: 'Electricals', details: 'Concealed wiring, non-modular panels', quantity: '30 Points', approxCost: 38000 }
        ]
      },
      {
        name: 'Premium',
        materials: [
          { category: 'Foundation & RCC', details: 'Ambuja cement, JSW structural steel', quantity: '5.8 Tons', approxCost: 290000 },
          { category: 'Frontage', details: 'Motorized rolling shutter, clear glass storefront window', quantity: '1 Set', approxCost: 75000 },
          { category: 'Flooring', details: 'Double charge vitrified tiles, anti-skid in toilet', quantity: '850 sqft', approxCost: 78000 },
          { category: 'Electricals', details: 'Havells wires, modular switches, high-load breakers', quantity: '45 Points', approxCost: 65000 }
        ]
      },
      {
        name: 'Luxury',
        materials: [
          { category: 'Foundation & RCC', details: 'Tata structural steel, premium concrete slabs', quantity: '6.5 Tons', approxCost: 380000 },
          { category: 'Frontage', details: 'Automatic sliding glass doors, frameless facade', quantity: 'Facade set', approxCost: 180000 },
          { category: 'Flooring', details: 'Granite slab flooring or customized epoxy finish', quantity: '900 sqft', approxCost: 140000 },
          { category: 'Electricals', details: 'FRLS wires, smart control panels, LED track preparation', quantity: '60 Points', approxCost: 110000 }
        ]
      }
    ]
  },
  {
    name: 'Commercial Building',
    packages: [
      {
        name: 'Standard',
        materials: [
          { category: 'Foundation & RCC', details: 'Standard cement mixes, commercial structure framing steel', quantity: '15 Tons', approxCost: 720000 },
          { category: 'Flooring', details: 'Ceramic tiles in office, Kota stone in common lobbies', quantity: '3,000 sqft', approxCost: 240000 },
          { category: 'Electricals', details: 'Basic commercial cabling & heavy duty main breakers', quantity: '120 Points', approxCost: 190000 }
        ]
      },
      {
        name: 'Premium',
        materials: [
          { category: 'Foundation & RCC', details: 'OPC 53 Grade cement, JSW/TATA high tensile steel', quantity: '18 Tons', approxCost: 980000 },
          { category: 'Flooring', details: 'Vitrified tiles in offices, polished granite in stairs/lobbies', quantity: '3,200 sqft', approxCost: 390000 },
          { category: 'Electricals', details: 'Havells FRLS cabling, modular fittings, split AC wiring prep', quantity: '180 Points', approxCost: 320000 }
        ]
      },
      {
        name: 'Luxury',
        materials: [
          { category: 'Foundation & RCC', details: 'Tata Tiscon steel, high strength concrete casting', quantity: '22 Tons', approxCost: 1350000 },
          { category: 'Flooring', details: 'Granite slabs in lobby, vitrified tiles, laminate executive floors', quantity: '3,500 sqft', approxCost: 650000 },
          { category: 'Electricals', details: 'Smart automated lighting prep, architectural lighting cabling', quantity: '250 Points', approxCost: 550000 }
        ]
      }
    ]
  }
];

export const Tracker = () => {
  const { apiUrl } = useAuth();
  const [referenceId, setReferenceId] = useState('');
  const [loading, setLoading] = useState(false);
  const [application, setApplication] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [clientMessage, setClientMessage] = useState('');
  const [sendingMsg, setSendingMsg] = useState(false);
  const [structures, setStructures] = useState([]);

  useEffect(() => {
    const fetchStructures = async () => {
      try {
        const res = await fetch(`${apiUrl}/structures`);
        if (res.ok) {
          const data = await res.json();
          setStructures(data);
        }
      } catch (err) {
        console.warn('Backend structures offline.');
      }
    };
    fetchStructures();
  }, [apiUrl]);

  const getMaterialSpecs = () => {
    if (!application) return [];
    const struct = structures.find(s => s.name === application.structureType) || mockStructuresFallback.find(s => s.name === application.structureType);
    const pkg = struct?.packages.find(p => p.name === application.packageType);
    return pkg?.materials || [];
  };

  const handleSendClientMessage = async (e) => {
    e.preventDefault();
    if (!clientMessage.trim() || !application) return;

    setSendingMsg(true);
    const cleanRefId = application.referenceId;
    const msgText = clientMessage.trim();

    try {
      const res = await fetch(`${apiUrl}/applications/engineer/${cleanRefId}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sender: 'Client',
          message: msgText
        })
      });

      const data = await res.json();
      if (res.ok) {
        setClientMessage('');
        setApplication(data);
      } else {
        alert(data.message || 'Failed to send message.');
      }
    } catch (err) {
      // Demo ID fallback
      if (cleanRefId === 'BC-DEMO12') {
        const updatedMessages = [...(application.messages || []), {
          sender: 'Client',
          message: msgText,
          date: new Date().toISOString()
        }];
        setApplication({ ...application, messages: updatedMessages });
        setClientMessage('');
      } else {
        alert('Could not connect to the server.');
      }
    } finally {
      setSendingMsg(false);
    }
  };

  const handleTrackSubmit = async (e) => {
    e.preventDefault();
    if (!referenceId.trim()) return;

    setLoading(true);
    setErrorMsg('');
    setApplication(null);

    const cleanRefId = referenceId.trim().toUpperCase();

    try {
      const res = await fetch(`${apiUrl}/applications/track/${cleanRefId}`);
      const data = await res.json();

      if (res.ok) {
        setApplication(data);
      } else {
        // Fallback: Check localStorage or check for demo ID
        handleFallbackSearch(cleanRefId, data.message);
      }
    } catch (err) {
      handleFallbackSearch(cleanRefId, 'Unable to connect to the backend server.');
    } finally {
      setLoading(false);
    }
  };

  const handleFallbackSearch = (refId, originalError) => {
    // Check if the user has a local storage application matching this ID
    const localApps = JSON.parse(localStorage.getItem('my_local_applications') || '{}');
    if (localApps[refId]) {
      setApplication(localApps[refId]);
      return;
    }

    // Check for a default demo ID
    if (refId === 'BC-DEMO12') {
      setApplication({
        referenceId: 'BC-DEMO12',
        clientName: 'Rahul Sharma',
        structureType: 'Home',
        packageType: 'Premium',
        areaSqFt: 1500,
        approximateCost: 2925000,
        budgetMin: 2778750,
        budgetMax: 3217500,
        status: 'Under Review',
        adminNotes: 'Site engineer visited on June 22nd. Soil stability test is in progress. The design layout is approved. Approximate cost finalized.',
        assignedEngineer: {
          name: 'Eng. Vikram Kumar',
          phone: '+91 99001 12233',
          email: 'vikram.kumar@apexconstruct.com',
          specialization: 'Senior Site Structural Engineer'
        },
        preferences: 'Prefer cream-colored exterior paint, vitrified flooring layout, and modern open-plan modular kitchen structure.',
        progressLogs: [
          {
            date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
            stage: 'Site Excavation',
            description: 'Soil excavation completed. Site leveled. Structural markups placed.',
            imageUrl: 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&w=600&q=80'
          },
          {
            date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
            stage: 'Foundation & Pillars',
            description: 'RCC foundation footings casted. Steel reinforcement binding completed.',
            imageUrl: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=600&q=80'
          }
        ],
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString() // 2 days ago
      });
      return;
    }

    setErrorMsg(originalError || 'Tracking ID not found. Try the demo ID: BC-DEMO12');
  };

  // Helper to determine status step number
  const getStatusStep = (status) => {
    switch (status) {
      case 'Pending': return 1;
      case 'Under Review': return 2;
      case 'Approved':
      case 'Declined':
        return 3;
      default: return 1;
    }
  };

  const step = application ? getStatusStep(application.status) : 1;

  return (
    <div className="tracker-container container fade-in">
      <div className="guide-header text-center">
        <h1 className="gold-gradient-text">Application Status Tracker</h1>
        <p>Monitor your project application review. Enter your tracking reference ID below to see live updates from the builder desk.</p>
      </div>

      <div className="tracker-box-layout">
        {/* Search Panel */}
        <div className="search-panel glass-panel">
          <h3>Track Your Project</h3>
          <form onSubmit={handleTrackSubmit} className="track-form">
            <div className="form-group">
              <label className="form-label">Reference Tracking ID</label>
              <input
                type="text"
                required
                value={referenceId}
                onChange={(e) => setReferenceId(e.target.value)}
                className="form-input"
                placeholder="e.g. BC-F3A8D2"
              />
            </div>
            <button type="submit" disabled={loading} className="gold-button w-100 justify-content-center">
              {loading ? 'Searching ID...' : 'Track Request'}
            </button>
          </form>
          <div className="demo-hint-box">
            <p>💡 Don't have a tracking ID? Type in the demo ID: <strong className="gold-text">BC-DEMO12</strong> to test the tracker dashboard.</p>
          </div>
          {errorMsg && <div className="error-message-box">{errorMsg}</div>}
        </div>

        {/* Results Panel */}
        {application ? (
          <div className="results-panel glass-panel fade-in">
            <div className="results-header">
              <div>
                <h2>Status for ID: <span className="gold-text">{application.referenceId}</span></h2>
                <p className="client-meta">Client: {application.clientName} | Submitted on: {new Date(application.createdAt).toLocaleDateString()}</p>
              </div>
              <span className={`badge badge-${application.status.toLowerCase().replace(' ', '')}`}>
                {application.status}
              </span>
            </div>

            {/* Timeline Visualizer */}
            <div className="timeline-container">
              <div className="timeline-line">
                <div className="timeline-progress" style={{ width: `${((step - 1) / 2) * 100}%` }}></div>
              </div>
              
              <div className="timeline-nodes">
                <div className={`timeline-node ${step >= 1 ? 'completed' : ''}`}>
                  <div className="node-circle">1</div>
                  <span className="node-label">Submitted</span>
                </div>
                
                <div className={`timeline-node ${step >= 2 ? 'completed' : ''} ${step === 2 ? 'active' : ''}`}>
                  <div className="node-circle">2</div>
                  <span className="node-label">Under Review</span>
                </div>
                
                <div className={`timeline-node ${step >= 3 ? 'completed' : ''} ${application.status === 'Declined' ? 'declined' : ''}`}>
                  <div className="node-circle">3</div>
                  <span className="node-label">{application.status === 'Declined' ? 'Declined' : 'Approved'}</span>
                </div>
              </div>
            </div>

            {/* Admin/Constructor Feedback */}
            {application.adminNotes && (
              <div className="admin-notes-box">
                <h4>Constructor Desk Updates</h4>
                <p>{application.adminNotes}</p>
              </div>
            )}

            {/* Assigned Engineer Card (Phase 3) */}
            {application.assignedEngineer && application.assignedEngineer.name && (
              <div className="engineer-assignment-card glass-panel inner-panel mt-1">
                <div className="engineer-header">
                  <span className="engineer-avatar">👷‍♂️</span>
                  <div>
                    <h4>Assigned Site Engineer</h4>
                    <p className="engineer-spec">{application.assignedEngineer.specialization || 'Lead Project Engineer'}</p>
                  </div>
                </div>
                <div className="engineer-body">
                  <div className="eng-detail-row">
                    <span className="label">Contact Name:</span>
                    <strong>{application.assignedEngineer.name}</strong>
                  </div>
                  <div className="eng-detail-row">
                    <span className="label">Mobile Number:</span>
                    <strong><a href={`tel:${application.assignedEngineer.phone}`} className="gold-text underline-hover">{application.assignedEngineer.phone}</a></strong>
                  </div>
                  <div className="eng-detail-row">
                    <span className="label">Email Address:</span>
                    <strong><a href={`mailto:${application.assignedEngineer.email}`} className="underline-hover">{application.assignedEngineer.email}</a></strong>
                  </div>
                </div>
              </div>
            )}
            {application.progressLogs && application.progressLogs.length > 0 && (
              <div className="site-progress-proof-gallery">
                <h3>Construction Site Proof of Work</h3>
                <p className="section-subtitle-tracker">Live updates and actual site photos uploaded by our project engineers.</p>
                
                <div className="progress-timeline-vertical">
                  {application.progressLogs.map((log, index) => (
                    <div key={index} className="progress-timeline-item">
                      <div className="timeline-badge-gold">✓</div>
                      <div className="progress-timeline-content glass-panel inner-panel">
                        <div className="progress-item-header">
                          <h4>{log.stage}</h4>
                          <span className="log-date-tracker">{new Date(log.date).toLocaleDateString()}</span>
                        </div>
                        <p className="progress-item-desc">{log.description}</p>
                        {log.imageUrl && (
                          <div className="progress-item-img-container">
                            <img src={log.imageUrl} alt={log.stage} className="progress-item-img" />
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Communication Hub / Site Chat (Phase 4) */}
            <div className="site-communication-hub glass-panel inner-panel mt-1">
              <h3>💬 Client-Constructor Chat Desk</h3>
              <p className="section-subtitle-tracker">Real-time messaging with your assigned Site Engineer and the Admin office.</p>
              
              <div className="chat-messages-container">
                {(!application.messages || application.messages.length === 0) ? (
                  <div className="no-chat-messages">
                    <p>No messages yet. Send a query to your Site Engineer below.</p>
                  </div>
                ) : (
                  application.messages.map((msg, index) => {
                    const isClient = msg.sender === 'Client';
                    return (
                      <div 
                        key={index} 
                        className={`chat-bubble-row ${isClient ? 'chat-right' : 'chat-left'}`}
                      >
                        <div className={`chat-bubble ${isClient ? 'bubble-client' : msg.sender === 'Admin' ? 'bubble-admin' : 'bubble-engineer'}`}>
                          <div className="bubble-meta">
                            <span className="bubble-sender" style={{ fontWeight: 600, fontSize: '0.75rem' }}>
                              {isClient ? 'You (Client)' : msg.sender === 'Admin' ? '🛡️ Admin Office' : '👷‍♂️ Site Engineer'}
                            </span>
                            <span className="bubble-time" style={{ fontSize: '0.65rem', color: 'var(--text-muted)', marginLeft: '1rem' }}>
                              {new Date(msg.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                          <p className="bubble-text" style={{ fontSize: '0.9rem', margin: '0.25rem 0 0 0', whiteSpace: 'pre-wrap' }}>{msg.message}</p>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              <form onSubmit={handleSendClientMessage} className="chat-input-form">
                <input
                  type="text"
                  required
                  value={clientMessage}
                  onChange={(e) => setClientMessage(e.target.value)}
                  placeholder="Ask a question or request updates on your project..."
                  className="form-input chat-input-text"
                />
                <button type="submit" disabled={sendingMsg} className="gold-button chat-send-btn">
                  {sendingMsg ? '...' : 'Send'}
                </button>
              </form>
            </div>

            {/* Estimate summary */}
            <div className="project-details">
              <h3>Requested Construction Specifications</h3>
              <div className="details-table">
                <div className="details-row"><span>Building Category:</span><strong>{application.structureType}</strong></div>
                <div className="details-row"><span>Material Package:</span><strong>{application.packageType} Tier</strong></div>
                <div className="details-row"><span>Total Area Size:</span><strong>{application.areaSqFt} sq.ft</strong></div>
                <div className="details-row"><span>Approximate Estimate:</span><strong className="gold-text">₹{application.approximateCost?.toLocaleString('en-IN')}</strong></div>
                <div className="details-row"><span>Budget Range:</span><strong>₹{application.budgetMin?.toLocaleString('en-IN')} - ₹{application.budgetMax?.toLocaleString('en-IN')}</strong></div>
              </div>
            </div>

            {/* Online Material Cost Specifications (Phase 4 Update) */}
            {getMaterialSpecs().length > 0 && (
              <div className="project-details mt-1">
                <h3>📋 Construction Materials Checklist & Costs</h3>
                <p className="section-subtitle-tracker" style={{ marginBottom: '1rem' }}>
                  Detailed specifications, qualities, and estimated rates based on your selected package.
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', maxHeight: '350px', overflowY: 'auto' }}>
                  {getMaterialSpecs().map((m, idx) => (
                    <div key={idx} style={{ padding: '0.75rem', background: 'rgba(255,255,255,0.01)', border: '1px solid rgba(255,255,255,0.03)', borderRadius: '6px', fontSize: '0.875rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 600, color: 'var(--accent-gold-hover)' }}>
                        <span>{m.category}</span>
                        {m.quantity && <span style={{ color: 'var(--text-secondary)', fontWeight: 'normal', fontSize: '0.8rem' }}>Qty: {m.quantity}</span>}
                      </div>
                      <div style={{ color: 'var(--text-muted)', marginTop: '0.2rem', fontSize: '0.8rem' }}>{m.details}</div>
                      {m.approxCost !== undefined && m.approxCost > 0 && (
                        <div style={{ textAlign: 'right', marginTop: '0.25rem', fontWeight: 600, color: 'var(--accent-gold)', fontSize: '0.8rem' }}>
                          Estimated Material Rate: ₹{m.approxCost.toLocaleString('en-IN')}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Client Preferences Box (Phase 3) */}
            {application.preferences && (
              <div className="project-details user-pref-details-box mt-1">
                <h3>Your Custom Design Preferences</h3>
                <p className="pref-content-text">"{application.preferences}"</p>
              </div>
            )}
          </div>
        ) : (
          <div className="no-results-panel glass-panel text-center">
            <span className="info-icon">🔍</span>
            <h3>No Application Loaded</h3>
            <p className="text-secondary">Input your tracking ID on the left panel to fetch construction details, status, and inspector updates.</p>
          </div>
        )}
      </div>

      <style>{`
        .tracker-container { padding-top: 2.5rem; display: flex; flex-direction: column; gap: 2rem; }
        .tracker-box-layout { display: grid; grid-template-columns: 1fr; gap: 2rem; }
        @media (min-width: 992px) { .tracker-box-layout { grid-template-columns: 0.8fr 1.2fr; } }
        
        .search-panel { display: flex; flex-direction: column; gap: 1.25rem; height: fit-content; }
        .search-panel h3 { font-size: 1.25rem; border-bottom: 1px solid rgba(255,255,255,0.05); padding-bottom: 0.5rem; }
        .demo-hint-box { background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.04); padding: 0.75rem 1rem; border-radius: 6px; font-size: 0.8rem; line-height: 1.4; }
        .error-message-box { background-color: rgba(245, 101, 101, 0.1); border: 1px solid rgba(245, 101, 101, 0.3); color: var(--status-declined); padding: 0.75rem 1rem; border-radius: 6px; font-size: 0.85rem; text-align: center; }
        
        .results-panel { display: flex; flex-direction: column; gap: 2rem; }
        .results-header { display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 1px solid rgba(255,255,255,0.05); padding-bottom: 1rem; }
        .results-header h2 { font-size: 1.5rem; }
        .client-meta { font-size: 0.85rem; color: var(--text-muted); margin-top: 0.25rem; }
        
        /* Timeline style */
        .timeline-container { position: relative; padding: 2rem 1rem 1rem 1rem; margin-bottom: 1rem; }
        .timeline-line { position: absolute; top: 48px; left: 10%; right: 10%; height: 4px; background: rgba(255,255,255,0.05); z-index: 1; border-radius: 2px; }
        .timeline-progress { height: 100%; background: var(--accent-gold); transition: width 0.5s ease-in-out; border-radius: 2px; }
        .timeline-nodes { position: relative; display: flex; justify-content: space-between; z-index: 2; }
        .timeline-node { display: flex; flex-direction: column; align-items: center; gap: 0.75rem; width: 80px; }
        .node-circle {
          width: 32px;
          height: 32px;
          background: var(--bg-secondary);
          border: 2px solid rgba(255,255,255,0.1);
          color: var(--text-muted);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          font-size: 0.9rem;
          transition: var(--transition);
        }
        .node-label { font-size: 0.8rem; font-weight: 500; color: var(--text-secondary); text-align: center; white-space: nowrap; }
        
        .timeline-node.completed .node-circle { border-color: var(--accent-gold); background: var(--accent-gold); color: #000; box-shadow: 0 0 10px rgba(212, 175, 55, 0.4); }
        .timeline-node.completed .node-label { color: var(--accent-gold-hover); font-weight: 600; }
        .timeline-node.active .node-circle { border-color: var(--accent-gold); color: var(--accent-gold); box-shadow: 0 0 8px rgba(212, 175, 55, 0.2); }
        .timeline-node.completed.declined .node-circle { border-color: var(--status-declined); background: var(--status-declined); color: #fff; box-shadow: 0 0 10px rgba(245, 101, 101, 0.4); }
        .timeline-node.completed.declined .node-label { color: var(--status-declined); }
        
        .admin-notes-box { background: rgba(212,175,55,0.06); border-left: 3px solid var(--accent-gold); padding: 1.25rem; border-radius: 0 6px 6px 0; }
        .admin-notes-box h4 { font-size: 1rem; color: var(--accent-gold-hover); margin-bottom: 0.5rem; text-transform: uppercase; letter-spacing: 0.05em; }
        .admin-notes-box p { font-size: 0.925rem; line-height: 1.5; color: var(--text-primary); }
        
        .project-details { background: rgba(0,0,0,0.2); padding: 1.25rem; border-radius: 8px; border: 1px solid rgba(255,255,255,0.02); }
        .project-details h3 { font-size: 1.15rem; border-bottom: 1px solid rgba(255,255,255,0.05); padding-bottom: 0.5rem; margin-bottom: 0.75rem; }
        .details-table { display: flex; flex-direction: column; gap: 0.6rem; }
        .details-row { display: flex; justify-content: space-between; font-size: 0.9rem; border-bottom: 1px dashed rgba(255,255,255,0.03); padding-bottom: 0.4rem; }
        .details-row span { color: var(--text-secondary); }
        
        .no-results-panel { display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 1rem; min-height: 350px; }
        .info-icon { font-size: 3.5rem; opacity: 0.3; }
        .no-results-panel h3 { font-size: 1.35rem; }
        .no-results-panel p { max-width: 350px; }

        /* Vertical progress timeline gallery styles (Phase 2) */
        .site-progress-proof-gallery { margin-top: 1.5rem; }
        .site-progress-proof-gallery h3 { font-size: 1.25rem; border-bottom: 1px solid rgba(255,255,255,0.05); padding-bottom: 0.5rem; margin-bottom: 0.25rem; }
        .section-subtitle-tracker { font-size: 0.85rem; color: var(--text-secondary); margin-bottom: 1.5rem; }
        .progress-timeline-vertical { display: flex; flex-direction: column; gap: 1.5rem; position: relative; padding-left: 1.5rem; border-left: 2px solid rgba(212,175,55,0.15); margin-left: 0.75rem; }
        .progress-timeline-item { position: relative; }
        .timeline-badge-gold {
          position: absolute;
          left: -32px;
          top: 0;
          background: var(--accent-gold);
          color: #000;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: bold;
          font-size: 0.65rem;
          border: 2px solid var(--bg-primary);
        }
        .progress-timeline-content { padding: 1.25rem; display: flex; flex-direction: column; gap: 0.75rem; background: rgba(0, 0, 0, 0.2); }
        .progress-item-header { display: flex; justify-content: space-between; align-items: baseline; border-bottom: 1px dashed rgba(255,255,255,0.05); padding-bottom: 0.4rem; }
        .progress-item-header h4 { font-size: 1.05rem; color: var(--accent-gold-hover); }
        .log-date-tracker { font-size: 0.75rem; color: var(--text-muted); }
        .progress-item-desc { font-size: 0.9rem; color: var(--text-primary); line-height: 1.5; }
        .progress-item-img-container { width: 100%; max-height: 350px; overflow: hidden; border-radius: 6px; border: 1px solid var(--border-color); margin-top: 0.5rem; }
        .progress-item-img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.5s ease; }
        .progress-item-img:hover { transform: scale(1.03); }
        .inner-panel { background: rgba(255,255,255,0.01); border-color: rgba(255,255,255,0.03); }

        /* Assigned Engineer Card styles (Phase 3) */
        .engineer-assignment-card {
          border-color: var(--border-color);
          background: rgba(212, 175, 55, 0.04);
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }
        .engineer-header {
          display: flex;
          align-items: center;
          gap: 1rem;
          border-bottom: 1px dashed var(--border-color);
          padding-bottom: 0.75rem;
        }
        .engineer-avatar {
          font-size: 2.25rem;
          background: rgba(212, 175, 55, 0.1);
          width: 50px;
          height: 50px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          border: 1px solid var(--border-color);
        }
        .engineer-header h4 {
          font-size: 1.1rem;
          color: var(--text-primary);
        }
        .engineer-spec {
          font-size: 0.8rem;
          color: var(--accent-gold-hover);
          font-weight: 500;
        }
        .engineer-body {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }
        .eng-detail-row {
          display: flex;
          justify-content: space-between;
          font-size: 0.875rem;
          border-bottom: 1px solid rgba(255,255,255,0.02);
          padding-bottom: 0.35rem;
        }
        .eng-detail-row .label {
          color: var(--text-secondary);
        }
        .underline-hover:hover {
          text-decoration: underline;
        }
        .user-pref-details-box {
          border-left: 3px solid #3182ce;
          background: rgba(66, 153, 225, 0.05) !important;
        }
        .pref-content-text {
          font-size: 0.95rem;
          font-style: italic;
          color: var(--text-primary);
          line-height: 1.6;
          margin-top: 0.5rem;
        }

        /* Chat styles */
        .site-communication-hub {
          margin-top: 1.5rem;
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }
        .chat-messages-container {
          max-height: 300px;
          overflow-y: auto;
          background: rgba(0, 0, 0, 0.15);
          padding: 1rem;
          border-radius: 6px;
          display: flex;
          flex-direction: column;
          gap: 1rem;
          border: 1px solid rgba(255,255,255,0.02);
        }
        .no-chat-messages {
          margin: auto;
          color: var(--text-muted);
          font-size: 0.9rem;
          text-align: center;
        }
        .chat-bubble-row {
          display: flex;
          width: 100%;
        }
        .chat-left {
          justify-content: flex-start;
        }
        .chat-right {
          justify-content: flex-end;
        }
        .chat-bubble {
          max-width: 80%;
          padding: 0.6rem 0.85rem;
          border-radius: 8px;
          display: flex;
          flex-direction: column;
          gap: 0.2rem;
        }
        .bubble-client {
          background: rgba(212, 175, 55, 0.15);
          border: 1px solid rgba(212, 175, 55, 0.3);
          color: #f3e5ab;
        }
        .bubble-engineer {
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          color: #f7fafc;
        }
        .bubble-admin {
          background: rgba(66, 153, 225, 0.1);
          border: 1px solid rgba(66, 153, 225, 0.2);
          color: #90cdf4;
        }
        .chat-input-form {
          display: flex;
          gap: 0.5rem;
        }
        .chat-input-text {
          flex: 1;
          background: #171c24;
          border: 1px solid var(--border-color);
          border-radius: 6px;
          padding: 0.6rem 0.75rem;
          color: #fff;
          font-size: 0.9rem;
        }
        .chat-send-btn {
          padding: 0.6rem 1.2rem;
        }
      `}</style>
    </div>
  );
};

export default Tracker;
