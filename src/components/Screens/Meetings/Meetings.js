// Agent Table JSX Layout Update
import React, { useState } from "react";
import { FaUserTie, FaChevronDown } from "react-icons/fa";
import MeetingFormModal from "./MeetingFormModal";
import "./Meetings.css";

const Meetings = () => {
  const [selectAll, setSelectAll] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    fromDate: "",
    toDate: "",
    relatedTo: "",
    participants: "",
    host: "",
    status: "select",
  });

  const [rows, setRows] = useState([
    {
      id: 1,
      title: "Project Kickoff",
      fromDate: "2024-05-01",
      toDate: "2024-05-01",
      relatedTo: "Client A",
      participants: "5",
      host: "John Doe",
      status: "Contacted",
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
      title: "",
      fromDate: "",
      toDate: "",
      relatedTo: "",
      participants: "",
      host: "",
      status: "Active",
    });
    setShowModal(false);
  };

  const filteredRows = rows.filter(row => {
    if (filter === "Filter by" || !search.trim()) return true;
    const key = filter.toLowerCase().replace(/ /g, "");
    return row[key]?.toLowerCase().includes(search.toLowerCase());
  });

  return (
    <div className="meeting-container">
    <div className="meeting-filter-header">
      <h2><FaUserTie /> Meetings</h2>
      <button className="meeting-create-btn" onClick={() => setShowModal(true)}>
        ✨ Add New Meeting
      </button>
    </div>

    {showModal && (
      <MeetingFormModal
        formData={formData}
        onChange={handleInputChange}
        onClose={() => setShowModal(false)}
        onCreate={handleCreateAgent}
      />
    )}

    <div className="meeting-filter-bar">
      <div className="meeting-filter-box">
        <label>Filters</label>
        <div
          className="meeting-dropdown-select"
          onClick={() => setShowFilterOptions(!showFilterOptions)}
        >
          <div className="meeting-status-badge">
            {filter} <FaChevronDown />
          </div>
          {showFilterOptions && (
            <div className="meeting-status-options">
              {["Title", "From Date", "To Date", "Related To", "Participants", "Host", "Status"].map(option => (
                <div
                  key={option}
                  className={`meeting-status-option ${filter === option ? "selected" : ""}`}
                  onClick={() => handleFilterSelect(option)}
                >
                  {option}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      <div className="meeting-search-wrapper">
        <input
          type="text"
          placeholder="Search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button className="meeting-search-btn">🔍</button>
      </div>
    </div>

    <div className="meeting-table-section">
      <div className="meeting-table-header">
        <div><input type="checkbox" checked={selectAll} onChange={handleSelectAll} /></div>
        <div>Title</div>
        <div>From Date</div>
        <div>To Date</div>
        <div>Related To</div>
        <div>Participants</div>
        <div>Host</div>
        <div>Status</div>
      </div>

      {filteredRows.map(row => (
        <div className="meeting-table-row" key={row.id}>
          <div><input type="checkbox" checked={row.checked} onChange={() => handleRowCheck(row.id)} /></div>
          <div>{row.title}</div>
          <div>{row.fromDate}</div>
          <div>{row.toDate}</div>
          <div>{row.relatedTo}</div>
          <div>{row.participants}</div>
          <div>{row.host}</div>
          <div className="meeting-status-actions">
            <div className="meeting-status-dropdown">
              <div className="meeting-status-badge" onClick={() => setStatusDropdownVisible(row.id)}>
                {row.status} <FaChevronDown />
              </div>
              {statusDropdownVisible === row.id && (
                <div className="meeting-status-options">
                  {["Contacted", "Scheduled"].map(option => (
                    <div
                      key={option}
                      className={`meeting-status-option ${row.status === option ? "selected" : ""}`}
                      onClick={() => handleStatusChange(row.id, option)}
                    >
                      {option}
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="meeting-row-actions">
              <button className="meeting-icon-btn" data-tooltip="Edit">✏️</button>
              <button className="meeting-icon-btn" data-tooltip="Delete">🗑️</button>
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
  );
};

export default Meetings;
