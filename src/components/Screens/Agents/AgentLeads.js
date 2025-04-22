import React, { useState, useEffect } from 'react';
import './AgentLeads.css';
import * as XLSX from 'xlsx';

function Profile() {
  const [allLeads, setAllLeads] = useState([]);
  const [displayLeads, setDisplayLeads] = useState([]);
  const [filter, setFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedLead, setSelectedLead] = useState(null);
  const [noteText, setNoteText] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: 'id', direction: 'asc' });
  const [isMobileView, setIsMobileView] = useState(false);
  const leadsPerPage = 20;

  // Check for mobile view
  useEffect(() => {
    const handleResize = () => {
      setIsMobileView(window.innerWidth <= 768);
    };
    
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Mock data generation with additional fields
  useEffect(() => {
    const generateMockLeads = () => {
      const mockLeads = [];
      const companies = ['Tech Corp', 'Innovate Inc', 'Global Solutions', 'Future LLC', 'Digital Partners'];
      const locations = ['New York', 'San Francisco', 'Chicago', 'Austin', 'Boston', 'Seattle'];
      
      for (let i = 1; i <= 5000; i++) {
        const company = companies[Math.floor(Math.random() * companies.length)];
        const location = locations[Math.floor(Math.random() * locations.length)];
        const notes = Math.random() > 0.7 ? ['Interested in pricing', 'Requested demo', 'Follow up next week'] : [];
        const statusOptions = ['new', 'contacted', 'qualified', 'won', 'loss'];
        
        mockLeads.push({
          id: i,
          name: `Lead ${i}`,
          company: company,
          phone: `(${Math.floor(Math.random() * 900) + 100}) ${Math.floor(Math.random() * 900) + 100}-${Math.floor(Math.random() * 9000) + 1000}`,
          email: `lead${i}@${company.toLowerCase().replace(/\s/g, '')}.com`,
          assignedDate: new Date(Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000).toISOString(),
          status: statusOptions[Math.floor(Math.random() * statusOptions.length)],
          assignedBy: ['Admin', 'Manager', 'System'][Math.floor(Math.random() * 3)],
          location: location,
          notes: notes,
          lastContacted: Math.random() > 0.5 ? new Date(Date.now() - Math.floor(Math.random() * 14) * 24 * 60 * 60 * 1000).toISOString() : null
        });
      }
      return mockLeads;
    };

    // Simulate API call
    setTimeout(() => {
      const leads = generateMockLeads();
      setAllLeads(leads);
      setIsLoading(false);
    }, 1000);
  }, []);


  const exportToExcel = () => {
    // Filter data based on current view (search, filter, etc.)
    let dataToExport = [...allLeads];
    
    if (filter !== 'all') {
      dataToExport = dataToExport.filter(lead => lead.status === filter);
    }
    
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      dataToExport = dataToExport.filter(lead => 
        lead.name.toLowerCase().includes(term) || 
        lead.company.toLowerCase().includes(term) ||
        lead.email.toLowerCase().includes(term) ||
        lead.phone.includes(term)
      );
    }
    
    // Create worksheet
    const ws = XLSX.utils.json_to_sheet(dataToExport);
    
    // Create workbook
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Leads");
    
    // Export the file
    XLSX.writeFile(wb, `leads_export_${new Date().toISOString().split('T')[0]}.xlsx`);
  };
  
  const handleFileImport = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (e) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: 'array' });
      
      // Get first sheet
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      
      // Convert to JSON
      const jsonData = XLSX.utils.sheet_to_json(worksheet);
      
      // Validate and process the imported data
      if (jsonData.length > 0) {
        // Add some basic validation
        const processedData = jsonData.map(item => ({
          id: item.id || Math.max(...allLeads.map(l => l.id)) + 1,
          name: item.name || 'Unknown',
          company: item.company || 'Unknown',
          phone: item.phone || '',
          email: item.email || '',
          assignedDate: item.assignedDate || new Date().toISOString(),
          status: item.status || 'new',
          assignedBy: item.assignedBy || 'Imported',
          location: item.location || '',
          notes: item.notes || [],
          lastContacted: item.lastContacted || null
        }));
        
        // Merge with existing leads
        setAllLeads([...allLeads, ...processedData]);
        alert(`Successfully imported ${processedData.length} leads`);
      }
    };
    reader.readAsArrayBuffer(file);
  };



  // Filter, sort, search and paginate leads
  useEffect(() => {
    let filtered = [...allLeads];
    
    // Apply status filter
    if (filter !== 'all') {
      filtered = filtered.filter(lead => lead.status === filter);
    }
    
    // Apply search
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(lead => 
        lead.name.toLowerCase().includes(term) || 
        lead.company.toLowerCase().includes(term) ||
        lead.email.toLowerCase().includes(term) ||
        lead.phone.includes(term))
    }
    
    // Apply sorting
    if (sortConfig.key) {
      filtered.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }
    
    // Calculate pagination
    const indexOfLastLead = currentPage * leadsPerPage;
    const indexOfFirstLead = indexOfLastLead - leadsPerPage;
    const currentLeads = filtered.slice(indexOfFirstLead, indexOfLastLead);
    
    setDisplayLeads(currentLeads);
  }, [allLeads, filter, currentPage, searchTerm, sortConfig]);

  const leadCounts = {
    all: allLeads.length,
    new: allLeads.filter(lead => lead.status === 'new').length,
    contacted: allLeads.filter(lead => lead.status === 'contacted').length,
    qualified: allLeads.filter(lead => lead.status === 'qualified').length,
    won: allLeads.filter(lead => lead.status === 'won').length,
    loss: allLeads.filter(lead => lead.status === 'loss').length,
  };

  const updateLeadStatus = (leadId, newStatus) => {
    setAllLeads(allLeads.map(lead => 
      lead.id === leadId ? {...lead, status: newStatus} : lead
    ));
  };

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const addNote = () => {
    if (!noteText.trim() || !selectedLead) return;
    
    setAllLeads(allLeads.map(lead => 
      lead.id === selectedLead.id 
        ? {...lead, notes: [...lead.notes, noteText]} 
        : lead
    ));
    
    setSelectedLead({
      ...selectedLead,
      notes: [...selectedLead.notes, noteText]
    });
    
    setNoteText('');
  };

  const handleCall = (phone) => {
    alert(`Calling ${phone}`);
  };

  const handleEmail = (email) => {
    window.open(`mailto:${email}`, '_blank');
  };

  const handleWhatsApp = (phone) => {
    const formattedPhone = phone.replace(/\D/g, '');
    window.open(`https://wa.me/${formattedPhone}`, '_blank');
  };

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const closeLeadDetails = () => {
    setSelectedLead(null);
    setNoteText('');
  };

  // Mobile view components
  const MobileLeadList = () => (
    <div className="mobile-lead-list">
      {displayLeads.map(lead => (
        <div 
          key={lead.id} 
          className="mobile-lead-item"
          onClick={() => setSelectedLead(lead)}
        >
          <div className="lead-header">
            <span className="lead-name">{lead.name}</span>
            <span className={`status-badge ${lead.status}`}>{lead.status}</span>
          </div>
          <div className="lead-company">{lead.company}</div>
          <div className="lead-meta">
            <span>{new Date(lead.assignedDate).toLocaleDateString()}</span>
            <div className="mobile-actions">
              <select 
                value={lead.status}
                onChange={(e) => updateLeadStatus(lead.id, e.target.value)}
                onClick={(e) => e.stopPropagation()}
              >
                <option value="new">New</option>
                <option value="contacted">Contacted</option>
                <option value="qualified">Qualified</option>
                <option value="won">Won</option>
                <option value="loss">Loss</option>
              </select>
              <button 
                className="mobile-call-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  handleCall(lead.phone);
                }}
              >
                📞
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  const MobileLeadDetails = () => (
    <div className="mobile-lead-details">
      <button className="back-button" onClick={closeLeadDetails}>← Back</button>
      
      <div className="lead-header">
        <h2>{selectedLead.name}</h2>
        <span className={`status-badge large ${selectedLead.status}`}>
          {selectedLead.status}
        </span>
      </div>
      
      <div className="lead-info">
        <div className="info-section">
          <h3>Contact Information</h3>
          <p><strong>Company:</strong> {selectedLead.company}</p>
          <p><strong>Email:</strong> 
            <a href={`mailto:${selectedLead.email}`} onClick={(e) => e.stopPropagation()}>
              {selectedLead.email}
            </a>
            <button 
              className="icon-btn"
              onClick={() => handleEmail(selectedLead.email)}
              title="Send Email"
            >
              ✉️
            </button>
          </p>
          <p><strong>Phone:</strong> 
            {selectedLead.phone}
            <button 
              className="icon-btn"
              onClick={() => handleCall(selectedLead.phone)}
              title="Call"
            >
              📞
            </button>
            <button 
              className="icon-btn"
              onClick={() => handleWhatsApp(selectedLead.phone)}
              title="WhatsApp"
            >
              💬
            </button>
          </p>
          <p><strong>Location:</strong> {selectedLead.location}</p>
        </div>
        
        <div className="info-section">
          <h3>Assignment Details</h3>
          <p><strong>Assigned By:</strong> {selectedLead.assignedBy}</p>
          <p><strong>Assigned On:</strong> {new Date(selectedLead.assignedDate).toLocaleString()}</p>
          <p><strong>Last Contacted:</strong> {selectedLead.lastContacted ? new Date(selectedLead.lastContacted).toLocaleString() : 'Never'}</p>
        </div>
      </div>
      
      <div className="notes-section">
        <h3>Notes</h3>
        {selectedLead.notes && selectedLead.notes.length > 0 ? (
          <ul className="notes-list">
            {selectedLead.notes.map((note, index) => (
              <li key={index}>{note}</li>
            ))}
          </ul>
        ) : (
          <p>No notes yet</p>
        )}
        
        <div className="add-note">
          <textarea
            value={noteText}
            onChange={(e) => setNoteText(e.target.value)}
            placeholder="Add a note about this lead..."
          />
          <button onClick={addNote}>Add Note</button>
        </div>
      </div>
      
      <div className="modal-footer">
        <select 
          value={selectedLead.status}
          onChange={(e) => {
            updateLeadStatus(selectedLead.id, e.target.value);
            setSelectedLead({
              ...selectedLead,
              status: e.target.value
            });
          }}
        >
          <option value="new">New</option>
          <option value="contacted">Contacted</option>
          <option value="qualified">Qualified</option>
          <option value="won">Won</option>
          <option value="loss">Loss</option>
        </select>
        
        <div className="communication-buttons">
          <button onClick={() => handleCall(selectedLead.phone)}>
            📞 Call
          </button>
          <button onClick={() => handleEmail(selectedLead.email)}>
            ✉️ Email
          </button>
          <button onClick={() => handleWhatsApp(selectedLead.phone)}>
            💬 WhatsApp
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="dashboard">
      <header>
  <h1>My Assigned Leads</h1>
  <div className="user-info">
    <span>Agent: John Doe</span>
    <div className="search-box">
      <input 
        type="text" 
        placeholder="Search leads..." 
        value={searchTerm}
        onChange={(e) => {
          setSearchTerm(e.target.value);
          setCurrentPage(1);
        }}
      />
      <button className="search-button">🔍</button>
    </div>
    </div>
    <div className="import-export-buttons">
      <button onClick={exportToExcel} className="export-btn">
        Export to Excel
      </button>
      <label htmlFor="file-upload" className="import-btn">
        Import from Excel
        <input 
          id="file-upload" 
          type="file" 
          accept=".xlsx, .xls" 
          onChange={handleFileImport}
          style={{ display: 'none' }}
        />
      </label>
    </div>

</header>
      
      <div className="summary-cards">
        <div className="card" onClick={() => {setFilter('all'); setCurrentPage(1)}}>
          <h3>Total Leads</h3>
          <p>{leadCounts.all.toLocaleString()}</p>
        </div>
        <div className="card" onClick={() => {setFilter('new'); setCurrentPage(1)}}>
          <h3>New Leads</h3>
          <p>{leadCounts.new.toLocaleString()}</p>
        </div>
        <div className="card" onClick={() => {setFilter('contacted'); setCurrentPage(1)}}>
          <h3>Contacted</h3>
          <p>{leadCounts.contacted.toLocaleString()}</p>
        </div>
        <div className="card" onClick={() => {setFilter('qualified'); setCurrentPage(1)}}>
          <h3>Qualified</h3>
          <p>{leadCounts.qualified.toLocaleString()}</p>
        </div>
        <div className="card" onClick={() => {setFilter('won'); setCurrentPage(1)}}>
          <h3>Won</h3>
          <p>{leadCounts.won.toLocaleString()}</p>
        </div>
        <div className="card" onClick={() => {setFilter('loss'); setCurrentPage(1)}}>
          <h3>Loss</h3>
          <p>{leadCounts.loss.toLocaleString()}</p>
        </div>
      </div>

      <div className="lead-table">
        <div className="filters">
          <button 
            className={filter === 'all' ? 'active' : ''}
            onClick={() => {setFilter('all'); setCurrentPage(1)}}
          >
            All Leads
          </button>
          <button 
            className={filter === 'new' ? 'active' : ''}
            onClick={() => {setFilter('new'); setCurrentPage(1)}}
          >
            New
          </button>
          <button 
            className={filter === 'contacted' ? 'active' : ''}
            onClick={() => {setFilter('contacted'); setCurrentPage(1)}}
          >
            Contacted
          </button>
          <button 
            className={filter === 'qualified' ? 'active' : ''}
            onClick={() => {setFilter('qualified'); setCurrentPage(1)}}
          >
            Qualified
          </button>
          <button 
            className={filter === 'won' ? 'active' : ''}
            onClick={() => {setFilter('won'); setCurrentPage(1)}}
          >
            Won
          </button>
          <button 
            className={filter === 'loss' ? 'active' : ''}
            onClick={() => {setFilter('loss'); setCurrentPage(1)}}
          >
            Loss
          </button>
        </div>

        {isLoading ? (
          <div className="loading">Loading leads...</div>
        ) : (
          <>
            {isMobileView ? (
              selectedLead ? (
                <MobileLeadDetails />
              ) : (
                <>
                  <MobileLeadList />
                  <Pagination
                    leadsPerPage={leadsPerPage}
                    totalLeads={filter === 'all' 
                      ? allLeads.filter(lead => 
                          searchTerm 
                            ? (lead.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                               lead.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
                               lead.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                               lead.phone.includes(searchTerm))
                            : true
                        ).length 
                      : leadCounts[filter]}
                    currentPage={currentPage}
                    paginate={paginate}
                  />
                </>
              )
            ) : (
              <>
                <table>
                  <thead>
                    <tr>
                      <th onClick={() => handleSort('id')}>
                        ID {sortConfig.key === 'id' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                      </th>
                      <th onClick={() => handleSort('name')}>
                        Name {sortConfig.key === 'name' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                      </th>
                      <th onClick={() => handleSort('company')}>
                        Company {sortConfig.key === 'company' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                      </th>
                      <th onClick={() => handleSort('status')}>
                        Status {sortConfig.key === 'status' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                      </th>
                      <th onClick={() => handleSort('assignedDate')}>
                        Assigned On {sortConfig.key === 'assignedDate' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                      </th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {displayLeads.map(lead => (
                      <tr key={lead.id} onClick={() => setSelectedLead(lead)}>
                        <td>{lead.id}</td>
                        <td>{lead.name}</td>
                        <td>{lead.company}</td>
                        <td>
                          <span className={`status-badge ${lead.status}`}>
                            {lead.status}
                          </span>
                        </td>
                        <td>{new Date(lead.assignedDate).toLocaleDateString()}</td>
                        <td>
                          <div className="action-buttons">
                            <select 
                              value={lead.status}
                              onChange={(e) => updateLeadStatus(lead.id, e.target.value)}
                              onClick={(e) => e.stopPropagation()}
                            >
                              <option value="new">New</option>
                              <option value="contacted">Contacted</option>
                              <option value="qualified">Qualified</option>
                              <option value="won">Won</option>
                              <option value="loss">Loss</option>
                            </select>
                            <button 
                              className="call-btn"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleCall(lead.phone);
                              }}
                              title="Call"
                            >
                              📞
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                <Pagination
                  leadsPerPage={leadsPerPage}
                  totalLeads={filter === 'all' 
                    ? allLeads.filter(lead => 
                        searchTerm 
                          ? (lead.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                             lead.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
                             lead.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                             lead.phone.includes(searchTerm))
                          : true
                      ).length 
                    : leadCounts[filter]}
                  currentPage={currentPage}
                  paginate={paginate}
                />
              </>
            )}
          </>
        )}
      </div>

      {/* Desktop Lead Details Modal */}
      {!isMobileView && selectedLead && (
        <div className="modal-overlay">
          <div className="lead-details-modal">
            <button className="close-modal" onClick={closeLeadDetails}>×</button>
            
            <div className="lead-header">
              <h2>{selectedLead.name}</h2>
              <span className={`status-badge large ${selectedLead.status}`}>
                {selectedLead.status}
              </span>
            </div>
            
            <div className="lead-info">
              <div className="info-section">
                <h3>Contact Information</h3>
                <p><strong>Company:</strong> {selectedLead.company}</p>
                <p><strong>Email:</strong> 
                  <a href={`mailto:${selectedLead.email}`} onClick={(e) => e.stopPropagation()}>
                    {selectedLead.email}
                  </a>
                  <button 
                    className="icon-btn"
                    onClick={() => handleEmail(selectedLead.email)}
                    title="Send Email"
                  >
                    ✉️
                  </button>
                </p>
                <p><strong>Phone:</strong> 
                  {selectedLead.phone}
                  <button 
                    className="icon-btn"
                    onClick={() => handleCall(selectedLead.phone)}
                    title="Call"
                  >
                    📞
                  </button>
                  <button 
                    className="icon-btn"
                    onClick={() => handleWhatsApp(selectedLead.phone)}
                    title="WhatsApp"
                  >
                    💬
                  </button>
                </p>
                <p><strong>Location:</strong> {selectedLead.location}</p>
              </div>
              
              <div className="info-section">
                <h3>Assignment Details</h3>
                <p><strong>Assigned By:</strong> {selectedLead.assignedBy}</p>
                <p><strong>Assigned On:</strong> {new Date(selectedLead.assignedDate).toLocaleString()}</p>
                <p><strong>Last Contacted:</strong> {selectedLead.lastContacted ? new Date(selectedLead.lastContacted).toLocaleString() : 'Never'}</p>
              </div>
            </div>
            
            <div className="notes-section">
              <h3>Notes</h3>
              {selectedLead.notes && selectedLead.notes.length > 0 ? (
                <ul className="notes-list">
                  {selectedLead.notes.map((note, index) => (
                    <li key={index}>{note}</li>
                  ))}
                </ul>
              ) : (
                <p>No notes yet</p>
              )}
              
              <div className="add-note">
                <textarea
                  value={noteText}
                  onChange={(e) => setNoteText(e.target.value)}
                  placeholder="Add a note about this lead..."
                />
                <button onClick={addNote}>Add Note</button>
              </div>
            </div>
            
            <div className="modal-footer">
              <select 
                value={selectedLead.status}
                onChange={(e) => {
                  updateLeadStatus(selectedLead.id, e.target.value);
                  setSelectedLead({
                    ...selectedLead,
                    status: e.target.value
                  });
                }}
              >
                <option value="new">New</option>
                <option value="contacted">Contacted</option>
                <option value="qualified">Qualified</option>
                <option value="won">Won</option>
                <option value="loss">Loss</option>
              </select>
              
              <div className="communication-buttons">
                <button onClick={() => handleCall(selectedLead.phone)}>
                  📞 Call
                </button>
                <button onClick={() => handleEmail(selectedLead.email)}>
                  ✉️ Email
                </button>
                <button onClick={() => handleWhatsApp(selectedLead.phone)}>
                  💬 WhatsApp
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Pagination component
const Pagination = ({ leadsPerPage, totalLeads, currentPage, paginate }) => {
  const pageNumbers = [];

  for (let i = 1; i <= Math.ceil(totalLeads / leadsPerPage); i++) {
    pageNumbers.push(i);
  }

  // Show limited page numbers
  const maxVisiblePages = 5;
  let startPage, endPage;
  
  if (pageNumbers.length <= maxVisiblePages) {
    startPage = 1;
    endPage = pageNumbers.length;
  } else {
    if (currentPage <= Math.ceil(maxVisiblePages / 2)) {
      startPage = 1;
      endPage = maxVisiblePages;
    } else if (currentPage + Math.floor(maxVisiblePages / 2) >= pageNumbers.length) {
      startPage = pageNumbers.length - maxVisiblePages + 1;
      endPage = pageNumbers.length;
    } else {
      startPage = currentPage - Math.floor(maxVisiblePages / 2);
      endPage = currentPage + Math.floor(maxVisiblePages / 2);
    }
  }

  return (
    <div className="pagination">
      {currentPage > 1 && (
        <button onClick={() => paginate(currentPage - 1)}>&laquo; Prev</button>
      )}
      
      {startPage > 1 && (
        <>
          <button onClick={() => paginate(1)}>1</button>
          {startPage > 2 && <span className="ellipsis">...</span>}
        </>
      )}
      
      {pageNumbers.slice(startPage - 1, endPage).map(number => (
        <button 
          key={number} 
          onClick={() => paginate(number)}
          className={currentPage === number ? 'active' : ''}
        >
          {number}
        </button>
      ))}
      
      {endPage < pageNumbers.length && (
        <>
          {endPage < pageNumbers.length - 1 && <span className="ellipsis">...</span>}
          <button onClick={() => paginate(pageNumbers.length)}>{pageNumbers.length}</button>
        </>
      )}
      
      {currentPage < pageNumbers.length && (
        <button onClick={() => paginate(currentPage + 1)}>Next &raquo;</button>
      )}
    </div>
  );
};

export default Profile;