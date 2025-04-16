import React, { Suspense } from 'react';

// Lazy-load the components
const MainScreen = React.lazy(() => import('../Screens/MainScreen/MainScreen'));
const Agent = React.lazy(() => import('../Screens/Agents/Agent'));
const Leads = React.lazy(() => import('../Screens/Leads/Leads'));
const Tasks = React.lazy(() => import('../Screens/Tasks/Tasks'));
const Meetings = React.lazy(() => import('../Screens/Meetings/Meetings'));
const Profile = React.lazy(() => import('../Screens/Profile/Profile'));

const Dashboard = ({ activeTab }) => {
  const renderContent = () => {
    switch (activeTab) {
      case 'Dashboard':
        return (
          <Suspense fallback={<div>Loading...</div>}>
            <MainScreen />
          </Suspense>
        );
      case 'Leads':
        return (
          <Suspense fallback={<div>Loading...</div>}>
            <Leads />
          </Suspense>
        );
      case 'Agents':
        return (
          <Suspense fallback={<div>Loading...</div>}>
            <Agent />
          </Suspense>
        );
      case 'Tasks':
        return (
          <Suspense fallback={<div>Loading...</div>}>
            <Tasks />
          </Suspense>
        );
      case 'Meetings':
        return (
          <Suspense fallback={<div>Loading...</div>}>
            <Meetings />
          </Suspense>
        );
      case 'Profile':
        return (
          <Suspense fallback={<div>Loading...</div>}>
            <Profile />
          </Suspense>
        );
      default:
        return (
          <div className="content-box">
            <h4>Dashboard Overview</h4>
            <p>Welcome to your Dashboard! Here's an overview of your activity.</p>
          </div>
        );
    }
  };

  return (
    <div className="dashboard">
      {renderContent()}
    </div>
  );
};

export default Dashboard;
