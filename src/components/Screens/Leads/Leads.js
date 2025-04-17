import React, { useState } from "react";
import { FaUserTie, FaChevronDown, FaWhatsapp, FaPhoneAlt, FaStickyNote ,FaBriefcase} from "react-icons/fa";
import LeadFormModal from "./LeadFormModal";
import "./Leads.css";

const Leads = () => {
  const [selectAll, setSelectAll] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [filter, setFilter] = useState("Filter by");
  const [showFilterOptions, setShowFilterOptions] = useState(false);
  const [search, setSearch] = useState("");
  const [formData, setFormData] = useState({
    clientName: "",
    title: "",
    email: "",
    phone: "",
    remark: "",
    industry: "",
    leadSource: "",
    leadStatus: "",
    numberOfEmployees: "",
    status: "Active",
  });

  const [rows, setRows] = useState([
    {
      id: 1,
      clientName: "John Doe",
      title: "CEO",
      email: "john@example.com",
      phone: "9876543210",
      remark: "Interested in partnership",
      industry: "Technology",
      leadSource: "Website",
      leadStatus: "New",
      numberOfEmployees: "50",
      status: "Active",
      checked: false,
    },
    // Add more sample data if needed
  ]);

  const handleSelectAll = () => {
    const updated = rows.map((row) => ({ ...row, checked: !selectAll }));
    setRows(updated);
    setSelectAll(!selectAll);
  };

  const filteredRows = rows.filter(row => {
    if (filter === "Filter by" || !search.trim()) return true;
    const filterKey = filter.toLowerCase().replace(/ /g, "");
    return String(row[filterKey])?.toLowerCase().includes(search.toLowerCase());
  });

  return (
    <div className="lead-container">
      <div className="lead-filter-header">
        <h2> <FaBriefcase className="lead-header-icon" /> Leads</h2>
        <button 
          className="lead-create-btn"
          onClick={() => setShowModal(true)}
          aria-label="Add new lead"
        >
         ✨ Add Lead
        </button>
      </div>

      <div className="lead-filter-bar">
        <div className="lead-filter-box">
          <span className="lead-filter-label">Filter by:</span>
          <div 
            className="lead-dropdown"
            onClick={() => setShowFilterOptions(!showFilterOptions)}
          >
            <div className="lead-filter-badge">
              {filter}
              <FaChevronDown className="lead-dropdown-chevron" />
            </div>
            {showFilterOptions && (
              <div className="lead-filter-options">
                {["Name", "Title", "Email", "Phone", "Remark", "Industry", 
                  "Source", "Status", "Employees"].map((option) => (
                  <div
                    key={option}
                    className={`lead-filter-option ${filter === option ? "selected" : ""}`}
                    onClick={() => {
                      setFilter(option);
                      setShowFilterOptions(false);
                    }}
                  >
                    {option}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="lead-search-wrapper">
          <input
            type="text"
            placeholder="Search leads..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="lead-search-input"
            aria-label="Search leads"
          />
          <button className="lead-search-btn" aria-label="Search">
            🔍
          </button>
        </div>
      </div>

      <div className="lead-table-section">
        <div className="lead-table-header">
          <div className="lead-checkbox-cell">
            <input 
              type="checkbox" 
              checked={selectAll}
              onChange={handleSelectAll}
              aria-label="Select all leads"
            />
          </div>
          <div>Name</div>
          <div>Title</div>
          <div>Email</div>
          <div>Phone</div>
          <div>Remark</div>
          <div>Industry</div>
          <div>Source</div>
          <div>Status</div>
          <div>Employees</div>
          <div>Actions</div>
        </div>

        {filteredRows.map((row) => (
          <div className="lead-table-row" key={row.id}>
            <div className="lead-checkbox-cell">
              <input
                type="checkbox"
                checked={row.checked}
                onChange={() => {
                  const updated = rows.map(r => 
                    r.id === row.id ? { ...r, checked: !r.checked } : r
                  );
                  setRows(updated);
                }}
                aria-label={`Select ${row.clientName}`}
              />
            </div>
            <div className="lead-client-name">{row.clientName}</div>
            <div>{row.title}</div>
            <div className="lead-email">{row.email}</div>
            <div className="lead-phone">{row.phone}</div>
            <div className="lead-remark">{row.remark}</div>
            <div>{row.industry}</div>
            <div>{row.leadSource}</div>
            <div>
              <span className={`lead-status-badge ${row.leadStatus.toLowerCase()}`}>
                {row.leadStatus}
              </span>
            </div>
            <div>{row.numberOfEmployees}</div>
            <div className="lead-row-actions">
  <button className="lead-icon-btn always-visible" data-tooltip="Call client">
    <FaPhoneAlt />
  </button>
  <button className="lead-icon-btn always-visible" data-tooltip="WhatsApp">
    <FaWhatsapp />
  </button>
  <button className="lead-icon-btn always-visible" data-tooltip="Add note">
    <FaStickyNote />
  </button>
  
  <div className="lead-action-group">
    <button className="lead-icon-btn" data-tooltip="Edit">
      ✏️
    </button>
    <button className="lead-icon-btn" data-tooltip="Delete">
      🗑️
    </button>
  </div>
</div>
          </div>
        ))}
      </div>

      {showModal && (
        <LeadFormModal
          formData={formData}
          onChange={(e) => {
            setFormData({
              ...formData,
              [e.target.name]: e.target.value
            });
          }}
          onClose={() => setShowModal(false)}
          onCreate={() => {
            // Add your create logic here
            setShowModal(false);
          }}
        />
      )}
    </div>
  );
};

export default Leads;