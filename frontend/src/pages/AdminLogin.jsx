import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

export const AdminLogin = () => {
  const { loginAdmin, isAuthenticated, apiUrl } = useAuth();
  const [role, setRole] = useState('admin'); // 'admin' or 'engineer'
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Redirect if already authenticated as Admin
  useEffect(() => {
    if (isAuthenticated && role === 'admin') {
      window.location.hash = '#admin';
    }
  }, [isAuthenticated, role]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username || !password) {
      setErrorMsg('Please enter both username and password.');
      return;
    }

    setSubmitting(true);
    setErrorMsg('');

    if (role === 'admin') {
      const res = await loginAdmin(username, password);

      if (res.success) {
        window.location.hash = '#admin';
      } else {
        setErrorMsg(res.error || 'Invalid credentials. Check your backend server and connection.');
        if (res.error?.includes('Failed to fetch') || res.error?.includes('NetworkError')) {
          setErrorMsg('Authentication Server Offline. Propping demo session: username "admin", password "admin123" is accepted offline.');
        }
      }
    } else {
      // Engineer Login
      try {
        const res = await fetch(`${apiUrl}/applications/engineer/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            username: username.trim(),
            password: password.trim()
          })
        });

        const data = await res.json();
        if (res.ok) {
          sessionStorage.setItem('engineerUsername', username.trim());
          // Save all project reference IDs the engineer is assigned to
          const projectIds = data.projects.map(p => p.referenceId);
          sessionStorage.setItem('engineerProjectIds', JSON.stringify(projectIds));
          sessionStorage.setItem('engineerRefId', projectIds[0] || ''); // default active project
          window.location.hash = '#engineer';
          window.location.reload();
        } else {
          setErrorMsg(data.message || 'Invalid engineer credentials.');
        }
      } catch (err) {
        // Fallback for offline demo
        if (username.trim() === 'vikram' && password.trim() === 'eng123') {
          sessionStorage.setItem('engineerUsername', 'vikram');
          sessionStorage.setItem('engineerProjectIds', JSON.stringify(['BC-DEMO12']));
          sessionStorage.setItem('engineerRefId', 'BC-DEMO12');
          // Reset the demo project acceptance flag to false so they can test the acceptance flow!
          sessionStorage.setItem('demo_project_accepted', 'false');
          window.location.hash = '#engineer';
          window.location.reload();
        } else {
          setErrorMsg('Server offline. Offline demo: Use username "vikram" and password "eng123" to test.');
        }
      }
    }
    setSubmitting(false);
  };

  // Support local mock login for offline testing
  const handleOfflineLogin = () => {
    if (role === 'admin') {
      if (username === 'admin' && password === 'admin123') {
        localStorage.setItem('adminToken', 'mock_demo_token_123');
        window.location.hash = '#admin';
        window.location.reload();
      } else {
        setErrorMsg('Offline Demo Mode: Only username "admin" and password "admin123" are accepted.');
      }
    } else {
      if (username === 'vikram' && password === 'eng123') {
        sessionStorage.setItem('engineerUsername', 'vikram');
        sessionStorage.setItem('engineerProjectIds', JSON.stringify(['BC-DEMO12']));
        sessionStorage.setItem('engineerRefId', 'BC-DEMO12');
        sessionStorage.setItem('demo_project_accepted', 'false');
        window.location.hash = '#engineer';
        window.location.reload();
      } else {
        setErrorMsg('Offline Demo Mode: Only username "vikram" and password "eng123" are accepted.');
      }
    }
  };

  return (
    <div className="login-container container fade-in">
      <div className="login-card glass-panel">
        
        {/* Role Tab Selector */}
        <div style={{ display: 'flex', borderBottom: '1px solid rgba(255, 255, 255, 0.05)', marginBottom: '0.5rem' }}>
          <button
            type="button"
            onClick={() => {
              setRole('admin');
              setErrorMsg('');
              setUsername('');
              setPassword('');
            }}
            style={{
              flex: 1,
              background: 'transparent',
              border: 'none',
              borderBottom: role === 'admin' ? '2px solid var(--accent-gold)' : '2px solid transparent',
              color: role === 'admin' ? 'var(--accent-gold)' : 'var(--text-secondary)',
              padding: '0.75rem',
              fontWeight: 600,
              cursor: 'pointer',
              fontSize: '0.9rem',
              transition: 'var(--transition)'
            }}
          >
            🛡️ Admin Portal
          </button>
          <button
            type="button"
            onClick={() => {
              setRole('engineer');
              setErrorMsg('');
              setUsername('');
              setPassword('');
            }}
            style={{
              flex: 1,
              background: 'transparent',
              border: 'none',
              borderBottom: role === 'engineer' ? '2px solid var(--accent-gold)' : '2px solid transparent',
              color: role === 'engineer' ? 'var(--accent-gold)' : 'var(--text-secondary)',
              padding: '0.75rem',
              fontWeight: 600,
              cursor: 'pointer',
              fontSize: '0.9rem',
              transition: 'var(--transition)'
            }}
          >
            👷‍♂️ Engineer Desk
          </button>
        </div>

        <div className="login-header text-center">
          <span className="login-icon">{role === 'admin' ? '🔒' : '👷‍♂️'}</span>
          <h2 className="gold-gradient-text">
            {role === 'admin' ? 'Admin Login Portal' : 'Engineer Portal Access'}
          </h2>
          <p className="login-subtitle">
            {role === 'admin'
              ? 'Authenticate to access constructor settings, pricing packages, and manage client project requests.'
              : 'Authenticate to access assigned building projects, update site logs, and chat with customers.'}
          </p>
        </div>

        {errorMsg && (
          <div className="error-box">
            <p>{errorMsg}</p>
            {errorMsg.includes('offline') || errorMsg.includes('Offline') || errorMsg.includes('Server offline') ? (
              <button type="button" onClick={handleOfflineLogin} className="demo-login-btn">
                Log In Offline (Demo Mode)
              </button>
            ) : null}
          </div>
        )}

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label className="form-label">Username</label>
            <input
              type="text"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="form-input"
              placeholder={role === 'admin' ? 'e.g. admin' : 'e.g. vikram'}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="form-input"
              placeholder="••••••••"
            />
          </div>

          <button type="submit" disabled={submitting} className="gold-button w-100 justify-content-center mt-1">
            {submitting
              ? 'Authenticating...'
              : role === 'admin'
              ? 'Sign In to Dashboard'
              : 'Sign In to Workspace'}
          </button>
        </form>

        <div className="login-tips text-center">
          <p>Default credentials (Seeded):</p>
          <code>
            {role === 'admin'
              ? 'Username: admin | Password: admin123'
              : 'Username: vikram | Password: eng123'}
          </code>
        </div>
      </div>

      <style>{`
        .login-container {
          padding-top: 5rem;
          max-width: 480px;
          display: flex;
          justify-content: center;
        }
        .login-card {
          width: 100%;
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
          border-color: rgba(255,255,255,0.05);
        }
        .login-icon {
          font-size: 2.5rem;
          display: block;
          margin-bottom: 0.5rem;
        }
        .login-card h2 {
          font-size: 1.5rem;
        }
        .login-subtitle {
          font-size: 0.85rem;
          color: var(--text-secondary);
          margin-top: 0.25rem;
        }
        .login-form {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }
        .error-box {
          background-color: rgba(245, 101, 101, 0.1);
          border: 1px solid rgba(245, 101, 101, 0.3);
          color: var(--status-declined);
          padding: 0.75rem 1rem;
          border-radius: 6px;
          font-size: 0.85rem;
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }
        .demo-login-btn {
          background: var(--status-declined);
          color: #fff;
          border: none;
          padding: 0.35rem;
          border-radius: 4px;
          font-weight: 600;
          cursor: pointer;
          font-size: 0.8rem;
          transition: var(--transition);
        }
        .demo-login-btn:hover {
          opacity: 0.9;
        }
        .login-tips {
          font-size: 0.8rem;
          color: var(--text-muted);
          border-top: 1px solid rgba(255,255,255,0.05);
          padding-top: 1rem;
          margin-top: 0.5rem;
        }
        .login-tips code {
          background-color: rgba(0,0,0,0.3);
          padding: 0.2rem 0.4rem;
          border-radius: 4px;
          color: var(--accent-gold);
          display: inline-block;
          margin-top: 0.25rem;
        }
        .w-100 { width: 100%; }
        .mt-1 { margin-top: 0.5rem; }
      `}</style>
    </div>
  );
};

export default AdminLogin;
