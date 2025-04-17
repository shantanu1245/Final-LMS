import React, { useState } from 'react';
import './Sidebar.css';
import { FaHome, FaBriefcase, FaUsers, FaRegUser, FaTasks, FaGlobeAmericas } from 'react-icons/fa';

const Sidebar = ({ onTabChange, activeTab, sidebarOpen }) => {
  const [hoveredItem, setHoveredItem] = useState(null);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });

  const handleMouseEnter = (item, event) => {
    const rect = event.currentTarget.getBoundingClientRect();
    setHoveredItem(item);
    setTooltipPosition({
      x: rect.left + rect.width / 2,
      y: window.innerHeight - rect.top + 10
    });
  };

  const handleMouseLeave = () => {
    setHoveredItem(null);
  };

  const menuItems = [
    { tab: 'Dashboard', icon: <FaHome size={20} /> },
    { tab: 'Leads', icon: <FaBriefcase size={20} /> },
    { tab: 'Agents', icon: <FaTasks size={20} /> },
    { tab: 'Tasks', icon: <FaUsers size={20} /> },
    { tab: 'Meetings', icon: <FaRegUser size={20} /> },
    { tab: 'Settings', icon: <FaGlobeAmericas size={20} /> },
    { tab: 'Profile', icon: <FaRegUser size={20} /> }
  ];

  return (
    <>
      {/* Desktop Sidebar */}
      <div className={`sidebar desktop-sidebar ${sidebarOpen ? 'open' : 'closed'}`}>
        <div className="sidebar-header">
          <div className="logo">
            <FaHome size={32} />
          </div>
          <h2>Dashboard</h2>
        </div>
        <ul className="sidebar-menu">
          {menuItems.map((item) => (
            <li 
              key={item.tab}
              className={activeTab === item.tab ? 'active' : ''}
              onClick={() => onTabChange(item.tab)}
            >
              {item.icon}
              <span>{item.tab}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Mobile Bottom Navigation */}
      <div className="mobile-bottom-nav">
        <ul className="bottom-nav-menu">
          {menuItems.map((item) => (
            <li 
              key={item.tab}
              className={activeTab === item.tab ? 'active' : ''}
              onClick={() => onTabChange(item.tab)}
              onMouseEnter={(e) => handleMouseEnter(item.tab, e)}
              onMouseLeave={handleMouseLeave}
            >
              {item.icon}
            </li>
          ))}
        </ul>
        
        {/* Mobile Tooltip */}
        {hoveredItem && (
          <div 
            className="mobile-tooltip"
            style={{
              left: `${tooltipPosition.x}px`,
              bottom: `${tooltipPosition.y}px`
            }}
          >
            {hoveredItem}
          </div>
        )}
      </div>
    </>
  );
};

export default Sidebar;