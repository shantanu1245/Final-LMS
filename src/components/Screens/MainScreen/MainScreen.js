import React, { useContext } from 'react';
import { 
  FaPhoneAlt, 
  FaCalendarAlt, 
  FaUsers, 
  FaChartLine, 
  FaUserTie,
  FaFileSignature,
  FaBell,
  FaTasks,
  FaMoneyBillWave,
  FaRegClock
} from 'react-icons/fa';
import './MainScreen.css';

// Card Component
const StatCard = ({ icon, title, value, trend, color }) => {
  return (
    <div className="stat-card" style={{ 
      borderLeft: `4px solid ${color}`,
      backgroundColor: 'var(--card-bg)'
    }}>
      <div className="card-icon" style={{ color }}>{icon}</div>
      <div className="card-content">
        <h4 style={{ color: 'var(--text-color)' }}>{title}</h4>
        <p className="value" style={{ color: 'var(--primary-color)' }}>{value}</p>
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
    <div className="activity-item" style={{ 
      backgroundColor: 'var(--card-bg)',
      borderBottom: '1px solid var(--border-color)'
    }}>
      <div className="activity-icon" style={{ color: 'var(--primary-color)' }}>
        {icons[type]}
      </div>
      <div className="activity-details">
        <p className="activity-time" style={{ color: 'var(--text-secondary)' }}>
          {time}
        </p>
        <h5 style={{ color: 'var(--text-color)' }}>{person}</h5>
        <span className={`status ${status}`}>{status}</span>
      </div>
    </div>
  );
};

export default function MainScreen() {

  return (
    <div className={`dashboard-container`}>
      {/* Header */}
      <header className="dashboard-header" style={{ 
        backgroundColor: 'var(--header-bg)',
        borderBottom: '1px solid var(--border-color)'
      }}>
        <h2 style={{ color: 'var(--text-color)' }}>CRM Dashboard</h2>
        <div className="header-actions">
          <button className="notification-btn" style={{
            backgroundColor: 'var(--card-bg)',
            color: 'var(--text-color)'
          }}>
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
          <div className="activity-card" style={{ 
            backgroundColor: 'var(--card-bg)',
            border: '1px solid var(--border-color)'
          }}>
            <h3 style={{ color: 'var(--text-color)' }}>
              <FaRegClock style={{ color: 'var(--primary-color)', marginRight: '8px' }} /> 
              Upcoming Activities
            </h3>
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
          <div className="chart-card" style={{ 
            backgroundColor: 'var(--card-bg)',
            border: '1px solid var(--border-color)'
          }}>
            <h3 style={{ color: 'var(--text-color)' }}>
              <FaChartLine style={{ color: 'var(--primary-color)', marginRight: '8px' }} /> 
              Agent Performance
            </h3>
            <div className="chart-placeholder" style={{ color: 'var(--text-secondary)' }}>
              {/* Chart would go here */}
              <p>Performance metrics visualization</p>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="content-column">
          {/* Recent Leads */}
          <div className="leads-card" style={{ 
            backgroundColor: 'var(--card-bg)',
            border: '1px solid var(--border-color)'
          }}>
            <h3 style={{ color: 'var(--text-color)' }}>
              <FaUserTie style={{ color: 'var(--primary-color)', marginRight: '8px' }} /> 
              Recent Leads
            </h3>
            <div className="leads-table">
              <table style={{ color: 'var(--text-color)' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                    <th>Name</th>
                    <th>Company</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { name: 'Michael Chen', company: 'Digital Innovations', status: 'new' },
                    { name: 'Emily Rodriguez', company: 'Cloud Systems', status: 'contacted' },
                    { name: 'David Kim', company: 'AI Ventures', status: 'qualified' }
                  ].map((lead, index) => (
                    <tr key={index} style={{ borderBottom: '1px solid var(--border-color)' }}>
                      <td>{lead.name}</td>
                      <td>{lead.company}</td>
                      <td>
                        <span className={`status ${lead.status}`}>{lead.status}</span>
                      </td>
                      <td>
                        <button style={{ 
                          backgroundColor: 'var(--primary-color)',
                          color: 'white'
                        }}>
                          {lead.status === 'new' ? 'Contact' : lead.status === 'contacted' ? 'Follow Up' : 'Schedule'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="quick-actions" style={{ 
            backgroundColor: 'var(--card-bg)',
            border: '1px solid var(--border-color)'
          }}>
            <h3 style={{ color: 'var(--text-color)' }}>Quick Actions</h3>
            <div className="action-buttons">
              {[
                { icon: <FaPhoneAlt />, label: 'New Call' },
                { icon: <FaCalendarAlt />, label: 'Schedule Meeting' },
                { icon: <FaUserTie />, label: 'Add Lead' },
                { icon: <FaFileSignature />, label: 'Create Contract' }
              ].map((action, index) => (
                <button 
                  key={index} 
                  className="action-btn"
                  style={{
                    backgroundColor: 'var(--primary-color)',
                    color: 'white'
                  }}
                >
                  {action.icon} {action.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}