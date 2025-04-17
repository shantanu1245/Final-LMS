import React, { useState, useEffect, useRef } from "react";
import { 
  FaUserTie, 
  FaChevronDown, 
  FaWhatsapp, 
  FaPhoneAlt, 
  FaStickyNote,
  FaBriefcase,
  FaFileImport,
  FaFileExport,
  FaEllipsisV,
  FaTimes,
  FaCheck,
  FaClock,
  FaTrash,
  FaEdit,
  FaSave,
  FaBan
} from "react-icons/fa";
import LeadFormModal from "./LeadFormModal";
import "./Leads.css";

const Leads = () => {
  const [selectAll, setSelectAll] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [filter, setFilter] = useState("Filter by");
  const [showFilterOptions, setShowFilterOptions] = useState(false);
  const [search, setSearch] = useState("");
  const [mobileView, setMobileView] = useState("list"); // 'list' or 'detail'
  const [selectedLead, setSelectedLead] = useState(null);
  const [showMobileActions, setShowMobileActions] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editFormData, setEditFormData] = useState({});
  const [noteInput, setNoteInput] = useState("");
  const [showNoteInput, setShowNoteInput] = useState(false);

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

  // New state for swipe and hold functionality
  const [swipedLeadId, setSwipedLeadId] = useState(null);
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);
  const [longPressTimer, setLongPressTimer] = useState(null);
  const [showStatusOptions, setShowStatusOptions] = useState(null);
  const [showNoteOptions, setShowNoteOptions] = useState(null);
  
  // Predefined notes
  const predefinedNotes = [
    "Will call back later",
    "Interested in demo",
    "Requested pricing",
    "Not interested now",
    "Follow up next week"
  ];

  // Status options
  const statusOptions = ["New", "Contacted", "Qualified", "Lost"];

  // Refs for mobile list items
  const leadItemRefs = useRef([]);
  const noteInputRef = useRef(null);

  // Handle touch start for swipe
  const handleTouchStart = (e, id) => {
    setTouchStart(e.targetTouches[0].clientX);
    setSwipedLeadId(id);
    
    // Start long press timer
    const timer = setTimeout(() => {
      setShowStatusOptions(id);
      setLongPressTimer(null);
    }, 800);
    setLongPressTimer(timer);
  };

  // Handle touch move for swipe
  const handleTouchMove = (e, id) => {
    if (!touchStart) return;
    setTouchEnd(e.targetTouches[0].clientX);
    
    // Cancel long press if user is swiping
    if (longPressTimer) {
      clearTimeout(longPressTimer);
      setLongPressTimer(null);
    }
  };

  // Handle touch end
  const handleTouchEnd = (id) => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;
    
    if (isLeftSwipe) {
      // Swipe left to delete
      confirmDeleteLead(id);
    } else if (isRightSwipe) {
      // Swipe right to mark as contacted
      updateLeadStatus(id, "Contacted");
    }
    
    setTouchStart(null);
    setTouchEnd(null);
    setSwipedLeadId(null);
    
    // Clear long press timer if it exists
    if (longPressTimer) {
      clearTimeout(longPressTimer);
      setLongPressTimer(null);
    }
  };

  // Delete lead confirmation
  const confirmDeleteLead = (id) => {
    if (window.confirm("Are you sure you want to delete this lead?")) {
      setRows(rows.filter(row => row.id !== id));
      if (selectedLead && selectedLead.id === id) {
        setMobileView("list");
        setSelectedLead(null);
      }
    }
  };

  // Update lead status
  const updateLeadStatus = (id, newStatus) => {
    setRows(rows.map(row => 
      row.id === id ? { ...row, leadStatus: newStatus } : row
    ));
    setShowStatusOptions(null);
    
    // Update selected lead if it's the one being viewed
    if (selectedLead && selectedLead.id === id) {
      setSelectedLead({ ...selectedLead, leadStatus: newStatus });
    }
  };

  // Add predefined note
  const addPredefinedNote = (id, note) => {
    setRows(rows.map(row => 
      row.id === id ? { ...row, remark: note } : row
    ));
    setShowNoteOptions(null);
    
    // Update selected lead if it's the one being viewed
    if (selectedLead && selectedLead.id === id) {
      setSelectedLead({ ...selectedLead, remark: note });
    }
  };

  // Calculate swipe transform
  const getSwipeTransform = (id) => {
    if (swipedLeadId !== id || !touchEnd) return 'translateX(0)';
    
    const distance = touchStart - touchEnd;
    return `translateX(${-distance}px)`;
  };

  // Close all options when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest('.status-options') && !e.target.closest('.note-options')) {
        setShowStatusOptions(null);
        setShowNoteOptions(null);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, []);

  // Focus note input when shown
  useEffect(() => {
    if (showNoteInput && noteInputRef.current) {
      noteInputRef.current.focus();
    }
  }, [showNoteInput]);

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
      lastContact: "2 hours ago",
    },
    {
      id: 2,
      clientName: "Jane Smith",
      title: "Marketing Director",
      email: "jane@example.com",
      phone: "9876543211",
      remark: "Requested demo",
      industry: "Finance",
      leadSource: "Referral",
      leadStatus: "Contacted",
      numberOfEmployees: "200",
      status: "Active",
      checked: false,
      lastContact: "1 day ago",
    },
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

  const handleLeadClick = (lead) => {
    setSelectedLead(lead);
    setEditFormData({ ...lead }); // Initialize edit form with lead data
    setMobileView("detail");
    setIsEditing(false);
    setShowNoteInput(false);
    setNoteInput("");
  };

  const handleBackToList = () => {
    setMobileView("list");
    setSelectedLead(null);
    setIsEditing(false);
    setShowNoteInput(false);
  };

  const handleImportLeads = () => {
    alert("Import leads functionality would go here");
  };

  const handleExportLeads = () => {
    alert("Export leads functionality would go here");
  };

  const handleEditClick = () => {
    setIsEditing(true);
    setShowNoteInput(false);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditFormData({ ...selectedLead }); // Reset to original data
  };

  const handleSaveEdit = () => {
    const updatedRows = rows.map(row => 
      row.id === selectedLead.id ? { ...editFormData } : row
    );
    setRows(updatedRows);
    setSelectedLead({ ...editFormData });
    setIsEditing(false);
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddNoteClick = () => {
    setShowNoteInput(true);
    setIsEditing(false);
    setNoteInput(selectedLead.remark || "");
  };

  const handleSaveNote = () => {
    const updatedNote = noteInput.trim();
    const updatedRows = rows.map(row => 
      row.id === selectedLead.id ? { ...row, remark: updatedNote } : row
    );
    setRows(updatedRows);
    setSelectedLead(prev => ({ ...prev, remark: updatedNote }));
    setShowNoteInput(false);
  };

  const handleCancelNote = () => {
    setShowNoteInput(false);
    setNoteInput("");
  };

  const handlePredefinedNoteClick = (note) => {
    const updatedRows = rows.map(row => 
      row.id === selectedLead.id ? { ...row, remark: note } : row
    );
    setRows(updatedRows);
    setSelectedLead(prev => ({ ...prev, remark: note }));
    setShowNoteInput(false);
  };

  const renderStatusBadge = (status) => {
    let icon, color;
    switch(status.toLowerCase()) {
      case 'new':
        icon = <FaClock />;
        color = '#ff9800';
        break;
      case 'contacted':
        icon = <FaPhoneAlt />;
        color = '#2196f3';
        break;
      case 'qualified':
        icon = <FaCheck />;
        color = '#4caf50';
        break;
      default:
        icon = <FaClock />;
        color = '#9e9e9e';
    }
    return (
      <span 
        className="lead-status-badge" 
        style={{ backgroundColor: color }}
      >
        {icon} {status}
      </span>
    );
  };

  const renderEditableField = (fieldName, label, value, type = "text") => {
    return (
      <div className="detail-row">
        <span>{label}:</span>
        {isEditing ? (
          <input
            type={type}
            name={fieldName}
            value={editFormData[fieldName] || ""}
            onChange={handleEditChange}
            className="editable-input"
          />
        ) : (
          <span>{value}</span>
        )}
      </div>
    );
  };

  const renderStatusSelector = () => {
    if (!isEditing) return null;
    
    return (
      <div className="detail-row">
        <span>Status:</span>
        <select
          name="leadStatus"
          value={editFormData.leadStatus || "New"}
          onChange={handleEditChange}
          className="editable-select"
        >
          {statusOptions.map(option => (
            <option key={option} value={option}>{option}</option>
          ))}
        </select>
      </div>
    );
  };


  return (
    <div className="lead-container">
      {/* Desktop View */}
      <div className="desktop-view">
        <div className="lead-filter-header">
          <h2> <FaBriefcase className="lead-header-icon" /> Leads</h2>
          <div className="lead-header-actions">
            <button 
              className="lead-import-btn"
              onClick={handleImportLeads}
              aria-label="Import leads"
            >
              <FaFileImport /> Import
            </button>
            <button 
              className="lead-export-btn"
              onClick={handleExportLeads}
              aria-label="Export leads"
            >
              <FaFileExport /> Export
            </button>
            <button 
              className="lead-create-btn"
              onClick={() => setShowModal(true)}
              aria-label="Add new lead"
            >
              +Add Lead
            </button>
          </div>
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
      </div>

     {/* Mobile View */}
     <div className="mobile-view">
        {mobileView === "list" ? (
          <>
            <div className="mobile-lead-header">
              <h2><FaBriefcase /> Leads</h2>
              <div className="mobile-header-actions">
                <button 
                  className="mobile-action-btn"
                  onClick={() => setShowMobileActions(!showMobileActions)}
                >
                  <FaEllipsisV />
                </button>
                {showMobileActions && (
                  <div className="mobile-actions-menu">
                    <button onClick={handleImportLeads}>
                      <FaFileImport /> Import
                    </button>
                    <button onClick={handleExportLeads}>
                      <FaFileExport /> Export
                    </button>
                    <button onClick={() => setShowModal(true)}>
                      ✨ Add Lead
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div className="mobile-search-filter">
              <div className="mobile-search-bar">
                <input
                  type="text"
                  placeholder="Search leads..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
                <button>🔍</button>
              </div>
              <div className="mobile-filter-dropdown">
                <select 
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                >
                  <option value="Filter by">Filter by</option>
                  {["Name", "Title", "Email", "Phone", "Remark", "Industry", 
                    "Source", "Status", "Employees"].map((option) => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="mobile-lead-list">
              {filteredRows.map((lead, index) => (
                <div 
                  key={lead.id}
                  ref={el => leadItemRefs.current[index] = el}
                  className={`mobile-lead-item ${swipedLeadId === lead.id ? 'swiping' : ''}`}
                  onClick={() => {
                    if (!touchEnd && !showStatusOptions && !showNoteOptions) {
                      handleLeadClick(lead);
                    }
                  }}
                  onTouchStart={(e) => handleTouchStart(e, lead.id)}
                  onTouchMove={(e) => handleTouchMove(e, lead.id)}
                  onTouchEnd={() => handleTouchEnd(lead.id)}
                  style={{ transform: getSwipeTransform(lead.id) }}
                >
                  <div className="lead-content-wrapper">
                    <div className="lead-item-header">
                      <div className="lead-avatar">
                        <FaUserTie />
                      </div>
                      <div className="lead-info">
                        <h3>{lead.clientName}</h3>
                        <p>{lead.title} • {lead.industry}</p>
                      </div>
                      <div className="lead-status">
                        {renderStatusBadge(lead.leadStatus)}
                      </div>
                    </div>
                    <div className="lead-item-footer">
                      <span>{lead.lastContact}</span>
                      <span>{lead.remark}</span>
                    </div>
                  </div>

                  {showStatusOptions === lead.id && (
                    <div className="status-options">
                      <h4>Change Status</h4>
                      {statusOptions.map(status => (
                        <button
                          key={status}
                          onClick={(e) => {
                            e.stopPropagation();
                            updateLeadStatus(lead.id, status);
                          }}
                          className={lead.leadStatus === status ? 'active' : ''}
                        >
                          {renderStatusBadge(status)}
                        </button>
                      ))}
                    </div>
                  )}

                  {showNoteOptions === lead.id && (
                    <div className="note-options">
                      <h4>Add Note</h4>
                      {predefinedNotes.map((note, i) => (
                        <button
                          key={i}
                          onClick={(e) => {
                            e.stopPropagation();
                            addPredefinedNote(lead.id, note);
                          }}
                        >
                          {note}
                        </button>
                      ))}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setShowNoteOptions(null);
                        }}
                        className="custom-note"
                      >
                        <FaEdit /> Custom Note
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="mobile-lead-detail">
            <div className="detail-header">
              <button className="back-button" onClick={handleBackToList}>
                &larr;
              </button>
              <h2>Lead Details</h2>
              {!isEditing && !showNoteInput && (
                <button className="edit-button" onClick={handleEditClick}>
                  <FaEdit /> Edit
                </button>
              )}
            </div>

            {selectedLead && (
              <div className="detail-content">
                <div className="lead-profile">
                  <div className="lead-avatar large">
                    <FaUserTie />
                  </div>
                  <div className="lead-name">
                    {isEditing ? (
                      <input
                        type="text"
                        name="clientName"
                        value={editFormData.clientName || ""}
                        onChange={handleEditChange}
                        className="editable-name"
                      />
                    ) : (
                      <h3>{selectedLead.clientName}</h3>
                    )}
                    {isEditing ? (
                      <input
                        type="text"
                        name="title"
                        value={editFormData.title || ""}
                        onChange={handleEditChange}
                        className="editable-title"
                      />
                    ) : (
                      <p>{selectedLead.title}</p>
                    )}
                  </div>
                  <div className="lead-status-large">
                    {isEditing ? null : renderStatusBadge(selectedLead.leadStatus)}
                  </div>
                </div>

                {isEditing && (
                  <div className="edit-controls">
                    <button className="save-btn" onClick={handleSaveEdit}>
                      <FaSave /> Save
                    </button>
                    <button className="cancel-btn" onClick={handleCancelEdit}>
                      <FaBan /> Cancel
                    </button>
                  </div>
                )}

                <div className="detail-section">
                  <h4>Contact Information</h4>
                  {renderEditableField("email", "Email", selectedLead.email, "email")}
                  {renderEditableField("phone", "Phone", selectedLead.phone, "tel")}
                  <div className="detail-row">
                    <span>Last Contact:</span>
                    <span>{selectedLead.lastContact}</span>
                  </div>
                  {renderStatusSelector()}
                </div>

                <div className="detail-section">
                  <h4>Company Information</h4>
                  {renderEditableField("industry", "Industry", selectedLead.industry)}
                  {renderEditableField("numberOfEmployees", "Employees", selectedLead.numberOfEmployees, "number")}
                  {renderEditableField("leadSource", "Source", selectedLead.leadSource)}
                </div>

                <div className="detail-section">
                  <div className="notes-header">
                    <h4>Notes</h4>
                    {!isEditing && !showNoteInput && (
                      <button 
                        className="add-note-btn"
                        onClick={handleAddNoteClick}
                      >
                        <FaEdit /> {selectedLead.remark ? "Edit" : "Add"} Note
                      </button>
                    )}
                  </div>
                  
                  {showNoteInput ? (
                    <div className="note-input-container">
                      <textarea
                        ref={noteInputRef}
                        value={noteInput}
                        onChange={(e) => setNoteInput(e.target.value)}
                        placeholder="Enter your notes here..."
                        rows="3"
                      />
                      <div className="note-controls">
                        <button className="save-note-btn" onClick={handleSaveNote}>
                          <FaSave /> Save
                        </button>
                        <button className="cancel-note-btn" onClick={handleCancelNote}>
                          <FaTimes /> Cancel
                        </button>
                      </div>
                      <div className="predefined-notes">
                        <h5>Quick Notes:</h5>
                        {predefinedNotes.map((note, i) => (
                          <button
                            key={i}
                            onClick={() => handlePredefinedNoteClick(note)}
                            className="predefined-note-btn"
                          >
                            {note}
                          </button>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <p className="lead-notes">
                      {selectedLead.remark || "No notes added yet"}
                    </p>
                  )}
                </div>

                <div className="detail-actions">
                  <button className="action-button call">
                    <FaPhoneAlt /> Call
                  </button>
                  <button className="action-button whatsapp">
                    <FaWhatsapp /> WhatsApp
                  </button>
                  <button 
                    className="action-button note"
                    onClick={() => {
                      setShowNoteInput(true);
                      setIsEditing(false);
                    }}
                  >
                    <FaStickyNote /> Note
                  </button>
                  {!isEditing && (
                    <button 
                      className="action-button delete"
                      onClick={() => confirmDeleteLead(selectedLead.id)}
                    >
                      <FaTrash /> Delete
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
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