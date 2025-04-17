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
    color: 'var(--text-color)'
  }}>
    Loading...
  </div>
);

const Dashboard = ({ activeTab }) => {
  
  const renderContent = () => {
    switch (activeTab) {
      case 'Dashboard':
        return (
          <Suspense fallback={<Loader />}>
            <MainScreen />
          </Suspense>
        );
      case 'Leads':
        return (
          <Suspense fallback={<Loader />}>
            <Leads />
          </Suspense>
        );
      case 'Agents':
        return (
          <Suspense fallback={<Loader />}>
            <Agent />
          </Suspense>
        );
      case 'Tasks':
        return (
          <Suspense fallback={<Loader />}>
            <Tasks />
          </Suspense>
        );
      case 'Meetings':
        return (
          <Suspense fallback={<Loader />}>
            <Meetings />
          </Suspense>
        );
      case 'Profile':
        return (
          <Suspense fallback={<Loader />}>
            <Profile />
          </Suspense>
        );
      default:
        return (
          <div className="content-box" style={{
            backgroundColor: 'var(--card-bg)',
            padding: '20px',
            borderRadius: '8px'
          }}>
            <h4>Dashboard Overview</h4>
            <p>Welcome to your Dashboard! Here's an overview of your activity.</p>
          </div>
        );
    }
  };

  return (
    <div className={`dashboard`} style={{
      backgroundColor: 'var(--bg-color)',
      color: 'var(--text-color)',
      minHeight: '100vh',
      transition: 'background-color 0.3s ease, color 0.3s ease'
    }}>
    
      {renderContent()}
    </div>
  );
};

export default Dashboard;