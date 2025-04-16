import React from 'react';
import './Sidebar.css';
import { FaHome, FaBriefcase, FaUsers, FaRegUser, FaCog, FaTasks, FaFileAlt, FaGlobeAmericas, FaChartLine } from 'react-icons/fa';

const Sidebar = ({ onTabChange, activeTab, sidebarOpen }) => {
  return (
    <div className={`sidebar ${sidebarOpen ? 'open' : 'closed'}`}>
      <div className="sidebar-header">
        <div className="logo">
          <FaHome size={32} />
        </div>
        <h2>Dashboard</h2>
      </div>
      <ul className="sidebar-menu">
        <li className={activeTab === 'Dashboard' ? 'active' : ''} onClick={() => onTabChange('Dashboard')}>
          <FaHome size={20} />
          <span>Dashboard</span>
        </li>
        <li className={activeTab === 'Leads' ? 'active' : ''} onClick={() => onTabChange('Leads')}>
          <FaBriefcase size={20} />
          <span>Leads</span>
        </li>
        <li className={activeTab === 'Agents' ? 'active' : ''} onClick={() => onTabChange('Agents')}>
          <FaTasks size={20} />
          <span>Agents</span>
        </li>
        <li className={activeTab === 'Tasks' ? 'active' : ''} onClick={() => onTabChange('Tasks')}>
          <FaUsers size={20} />
          <span>Tasks</span>
        </li>
        <li className={activeTab === 'Meetings' ? 'active' : ''} onClick={() => onTabChange('Meetings')}>
          <FaRegUser size={20} />
          <span>Meetings</span>
        </li>
        <li className={activeTab === 'Settings' ? 'active' : ''} onClick={() => onTabChange('Settings')}>
          <FaGlobeAmericas size={20} />
          <span>Settings</span>
        </li>
        
        <li className={activeTab === 'Profile' ? 'active' : ''} onClick={() => onTabChange('Profile')}>
          <FaRegUser size={20} />
          <span>Profile</span>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
