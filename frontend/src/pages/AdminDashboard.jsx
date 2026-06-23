import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

export const AdminDashboard = () => {
  const { adminToken, isAuthenticated, apiUrl, logoutAdmin } = useAuth();
  
  // Dashboard navigation state
  const [activeTab, setActiveTab] = useState('applications'); // 'applications', 'pricing'

  // Application Data State
  const [applications, setApplications] = useState([]);
  const [loadingApps, setLoadingApps] = useState(true);
  const [selectedApp, setSelectedApp] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  // Pricing Data State
  const [structures, setStructures] = useState([]);
  const [loadingStructures, setLoadingStructures] = useState(true);
  const [editingStructure, setEditingStructure] = useState(null);

  // Edit Application Form State
  const [editStatus, setEditStatus] = useState('Pending');
  const [editNotes, setEditNotes] = useState('');
  const [editCost, setEditCost] = useState(0);
  const [editMinBudget, setEditMinBudget] = useState(0);
  const [editMaxBudget, setEditMaxBudget] = useState(0);

  // Edit Structure Form State
  const [editBasePrice, setEditBasePrice] = useState(0);
  const [editPackages, setEditPackages] = useState([]);

  // Progress Update Form State
  const [newProgressStage, setNewProgressStage] = useState('');
  const [newProgressDesc, setNewProgressDesc] = useState('');
  const [newProgressImg, setNewProgressImg] = useState('');
  const [addingProgress, setAddingProgress] = useState(false);

  // Assign Engineer Form State
  const [engName, setEngName] = useState('');
  const [engPhone, setEngPhone] = useState('');
  const [engEmail, setEngEmail] = useState('');
  const [engSpec, setEngSpec] = useState('');
  const [engUsername, setEngUsername] = useState('');
  const [engPassword, setEngPassword] = useState('');

  // Admin Chat Messaging State
  const [adminMessage, setAdminMessage] = useState('');
  const [sendingAdminMsg, setSendingAdminMsg] = useState(false);

  // Check authentication
  useEffect(() => {
    if (!isAuthenticated) {
      window.location.hash = '#login';
    }
  }, [isAuthenticated]);

  // Fetch Applications
  const fetchApplications = async () => {
    setLoadingApps(true);
    try {
      const url = new URL(`${apiUrl}/applications`);
      if (statusFilter) url.searchParams.append('status', statusFilter);
      if (searchQuery) url.searchParams.append('search', searchQuery);

      const res = await fetch(url.toString(), {
        headers: { Authorization: `Bearer ${adminToken}` }
      });

      if (res.ok) {
        const data = await res.json();
        setApplications(data);
      } else {
        throw new Error();
      }
    } catch (err) {
      console.warn('Backend unavailable, loading local applications.');
      loadLocalApplications();
    } finally {
      setLoadingApps(false);
    }
  };

  // Fetch Structure Configurations
  const fetchStructures = async () => {
    setLoadingStructures(true);
    try {
      const res = await fetch(`${apiUrl}/structures`);
      if (res.ok) {
        const data = await res.json();
        setStructures(data);
      } else {
        throw new Error();
      }
    } catch (err) {
      console.warn('Backend unavailable, loading local configurations.');
      loadLocalStructures();
    } finally {
      setLoadingStructures(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchApplications();
      fetchStructures();
    }
  }, [isAuthenticated, statusFilter, searchQuery]);

  // FALLBACK LOCAL STORAGE UTILITIES
  const loadLocalApplications = () => {
    // Check if there are local applications
    let localApps = JSON.parse(localStorage.getItem('my_local_applications') || '{}');
    let appList = Object.values(localApps);
    
    // Add default demo if empty
    if (appList.length === 0) {
      const defaultDemo = {
        _id: 'demo-12',
        referenceId: 'BC-DEMO12',
        clientName: 'Rahul Sharma',
        clientEmail: 'rahul@gmail.com',
        clientPhone: '9876543210',
        location: '5th Cross, Indiranagar, Bangalore',
        structureType: 'Home',
        packageType: 'Premium',
        areaSqFt: 1500,
        approximateCost: 2925000,
        budgetMin: 2778750,
        budgetMax: 3217500,
        status: 'Under Review',
        adminNotes: 'Site engineer visited on June 22nd. Soil stability test is in progress. The design layout is approved. Approximate cost finalized.',
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
      };
      localApps[defaultDemo.referenceId] = defaultDemo;
      localStorage.setItem('my_local_applications', JSON.stringify(localApps));
      appList = [defaultDemo];
    }

    // Filter list locally
    if (statusFilter) {
      appList = appList.filter(app => app.status === statusFilter);
    }
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      appList = appList.filter(app => 
        app.clientName.toLowerCase().includes(query) ||
        app.clientEmail.toLowerCase().includes(query) ||
        app.referenceId.toLowerCase().includes(query) ||
        app.location.toLowerCase().includes(query)
      );
    }
    // Sort descending
    appList.sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt));
    setApplications(appList);
  };

  const loadLocalStructures = () => {
    let localStructures = JSON.parse(localStorage.getItem('my_local_structures') || '[]');
    if (localStructures.length === 0) {
      // Mock guides
      localStructures = [
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
                { category: 'Flooring', details: 'Ceramic tiles (2x2 ft) in living/bedroom' }
              ]
            },
            {
              name: 'Premium',
              priceMultiplier: 1.3,
              materials: [
                { category: 'Foundation & RCC', details: 'PPC/OPC 53 Grade Cement, Fe 550 TMT Steel (Tata Tiscon)' },
                { category: 'Walls & Bricks', details: '8-inch solid concrete blocks' },
                { category: 'Flooring', details: 'Double charged vitrified tiles (Kajaria)' }
              ]
            },
            {
              name: 'Luxury',
              priceMultiplier: 1.7,
              materials: [
                { category: 'Foundation & RCC', details: 'Corrosion resistant cement, Fe 550D TMT Steel' },
                { category: 'Walls & Bricks', details: 'Fly-ash lightweight blocks / premium AAC blocks' },
                { category: 'Flooring', details: 'Italian marble in living area' }
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
            { name: 'Standard', priceMultiplier: 1.0, materials: [{ category: 'Frontage', details: 'Manual rolling shutter' }] },
            { name: 'Premium', priceMultiplier: 1.3, materials: [{ category: 'Frontage', details: 'Motorized rolling shutter & glass' }] },
            { name: 'Luxury', priceMultiplier: 1.7, materials: [{ category: 'Frontage', details: 'Automatic sliding glass doors & facade' }] }
          ]
        }
      ];
      localStorage.setItem('my_local_structures', JSON.stringify(localStructures));
    }
    setStructures(localStructures);
  };

  // OPEN EDIT APPLICATION DETAILS MODAL
  const openAppDetails = (app) => {
    setSelectedApp(app);
    setEditStatus(app.status);
    setEditNotes(app.adminNotes || '');
    setEditCost(app.approximateCost);
    setEditMinBudget(app.budgetMin);
    setEditMaxBudget(app.budgetMax);
    setEngName(app.assignedEngineer?.name || '');
    setEngPhone(app.assignedEngineer?.phone || '');
    setEngEmail(app.assignedEngineer?.email || '');
    setEngSpec(app.assignedEngineer?.specialization || '');
    setEngUsername(app.assignedEngineer?.username || '');
    setEngPassword(app.assignedEngineer?.password || '');
  };

  // SAVE APPLICATION UPDATES (Status, Cost, Notes)
  const handleAppUpdate = async (e) => {
    e.preventDefault();
    if (!selectedApp) return;

    const payload = {
      status: editStatus,
      adminNotes: editNotes,
      approximateCost: editCost,
      budgetMin: editMinBudget,
      budgetMax: editMaxBudget,
      assignedEngineer: {
        name: engName,
        phone: engPhone,
        email: engEmail,
        specialization: engSpec,
        username: engUsername,
        password: engPassword
      }
    };

    try {
      const res = await fetch(`${apiUrl}/applications/${selectedApp._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${adminToken}`
        },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        setSelectedApp(null);
        fetchApplications();
      } else {
        throw new Error();
      }
    } catch (err) {
      console.warn('Backend unavailable, updating local storage.');
      // Local storage update
      const localApps = JSON.parse(localStorage.getItem('my_local_applications') || '{}');
      if (localApps[selectedApp.referenceId]) {
        localApps[selectedApp.referenceId] = {
          ...localApps[selectedApp.referenceId],
          status: editStatus,
          adminNotes: editNotes,
          approximateCost: editCost,
          budgetMin: editMinBudget,
          budgetMax: editMaxBudget,
          assignedEngineer: {
            name: engName,
            phone: engPhone,
            email: engEmail,
            specialization: engSpec,
            username: engUsername,
            password: engPassword,
            accepted: localApps[selectedApp.referenceId]?.assignedEngineer?.accepted || false
          }
        };
        localStorage.setItem('my_local_applications', JSON.stringify(localApps));
        setSelectedApp(null);
        loadLocalApplications();
      }
    }
  };

  // POST PROGRESS UPDATE (Phase 2 site images and proof)
  const handlePostProgress = async (e) => {
    e.preventDefault();
    if (!newProgressStage || !newProgressDesc) {
      alert('Stage and description are required.');
      return;
    }

    setAddingProgress(true);

    const payload = {
      stage: newProgressStage,
      description: newProgressDesc,
      imageUrl: newProgressImg
    };

    try {
      const res = await fetch(`${apiUrl}/applications/${selectedApp._id}/progress`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${adminToken}`
        },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        const updatedApp = await res.json();
        setSelectedApp(updatedApp);
        setNewProgressStage('');
        setNewProgressDesc('');
        setNewProgressImg('');
        fetchApplications();
      } else {
        throw new Error();
      }
    } catch (err) {
      console.warn('Backend offline, adding progress locally.');
      const localApps = JSON.parse(localStorage.getItem('my_local_applications') || '{}');
      if (localApps[selectedApp.referenceId]) {
        const newLog = {
          date: new Date().toISOString(),
          stage: newProgressStage,
          description: newProgressDesc,
          imageUrl: newProgressImg
        };
        
        if (!localApps[selectedApp.referenceId].progressLogs) {
          localApps[selectedApp.referenceId].progressLogs = [];
        }
        localApps[selectedApp.referenceId].progressLogs.push(newLog);
        localStorage.setItem('my_local_applications', JSON.stringify(localApps));
        
        setSelectedApp(localApps[selectedApp.referenceId]);
        setNewProgressStage('');
        setNewProgressDesc('');
        setNewProgressImg('');
        loadLocalApplications();
      }
    } finally {
      setAddingProgress(false);
    }
  };

  // POST ADMIN MESSAGE TO CLIENT
  const handleSendAdminMessage = async (e) => {
    e.preventDefault();
    if (!adminMessage.trim() || !selectedApp) return;

    setSendingAdminMsg(true);

    try {
      const res = await fetch(`${apiUrl}/applications/${selectedApp._id}/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${adminToken}`
        },
        body: JSON.stringify({ message: adminMessage.trim() })
      });

      if (res.ok) {
        const updatedApp = await res.json();
        setSelectedApp(updatedApp);
        setAdminMessage('');
        fetchApplications();
      } else {
        throw new Error();
      }
    } catch (err) {
      console.warn('Backend offline, saving admin message locally.');
      const localApps = JSON.parse(localStorage.getItem('my_local_applications') || '{}');
      if (localApps[selectedApp.referenceId]) {
        const newMsg = {
          sender: 'Admin',
          message: adminMessage.trim(),
          date: new Date().toISOString()
        };
        if (!localApps[selectedApp.referenceId].messages) {
          localApps[selectedApp.referenceId].messages = [];
        }
        localApps[selectedApp.referenceId].messages.push(newMsg);
        localStorage.setItem('my_local_applications', JSON.stringify(localApps));
        
        setSelectedApp(localApps[selectedApp.referenceId]);
        setAdminMessage('');
        loadLocalApplications();
      }
    } finally {
      setSendingAdminMsg(false);
    }
  };

  // DELETE APPLICATION REQUEST
  const handleAppDelete = async (appId, refId) => {
    if (!window.confirm(`Are you sure you want to delete application request ${refId}?`)) return;

    try {
      const res = await fetch(`${apiUrl}/applications/${appId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${adminToken}` }
      });

      if (res.ok) {
        setSelectedApp(null);
        fetchApplications();
      } else {
        throw new Error();
      }
    } catch (err) {
      // Local storage delete
      const localApps = JSON.parse(localStorage.getItem('my_local_applications') || '{}');
      if (localApps[refId]) {
        delete localApps[refId];
        localStorage.setItem('my_local_applications', JSON.stringify(localApps));
        setSelectedApp(null);
        loadLocalApplications();
      }
    }
  };

  // OPEN EDIT PRICING MODAL
  const openStructureEdit = (struct) => {
    setEditingStructure(struct);
    setEditBasePrice(struct.basePricePerSqFt);
    setEditPackages(JSON.parse(JSON.stringify(struct.packages))); // Deep copy
  };

  // SAVE STRUCTURE CONFIG UPDATES
  const handleStructureUpdate = async (e) => {
    e.preventDefault();
    if (!editingStructure) return;

    const payload = {
      basePricePerSqFt: editBasePrice,
      packages: editPackages
    };

    try {
      const res = await fetch(`${apiUrl}/structures/${editingStructure._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${adminToken}`
        },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        setEditingStructure(null);
        fetchStructures();
      } else {
        throw new Error();
      }
    } catch (err) {
      console.warn('Backend offline, updating local structures.');
      let localStructures = JSON.parse(localStorage.getItem('my_local_structures') || '[]');
      const idx = localStructures.findIndex(s => s._id === editingStructure._id);
      if (idx !== -1) {
        localStructures[idx] = {
          ...localStructures[idx],
          basePricePerSqFt: editBasePrice,
          packages: editPackages
        };
        localStorage.setItem('my_local_structures', JSON.stringify(localStructures));
        setEditingStructure(null);
        loadLocalStructures();
        // Also refresh MaterialGuide cache
        localStorage.setItem('my_local_structures', JSON.stringify(localStructures));
      }
    }
  };

  // Handle material detail changes in form (Phase 2 - supports generic fields)
  const handleMaterialChange = (packageIdx, materialIdx, field, value) => {
    const updated = [...editPackages];
    updated[packageIdx].materials[materialIdx][field] = value;
    setEditPackages(updated);
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="dashboard-container container fade-in">
      <div className="dashboard-header glass-panel">
        <div>
          <span className="gold-text uppercase font-bold text-xs">Admin Control Center</span>
          <h1 className="gold-gradient-text">Constructor Control Console</h1>
        </div>
        <button onClick={logoutAdmin} className="logout-btn">Log Out</button>
      </div>

      <div className="dashboard-layout">
        {/* Navigation Sidebar */}
        <aside className="dashboard-sidebar glass-panel">
          <button 
            onClick={() => setActiveTab('applications')} 
            className={`tab-toggle-btn ${activeTab === 'applications' ? 'active' : ''}`}
          >
            📋 Applications ({applications.length})
          </button>
          
          <button 
            onClick={() => setActiveTab('pricing')} 
            className={`tab-toggle-btn ${activeTab === 'pricing' ? 'active' : ''}`}
          >
            ⚙️ Pricing & Material Settings
          </button>
        </aside>

        {/* Content Display Panel */}
        <main className="dashboard-main glass-panel">
          
          {/* ================= TAB 1: APPLICATIONS LIST ================= */}
          {activeTab === 'applications' && (
            <div className="applications-view">
              <div className="view-header">
                <h2>Construction Project Submissions</h2>
                
                {/* Filters */}
                <div className="filters-row">
                  <input
                    type="text"
                    placeholder="Search by ID, client, or location..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="form-input search-box"
                  />
                  
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="form-select status-select"
                  >
                    <option value="">All Statuses</option>
                    <option value="Pending">Pending</option>
                    <option value="Under Review">Under Review</option>
                    <option value="Approved">Approved</option>
                    <option value="Declined">Declined</option>
                  </select>
                </div>
              </div>

              {loadingApps ? (
                <div className="text-center py-4"><div className="spinner"></div></div>
              ) : applications.length === 0 ? (
                <p className="no-data-text">No project applications match your filters.</p>
              ) : (
                <div className="table-responsive">
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>Tracking ID</th>
                        <th>Client Name</th>
                        <th>Project specs</th>
                        <th>Address / Location</th>
                        <th>Status</th>
                        <th>Approx. Quote</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {applications.map((app) => (
                        <tr key={app._id} className="admin-tr-row">
                          <td className="font-bold gold-text">{app.referenceId}</td>
                          <td>
                            <div className="client-info-cell">
                              <strong>{app.clientName}</strong>
                              <span>{app.clientPhone}</span>
                            </div>
                          </td>
                          <td>
                            <div className="specs-cell">
                              <strong>{app.areaSqFt} sq.ft {app.structureType}</strong>
                              <span>Package: {app.packageType}</span>
                            </div>
                          </td>
                          <td className="location-cell">{app.location}</td>
                          <td>
                            <span className={`badge badge-${app.status.toLowerCase().replace(' ', '')}`}>
                              {app.status}
                            </span>
                          </td>
                          <td className="font-bold">₹{app.approximateCost?.toLocaleString('en-IN')}</td>
                          <td>
                            <div className="action-buttons-cell">
                              <button onClick={() => openAppDetails(app)} className="edit-action-btn">Manage</button>
                              <button onClick={() => handleAppDelete(app._id, app.referenceId)} className="delete-action-btn">🗑</button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* ================= TAB 2: PRICING CONFIGS ================= */}
          {activeTab === 'pricing' && (
            <div className="pricing-view">
              <div className="view-header">
                <h2>Material Rates & Cost Multipliers</h2>
                <p className="section-subtitle">Configure base rates per square foot, pricing multipliers, and customize materials checklist definitions.</p>
              </div>

              {loadingStructures ? (
                <div className="text-center py-4"><div className="spinner"></div></div>
              ) : structures.length === 0 ? (
                <p className="no-data-text">No structures configuration found.</p>
              ) : (
                <div className="structures-grid">
                  {structures.map((struct) => (
                    <div key={struct._id} className="structure-pricing-card glass-panel">
                      <div className="card-header">
                        <h3>{struct.name} Construction</h3>
                        <button onClick={() => openStructureEdit(struct)} className="outline-button edit-struct-btn">Modify Settings</button>
                      </div>
                      <p className="struct-description">{struct.description}</p>
                      
                      <div className="pricing-parameters">
                        <div className="param-item">
                          <span>Base Rate per Sq Ft:</span>
                          <strong>₹{struct.basePricePerSqFt}</strong>
                        </div>
                        {struct.packages.map((pkg) => (
                          <div key={pkg.name} className="param-item nested-param">
                            <span>{pkg.name} Multiplier:</span>
                            <span>{pkg.priceMultiplier}x (₹{Math.round(struct.basePricePerSqFt * pkg.priceMultiplier)}/sqft)</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </main>
      </div>

      {/* ================= MODAL: EDIT APPLICATION ================= */}
      {selectedApp && (
        <div className="modal-backdrop">
          <div className="modal-content glass-panel fade-in">
            <div className="modal-header">
              <h2>Review Request: <span className="gold-text">{selectedApp.referenceId}</span></h2>
              <button onClick={() => setSelectedApp(null)} className="close-modal-btn">&times;</button>
            </div>
            
            <form onSubmit={handleAppUpdate} className="modal-form">
              <div className="modal-details-grid">
                <div className="modal-detail-block">
                  <h4>Client Information</h4>
                  <p><strong>Name:</strong> {selectedApp.clientName}</p>
                  <p><strong>Email:</strong> {selectedApp.clientEmail}</p>
                  <p><strong>Phone:</strong> {selectedApp.clientPhone}</p>
                  <p><strong>Site Location:</strong> {selectedApp.location}</p>
                </div>
                
                <div className="modal-detail-block">
                  <h4>Requested Specifications</h4>
                  <p><strong>Building Type:</strong> {selectedApp.structureType}</p>
                  <p><strong>Material Tier:</strong> {selectedApp.packageType}</p>
                  <p><strong>Total Area:</strong> {selectedApp.areaSqFt} sq.ft</p>
                </div>
              </div>

              {selectedApp.preferences && (
                <div className="modal-preferences-display glass-panel inner-panel mt-1">
                  <h4 className="gold-text text-xs uppercase font-bold">Client Design Preferences & Suggestions</h4>
                  <p className="text-sm mt-1 font-italic">"{selectedApp.preferences}"</p>
                </div>
              )}

              <hr className="modal-divider" />

              <div className="form-group">
                <label className="form-label">Review Status</label>
                <select
                  value={editStatus}
                  onChange={(e) => setEditStatus(e.target.value)}
                  className="form-select"
                >
                  <option value="Pending">Pending Review</option>
                  <option value="Under Review">Under Review (Inspection Scheduled)</option>
                  <option value="Approved">Approved & Finalized</option>
                  <option value="Declined">Declined / Closed</option>
                </select>
              </div>

              <div className="grid-3">
                <div className="form-group">
                  <label className="form-label">Final Approximate Cost (₹)</label>
                  <input
                    type="number"
                    value={editCost}
                    onChange={(e) => setEditCost(parseInt(e.target.value))}
                    className="form-input"
                  />
                </div>
                
                <div className="form-group">
                  <label className="form-label">Min Budget Range (₹)</label>
                  <input
                    type="number"
                    value={editMinBudget}
                    onChange={(e) => setEditMinBudget(parseInt(e.target.value))}
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Max Budget Range (₹)</label>
                  <input
                    type="number"
                    value={editMaxBudget}
                    onChange={(e) => setEditMaxBudget(parseInt(e.target.value))}
                    className="form-input"
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Inspector Updates & Public Notes (Visible to Client)</label>
                <textarea
                  value={editNotes}
                  onChange={(e) => setEditNotes(e.target.value)}
                  className="form-textarea"
                  placeholder="e.g. Site visited. Checked soil condition. Concrete works approved. Finalizing blueprints..."
                ></textarea>
                <span className="hint-label">Clients will see these notes instantly when tracking their status ID.</span>
              </div>

              <hr className="modal-divider" />

              <h3>Assign Site Project Engineer</h3>
              <p className="panel-desc mb-1">Assign an engineer to manage construction works and act as the client contact.</p>

              <div className="form-group">
                <label className="form-label text-xs">Quick Preset Engineers</label>
                <select
                  onChange={(e) => {
                    const val = e.target.value;
                    if (val === 'vikram') {
                      setEngName('Eng. Vikram Kumar');
                      setEngPhone('+91 99001 12233');
                      setEngEmail('vikram.kumar@apexconstruct.com');
                      setEngSpec('Senior Site Structural Engineer');
                      setEngUsername('vikram');
                      setEngPassword('eng123');
                    } else if (val === 'sandeep') {
                      setEngName('Eng. Sandeep Patil');
                      setEngPhone('+91 98800 22334');
                      setEngEmail('sandeep.patil@apexconstruct.com');
                      setEngSpec('Electrical & Plumbing Lead');
                      setEngUsername('sandeep');
                      setEngPassword('eng123');
                    } else if (val === 'ananya') {
                      setEngName('Arch. Ananya Sen');
                      setEngPhone('+91 97700 33445');
                      setEngEmail('ananya.sen@apexconstruct.com');
                      setEngSpec('Principal Luxury Architectural Designer');
                      setEngUsername('ananya');
                      setEngPassword('eng123');
                    } else if (val === 'clear') {
                      setEngName('');
                      setEngPhone('');
                      setEngEmail('');
                      setEngSpec('');
                      setEngUsername('');
                      setEngPassword('');
                    }
                  }}
                  className="form-select"
                >
                  <option value="">-- Choose Preset Engineer or Type Custom --</option>
                  <option value="vikram">Eng. Vikram Kumar (Structural)</option>
                  <option value="sandeep">Eng. Sandeep Patil (Services/MEP)</option>
                  <option value="ananya">Arch. Ananya Sen (Architect)</option>
                  <option value="clear">Unassign Engineer</option>
                </select>
              </div>

              <div className="grid-2 mt-1">
                <div className="form-group">
                  <label className="form-label text-xs">Engineer Name</label>
                  <input
                    type="text"
                    value={engName}
                    onChange={(e) => setEngName(e.target.value)}
                    className="form-input"
                    placeholder="e.g. Eng. Vikram Kumar"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label text-xs">Engineer Specialization</label>
                  <input
                    type="text"
                    value={engSpec}
                    onChange={(e) => setEngSpec(e.target.value)}
                    className="form-input"
                    placeholder="e.g. Structural Engineer"
                  />
                </div>
              </div>

              <div className="grid-2 mt-1">
                <div className="form-group">
                  <label className="form-label text-xs">Engineer Phone</label>
                  <input
                    type="text"
                    value={engPhone}
                    onChange={(e) => setEngPhone(e.target.value)}
                    className="form-input"
                    placeholder="e.g. +91 99001 12233"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label text-xs">Engineer Email</label>
                  <input
                    type="email"
                    value={engEmail}
                    onChange={(e) => setEngEmail(e.target.value)}
                    className="form-input"
                    placeholder="e.g. engineer@apexconstruct.com"
                  />
                </div>
              </div>

              <div className="grid-2 mt-1">
                <div className="form-group">
                  <label className="form-label text-xs">Engineer Username (For Login)</label>
                  <input
                    type="text"
                    value={engUsername}
                    onChange={(e) => setEngUsername(e.target.value)}
                    className="form-input"
                    placeholder="e.g. vikram"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label text-xs">Engineer Password (For Login)</label>
                  <input
                    type="password"
                    value={engPassword}
                    onChange={(e) => setEngPassword(e.target.value)}
                    className="form-input"
                    placeholder="e.g. eng123"
                  />
                </div>
              </div>

              <hr className="modal-divider" />

              <h3>Site Progress Logs (Proof of Work)</h3>
              <p className="panel-desc mb-1">Add progress timeline logs and upload site proof photos visible to the client.</p>

              {/* List existing logs */}
              {selectedApp.progressLogs && selectedApp.progressLogs.length > 0 ? (
                <div className="admin-progress-logs-list mb-1">
                  {selectedApp.progressLogs.map((log, idx) => (
                    <div key={idx} className="progress-log-item glass-panel inner-panel mt-1">
                      <div className="log-meta">
                        <strong className="gold-text">{log.stage}</strong>
                        <span className="log-date">{new Date(log.date).toLocaleDateString()}</span>
                      </div>
                      <p className="log-desc">{log.description}</p>
                      {log.imageUrl && (
                        <div className="log-img-preview">
                          <img src={log.imageUrl} alt={log.stage} className="progress-img-thumb" />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="no-data-text text-sm py-2">No progress logs posted yet.</p>
              )}

              {/* Add progress log form */}
              <div className="add-progress-block glass-panel inner-panel mt-1">
                <h4>Post New Work Progress Proof</h4>
                
                <div className="grid-2 mt-1">
                  <div className="form-group">
                    <label className="form-label text-xs">Work Stage</label>
                    <select
                      value={newProgressStage}
                      onChange={(e) => setNewProgressStage(e.target.value)}
                      className="form-select"
                    >
                      <option value="">-- Select Stage --</option>
                      <option value="Site Excavation">Site Excavation</option>
                      <option value="Foundation & Pillars">Foundation & Pillars</option>
                      <option value="Brick Masonry">Brick Masonry</option>
                      <option value="Roof Slab Casting">Roof Slab Casting</option>
                      <option value="Plumbing & Electricals">Plumbing & Electricals</option>
                      <option value="Plastering & Painting">Plastering & Painting</option>
                      <option value="Final Handover">Final Handover</option>
                    </select>
                  </div>
                  
                  <div className="form-group">
                    <label className="form-label text-xs">Site Proof Photo</label>
                    <select
                      value={newProgressImg}
                      onChange={(e) => setNewProgressImg(e.target.value)}
                      className="form-select"
                    >
                      <option value="">No Photo / Image URL</option>
                      <option value="https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&w=600&q=80">Excavation & Excavator (Preset)</option>
                      <option value="https://images.unsplash.com/photo-1590069261209-f8e9b8642343?auto=format&fit=crop&w=600&q=80">Masonry & Bricks (Preset)</option>
                      <option value="https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=600&q=80">Reinforcement Steel (Preset)</option>
                      <option value="https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=600&q=80">Plumbing Inspecting (Preset)</option>
                      <option value="https://images.unsplash.com/photo-1562259949-e8e7689d7828?auto=format&fit=crop&w=600&q=80">Finished Interior (Preset)</option>
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label text-xs">Or Custom Image URL</label>
                  <input
                    type="url"
                    value={newProgressImg}
                    onChange={(e) => setNewProgressImg(e.target.value)}
                    className="form-input"
                    placeholder="https://example.com/site-photo.jpg"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label text-xs">Work Description / Details</label>
                  <textarea
                    value={newProgressDesc}
                    onChange={(e) => setNewProgressDesc(e.target.value)}
                    className="form-textarea text-sm"
                    placeholder="Provide description of what work was completed..."
                    rows="2"
                  ></textarea>
                </div>

                <button
                  type="button"
                  onClick={handlePostProgress}
                  disabled={addingProgress}
                  className="outline-button font-bold text-xs"
                >
                  {addingProgress ? 'Saving Update...' : 'Post Progress Update'}
                </button>
              </div>

              <hr className="modal-divider" />

              <h3>Client Communication Chat Log</h3>
              <p className="panel-desc mb-1">Directly chat with the client about design preferences, materials, updates, or payments.</p>

              {/* Chat messages list */}
              <div className="admin-chat-container glass-panel inner-panel mt-1" style={{ maxHeight: '200px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.75rem', padding: '1rem', background: 'rgba(0,0,0,0.2)' }}>
                {(!selectedApp.messages || selectedApp.messages.length === 0) ? (
                  <p className="no-data-text text-sm py-2 text-center" style={{ color: 'var(--text-muted)' }}>No messages in chat feed yet.</p>
                ) : (
                  selectedApp.messages.map((msg, idx) => {
                    const isAdmin = msg.sender === 'Admin';
                    return (
                      <div 
                        key={idx} 
                        style={{
                          alignSelf: isAdmin ? 'flex-end' : 'flex-start',
                          background: isAdmin ? 'rgba(66, 153, 225, 0.15)' : msg.sender === 'Engineer' ? 'rgba(212, 175, 55, 0.15)' : 'rgba(255,255,255,0.05)',
                          border: `1px solid ${isAdmin ? 'rgba(66, 153, 225, 0.3)' : msg.sender === 'Engineer' ? 'rgba(212, 175, 55, 0.3)' : 'rgba(255,255,255,0.1)'}`,
                          borderRadius: '6px',
                          padding: '0.5rem 0.75rem',
                          maxWidth: '80%'
                        }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem', fontSize: '0.7rem', color: isAdmin ? '#90cdf4' : msg.sender === 'Engineer' ? '#f3e5ab' : '#a0aec0', fontWeight: 'bold' }}>
                          <span>{isAdmin ? '🛡️ Admin (You)' : msg.sender === 'Engineer' ? '👷‍♂️ Site Engineer' : '👤 Customer'}</span>
                          <span style={{ fontWeight: 'normal', color: 'var(--text-muted)' }}>
                            {new Date(msg.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                        <p style={{ margin: '0.2rem 0 0 0', fontSize: '0.85rem', color: '#f7fafc', whiteSpace: 'pre-wrap' }}>{msg.message}</p>
                      </div>
                    );
                  })
                )}
              </div>

              {/* Chat input form inside review modal */}
              <div className="admin-chat-input-block glass-panel inner-panel mt-1" style={{ display: 'flex', gap: '0.5rem' }}>
                <textarea
                  value={adminMessage}
                  onChange={(e) => setAdminMessage(e.target.value)}
                  className="form-input"
                  style={{ flex: 1, padding: '0.5rem', background: '#171c24', border: '1px solid var(--border-color)', borderRadius: '6px', color: '#fff', fontSize: '0.85rem', resize: 'none', height: '40px' }}
                  placeholder="Type message to client..."
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSendAdminMessage(e);
                    }
                  }}
                />
                <button
                  type="button"
                  onClick={handleSendAdminMessage}
                  disabled={sendingAdminMsg || !adminMessage.trim()}
                  className="gold-button"
                  style={{ padding: '0 1.2rem', height: '40px', fontSize: '0.8rem' }}
                >
                  {sendingAdminMsg ? '...' : 'Send'}
                </button>
              </div>

              <div className="modal-buttons">
                <button type="button" onClick={() => setSelectedApp(null)} className="outline-button">Cancel</button>
                <button type="submit" className="gold-button">Save Application Changes</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL: EDIT STRUCTURE PRICING ================= */}
      {editingStructure && (
        <div className="modal-backdrop">
          <div className="modal-content glass-panel modal-wide fade-in">
            <div className="modal-header">
              <h2>Modify Settings: <span className="gold-text">{editingStructure.name}</span></h2>
              <button onClick={() => setEditingStructure(null)} className="close-modal-btn">&times;</button>
            </div>
            
            <form onSubmit={handleStructureUpdate} className="modal-form">
              <div className="form-group">
                <label className="form-label">Base Price per Square Foot (Standard Package) (₹)</label>
                <input
                  type="number"
                  value={editBasePrice}
                  onChange={(e) => setEditBasePrice(parseInt(e.target.value))}
                  className="form-input"
                  required
                />
              </div>

              <h3>Package Rate Multipliers</h3>
              <div className="grid-3 mt-1">
                {editPackages.map((pkg, idx) => (
                  <div key={pkg.name} className="form-group glass-panel inner-panel">
                    <label className="form-label font-bold gold-text">{pkg.name} Package</label>
                    <div className="form-group">
                      <label className="form-label">Price Multiplier</label>
                      <input
                        type="number"
                        step="0.05"
                        value={pkg.priceMultiplier}
                        onChange={(e) => {
                          const updated = [...editPackages];
                          updated[idx].priceMultiplier = parseFloat(e.target.value);
                          setEditPackages(updated);
                        }}
                        className="form-input"
                        required
                      />
                    </div>
                    <span className="hint-label">Calculated Rate: ₹{Math.round(editBasePrice * pkg.priceMultiplier)}/sqft</span>
                  </div>
                ))}
              </div>

              <h3 className="mt-2">Material Definitions Specifications Checklist</h3>
              <div className="modal-materials-scroller">
                {editPackages.map((pkg, pIdx) => (
                  <div key={pkg.name} className="package-materials-edit-section">
                    <h4>{pkg.name} Tier Materials</h4>
                    {pkg.materials.map((mat, mIdx) => (
                      <div key={mIdx} className="material-edit-block glass-panel inner-panel mt-1">
                        <strong className="gold-text d-block mb-1">{mat.category}</strong>
                        <div className="grid-3">
                          <div className="form-group">
                            <label className="form-label text-xs">Specs & Brand</label>
                            <input
                              type="text"
                              value={mat.details}
                              onChange={(e) => handleMaterialChange(pIdx, mIdx, 'details', e.target.value)}
                              className="form-input"
                              required
                            />
                          </div>
                          <div className="form-group">
                            <label className="form-label text-xs">Quantity / Volume</label>
                            <input
                              type="text"
                              value={mat.quantity || ''}
                              onChange={(e) => handleMaterialChange(pIdx, mIdx, 'quantity', e.target.value)}
                              className="form-input"
                              placeholder="e.g. 400 Bags"
                            />
                          </div>
                          <div className="form-group">
                            <label className="form-label text-xs">Estimated Cost (₹)</label>
                            <input
                              type="number"
                              value={mat.approxCost || 0}
                              onChange={(e) => handleMaterialChange(pIdx, mIdx, 'approxCost', parseInt(e.target.value) || 0)}
                              className="form-input"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ))}
              </div>

              <div className="modal-buttons mt-2">
                <button type="button" onClick={() => setEditingStructure(null)} className="outline-button">Cancel</button>
                <button type="submit" className="gold-button">Save Configuration Changes</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style>{`
        .dashboard-container { padding-top: 2.5rem; display: flex; flex-direction: column; gap: 2rem; }
        .dashboard-header { display: flex; justify-content: space-between; align-items: center; }
        .dashboard-header h1 { font-size: 1.75rem; }
        
        .dashboard-layout { display: grid; grid-template-columns: 1fr; gap: 1.5rem; }
        @media (min-width: 992px) { .dashboard-layout { grid-template-columns: 0.3fr 1.7fr; } }
        
        .dashboard-sidebar { display: flex; flex-direction: column; gap: 0.75rem; height: fit-content; padding: 1rem; }
        .tab-toggle-btn {
          background: transparent;
          border: 1px solid transparent;
          color: var(--text-secondary);
          padding: 0.75rem 1rem;
          border-radius: 6px;
          cursor: pointer;
          font-weight: 600;
          text-align: left;
          transition: var(--transition);
          font-size: 0.95rem;
        }
        .tab-toggle-btn:hover { background: rgba(255,255,255,0.02); color: var(--text-primary); }
        .tab-toggle-btn.active { background: rgba(212,175,55,0.1); color: var(--accent-gold); border-color: var(--border-color); }
        
        .dashboard-main { min-height: 500px; padding: 1.5rem; }
        
        .view-header { border-bottom: 1px solid rgba(255,255,255,0.05); padding-bottom: 1rem; margin-bottom: 1.5rem; }
        .view-header h2 { font-size: 1.35rem; }
        .filters-row { display: flex; flex-wrap: wrap; gap: 1rem; margin-top: 1rem; }
        .search-box { flex: 1; min-width: 200px; }
        .status-select { width: 180px; }
        
        /* Table Styles */
        .table-responsive { width: 100%; overflow-x: auto; }
        .admin-table { width: 100%; border-collapse: collapse; text-align: left; font-size: 0.9rem; }
        .admin-table th { background: rgba(0,0,0,0.2); padding: 0.75rem 1rem; font-weight: 600; border-bottom: 2px solid rgba(255,255,255,0.05); color: var(--text-secondary); }
        .admin-table td { padding: 0.75rem 1rem; border-bottom: 1px solid rgba(255,255,255,0.03); vertical-align: middle; }
        .admin-tr-row:hover { background: rgba(255,255,255,0.01); }
        
        .client-info-cell, .specs-cell { display: flex; flex-direction: column; }
        .client-info-cell span, .specs-cell span { font-size: 0.75rem; color: var(--text-muted); }
        .location-cell { max-width: 180px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        
        .action-buttons-cell { display: flex; gap: 0.5rem; }
        .edit-action-btn { background: rgba(212,175,55,0.15); color: var(--accent-gold-hover); border: 1px solid var(--border-color); padding: 0.3rem 0.6rem; border-radius: 4px; cursor: pointer; font-size: 0.75rem; transition: var(--transition); }
        .edit-action-btn:hover { background: var(--accent-gold); color: #000; }
        .delete-action-btn { background: rgba(245,101,101,0.15); color: var(--status-declined); border: 1px solid rgba(245,101,101,0.3); padding: 0.3rem 0.6rem; border-radius: 4px; cursor: pointer; font-size: 0.75rem; transition: var(--transition); }
        .delete-action-btn:hover { background: var(--status-declined); color: #fff; }
        
        .no-data-text { text-align: center; color: var(--text-muted); padding: 3rem 0; }
        
        /* Pricing configs view */
        .structures-grid { display: grid; grid-template-columns: 1fr; gap: 1.5rem; margin-top: 1rem; }
        @media (min-width: 768px) { .structures-grid { grid-template-columns: repeat(2, 1fr); } }
        .structure-pricing-card { display: flex; flex-direction: column; gap: 1rem; border-color: rgba(255,255,255,0.03); }
        .card-header { display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid rgba(255,255,255,0.05); padding-bottom: 0.5rem; }
        .edit-struct-btn { font-size: 0.75rem; padding: 0.4rem 0.8rem; }
        .struct-description { font-size: 0.85rem; color: var(--text-secondary); line-height: 1.5; }
        .pricing-parameters { display: flex; flex-direction: column; gap: 0.5rem; background: rgba(0,0,0,0.2); padding: 1rem; border-radius: 6px; }
        .param-item { display: flex; justify-content: space-between; font-size: 0.875rem; }
        .nested-param { padding-left: 1rem; font-size: 0.8rem; color: var(--text-muted); border-left: 1px solid rgba(255,255,255,0.05); }
        
        /* Modals style */
        .modal-backdrop { position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background: rgba(0,0,0,0.7); backdrop-filter: blur(4px); display: flex; justify-content: center; align-items: center; z-index: 1100; padding: 1.5rem; overflow-y: auto; }
        .modal-content { background: var(--bg-secondary); border: 1px solid rgba(255,255,255,0.08); border-radius: 12px; width: 100%; max-width: 650px; max-height: 90vh; overflow-y: auto; padding: 2rem; display: flex; flex-direction: column; gap: 1.5rem; }
        .modal-wide { max-width: 850px; }
        .modal-header { display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid rgba(255,255,255,0.05); padding-bottom: 0.75rem; }
        .close-modal-btn { background: transparent; border: none; font-size: 2rem; color: var(--text-secondary); cursor: pointer; transition: var(--transition); line-height: 1; }
        .close-modal-btn:hover { color: var(--text-primary); }
        
        .modal-details-grid { display: grid; grid-template-columns: 1fr; gap: 1.5rem; }
        @media (min-width: 576px) { .modal-details-grid { grid-template-columns: 1fr 1fr; } }
        .modal-detail-block h4 { font-size: 0.95rem; color: var(--accent-gold); margin-bottom: 0.5rem; text-transform: uppercase; }
        .modal-detail-block p { font-size: 0.85rem; color: var(--text-secondary); margin-bottom: 0.25rem; }
        .modal-divider { border: 0; height: 1px; background: rgba(255,255,255,0.05); margin: 0.5rem 0; }
        .hint-label { font-size: 0.75rem; color: var(--text-muted); display: block; margin-top: 0.25rem; }
        .modal-buttons { display: flex; justify-content: flex-end; gap: 1rem; border-top: 1px solid rgba(255,255,255,0.05); padding-top: 1.25rem; margin-top: 0.5rem; }
        
        .inner-panel { background: rgba(0,0,0,0.1); border-color: rgba(255,255,255,0.02); }
        .mt-2 { margin-top: 1.5rem; }
        .uppercase { text-transform: uppercase; }
        .text-xs { font-size: 0.75rem; }
        .font-bold { font-weight: 700; }
        
        .modal-materials-scroller { max-height: 250px; overflow-y: auto; padding-right: 0.5rem; display: flex; flex-direction: column; gap: 1.5rem; margin-top: 1rem; }
        .package-materials-edit-section { border-bottom: 1px solid rgba(255,255,255,0.03); padding-bottom: 1rem; }
        .package-materials-edit-section h4 { color: var(--accent-gold); font-size: 0.95rem; margin-bottom: 0.75rem; border-left: 2px solid var(--accent-gold); padding-left: 0.5rem; }
        .material-edit-row { display: grid; grid-template-columns: 0.3fr 1.7fr; gap: 1rem; align-items: center; margin-bottom: 0.5rem; }
        .material-label { font-size: 0.85rem; font-weight: 600; color: var(--text-secondary); }

        /* Progress updates list styling */
        .admin-progress-logs-list { display: flex; flex-direction: column; gap: 0.75rem; max-height: 250px; overflow-y: auto; padding-right: 0.25rem; }
        .progress-log-item { display: flex; flex-direction: column; gap: 0.35rem; border-color: rgba(255,255,255,0.02); }
        .log-meta { display: flex; justify-content: space-between; align-items: baseline; }
        .log-date { font-size: 0.75rem; color: var(--text-muted); }
        .log-desc { font-size: 0.85rem; color: var(--text-secondary); }
        .progress-img-thumb { width: 120px; height: 80px; object-fit: cover; border-radius: 4px; border: 1px solid var(--border-color); margin-top: 0.35rem; }
        .add-progress-block { border-color: var(--border-color) !important; background: rgba(212,175,55,0.02) !important; }
        .add-progress-block h4 { color: var(--accent-gold); font-size: 0.95rem; border-bottom: 1px dashed rgba(212,175,55,0.2); padding-bottom: 0.35rem; margin-bottom: 0.5rem; }
        .mb-1 { margin-bottom: 0.5rem; }
        .d-block { display: block; }
      `}</style>
    </div>
  );
};

export default AdminDashboard;
