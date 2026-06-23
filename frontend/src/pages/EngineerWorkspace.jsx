import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';

const PRESET_IMAGES = [
  { label: 'Site Excavation', url: 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&w=600&q=80' },
  { label: 'Foundation & Pillars', url: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=600&q=80' },
  { label: 'Framing & Brickwork', url: 'https://images.unsplash.com/photo-1590069261209-f8e9b8642343?auto=format&fit=crop&w=600&q=80' },
  { label: 'Interior / Utility Works', url: 'https://images.unsplash.com/photo-1581094288338-2314dddb7ecc?auto=format&fit=crop&w=600&q=80' },
  { label: 'Plastering & Painting', url: 'https://images.unsplash.com/photo-1562259949-e8e7689d7828?auto=format&fit=crop&w=600&q=80' },
  { label: 'Final Handover / Completed', url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=600&q=80' }
];

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
          { category: 'Flooring', details: 'Double charged vitrified tiles, granite stairways', quantity: '1,500 sqft', approxCost: 160000 },
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

export const EngineerWorkspace = () => {
  const { apiUrl } = useAuth();
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [projects, setProjects] = useState([]);
  const [activeProject, setActiveProject] = useState(null);

  // Material Spec configurations
  const [structuresList, setStructuresList] = useState([]);

  // Forms states
  const [logStage, setLogStage] = useState('');
  const [logDescription, setLogDescription] = useState('');
  const [logImageUrl, setLogImageUrl] = useState('');
  const [customImage, setCustomImage] = useState(false);
  const [postingLog, setPostingLog] = useState(false);
  const [logSuccess, setLogSuccess] = useState('');
  const [logError, setLogError] = useState('');

  // Message states
  const [newMessage, setNewMessage] = useState('');
  const [sendingMsg, setSendingMsg] = useState(false);
  const [msgError, setMsgError] = useState('');

  // Project acceptance state
  const [accepting, setAccepting] = useState(false);

  const chatEndRef = useRef(null);

  const savedUsername = sessionStorage.getItem('engineerUsername');

  // Verify staff login
  useEffect(() => {
    if (savedUsername) {
      fetchEngineerProjects(savedUsername);
      fetchStructures();
    }
  }, [savedUsername]);

  // Scroll to bottom of chat
  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [activeProject?.messages]);

  const fetchStructures = async () => {
    try {
      const res = await fetch(`${apiUrl}/structures`);
      if (res.ok) {
        const data = await res.json();
        setStructuresList(data);
      }
    } catch (err) {
      console.warn('Backend structures loading offline.');
    }
  };

  const fetchEngineerProjects = async (username) => {
    setLoading(true);
    setErrorMsg('');
    try {
      // Re-fetch project list by credentials matching
      const projectIdsSaved = JSON.parse(sessionStorage.getItem('engineerProjectIds') || '[]');
      
      if (projectIdsSaved.length > 0) {
        // Fetch each project detail
        const fetchedList = [];
        for (const refId of projectIdsSaved) {
          try {
            const res = await fetch(`${apiUrl}/applications/engineer/${refId}`);
            if (res.ok) {
              const data = await res.ok ? await res.json() : null;
              if (data) fetchedList.push(data);
            }
          } catch (e) {
            // ignore
          }
        }

        if (fetchedList.length > 0) {
          setProjects(fetchedList);
          // Set active project
          const savedActiveRefId = sessionStorage.getItem('engineerRefId');
          const matchedActive = fetchedList.find(p => p.referenceId === savedActiveRefId) || fetchedList[0];
          setActiveProject(matchedActive);
          sessionStorage.setItem('engineerRefId', matchedActive.referenceId);
        } else {
          handleOfflineProjectsFallback(username);
        }
      } else {
        handleOfflineProjectsFallback(username);
      }
    } catch (err) {
      handleOfflineProjectsFallback(username);
    } finally {
      setLoading(false);
    }
  };

  const handleOfflineProjectsFallback = (username) => {
    // If offline, provide Vikram / demo project BC-DEMO12
    if (username === 'vikram') {
      const offlineAccepted = sessionStorage.getItem('demo_project_accepted') === 'true';
      const demoProject = {
        referenceId: 'BC-DEMO12',
        clientName: 'Rahul Sharma',
        clientPhone: '+91 98765 43210',
        clientEmail: 'rahul.sharma@example.com',
        location: 'Sector 62, Noida, UP',
        structureType: 'Home',
        packageType: 'Premium',
        areaSqFt: 1500,
        approximateCost: 2925000,
        budgetMin: 2778750,
        budgetMax: 3217500,
        status: 'Approved',
        adminNotes: 'Assigned Senior Site Engineer Vikram for foundation mapping.',
        preferences: 'Prefer cream-colored exterior paint, vitrified flooring layout, and modern open-plan modular kitchen structure.',
        assignedEngineer: {
          name: 'Eng. Vikram Kumar',
          phone: '+91 99001 12233',
          email: 'vikram.kumar@apexconstruct.com',
          specialization: 'Senior Site Structural Engineer',
          username: 'vikram',
          password: 'eng123',
          accepted: offlineAccepted
        },
        progressLogs: [
          {
            _id: '1',
            date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
            stage: 'Site Excavation',
            description: 'Soil excavation completed. Site leveled. Structural markups placed.',
            imageUrl: 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&w=600&q=80'
          },
          {
            _id: '2',
            date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
            stage: 'Foundation & Pillars',
            description: 'RCC foundation footings casted. Steel reinforcement binding completed.',
            imageUrl: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=600&q=80'
          }
        ],
        messages: [
          { sender: 'Admin', message: 'Vikram, please upload soil test reports and begin pillar binding.', date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString() },
          { sender: 'Engineer', message: 'Understood. Initial layout excavation is done. Pillars foundation began today.', date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString() },
          { sender: 'Client', message: 'Looks great! When will the ground slab casting start?', date: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString() }
        ],
        createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString()
      };
      setProjects([demoProject]);
      setActiveProject(demoProject);
      sessionStorage.setItem('engineerRefId', 'BC-DEMO12');
    } else {
      setErrorMsg('No projects assigned to this account.');
    }
  };

  const handleSelectProject = (proj) => {
    setActiveProject(proj);
    sessionStorage.setItem('engineerRefId', proj.referenceId);
    setLogSuccess('');
    setLogError('');
    setMsgError('');
  };

  const handleAcceptProject = async () => {
    if (!activeProject) return;
    setAccepting(true);
    try {
      const res = await fetch(`${apiUrl}/applications/engineer/${activeProject.referenceId}/accept`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      const data = await res.json();
      if (res.ok) {
        // Update local active project & list
        setActiveProject(data);
        setProjects(projects.map(p => p.referenceId === data.referenceId ? data : p));
      } else {
        alert(data.message || 'Failed to accept project.');
      }
    } catch (err) {
      // Demo fallback
      if (activeProject.referenceId === 'BC-DEMO12') {
        sessionStorage.setItem('demo_project_accepted', 'true');
        const updated = {
          ...activeProject,
          assignedEngineer: { ...activeProject.assignedEngineer, accepted: true }
        };
        setActiveProject(updated);
        setProjects([updated]);
      } else {
        alert('Could not connect to the server.');
      }
    } finally {
      setAccepting(false);
    }
  };

  const handleLogout = () => {
    sessionStorage.clear();
    window.location.hash = '#login';
    window.location.reload();
  };

  const handlePostProgress = async (e) => {
    e.preventDefault();
    if (!logStage || !logDescription) {
      setLogError('Stage and Description are required.');
      return;
    }

    setPostingLog(true);
    setLogSuccess('');
    setLogError('');

    const targetUrl = logImageUrl || (PRESET_IMAGES.find(i => i.label === logStage)?.url || PRESET_IMAGES[0].url);

    try {
      const res = await fetch(`${apiUrl}/applications/engineer/${activeProject.referenceId}/progress`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          stage: logStage,
          description: logDescription,
          imageUrl: targetUrl
        })
      });

      const data = await res.json();
      if (res.ok) {
        setLogSuccess('Progress log successfully uploaded!');
        setLogStage('');
        setLogDescription('');
        setLogImageUrl('');
        setActiveProject(data);
        setProjects(projects.map(p => p.referenceId === data.referenceId ? data : p));
      } else {
        setLogError(data.message || 'Failed to post progress log.');
      }
    } catch (err) {
      // Local fallback for demo
      if (activeProject.referenceId === 'BC-DEMO12') {
        const updatedLogs = [...activeProject.progressLogs, {
          _id: String(Date.now()),
          date: new Date().toISOString(),
          stage: logStage,
          description: logDescription,
          imageUrl: targetUrl
        }];
        const updated = { ...activeProject, progressLogs: updatedLogs };
        setActiveProject(updated);
        setProjects([updated]);
        setLogSuccess('Offline Demo: Log successfully appended locally!');
        setLogStage('');
        setLogDescription('');
        setLogImageUrl('');
      } else {
        setLogError('Server connection error. Failed to post log.');
      }
    } finally {
      setPostingLog(false);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    setSendingMsg(true);
    setMsgError('');

    try {
      const res = await fetch(`${apiUrl}/applications/engineer/${activeProject.referenceId}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sender: 'Engineer',
          message: newMessage.trim()
        })
      });

      const data = await res.json();
      if (res.ok) {
        setNewMessage('');
        setActiveProject(data);
        setProjects(projects.map(p => p.referenceId === data.referenceId ? data : p));
      } else {
        setMsgError(data.message || 'Failed to send message.');
      }
    } catch (err) {
      // Local fallback for demo
      if (activeProject.referenceId === 'BC-DEMO12') {
        const updatedMessages = [...activeProject.messages, {
          sender: 'Engineer',
          message: newMessage.trim(),
          date: new Date().toISOString()
        }];
        const updated = { ...activeProject, messages: updatedMessages };
        setActiveProject(updated);
        setProjects([updated]);
        setNewMessage('');
      } else {
        setMsgError('Server offline. Message failed to deliver.');
      }
    } finally {
      setSendingMsg(false);
    }
  };

  // Find Material specs matching active project
  const getMaterialSpecs = () => {
    if (!activeProject) return [];
    const struct = structuresList.find(s => s.name === activeProject.structureType) || mockStructuresFallback.find(s => s.name === activeProject.structureType);
    const pkg = struct?.packages.find(p => p.name === activeProject.packageType);
    return pkg?.materials || [];
  };

  const getBubbleStyle = (sender) => {
    if (sender === 'Engineer') {
      return {
        bg: 'rgba(212, 175, 55, 0.2)',
        border: '1px solid rgba(212, 175, 55, 0.4)',
        alignSelf: 'flex-end',
        color: '#f3e5ab'
      };
    } else if (sender === 'Admin') {
      return {
        bg: 'rgba(66, 153, 225, 0.15)',
        border: '1px solid rgba(66, 153, 225, 0.3)',
        alignSelf: 'flex-start',
        color: '#90cdf4'
      };
    } else {
      return {
        bg: 'rgba(255, 255, 255, 0.05)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        alignSelf: 'flex-start',
        color: '#f7fafc'
      };
    }
  };

  // Render Login restriction warning if not authenticated
  if (!savedUsername) {
    return (
      <div className="login-container container fade-in" style={{ padding: '6rem 2rem', minHeight: '80vh', textAlign: 'center' }}>
        <div className="login-card glass-panel" style={{ maxWidth: '500px', margin: '0 auto', padding: '2rem' }}>
          <span style={{ fontSize: '3rem', display: 'block', marginBottom: '1rem' }}>🚫</span>
          <h2 className="gold-gradient-text" style={{ fontSize: '1.8rem', margin: '1rem 0' }}>Access Restricted</h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem', fontSize: '0.95rem', lineHeight: '1.5' }}>
            This workspace is restricted to active site project engineers. Please authenticate via the Staff Portal to gain access.
          </p>
          <a href="#login" className="gold-button justify-content-center" style={{ width: '100%', justifyContent: 'center' }}>
            Go to Staff Portal Login
          </a>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="container py-4 text-center">
        <h2 className="gold-text">Loading assigned projects...</h2>
      </div>
    );
  }

  // Render Workspace
  const isAccepted = activeProject?.assignedEngineer?.accepted;
  const materialsList = getMaterialSpecs();

  return (
    <div className="container fade-in" style={{ padding: '2rem 1.5rem 6rem 1.5rem' }}>
      
      {/* Top Banner */}
      <div className="glass-panel" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <span style={{ fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--accent-gold)' }}>
            Welcome, Eng. {savedUsername}
          </span>
          <h2 style={{ fontSize: '1.8rem' }}>Engineer Workspace</h2>
        </div>
        <button onClick={handleLogout} className="outline-button" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem', border: '1px solid rgba(255,255,255,0.2)', color: '#fff', borderRadius: '4px', background: 'transparent', cursor: 'pointer' }}>
          <span>🚪</span> Log Out
        </button>
      </div>

      {projects.length === 0 ? (
        <div className="glass-panel text-center" style={{ padding: '3rem' }}>
          <p style={{ fontSize: '1.5rem' }}>📭</p>
          <h3>No assigned projects found.</h3>
          <p style={{ color: 'var(--text-muted)' }}>Admin has not assigned any construction projects to your account credentials yet.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '2rem' }} className="workspace-main-layout">
          
          {/* Projects List Selector Tabs */}
          <div style={{ display: 'flex', gap: '0.75rem', overflowX: 'auto', paddingBottom: '0.5rem' }}>
            {projects.map((proj) => (
              <button
                key={proj.referenceId}
                onClick={() => handleSelectProject(proj)}
                style={{
                  background: activeProject?.referenceId === proj.referenceId ? 'rgba(212, 175, 55, 0.15)' : 'rgba(255,255,255,0.02)',
                  color: activeProject?.referenceId === proj.referenceId ? 'var(--accent-gold)' : 'var(--text-secondary)',
                  border: `1px solid ${activeProject?.referenceId === proj.referenceId ? 'var(--accent-gold)' : 'rgba(255,255,255,0.05)'}`,
                  padding: '0.5rem 1rem',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontWeight: 600,
                  fontSize: '0.85rem',
                  whiteSpace: 'nowrap',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}
              >
                <span>👷‍♂️</span>
                <span>{proj.referenceId}</span>
                {!proj.assignedEngineer?.accepted && (
                  <span style={{ width: '8px', height: '8px', background: 'red', borderRadius: '50%' }} title="New Assignment!"></span>
                )}
              </button>
            ))}
          </div>

          {activeProject && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '2rem' }}>
              
              {/* Acceptance Alert for New Assignments */}
              {!isAccepted && (
                <div className="glass-panel" style={{ border: '2px solid var(--accent-gold)', background: 'rgba(212, 175, 55, 0.05)', padding: '1.5rem', display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
                  <div style={{ fontSize: '2.5rem' }}>🔔</div>
                  <div style={{ flex: 1, minWidth: '250px' }}>
                    <h3 style={{ color: 'var(--accent-gold-hover)', margin: '0 0 0.25rem 0' }}>New Project Assignment Pending!</h3>
                    <p style={{ fontSize: '0.9rem', color: 'var(--text-primary)', margin: 0 }}>
                      You have been assigned to project tracker ID <strong className="gold-text">{activeProject.referenceId}</strong> (Client: {activeProject.clientName}). 
                      Please accept this assignment below to unlock the workspace features.
                    </p>
                  </div>
                  <button 
                    onClick={handleAcceptProject} 
                    disabled={accepting} 
                    className="gold-button"
                    style={{ padding: '0.75rem 1.5rem', fontSize: '0.85rem' }}
                  >
                    {accepting ? 'Accepting...' : '✓ Accept Project Assignment'}
                  </button>
                </div>
              )}

              {/* Main Workspace Panels */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '2rem' }} className="workspace-panels-grid">
                
                {/* Left Side: Specifications & Material Checklist */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                  
                  {/* Specifications Card */}
                  <div className="glass-panel">
                    <h3 style={{ fontSize: '1.2rem', color: 'var(--accent-gold)', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      📋 Project Specifications
                    </h3>
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
                      <tbody>
                        <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                          <td style={{ padding: '0.6rem 0', color: 'var(--text-secondary)' }}>Client Name</td>
                          <td style={{ padding: '0.6rem 0', textAlign: 'right', fontWeight: 600 }}>{activeProject.clientName}</td>
                        </tr>
                        <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                          <td style={{ padding: '0.6rem 0', color: 'var(--text-secondary)' }}>Contact Info</td>
                          <td style={{ padding: '0.6rem 0', textAlign: 'right', fontSize: '0.85rem' }}>
                            <div>{activeProject.clientPhone}</div>
                            <div style={{ color: 'var(--text-muted)' }}>{activeProject.clientEmail}</div>
                          </td>
                        </tr>
                        <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                          <td style={{ padding: '0.6rem 0', color: 'var(--text-secondary)' }}>Site Location</td>
                          <td style={{ padding: '0.6rem 0', textAlign: 'right' }}>{activeProject.location}</td>
                        </tr>
                        <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                          <td style={{ padding: '0.6rem 0', color: 'var(--text-secondary)' }}>Structure details</td>
                          <td style={{ padding: '0.6rem 0', textAlign: 'right', fontWeight: 600 }}>{activeProject.structureType} ({activeProject.areaSqFt} sq. ft.)</td>
                        </tr>
                        <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                          <td style={{ padding: '0.6rem 0', color: 'var(--text-secondary)' }}>Material Package</td>
                          <td style={{ padding: '0.6rem 0', textAlign: 'right', fontWeight: 600, color: 'var(--accent-gold)' }}>{activeProject.packageType} Tier</td>
                        </tr>
                        <tr>
                          <td style={{ padding: '0.6rem 0', color: 'var(--text-secondary)' }}>Estimated Budget</td>
                          <td style={{ padding: '0.6rem 0', textAlign: 'right', fontWeight: 600 }}>₹{activeProject.approximateCost?.toLocaleString('en-IN')}</td>
                        </tr>
                      </tbody>
                    </table>

                    {activeProject.preferences && (
                      <div style={{ marginTop: '1.25rem', padding: '0.75rem', background: 'rgba(255,255,255,0.02)', borderRadius: '6px', borderLeft: '3px solid var(--accent-gold)' }}>
                        <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--accent-gold)', fontWeight: 600, display: 'block', marginBottom: '0.25rem' }}>
                          Client Design Suggestions
                        </span>
                        <p style={{ fontSize: '0.85rem', fontStyle: 'italic', color: 'var(--text-secondary)', margin: 0 }}>
                          "{activeProject.preferences}"
                        </p>
                      </div>
                    )}
                  </div>

                </div>

                {/* Right Side: Site Logging & Live Chat */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                  
                  {/* Site Progress Log Form */}
                  <div className="glass-panel" style={{ opacity: isAccepted ? 1 : 0.5, pointerEvents: isAccepted ? 'auto' : 'none' }}>
                    <h3 style={{ fontSize: '1.2rem', color: 'var(--accent-gold)', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      🏗️ Post Site Progress Log
                    </h3>
                    
                    {!isAccepted && (
                      <p style={{ color: 'var(--accent-gold)', fontSize: '0.85rem', fontStyle: 'italic', marginBottom: '1rem' }}>
                        ⚠️ Please accept the project assignment to unlock progress logging.
                      </p>
                    )}

                    {logSuccess && (
                      <div style={{ background: 'rgba(72, 187, 120, 0.1)', border: '1px solid rgba(72, 187, 120, 0.3)', borderRadius: '6px', padding: '0.75rem', marginBottom: '1rem', color: '#9ae6b4', fontSize: '0.85rem' }}>
                        {logSuccess}
                      </div>
                    )}
                    {logError && (
                      <div style={{ background: 'rgba(245, 101, 101, 0.1)', border: '1px solid rgba(245, 101, 101, 0.3)', borderRadius: '6px', padding: '0.75rem', marginBottom: '1rem', color: '#feb2b2', fontSize: '0.85rem' }}>
                        {logError}
                      </div>
                    )}

                    <form onSubmit={handlePostProgress} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                      <div className="form-group">
                        <label className="form-label" style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Construction Stage</label>
                        <select
                          required
                          value={logStage}
                          onChange={(e) => setLogStage(e.target.value)}
                          className="form-input"
                          style={{ width: '100%', padding: '0.6rem 0.75rem', background: '#171c24', border: '1px solid var(--border-color)', borderRadius: '6px', color: '#fff' }}
                        >
                          <option value="">-- Select Current Stage --</option>
                          <option value="Site Excavation">Site Excavation</option>
                          <option value="Foundation & Pillars">Foundation & Pillars</option>
                          <option value="Framing & Brickwork">Framing & Brickwork</option>
                          <option value="Interior / Utility Works">Interior / Utility Works</option>
                          <option value="Plastering & Painting">Plastering & Painting</option>
                          <option value="Final Handover / Completed">Final Handover / Completed</option>
                        </select>
                      </div>

                      <div className="form-group">
                        <label className="form-label" style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Work Log Description</label>
                        <textarea
                          required
                          rows="3"
                          value={logDescription}
                          onChange={(e) => setLogDescription(e.target.value)}
                          className="form-input"
                          style={{ width: '100%', padding: '0.6rem 0.75rem', background: '#171c24', border: '1px solid var(--border-color)', borderRadius: '6px', color: '#fff', resize: 'vertical' }}
                          placeholder="Detail the work completed, inspection clearances, or next activities..."
                        />
                      </div>

                      <div className="form-group">
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.25rem' }}>
                          <label className="form-label" style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: 0 }}>Proof Photo Image</label>
                          <button
                            type="button"
                            onClick={() => setCustomImage(!customImage)}
                            style={{ background: 'none', border: 'none', color: 'var(--accent-gold)', fontSize: '0.75rem', textDecoration: 'underline', cursor: 'pointer' }}
                          >
                            {customImage ? 'Use Preset Image' : 'Input Custom Image URL'}
                          </button>
                        </div>

                        {customImage ? (
                          <input
                            type="url"
                            value={logImageUrl}
                            onChange={(e) => setLogImageUrl(e.target.value)}
                            className="form-input"
                            style={{ width: '100%', padding: '0.6rem 0.75rem', background: '#171c24', border: '1px solid var(--border-color)', borderRadius: '6px', color: '#fff' }}
                            placeholder="https://example.com/site-proof.jpg"
                          />
                        ) : (
                          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', background: 'rgba(255,255,255,0.01)', padding: '0.5rem 0.75rem', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '4px' }}>
                            {logStage ? (
                              <span>Will automatically attach standard photo for <strong>{logStage}</strong></span>
                            ) : (
                              <span>Select stage to auto-link corresponding site proof illustration.</span>
                            )}
                          </div>
                        )}
                      </div>

                      <button type="submit" disabled={postingLog || !isAccepted} className="gold-button w-100 justify-content-center" style={{ marginTop: '0.5rem', justifyContent: 'center' }}>
                        {postingLog ? 'Posting Log...' : 'Submit Progress Log'}
                      </button>
                    </form>
                  </div>

                  {/* Client Communication Chat */}
                  <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', height: '420px', opacity: isAccepted ? 1 : 0.5, pointerEvents: isAccepted ? 'auto' : 'none' }}>
                    <h3 style={{ fontSize: '1.1rem', color: 'var(--accent-gold)', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      💬 Client Communication Hub
                    </h3>

                    {!isAccepted && (
                      <p style={{ color: 'var(--accent-gold)', fontSize: '0.8rem', fontStyle: 'italic', margin: '0 0 0.5rem 0' }}>
                        ⚠️ Please accept project assignment to unlock chat desk.
                      </p>
                    )}

                    <div style={{ flex: 1, overflowY: 'auto', padding: '0.75rem', background: 'rgba(0,0,0,0.15)', borderRadius: '6px', display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '0.75rem', border: '1px solid rgba(255,255,255,0.02)' }}>
                      {(!activeProject.messages || activeProject.messages.length === 0) ? (
                        <div style={{ margin: 'auto', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                          <p>No messages in chat feed yet.</p>
                        </div>
                      ) : (
                        activeProject.messages.map((msg, idx) => {
                          const bubble = getBubbleStyle(msg.sender);
                          return (
                            <div
                              key={idx}
                              style={{
                                display: 'flex',
                                flexDirection: 'column',
                                maxWidth: '80%',
                                alignSelf: bubble.alignSelf,
                                background: bubble.bg,
                                border: bubble.border,
                                borderRadius: '8px',
                                padding: '0.6rem 0.85rem',
                                position: 'relative'
                              }}
                            >
                              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: '1rem', marginBottom: '0.2rem' }}>
                                <span style={{ fontWeight: 600, fontSize: '0.7rem', color: bubble.color }}>
                                  {msg.sender === 'Engineer' ? '👷‍♂️ Site Engineer (You)' : msg.sender === 'Admin' ? '🛡️ Admin Office' : '👤 Customer'}
                                </span>
                                <span style={{ fontSize: '0.6rem', color: 'var(--text-muted)' }}>
                                  {new Date(msg.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </span>
                              </div>
                              <p style={{ fontSize: '0.85rem', color: '#f7fafc', margin: 0, whiteSpace: 'pre-line' }}>{msg.message}</p>
                            </div>
                          );
                        })
                      )}
                      <div ref={chatEndRef} />
                    </div>

                    {msgError && <div style={{ color: '#feb2b2', fontSize: '0.75rem', marginBottom: '0.25rem' }}>{msgError}</div>}

                    <form onSubmit={handleSendMessage} style={{ display: 'flex', gap: '0.5rem' }}>
                      <input
                        required
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Type message directly to client..."
                        className="form-input"
                        style={{ flex: 1, padding: '0.5rem 0.75rem', background: '#171c24', border: '1px solid var(--border-color)', borderRadius: '6px', color: '#fff', fontSize: '0.85rem' }}
                      />
                      <button
                        type="submit"
                        disabled={sendingMsg || !isAccepted}
                        className="gold-button"
                        style={{ padding: '0.5rem 1rem', fontSize: '0.8rem' }}
                      >
                        Send
                      </button>
                    </form>
                  </div>

                </div>

              </div>

              {/* Progress Timeline Gallery logs list */}
              <div className="glass-panel" style={{ marginTop: '1rem' }}>
                <h3 style={{ fontSize: '1.2rem', color: 'var(--accent-gold)', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem', marginBottom: '1.5rem' }}>
                  📈 Submitted Project Logs History
                </h3>
                
                {(!activeProject.progressLogs || activeProject.progressLogs.length === 0) ? (
                  <div style={{ color: 'var(--text-muted)', fontStyle: 'italic', padding: '1rem 0', fontSize: '0.85rem' }}>
                    No logs have been posted for this site project. Use the form above to add your first progress update.
                  </div>
                ) : (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
                    {activeProject.progressLogs.map((log, idx) => (
                      <div key={log._id || idx} className="glass-panel" style={{ background: 'rgba(255,255,255,0.01)', padding: '1rem', border: '1px solid rgba(255,255,255,0.03)' }}>
                        {log.imageUrl && (
                          <div style={{ height: '140px', borderRadius: '4px', overflow: 'hidden', marginBottom: '0.75rem' }}>
                            <img src={log.imageUrl} alt={log.stage} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                          </div>
                        )}
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '0.5rem' }}>
                          <span style={{ fontWeight: 600, color: 'var(--accent-gold)', fontSize: '0.95rem' }}>{log.stage}</span>
                          <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{new Date(log.date).toLocaleDateString()}</span>
                        </div>
                        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: 0 }}>{log.description}</p>
                      </div>
                    )).reverse()}
                  </div>
                )}
              </div>

            </div>
          )}
        </div>
      )}

      <style>{`
        @media (min-width: 992px) {
          .workspace-panels-grid {
            grid-template-columns: 0.9fr 1.1fr;
          }
        }
      `}</style>
    </div>
  );
};
