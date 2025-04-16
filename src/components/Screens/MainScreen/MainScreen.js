import React from 'react';
import { 
  FaPhoneAlt, 
  FaCalendarAlt, 
  FaUsers, 
  FaChartLine, 
  FaShoppingBag,
  FaUserTie,
  FaFileSignature,
  FaDatabase,
  FaBell,
  FaTasks,
  FaMoneyBillWave,
  FaRegClock
} from 'react-icons/fa';
import './MainScreen.css';

// Card Component
const StatCard = ({ icon, title, value, trend, color }) => {
  return (
    <div className="stat-card" style={{ borderLeft: `4px solid ${color}` }}>
      <div className="card-icon" style={{ color }}>{icon}</div>
      <div className="card-content">
        <h4>{title}</h4>
        <p className="value">{value}</p>
        <p className={`trend ${trend > 0 ? 'positive' : 'negative'}`}>
          {trend > 0 ? `↑ ${trend}%` : `↓ ${Math.abs(trend)}%`}
        </p>
      </div>
    </div>
  );
};

// Activity Item Component
const ActivityItem = ({ type, time, person, status }) => {
  const icons = {
    call: <FaPhoneAlt />,
    meeting: <FaCalendarAlt />,
    task: <FaTasks />,
    lead: <FaUserTie />
  };

  return (
    <div className="activity-item">
      <div className="activity-icon">{icons[type]}</div>
      <div className="activity-details">
        <p className="activity-time">{time}</p>
        <h5>{person}</h5>
        <span className={`status ${status}`}>{status}</span>
      </div>
    </div>
  );
};

export default function MainScreen() {
  return (
    <div className="dashboard-container">
      {/* Header */}
      <header className="dashboard-header">
        <h2>CRM Dashboard</h2>
        <div className="header-actions">
          <button className="notification-btn">
            <FaBell />
            <span className="badge">3</span>
          </button>
          <div className="user-profile">
            <img src="/profile.jpg" alt="User" />
          </div>
        </div>
      </header>

      {/* Stats Grid */}
      <div className="stats-grid">
        <StatCard 
          icon={<FaUserTie />} 
          title="Total Leads" 
          value="248" 
          trend={12.5} 
          color="#4e73df" 
        />
        <StatCard 
          icon={<FaUsers />} 
          title="Active Agents" 
          value="18" 
          trend={5.2} 
          color="#1cc88a" 
        />
        <StatCard 
          icon={<FaPhoneAlt />} 
          title="Today's Calls" 
          value="47" 
          trend={-3.4} 
          color="#f6c23e" 
        />
        <StatCard 
          icon={<FaCalendarAlt />} 
          title="Scheduled Meetings" 
          value="23" 
          trend={8.1} 
          color="#e74a3b" 
        />
        <StatCard 
          icon={<FaFileSignature />} 
          title="Pending Contracts" 
          value="15" 
          trend={2.3} 
          color="#36b9cc" 
        />
        <StatCard 
          icon={<FaMoneyBillWave />} 
          title="Revenue (Monthly)" 
          value="$48,500" 
          trend={18.7} 
          color="#5a5c69" 
        />
      </div>

      {/* Main Content */}
      <div className="main-content-mainscreen">
        {/* Left Column */}
        <div className="content-column">
          {/* Upcoming Activities */}
          <div className="activity-card">
            <h3><FaRegClock /> Upcoming Activities</h3>
            <div className="activity-list">
              <ActivityItem 
                type="meeting" 
                time="10:30 AM" 
                person="Client: Tech Solutions Inc." 
                status="confirmed" 
              />
              <ActivityItem 
                type="call" 
                time="11:45 AM" 
                person="Lead: Sarah Johnson" 
                status="pending" 
              />
              <ActivityItem 
                type="task" 
                time="2:00 PM" 
                person="Contract Review" 
                status="urgent" 
              />
            </div>
          </div>

          {/* Performance Chart */}
          <div className="chart-card">
            <h3><FaChartLine /> Agent Performance</h3>
            <div className="chart-placeholder">
              {/* Chart would go here */}
              <p>Performance metrics visualization</p>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="content-column">
          {/* Recent Leads */}
          <div className="leads-card">
            <h3><FaUserTie /> Recent Leads</h3>
            <div className="leads-table">
              <table>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Company</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Michael Chen</td>
                    <td>Digital Innovations</td>
                    <td><span className="status new">New</span></td>
                    <td><button>Contact</button></td>
                  </tr>
                  <tr>
                    <td>Emily Rodriguez</td>
                    <td>Cloud Systems</td>
                    <td><span className="status contacted">Contacted</span></td>
                    <td><button>Follow Up</button></td>
                  </tr>
                  <tr>
                    <td>David Kim</td>
                    <td>AI Ventures</td>
                    <td><span className="status qualified">Qualified</span></td>
                    <td><button>Schedule</button></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="quick-actions">
            <h3>Quick Actions</h3>
            <div className="action-buttons">
              <button className="action-btn">
                <FaPhoneAlt /> New Call
              </button>
              <button className="action-btn">
                <FaCalendarAlt /> Schedule Meeting
              </button>
              <button className="action-btn">
                <FaUserTie /> Add Lead
              </button>
              <button className="action-btn">
                <FaFileSignature /> Create Contract
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
