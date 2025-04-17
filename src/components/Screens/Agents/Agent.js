import React, { useState, useEffect } from "react";
import { FaUserTie, FaChevronDown, FaEdit, FaTrash, FaArrowLeft } from "react-icons/fa";
import { useSwipeable } from "react-swipeable";
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
  const [isMobile, setIsMobile] = useState(false);
  const [selectedAgent, setSelectedAgent] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [swipedItem, setSwipedItem] = useState(null);
  const [swipeOffset, setSwipeOffset] = useState(0);

  const [rows, setRows] = useState([
    {
      id: 1,
      name: "Rayhan Shaikh",
      email: "john@example.com",
      EmployeeId: "111",
      designation: "Project Manager",
      status: "Active",
      checked: false,
      phone: "+1 555-123-4567",
      joinDate: "2022-01-15",
      address: "123 Main St, New York, NY"
    },
    {
      id: 2,
      name: "Amruta Patil",
      email: "john@example.com",
      EmployeeId: "111",
      designation: "SD Developer",
      status: "Active",
      checked: false,
      phone: "+1 555-123-4567",
      joinDate: "2022-01-15",
      address: "123 Main St, New York, NY"
    },
    {
      id: 3,
      name: "Rohini Chougule",
      email: "john@example.com",
      EmployeeId: "111",
      designation: "Software-developer",
      status: "Active",
      checked: false,
      phone: "+1 555-123-4567",
      joinDate: "2022-01-15",
      address: "123 Main St, New York, NY"
    },
    {
      id: 2,
      name: "Dhanshree Leader",
      email: "john@example.com",
      EmployeeId: "111",
      designation: "Project Leader",
      status: "Active",
      checked: false,
      phone: "+1 555-123-4567",
      joinDate: "2022-01-15",
      address: "123 Main St, New York, NY"
    },
  ]);

  const [filter, setFilter] = useState("Filter by");
  const [showFilterOptions, setShowFilterOptions] = useState(false);
  const [search, setSearch] = useState("");
  const [statusDropdownVisible, setStatusDropdownVisible] = useState(null);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

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
      checked: false,
      joinDate: new Date().toISOString().split('T')[0],
      phone: formData.phone || "+1 555-000-0000"
    };
    setRows([...rows, newAgent]);
    setFormData({
      name: "",
      email: "",
      EmployeeId: "",
      designation: "",
      status: "Active",
      address: "",
      phone: ""
    });
    setShowModal(false);
  };

  const handleUpdateAgent = () => {
    const updated = rows.map(row =>
      row.id === selectedAgent.id ? { ...row, ...formData } : row
    );
    setRows(updated);
    setSelectedAgent(null);
    setEditMode(false);
    setShowModal(false);
  };

  const handleDeleteAgent = (id) => {
    setRows(rows.filter(row => row.id !== id));
    if (selectedAgent && selectedAgent.id === id) {
      setSelectedAgent(null);
    }
  };

  const filteredRows = rows.filter(row => {
    if (filter === "Filter by" || !search.trim()) return true;
    const key = filter.toLowerCase().replace(/ /g, "");
    return row[key]?.toLowerCase().includes(search.toLowerCase());
  });

  const handleAgentClick = (agent) => {
    setSelectedAgent(agent);
    setFormData({
      name: agent.name,
      email: agent.email,
      EmployeeId: agent.EmployeeId,
      designation: agent.designation,
      status: agent.status,
      address: agent.address,
      phone: agent.phone
    });
  };

  const handleBackToList = () => {
    setSelectedAgent(null);
    setEditMode(false);
  };

  const handleEdit = () => {
    setEditMode(true);
    setShowModal(true);
  };

  const swipeHandlers = useSwipeable({
    onSwiping: (eventData) => {
      if (Math.abs(eventData.deltaX) > 30) {
        setSwipedItem(eventData.event.target.closest('.mobile-agent-item').dataset.id);
        setSwipeOffset(eventData.deltaX);
      }
    },
    onSwipedLeft: (eventData) => {
      const id = parseInt(eventData.event.target.closest('.mobile-agent-item').dataset.id);
      setTimeout(() => {
        handleDeleteAgent(id);
      }, 300);
      setSwipedItem(null);
      setSwipeOffset(0);
    },
    onSwipedRight: (eventData) => {
      const id = parseInt(eventData.event.target.closest('.mobile-agent-item').dataset.id);
      const agent = rows.find(row => row.id === id);
      handleAgentClick(agent);
      setSwipedItem(null);
      setSwipeOffset(0);
    },
    onSwiped: () => {
      setTimeout(() => {
        setSwipedItem(null);
        setSwipeOffset(0);
      }, 300);
    },
    trackMouse: true
  });

  if (isMobile) {
    return (
      <div className="mobile-agent-container">
        {!selectedAgent ? (
          <>
            <div className="mobile-agent-header">
              <h2><FaUserTie /> Agents</h2>
              <button className="mobile-add-btn" onClick={() => setShowModal(true)}>+</button>
            </div>
            
            <div className="mobile-search-bar">
              <input
                type="text"
                placeholder="Search agents..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            
            <div className="mobile-agent-list">
              {filteredRows.map(row => (
                <div 
                  key={row.id}
                  className={`mobile-agent-item ${swipedItem === row.id.toString() ? (swipeOffset > 0 ? 'swipe-right' : 'swipe-left') : ''}`}
                  data-id={row.id}
                  style={{ transform: swipedItem === row.id.toString() ? `translateX(${swipeOffset}px)` : 'translateX(0)' }}
                  {...swipeHandlers}
                >
                  <div className="agent-content" onClick={() => handleAgentClick(row)}>
                    <div className="agent-avatar">{row.name.charAt(0)}</div>
                    <div className="agent-info">
                      <h3>{row.name}</h3>
                      <p>{row.designation}</p>
                    </div>
                    <div className={`agent-status ${row.status.toLowerCase()}`}>
                      {row.status}
                    </div>
                  </div>
                  <div className="agent-actions">
                    <div className="action edit" onClick={(e) => {
                      e.stopPropagation();
                      handleAgentClick(row);
                      handleEdit();
                    }}>
                      <FaEdit />
                    </div>
                    <div className="action delete" onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteAgent(row.id);
                    }}>
                      <FaTrash />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="mobile-agent-detail">
            <div className="detail-header">
              <button className="back-button" onClick={handleBackToList}>
                <FaArrowLeft />
              </button>
              <h2>Agent Details</h2>
              <button className="edit-button" onClick={handleEdit}>Edit</button>
            </div>
            
            <div className="agent-profile">
              <div className="profile-avatar">{selectedAgent.name.charAt(0)}</div>
              <h2>{selectedAgent.name}</h2>
              <p className="designation">{selectedAgent.designation}</p>
              <p className={`status ${selectedAgent.status.toLowerCase()}`}>
                {selectedAgent.status}
              </p>
            </div>
            
            <div className="agent-details">
              <div className="detail-item">
                <span className="label">Employee ID:</span>
                <span className="value">{selectedAgent.EmployeeId}</span>
              </div>
              <div className="detail-item">
                <span className="label">Email:</span>
                <span className="value">{selectedAgent.email}</span>
              </div>
              <div className="detail-item">
                <span className="label">Phone:</span>
                <span className="value">{selectedAgent.phone}</span>
              </div>
              <div className="detail-item">
                <span className="label">Join Date:</span>
                <span className="value">{selectedAgent.joinDate}</span>
              </div>
              <div className="detail-item">
                <span className="label">Address:</span>
                <span className="value">{selectedAgent.address}</span>
              </div>
            </div>
            
            <div className="action-buttons">
              <button className="assign-button">Assign Lead</button>
              <button 
                className="delete-button"
                onClick={() => {
                  handleDeleteAgent(selectedAgent.id);
                  handleBackToList();
                }}
              >
                Delete Agent
              </button>
            </div>
          </div>
        )}
        
        {showModal && (
          <AgentFormModal
            formData={formData}
            onChange={handleInputChange}
            onClose={() => {
              setShowModal(false);
              if (editMode) setEditMode(false);
            }}
            onCreate={editMode ? handleUpdateAgent : handleCreateAgent}
            isEdit={editMode}
          />
        )}
      </div>
    );
  }

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
          isEdit={false}
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
                <span 
                  className="icon-btn" 
                  data-tooltip="Edit"
                  onClick={() => {
                    handleAgentClick(row);
                    setEditMode(true);
                    setShowModal(true);
                  }}
                >
                  ✏️
                </span>
                <span 
                  className="icon-btn" 
                  data-tooltip="Delete"
                  onClick={() => handleDeleteAgent(row.id)}
                >
                  🗑️
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Agent;