import React, { useState } from 'react';
import Dashboard from './components/Dashboard/Dashboard';
import Sidebar from './components/Sidebar/Sidebar';
import './App.css';

const App = () => {
  const [activeTab, setActiveTab] = useState('Dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(true); // Track sidebar state (open/closed)

  const handleTabChange = (tabName) => {
    setActiveTab(tabName);
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen); // Toggle sidebar visibility
  };

  return (
    <div className={`app-container ${sidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
      <Sidebar onTabChange={handleTabChange} activeTab={activeTab} sidebarOpen={sidebarOpen} />
      <div className="main-content">
        <button className="menu-toggle" onClick={toggleSidebar}>
          ☰
        </button>
        <Dashboard activeTab={activeTab} />
      </div>
    </div>
  );
};

export default App;
