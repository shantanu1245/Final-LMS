import React, { useState, useEffect } from 'react';
import Dashboard from './components/Dashboard/Dashboard';
import Sidebar from './components/Sidebar/Sidebar';
import Login from './components/Login/Login';
import './App.css';

const App = () => {
  const [activeTab, setActiveTab] = useState('Dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userData, setUserData] = useState(null);

  // Check authentication status when the app loads
// Check for existing authentication on app load
useEffect(() => {
  const storedUserKey = localStorage.getItem('userKey');
  const storedUserType = localStorage.getItem('userType');
  const storedUserData = localStorage.getItem('userData');
  
  if (storedUserKey && storedUserType && storedUserData) {
    // Verify the user data is still valid (optional)
    setIsAuthenticated(true);
    // You might want to set other user-related state here
  }
}, []);

  const handleTabChange = (tabName) => {
    setActiveTab(tabName);
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.body.classList.toggle('dark-mode', !darkMode);
  };

  const handleLoginSuccess = (user) => {
    setIsAuthenticated(true);
    setUserData(user);
    localStorage.setItem('isAuthenticated', 'true');
    localStorage.setItem('userData', JSON.stringify(user));
  };
  const handleLogout = () => {
    // Clear localStorage
    localStorage.removeItem('userKey');
    localStorage.removeItem('userType');
    localStorage.removeItem('userData');
    
    // Other logout logic...
    setIsAuthenticated(false);
    // Sign out from Firebase auth if needed
  };

  if (!isAuthenticated) {
    return (
      <Login 
        setIsAuthenticated={setIsAuthenticated} 
        setUserData={setUserData}
        onLoginSuccess={handleLoginSuccess}
      />
    );
  }

  return (
    <div className={`app-container ${sidebarOpen ? 'sidebar-open' : 'sidebar-closed'} ${darkMode ? 'dark-mode' : ''}`}>
      <Sidebar 
        onTabChange={handleTabChange} 
        activeTab={activeTab} 
        sidebarOpen={sidebarOpen}
        darkMode={darkMode}
        toggleDarkMode={toggleDarkMode}
        onLogout={handleLogout}
        userData={userData}
      />
      <div className="main-content">
<Dashboard 
  activeTab={activeTab} 
  darkMode={darkMode}
  onLogout={handleLogout}  // Add this line
/>
      </div>
    </div>
  );
};

export default App;