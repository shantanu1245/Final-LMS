import React, { useState } from "react";
import { FaUserTie, FaChevronDown } from "react-icons/fa";
import AgentFormModal from "./AgentFormModal";
import "./Agent.css";

const Agent = () => {
  const [selectAll, setSelectAll] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    EmployeeId: "",
    designation: "",
    status: "Active",
    address: ""
  });

  const [rows, setRows] = useState([
    {
      id: 1,
      name: "John Doe",
      email: "john@example.com",
      EmployeeId: "111",
      designation: "Sales Executive",
      status: "Active",
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
      name: "",
      email: "",
      EmployeeId: "",
      designation: "",
      status: "Active",
      address: ""
    });
    setShowModal(false);
  };

  const filteredRows = rows.filter(row => {
    if (filter === "Filter by" || !search.trim()) return true;
    const key = filter.toLowerCase().replace(/ /g, "");
    return row[key]?.toLowerCase().includes(search.toLowerCase());
  });

  return (
    <div className="jobs-container">
      <div className="filter-header">
        <h2><FaUserTie /> Agent</h2>
        <button className="create-job-btn" onClick={() => setShowModal(true)}>✨ Add Agent</button>
      </div>

      {showModal && (
        <AgentFormModal
          formData={formData}
          onChange={handleInputChange}
          onClose={() => setShowModal(false)}
          onCreate={handleCreateAgent}
        />
      )}

      <div className="filter-bar">
        <div className="filter-box">
          <label>Filters</label>
          <div
            className="dropdown-select"
            onClick={() => setShowFilterOptions(!showFilterOptions)}
          >
            <div className="status-badge">
              {filter} <FaChevronDown />
            </div>
            {showFilterOptions && (
              <div className="status-options">
                {['Agent Name', 'Email', 'EmployeeId', 'Designation', 'Status'].map(option => (
                  <div
                    key={option}
                    className={`status-option ${filter === option ? "selected" : ""}`}
                    onClick={() => handleFilterSelect(option)}
                  >
                    {option}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        <div className="search-wrapper">
          <input
            type="text"
            placeholder="Search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button className="search-btn">🔍</button>
        </div>
      </div>

      <div className="table-section">
        <div className="table-header">
          <div>
            <input
              type="checkbox"
              checked={selectAll}
              onChange={handleSelectAll}
            />
          </div>
          <div>Agent Name</div>
          <div>Email</div>
          <div>Employee Id</div>
          <div>Designation</div>
          <div>Status</div>
        </div>

        {filteredRows.map(row => (
          <div className="table-row" key={row.id}>
            <div>
              <input
                type="checkbox"
                checked={row.checked}
                onChange={() => handleRowCheck(row.id)}
              />
            </div>
            <div className="post-col">
              <div className="post-text">
                <div className="title">{row.name}</div>
                <div className="subtitle">Pawar Technology Services</div>
              </div>
            </div>
            <div>{row.email}</div>
            <div>{row.EmployeeId}</div>
            <div>{row.designation}</div>
            <div className="status-actions">
              <div className="status-dropdown">
                <div
                  className="status-badge"
                  onClick={() => setStatusDropdownVisible(row.id)}
                >
                  {row.status} <FaChevronDown />
                </div>
                {statusDropdownVisible === row.id && (
                  <div className="status-options">
                    {['Active', 'Inactive'].map(option => (
                      <div
                        key={option}
                        className={`status-option ${row.status === option ? "selected" : ""}`}
                        onClick={() => handleStatusChange(row.id, option)}
                      >
                        {option}
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <div className="row-actions">
                <span className="icon-btn" data-tooltip="Edit">✏️</span>
                <span className="icon-btn" data-tooltip="Delete">🗑️</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Agent;