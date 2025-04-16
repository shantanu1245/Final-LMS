import React from 'react';
import './Leads.css'; // Importing styles

const Leads = () => {
  // Dummy data for the Leads table
  const leadsData = [
    { name: 'Michael Chen', company: 'Digital Innovations', status: 'New', contact: 'Contact' },
    { name: 'Emily Rodriguez', company: 'Cloud Systems', status: 'Contacted', contact: 'Follow Up' },
    { name: 'David Kim', company: 'AI Ventures', status: 'Qualified', contact: 'Schedule' },
    { name: 'Sophia Brown', company: 'Tech Solutions', status: 'New', contact: 'Contact' },
    { name: 'James Lee', company: 'SmartTech', status: 'Contacted', contact: 'Follow Up' },
    { name: 'Olivia Davis', company: 'FutureWorks', status: 'Qualified', contact: 'Schedule' },
    { name: 'Liam White', company: 'InnovateX', status: 'New', contact: 'Contact' },
    { name: 'Charlotte Harris', company: 'CloudNext', status: 'Contacted', contact: 'Follow Up' },
    { name: 'Ethan Wilson', company: 'AI Ventures', status: 'Qualified', contact: 'Schedule' },
    { name: 'Ava Jackson', company: 'Tech Innovations', status: 'New', contact: 'Contact' }
  ];

  return (
    <div className="leads-container">
      <div className="leads-header">
        <h2>Leads</h2>
        <button className="create-lead-btn">Create a Lead</button>
      </div>
      
      <div className="leads-table-container">
        <table className="leads-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Company</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {leadsData.map((lead, index) => (
              <tr key={index}>
                <td>{lead.name}</td>
                <td>{lead.company}</td>
                <td className={`status ${lead.status.toLowerCase()}`}>{lead.status}</td>
                <td>
                  <button className="action-btn">{lead.contact}</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Leads;
