import React, { useState } from "react";
import { FaUserTie, FaChevronDown } from "react-icons/fa";
import TaskFormModal from "./TaskFormModal";
import "./Tasks.css";

const Tasks = () => {
  const [selectAll, setSelectAll] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    taskOwner: "",
    subject: "",
    dueDate: "",
    status: "Pending",
    priority: "Low",
  });

  const [rows, setRows] = useState([
    {
      id: 1,
      taskOwner: "John Doe",
      subject: "Task Subject",
      dueDate: "2025-05-30",
      status: "Pending",
      priority: "Medium",
      checked: false,
    },
  ]);

  const [filter, setFilter] = useState("Filter by");
  const [showFilterOptions, setShowFilterOptions] = useState(false);
  const [search, setSearch] = useState("");
  const [statusDropdownVisible, setStatusDropdownVisible] = useState(null);

  const handleSelectAll = () => {
    const updated = rows.map(row => ({ ...row, checked: !selectAll }));
    setRows(updated);
    setSelectAll(!selectAll);
  };

  const handleRowCheck = (id) => {
    const updated = rows.map(row =>
      row.id === id ? { ...row, checked: !row.checked } : row
    );
    setRows(updated);
    setSelectAll(updated.every(row => row.checked));
  };

  const handleStatusChange = (id, value) => {
    const updated = rows.map(row =>
      row.id === id ? { ...row, status: value } : row
    );
    setRows(updated);
    setStatusDropdownVisible(null);
  };

  const handleFilterSelect = (value) => {
    setFilter(value);
    setShowFilterOptions(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleCreateAgent = () => {
    const newAgent = {
      id: rows.length + 1,
      ...formData,
      checked: false
    };
    setRows([...rows, newAgent]);
    setFormData({
      taskOwner: "",
      subject: "",
      dueDate: "",
      status: "Pending",
      priority: "Low",
    });
    setShowModal(false);
  };

  const filteredRows = rows.filter(row => {
    if (filter === "Filter by" || !search.trim()) return true;
    const key = filter.toLowerCase().replace(/ /g, "");
    return row[key]?.toLowerCase().includes(search.toLowerCase());
  });

  return (
    <div className="tasks-container">
      <div className="tasks-filter-header">
        <h2><FaUserTie /> Tasks</h2>
        <button className="tasks-create-job-btn" onClick={() => setShowModal(true)}>✨ Add Task</button>
      </div>

      {showModal && (
        <TaskFormModal
          formData={formData}
          onChange={handleInputChange}
          onClose={() => setShowModal(false)}
          onCreate={handleCreateAgent}
        />
      )}

      <div className="tasks-filter-bar">
        <div className="tasks-filter-box">
          <label>Filters</label>
          <div
            className="tasks-dropdown-select"
            onClick={() => setShowFilterOptions(!showFilterOptions)}
          >
            <div className="tasks-status-badge">
              {filter} <FaChevronDown />
            </div>
            {showFilterOptions && (
              <div className="tasks-status-options">
                {['Task Owner', 'Subject', 'Due Date', 'Status'].map(option => (
                  <div
                    key={option}
                    className={`tasks-status-option ${filter === option ? "selected" : ""}`}
                    onClick={() => handleFilterSelect(option)}
                  >
                    {option}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        <div className="tasks-search-wrapper">
          <input
            type="text"
            placeholder="Search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button className="tasks-search-btn">🔍</button>
        </div>
      </div>

      <div className="tasks-table-section">
        <div className="tasks-table-header">
          <div>
            <input
              type="checkbox"
              checked={selectAll}
              onChange={handleSelectAll}
            />
          </div>
          <div>Task Owner</div>
          <div>Subject</div>
          <div>Due Date</div>
          <div>Status</div>
          <div>Priority</div>
          <div>Action</div>
        </div>

        {filteredRows.map(row => (
          <div className="tasks-table-row" key={row.id}>
            <div>
              <input
                type="checkbox"
                checked={row.checked}
                onChange={() => handleRowCheck(row.id)}
              />
            </div>
            <div>{row.taskOwner}</div>
            <div>{row.subject}</div>
            <div>{row.dueDate}</div>
            <div>{row.status}</div>
            <div>{row.priority}</div>
            <div className="tasks-row-actions">
              <span className="tasks-icon-btn" data-tooltip="Edit">✏️</span>
              <span className="tasks-icon-btn" data-tooltip="Delete">🗑️</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Tasks;
