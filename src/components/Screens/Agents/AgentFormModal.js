import React, { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { ref, push, set } from "firebase/database";
import { database } from "../../../firebaseConfig";
import "./AgentFormModal.css";
import Swal from "sweetalert2";

const AgentFormModal = ({ onClose }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    designation: "",
    employeeid: "",
    dob: "",
    status: "Active",
    address: "",
    createdAt: new Date().toISOString()
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleCreateAgent = async () => {
    // Basic validation
    if (!formData.name || !formData.email || !formData.password) {
      Swal.fire('Error', 'Please fill all required fields', 'error');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      Swal.fire('Error', 'Passwords do not match', 'error');
      return;
    }

    // Get the admin's pushkey from localStorage
    const storedUserKey = localStorage.getItem("userKey");
    if (!storedUserKey) {
      Swal.fire('Error', 'User not authenticated', 'error');
      return;
    }

    setLoading(true);

    try {
      // Create a reference to the agents path under the admin
      const agentsRef = ref(database, `admins/${storedUserKey}/agents`);
      
      // Push a new agent with a generated key
      const newAgentRef = push(agentsRef);
      
      // Prepare agent data (excluding confirmPassword)
      const agentData = {
        ...formData,
        id: newAgentRef.key // Include the Firebase-generated ID
      };
      delete agentData.confirmPassword; // Remove confirmPassword before saving

      // Save the agent data
      await set(newAgentRef, agentData);

      Swal.fire('Success', 'Agent created successfully!', 'success');
      onClose();
    } catch (error) {
      console.error("Error creating agent:", error);
      Swal.fire('Error', 'Failed to create agent. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <div className="modal-header">
          <h2>Create New Agent</h2>
          <button onClick={onClose} className="close-btn">×</button>
        </div>
        <div className="modal-body">
          <div className="form-group">
            <label>Agent Name *</label>
            <input 
              type="text" 
              name="name" 
              placeholder="Enter name" 
              value={formData.name} 
              onChange={handleChange} 
              required 
            />
          </div>
          <div className="form-group">
            <label>Email *</label>
            <input 
              type="email" 
              name="email" 
              placeholder="Enter email" 
              value={formData.email} 
              onChange={handleChange} 
              required 
            />
          </div>
          <div className="form-group password-group">
            <label>Password *</label>
            <input 
              type={showPassword ? "text" : "password"} 
              name="password" 
              placeholder="Enter password" 
              value={formData.password} 
              onChange={handleChange} 
              required 
            />
            <span className="password-toggle" onClick={() => setShowPassword(!showPassword)}>
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>
          <div className="form-group password-group">
            <label>Confirm Password *</label>
            <input 
              type={showConfirmPassword ? "text" : "password"} 
              name="confirmPassword" 
              placeholder="Re-enter password" 
              value={formData.confirmPassword} 
              onChange={handleChange} 
              required 
            />
            <span className="password-toggle" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
              {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>
          <div className="form-group">
            <label>Designation</label>
            <input 
              type="text" 
              name="designation" 
              placeholder="Enter designation" 
              value={formData.designation} 
              onChange={handleChange} 
            />
          </div>
          <div className="form-group">
            <label>Employee Id</label>
            <input 
              type="text" 
              name="employeeid" 
              placeholder="Employee Id" 
              value={formData.employeeid} 
              onChange={handleChange} 
            />
          </div>
          <div className="form-group">
            <label>Date of Birth</label>
            <input 
              type="date" 
              name="dob" 
              value={formData.dob} 
              onChange={handleChange} 
            />
          </div>
          <div className="form-group">
            <label>Status</label>
            <select name="status" value={formData.status} onChange={handleChange}>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>
          <div className="form-group full-width">
            <label>Additional Address</label>
            <textarea 
              name="address" 
              placeholder="Enter address..." 
              value={formData.address} 
              onChange={handleChange}
            ></textarea>
          </div>
        </div>
        <div className="modal-footer">
          <button 
            className="create-job-btn" 
            onClick={handleCreateAgent}
            disabled={loading}
          >
            {loading ? 'Creating...' : '✨ Create'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AgentFormModal;