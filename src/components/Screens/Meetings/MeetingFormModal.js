import React from "react";
import "./MeetingFormModal.css";

const MeetingFormModal = ({ formData, onChange, onClose, onCreate }) => {
  return (
    <div className="meeting-modal-overlay">
      <div className="meeting-modal-container">
        <div className="meeting-modal-header">
          <h2>Create New Meeting</h2>
          <button onClick={onClose} className="meeting-close-btn">&times;</button>
        </div>
        <div className="meeting-modal-body">
          <div className="form-group">
            <label>Title</label>
            <input type="text" name="title" placeholder="Meeting title" value={formData.title} onChange={onChange} />
          </div>
          <div className="form-group">
            <label>From Date</label>
            <input type="date" name="fromDate" value={formData.fromDate} onChange={onChange} />
          </div>
          <div className="form-group">
            <label>To Date</label>
            <input type="date" name="toDate" value={formData.toDate} onChange={onChange} />
          </div>
          <div className="form-group">
            <label>Related To</label>
            <input type="text" name="relatedTo" placeholder="e.g. Client A" value={formData.relatedTo} onChange={onChange} />
          </div>
          <div className="form-group">
            <label>Participants</label>
            <input type="number" name="participants" placeholder="Number of participants" value={formData.participants} onChange={onChange} />
          </div>
          <div className="form-group">
            <label>Host</label>
            <input type="text" name="host" placeholder="Hosted by" value={formData.host} onChange={onChange} />
          </div>
          <div className="form-group">
            <label>Status</label>
            <select name="status" value={formData.status} onChange={onChange}>
              <option value="Contacted">Contacted</option>
              <option value="Scheduled">Scheduled</option>
            </select>
          </div>
        </div>
        <div className="meeting-modal-footer">
          <button className="meeting-create-btn" onClick={onCreate}>✨ Create</button>
        </div>
      </div>
    </div>
  );
};

export default MeetingFormModal;
