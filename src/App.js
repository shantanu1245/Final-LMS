import React, { useState } from 'react';
import Dashboard from './components/Dashboard/Dashboard';
import Sidebar from './components/Sidebar/Sidebar';
import './App.css';

const App = () => {
  const [activeTab, setActiveTab] = useState('Dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

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

  return (
    <div className={`app-container ${sidebarOpen ? 'sidebar-open' : 'sidebar-closed'} ${darkMode ? 'dark-mode' : ''}`}>
      <Sidebar 
        onTabChange={handleTabChange} 
        activeTab={activeTab} 
        sidebarOpen={sidebarOpen}
        darkMode={darkMode}
        toggleDarkMode={toggleDarkMode}
      />
      <div className="main-content">
        <Dashboard activeTab={activeTab} darkMode={darkMode} />
      </div>
    </div>
  );
};

export default App;