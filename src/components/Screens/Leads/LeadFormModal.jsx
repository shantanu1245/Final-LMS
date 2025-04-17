import React, { useState } from "react";
import "./LeadFormModal.css";

const LeadFormModal = ({ formData, onChange, onClose, onCreate }) => {
  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <div className="modal-header">
          <h2>Create New Lead</h2>
          <button onClick={onClose} className="close-btn">×</button>
        </div>
        <div className="modal-body">
          <div className="form-group">
            <label>Client Name</label>
            <input
              type="text"
              name="clientName"
              placeholder="Enter client name"
              value={formData.clientName}
              onChange={onChange}
            />
          </div>
          <div className="form-group">
            <label>Title</label>
            <input
              type="text"
              name="title"
              placeholder="Enter title"
              value={formData.title}
              onChange={onChange}
            />
          </div>
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              name="email"
              placeholder="Enter email"
              value={formData.email}
              onChange={onChange}
            />
          </div>
          <div className="form-group">
            <label>Phone</label>
            <input
              type="tel"
              name="phone"
              placeholder="Enter phone number"
              value={formData.phone}
              onChange={onChange}
            />
          </div>
          <div className="form-group">
            <label>Industry</label>
            <input
              type="text"
              name="industry"
              placeholder="Enter industry"
              value={formData.industry}
              onChange={onChange}
            />
          </div>
          <div className="form-group">
            <label>Lead Source</label>
            <select
              name="leadSource"
              value={formData.leadSource}
              onChange={onChange}
            >
              <option value="Website">Website</option>
              <option value="Referral">Referral</option>
              <option value="Social Media">Social Media</option>
              <option value="Email Campaign">Email Campaign</option>
            </select>
          </div>
          <div className="form-group">
            <label>Lead Status</label>
            <select
              name="leadStatus"
              value={formData.leadStatus}
              onChange={onChange}
            >
              <option value="New">New</option>
              <option value="Contacted">Contacted</option>
              <option value="Qualified">Qualified</option>
              <option value="Closed">Closed</option>
            </select>
          </div>
          <div className="form-group">
            <label>Number of Employees</label>
            <input
              type="number"
              name="numberOfEmployees"
              placeholder="Enter employee count"
              value={formData.numberOfEmployees}
              onChange={onChange}
              min="0"
            />
          </div>
          <div className="form-group full-width">
            <label>Remarks</label>
            <textarea
              name="remark"
              placeholder="Enter remarks..."
              value={formData.remark}
              onChange={onChange}
            ></textarea>
          </div>
        </div>
        <div className="modal-footer">
          <button className="create-job-btn" onClick={onCreate}>
            ✨ Create
          </button>
        </div>
      </div>
    </div>
  );
};

export default LeadFormModal;