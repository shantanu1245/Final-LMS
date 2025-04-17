import React, { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import "./AgentFormModal.css";

const AgentFormModal = ({ formData, onChange, onClose, onCreate }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <div className="modal-header">
          <h2>Create New Agent</h2>
          <button onClick={onClose} className="close-btn">×</button>
        </div>
        <div className="modal-body">
          <div className="form-group">
            <label>Agent Name</label>
            <input type="text" name="name" placeholder="Enter name" value={formData.name} onChange={onChange} />
          </div>
          <div className="form-group">
            <label>Email</label>
            <input type="email" name="email" placeholder="Enter email" value={formData.email} onChange={onChange} />
          </div>
          <div className="form-group password-group">
            <label>Password</label>
            <input type={showPassword ? "text" : "password"} name="password" placeholder="Enter password" value={formData.password} onChange={onChange} />
            <span className="password-toggle" onClick={() => setShowPassword(!showPassword)}>
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>
          <div className="form-group password-group">
            <label>Confirm Password</label>
            <input type={showConfirmPassword ? "text" : "password"} name="confirmPassword" placeholder="Re-enter password" value={formData.confirmPassword || ""} onChange={onChange} />
            <span className="password-toggle" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
              {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>
          <div className="form-group">
            <label>Designation</label>
            <input type="text" name="designation" placeholder="Enter designation" value={formData.designation} onChange={onChange} />
          </div>
          <div className="form-group">
            <label>Employee Id</label>
            <input type="text" name="employeeid" placeholder="Employee Id" value={formData.employeeid} onChange={onChange} />
          </div>
          <div className="form-group">
            <label>Date of Birth</label>
            <input type="date" name="dob" value={formData.dob || ""} onChange={onChange} />
          </div>
          <div className="form-group">
            <label>Status</label>
            <select name="status" value={formData.status} onChange={onChange}>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>
          <div className="form-group full-width">
            <label>Additional Address</label>
            <textarea name="address" placeholder="Enter address..." value={formData.address} onChange={onChange}></textarea>
          </div>
        </div>
        <div className="modal-footer">
          <button className="create-job-btn" onClick={onCreate}>✨ Create</button>
        </div>
      </div>
    </div>
  );
};

export default AgentFormModal;
