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
  FaBan,
  FaChartLine,
  FaChartPie,
  FaChartBar
} from "react-icons/fa";
import * as XLSX from "xlsx";
import { database } from "../../../firebaseConfig"; // Import your Firebase configuration
import { ref, push, set, onValue,get,update } from "firebase/database";
import LeadFormModal from "./LeadFormModal";
import "./Leads.css";
import Swal from "sweetalert2";


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
  const [importPreview, setImportPreview] = useState(null);
  const [showImportModal, setShowImportModal] = useState(false);
  const [stats, setStats] = useState({
    total: 0,
    new: 0,
    contacted: 0,
    qualified: 0,
    lost: 0,
    recent: []
  });
  const storedUserKey = localStorage.getItem('userKey');


  const [formData, setFormData] = useState({
    clientName: "",
    title: "",
    email: "",
    phone: "",
    remark: "",
    industry: "",
    leadSource: "",
    leadStatus: "New",
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
  const fileInputRef = useRef(null);
  // Fetch leads from Firebase on component mount
  useEffect(() => {
    const leadsRef = ref(database, `admins/${storedUserKey}/leads`);
    onValue(leadsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const leadsArray = Object.keys(data).map(key => ({
          id: key,
          ...data[key],
          checked: false
        }));
        setRows(leadsArray);
        calculateStats(leadsArray);
      } else {
        setRows([]);
        calculateStats([]);
      }
    });
  }, []);

  // Calculate lead statistics
  const calculateStats = (leads) => {
    const now = new Date();
    const recentLeads = leads
      .filter(lead => {
        const leadDate = new Date(lead.createdAt || now);
        return (now - leadDate) <= (7 * 24 * 60 * 60 * 1000); // Last 7 days
      })
      .slice(0, 5); // Get up to 5 most recent
    
    setStats({
      total: leads.length,
      new: leads.filter(lead => lead.leadStatus === "New").length,
      contacted: leads.filter(lead => lead.leadStatus === "Contacted").length,
      qualified: leads.filter(lead => lead.leadStatus === "Qualified").length,
      lost: leads.filter(lead => lead.leadStatus === "Lost").length,
      recent: recentLeads
    });
  };

  const handleFileImport = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
  
    // Get the stored user key
    const storedUserKey = localStorage.getItem("userKey");
    if (!storedUserKey) {
      Swal.fire('Error', 'User not authenticated', 'error');
      return;
    }
  
    // Reference to custom forms in Firebase
    const customFormsRef = ref(database, `admins/${storedUserKey}/customForms`);
  
    try {
      // First fetch the custom form fields from Firebase
      const snapshot = await get(customFormsRef);
      if (!snapshot.exists()) {
        Swal.fire('Error', 'No custom form fields found', 'error');
        return;
      }
  
      const formsData = snapshot.val();
      let customFields = [];
  
      // Extract all custom field labels
      for (let formKey in formsData) {
        if (formsData.hasOwnProperty(formKey)) {
          const fieldsData = formsData[formKey].fields;
          for (let index in fieldsData) {
            customFields.push(fieldsData[index].label);
          }
        }
      }
  
      // Now read the Excel file
      const reader = new FileReader();
      reader.onload = async (e) => {
        try {
          const data = new Uint8Array(e.target.result);
          const workbook = XLSX.read(data, { type: 'array' });
          const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
          const jsonData = XLSX.utils.sheet_to_json(firstSheet);
          
          // Get Excel column names
          const excelColumns = Object.keys(jsonData[0] || {});
          
          // Check if all custom fields exist in Excel columns
          const missingFields = customFields.filter(
            field => !excelColumns.some(
              col => col.toLowerCase() === field.toLowerCase()
            )
          );
  
          if (missingFields.length > 0) {
            Swal.fire({
              title: 'Fields Mismatch',
              html: `The following required fields are missing in your Excel file:<br><br>
                    <strong>${missingFields.join(', ')}</strong><br><br>
                    Please update your file and try again.`,
              icon: 'error'
            });
            return;
          }
  
          // Create a mapping between Excel columns and custom field labels
          const fieldMapping = {};
          excelColumns.forEach(col => {
            const matchedField = customFields.find(
              field => field.toLowerCase() === col.toLowerCase()
            );
            if (matchedField) {
              fieldMapping[col] = matchedField;
            }
          });
  
          // Map imported data to our lead structure using the field mapping
          const previewData = jsonData.map((item, index) => {
            const leadData = {
              id: `preview-${index}`,
              status: 'Active',
              checked: false,
              isPreview: true,
              createdAt: new Date().toISOString()
            };
  
            // Add all custom fields from the Excel file
            for (let col in item) {
              if (fieldMapping[col]) {
                leadData[fieldMapping[col]] = item[col];
              }
            }
  
            return leadData;
          });
  
          setImportPreview(previewData);
          setShowImportModal(true);
        } catch (error) {
          console.error('Error processing file:', error);
          Swal.fire('Error', 'Failed to process the file', 'error');
        }
      };
      reader.readAsArrayBuffer(file);
    } catch (error) {
      console.error('Error fetching custom fields:', error);
      Swal.fire('Error', 'Failed to fetch custom form fields', 'error');
    }
  };

  // Confirm import to Firebase
const confirmImport = async () => {
  if (!importPreview || importPreview.length === 0) return;

  try {
    // Get the current user's lead limit
    const userRef = ref(database, `admins/${storedUserKey}`);
    const userSnapshot = await get(userRef);

    if (!userSnapshot.exists()) {
      alert("User not found.");
      return;
    }

    const userData = userSnapshot.val();
    const leadLimit = userData.leadsLimit || 0; // Default to 0 if no lead limit is set

    // Get the current number of leads in the Firebase database
    const leadsRef = ref(database, `admins/${storedUserKey}/leads`);
    const leadsSnapshot = await get(leadsRef);
    const currentLeadsCount = leadsSnapshot.exists() ? Object.keys(leadsSnapshot.val()).length : 0;

    // Check if the current number of leads + the new ones exceed the limit
    if (currentLeadsCount + importPreview.length > leadLimit) {
      // Close the preview modal first before showing the alert
      setShowImportModal(false);  // Close the modal

      // Show SweetAlert warning
      Swal.fire({
        title: "Lead Limit Exceeded",
        text: `You cannot import more than ${leadLimit} leads. You have reached your lead limit.`,
        icon: "warning",
        confirmButtonText: "Okay",
        confirmButtonColor: "#3085d6"
      });
      return;
    }

    // Proceed with importing the leads if the limit is not exceeded
    const timestamp = new Date().toISOString();

    // Create an object to batch the writes
    const updates = {};

    // Loop through the preview data and add it to the updates object
    importPreview.forEach((lead, index) => {
      const newLeadRef = ref(database, `admins/${storedUserKey}/leads/${lead.id || `lead-${index}`}`);
      updates[`admins/${storedUserKey}/leads/${lead.id || `lead-${index}`}`] = {
        ...lead,
        createdAt: timestamp,
        lastContact: "Just now"
      };
    });

    // Update all leads at once
    await update(ref(database), updates);

    Swal.fire({
      title: `${importPreview.length} leads imported successfully!`,
      icon: "success",
      confirmButtonText: "Done",
      confirmButtonColor: "#3085d6"
    });

    // Clear the import preview and hide the modal
    setShowImportModal(false);
    setImportPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = '';

  } catch (error) {
    console.error("Error importing leads:", error);
    Swal.fire({
      title: "Import Failed",
      text: "Failed to import leads. Please try again.",
      icon: "error",
      confirmButtonText: "Okay",
      confirmButtonColor: "#dc3545"
    });
  }
};

  
  

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
      // Remove from Firebase
      const leadRef = ref(database, `leads/${id}`);
      set(leadRef, null);
      
      if (selectedLead && selectedLead.id === id) {
        setMobileView("list");
        setSelectedLead(null);
      }
    }
  };

  // Update lead status
  const updateLeadStatus = (id, newStatus) => {
    const leadRef = ref(database, `leads/${id}`);
    set(leadRef, {
      ...rows.find(row => row.id === id),
      leadStatus: newStatus,
      lastContact: new Date().toLocaleString()
    });
    
    setShowStatusOptions(null);
    
    // Update selected lead if it's the one being viewed
    if (selectedLead && selectedLead.id === id) {
      setSelectedLead({ ...selectedLead, leadStatus: newStatus });
    }
  };

  // Add predefined note
  const addPredefinedNote = (id, note) => {
    const leadRef = ref(database, `leads/${id}`);
    set(leadRef, {
      ...rows.find(row => row.id === id),
      remark: note,
      lastContact: new Date().toLocaleString()
    });
    
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

  const [rows, setRows] = useState([]);

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
    fileInputRef.current.click();
  };

  const handleExportLeads = () => {
    // Convert leads to worksheet
    const ws = XLSX.utils.json_to_sheet(rows.map(lead => ({
      "Client Name": lead.clientName,
      "Title": lead.title,
      "Email": lead.email,
      "Phone": lead.phone,
      "Remark": lead.remark,
      "Industry": lead.industry,
      "Lead Source": lead.leadSource,
      "Lead Status": lead.leadStatus,
      "Employees": lead.numberOfEmployees,
      "Status": lead.status,
      "Last Contact": lead.lastContact
    })));
    
    // Create workbook and download
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Leads");
    XLSX.writeFile(wb, "leads_export.xlsx");
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
    const leadRef = ref(database, `leads/${selectedLead.id}`);
    set(leadRef, {
      ...editFormData,
      lastContact: new Date().toLocaleString()
    });
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
    const leadRef = ref(database, `leads/${selectedLead.id}`);
    set(leadRef, {
      ...selectedLead,
      remark: updatedNote,
      lastContact: new Date().toLocaleString()
    });
    setShowNoteInput(false);
  };

  const handleCancelNote = () => {
    setShowNoteInput(false);
    setNoteInput("");
  };

  const handlePredefinedNoteClick = (note) => {
    const leadRef = ref(database, `leads/${selectedLead.id}`);
    set(leadRef, {
      ...selectedLead,
      remark: note,
      lastContact: new Date().toLocaleString()
    });
    setShowNoteInput(false);
  };

  const renderStatusBadge = (status) => {
    if (!status || typeof status !== 'string') {
      status = 'New'; // Default value if status is not defined or not a string
    }
  
    let icon, color;
    switch (status.toLowerCase()) {
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
      case 'lost':
        icon = <FaTimes />;
        color = '#f44336';
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

  const renderStatsCard = (title, value, icon, color) => {
    return (
      <div className="stat-card" style={{ borderTop: `4px solid ${color}` }}>
        <div className="stat-icon" style={{ color }}>
          {icon}
        </div>
        <div className="stat-content">
          <h3>{value}</h3>
          <p>{title}</p>
        </div>
      </div>
    );
  };

  return (
    <div className="lead-container">
      {/* Hidden file input for import */}
      <input 
        type="file" 
        ref={fileInputRef}
        onChange={handleFileImport}
        accept=".xlsx,.xls,.csv"
        style={{ display: 'none' }}
      />
      
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

        {/* Stats Section */}
        {/* <div className="stats-section">
          {renderStatsCard("Total Leads", stats.total, <FaChartLine />, "#4e73df")}
          {renderStatsCard("New", stats.new, <FaClock />, "#ff9800")}
          {renderStatsCard("Contacted", stats.contacted, <FaPhoneAlt />, "#2196f3")}
          {renderStatsCard("Qualified", stats.qualified, <FaCheck />, "#4caf50")}
          {renderStatsCard("Lost", stats.lost, <FaTimes />, "#f44336")}
        </div> */}

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
                {renderStatusBadge(row.leadStatus)}
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
                  <button 
                    className="lead-icon-btn" 
                    data-tooltip="Edit"
                    onClick={() => handleLeadClick(row)}
                  >
                    ✏️
                  </button>
                  <button 
                    className="lead-icon-btn" 
                    data-tooltip="Delete"
                    onClick={() => confirmDeleteLead(row.id)}
                  >
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

            {/* Mobile Stats */}
            <div className="mobile-stats">
              <div className="mobile-stat">
                <FaChartPie />
                <span>Total: {stats.total}</span>
              </div>
              <div className="mobile-stat">
                <FaClock />
                <span>New: {stats.new}</span>
              </div>
              <div className="mobile-stat">
                <FaPhoneAlt />
                <span>Contacted: {stats.contacted}</span>
              </div>
              <div className="mobile-stat">
                <FaCheck />
                <span>Qualified: {stats.qualified}</span>
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
          onCreate={(newLead) => {
            const newLeadRef = push(ref(database, 'leads'));
            set(newLeadRef, {
              ...newLead,
              createdAt: new Date().toISOString(),
              lastContact: "Just now"
            });
            setShowModal(false);
          }}
        />
      )}

      {/* Import Preview Modal */}
      {showImportModal && (
  <div className="modal-overlay">
    <div className="import-preview-modal">
      <div className="modal-header">
        <h3>Import Preview ({importPreview.length} leads)</h3>
        <button 
          onClick={() => {
            setShowImportModal(false);
            setImportPreview(null);
            if (fileInputRef.current) fileInputRef.current.value = '';
          }}
          className="close-btn"
        >
          <FaTimes />
        </button>
      </div>
      <div className="modal-body">
        <div className="preview-table-container">
        <div className="modal-footer">
        <button 
          className="cancel-btn"
          onClick={() => {
            setShowImportModal(false);
            setImportPreview(null);
            if (fileInputRef.current) fileInputRef.current.value = '';
          }}
        >
          Cancel
        </button>
        <button 
          className="confirm-btn"
          onClick={confirmImport}
        >
          Confirm Import
        </button>
      </div>
          <table className="preview-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Status</th>
                <th>Source</th>
              </tr>
            </thead>
            <tbody>
              {importPreview.map((lead, index) => (
                <tr key={index}>
                  <td>{lead.clientName}</td>
                  <td>{lead.email}</td>
                  <td>{lead.phone}</td>
                  <td>{lead.leadStatus}</td>
                  <td>{lead.leadSource}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
    </div>
  </div>
)}


    </div>
  );
};

export default Leads;