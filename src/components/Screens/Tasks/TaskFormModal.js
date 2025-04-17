import React from "react";
import "./TaskFormModal.css";

const TaskFormModal = ({ formData, onChange, onClose, onCreate }) => {
  return (
    <div className="task-modal-overlay">
      <div className="task-modal-container">
        <div className="task-modal-header">
          <h2>Create New Task</h2>
          <button onClick={onClose} className="task-close-btn">&times;</button>
        </div>
        <div className="task-modal-body">
          <div className="form-group">
            <label>Task Owner</label>
            <input type="text" name="taskOwner" placeholder="Task Owner" value={formData.taskOwner} onChange={onChange} />
          </div>
          <div className="form-group">
            <label>Subject</label>
            <input type="text" name="subject" placeholder="Task Subject" value={formData.subject} onChange={onChange} />
          </div>
          <div className="form-group">
            <label>Due Date</label>
            <input type="date" name="dueDate" value={formData.dueDate} onChange={onChange} />
          </div>
          <div className="form-group">
            <label>Status</label>
            <select name="status" value={formData.status} onChange={onChange}>
              <option value="Pending">Pending</option>
              <option value="Completed">Completed</option>
            </select>
          </div>
          <div className="form-group">
            <label>Priority</label>
            <select name="priority" value={formData.priority} onChange={onChange}>
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>
          </div>
          <div className="form-group">
            <label>Reminder</label>
            <label className="switch">
              <input type="checkbox" name="reminder" checked={formData.reminder} onChange={(e) => onChange({ target: { name: 'reminder', value: e.target.checked } })} />
              <span className="slider round"></span>
            </label>
          </div>
          <div className="form-group full-width">
            <label>Description</label>
            <textarea name="description" placeholder="Enter description..." value={formData.description} onChange={onChange}></textarea>
          </div>
        </div>
        <div className="task-modal-footer">
          <button className="task-create-btn" onClick={onCreate}>✨ Create</button>
        </div>
      </div>
    </div>
  );
};

export default TaskFormModal;
