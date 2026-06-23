import React, { useState, useEffect } from 'react';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import MaterialGuide from './pages/MaterialGuide';
import Estimator from './pages/Estimator';
import Tracker from './pages/Tracker';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import ContactUs from './pages/ContactUs';
import { EngineerWorkspace } from './pages/EngineerWorkspace';

function App() {
  const [currentHash, setCurrentHash] = useState(window.location.hash || '#home');

  useEffect(() => {
    const handleHashChange = () => {
      setCurrentHash(window.location.hash || '#home');
      // Scroll to top on view change
      window.scrollTo(0, 0);
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const renderContent = () => {
    switch (currentHash) {
      case '#home':
        return <Home />;
      case '#materials':
        return <MaterialGuide />;
      case '#estimator':
        return <Estimator />;
      case '#tracker':
        return <Tracker />;
      case '#engineer':
        return <EngineerWorkspace />;
      case '#login':
        return <AdminLogin />;
      case '#admin':
        return <AdminDashboard />;
      case '#contact':
        return <ContactUs />;
      default:
        return <Home />;
    }
  };

  return (
    <AuthProvider>
      <div className="app-container">
        <Navbar currentHash={currentHash} />
        <main className="main-content">
          {renderContent()}
        </main>
        <Footer />
      </div>
    </AuthProvider>
  );
}

export default App;
