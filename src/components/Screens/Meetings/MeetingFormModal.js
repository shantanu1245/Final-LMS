import React from "react";
import "./MeetingFormModal.css";

const MeetingFormModal = ({ 
  formData, 
  onChange, 
  onClose, 
  onCreate,
  onParticipantChange,
  onAddParticipant,
  onRemoveParticipant,
  newParticipantEmail
}) => {
  const handleSubmit = (e) => {
    e.preventDefault();
    onCreate();
  };

  return (
    <div className="meeting-modal-overlay">
      <div className="meeting-modal-container">
        <div className="meeting-modal-header">
          <h2>Create New Meeting</h2>
          <button onClick={onClose} className="meeting-close-btn">&times;</button>
        </div>
        <form onSubmit={handleSubmit} className="meeting-modal-body">
          <div className="form-group">
            <label>Title*</label>
            <input 
              type="text" 
              name="title" 
              placeholder="Meeting title" 
              value={formData.title} 
              onChange={onChange}
              required
            />
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label>Start Date*</label>
              <input 
                type="datetime-local" 
                name="fromDate" 
                value={formData.fromDate} 
                onChange={onChange}
                required
              />
            </div>
            <div className="form-group">
              <label>End Date*</label>
              <input 
                type="datetime-local" 
                name="toDate" 
                value={formData.toDate} 
                onChange={onChange}
                required
                min={formData.fromDate}
              />
            </div>
          </div>
          
          <div className="form-group">
            <label>Related To</label>
            <input
              type="text"
              name="relatedTo"
              placeholder="Client or project name"
              value={formData.relatedTo}
              onChange={onChange}
            />
          </div>
          
          <div className="form-group">
            <label>Participants</label>
            <div className="participants-input">
              <input
                type="email"
                placeholder="Add participant email"
                value={newParticipantEmail}
                onChange={onParticipantChange}
              />
              <button 
                type="button" 
                className="add-participant-btn"
                onClick={onAddParticipant}
                disabled={!newParticipantEmail}
              >
                Add
              </button>
            </div>
            {formData.participants.length > 0 && (
              <div className="participants-list">
                {formData.participants.map(email => (
                  <div key={email} className="participant-tag">
                    {email}
                    <button 
                      type="button"
                      className="remove-participant"
                      onClick={() => onRemoveParticipant(email)}
                    >
                      &times;
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          <div className="form-group">
            <label>Host*</label>
            <input
              type="text"
              name="host"
              value={formData.host}
              onChange={onChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label>Status*</label>
            <select 
              name="status" 
              value={formData.status} 
              onChange={onChange}
              required
            >
              <option value="Scheduled">Scheduled</option>
              <option value="Confirmed">Confirmed</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>
          
          <div className="meeting-modal-footer">
            <button 
              type="button" 
              className="meeting-cancel-btn" 
              onClick={onClose}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="meeting-create-btn"
            >
              Create Meeting
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MeetingFormModal;