import React, { Suspense } from 'react';

// Lazy-load the components with proper error boundaries
const MainScreen = React.lazy(() => import('../Screens/MainScreen/MainScreen'));
const Agent = React.lazy(() => import('../Screens/Agents/Agent'));
const Leads = React.lazy(() => import('../Screens/Leads/Leads'));
const Tasks = React.lazy(() => import('../Screens/Tasks/Tasks'));
const Meetings = React.lazy(() => import('../Screens/Meetings/Meetings'));
const Profile = React.lazy(() => import('../Screens/Profile/Profile'));

// Fallback component for Suspense
const Loader = () => (
  <div className="loader" style={{ 
    padding: '20px', 
    textAlign: 'center',
    color: 'var(--text-color)',
    backgroundColor: 'var(--card-bg)',
    borderRadius: '8px',
    margin: '20px',
    boxShadow: '0 2px 4px var(--shadow-color)'
  }}>
    <div className="loading-spinner"></div>
    <p>Loading content...</p>
  </div>
);

const Dashboard = ({ activeTab, darkMode, onLogout }) => {
  const renderContent = () => {
    switch (activeTab) {
      case 'Dashboard':
        return (
          <Suspense fallback={<Loader />}>
            <MainScreen darkMode={darkMode} />
          </Suspense>
        );
      case 'Leads':
        return (
          <Suspense fallback={<Loader />}>
            <Leads darkMode={darkMode} />
          </Suspense>
        );
      case 'Agents':
        return (
          <Suspense fallback={<Loader />}>
            <Agent darkMode={darkMode} />
          </Suspense>
        );
      case 'Tasks':
        return (
          <Suspense fallback={<Loader />}>
            <Tasks darkMode={darkMode} />
          </Suspense>
        );
      case 'Meetings':
        return (
          <Suspense fallback={<Loader />}>
            <Meetings darkMode={darkMode} />
          </Suspense>
        );
      case 'Profile':
        return (
          <Suspense fallback={<Loader />}>
            <Profile darkMode={darkMode} />
          </Suspense>
        );
      default:
        return (
          <div className="content-box" style={{
            backgroundColor: 'var(--card-bg)',
            borderRadius: '8px',
            margin: '20px',
            boxShadow: '0 2px 4px var(--shadow-color)'
          }}>
            <h4 style={{ color: 'var(--text-color)' }}>Dashboard Overview</h4>
            <p style={{ color: 'var(--text-secondary)' }}>Welcome to your Dashboard! Here's an overview of your activity.</p>
          </div>
        );
    }
  };

  const handleLogout = () => {
    // Clear any user data from localStorage if needed
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('userData');
    
    // Call the parent's logout function
    if (onLogout) {
      onLogout();
    }
  };

  return (
    <div className={`dashboard ${darkMode ? 'dark-mode' : ''}`} style={{
      backgroundColor: 'var(--bg-color)',
      color: 'var(--text-color)',
      minHeight: '100vh',
      transition: 'background-color 0.3s ease, color 0.3s ease',
      position: 'relative' // Added for logout button positioning
    }}>
      {/* Logout Button */}
      <button 
        onClick={handleLogout}
        style={{
          position: 'absolute',
          top: '20px',
          right: '20px',
          padding: '8px 16px',
          backgroundColor: darkMode ? '#ff4444' : '#dc3545',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
          fontWeight: 'bold',
          transition: 'background-color 0.3s ease',
          zIndex: 1000
        }}
        onMouseOver={(e) => e.target.style.backgroundColor = darkMode ? '#ff6666' : '#e74c3c'}
        onMouseOut={(e) => e.target.style.backgroundColor = darkMode ? '#ff4444' : '#dc3545'}
      >
        Logout
      </button>
      
      {renderContent()}
    </div>
  );
};

export default Dashboard;