import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { getEvents, deleteEvent } from '../Api/EventApi';
import { useEventContext } from '../Context/EventContext';
import Table from '../Components/Table';
import Button from '../Components/Button';
import Modal from '../Components/Modal';
import '../Styles/EventListPage.css';
import Input from '../Components/Input';


function EventListPage() {
  const { events, setEvents, setError } = useEventContext();
  const [page] = useState(1);
  const [totalPages, setTotalPages] = useState(1);  // Fixed: proper destructuring
  const [appliedFilters, setAppliedFilters] = useState({ date: '', location: '', tags: '' });
  const [modalOpen, setModalOpen] = useState(false);
  const [eventToDelete, setEventToDelete] = useState(null);
  const [loading, setLoading] = useState(true);
  const [dataToDisplay, setDataToDisplay] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [tableSearch, setTableSearch] = useState(''); 
  const [eventsPerPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);
  const navigate = useNavigate();
  const location = useLocation();

  // Extract query parameters on component mount
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const date = searchParams.get('date') || '';
    const loc = searchParams.get('location') || '';
    const tags = searchParams.get('tags') || '';
    const query = searchParams.get('query') || '';
    
    if (date || loc || tags || query) {
      const newFilters = { date, location: loc, tags };
      setAppliedFilters(newFilters);
      setSearchQuery(query);
    }
  }, [location.search]);

  // Add function to handle table search
  const handleTableSearch = (e) => {
    const searchValue = e.target.value.toLowerCase();
    setTableSearch(searchValue);
  };
  
  // Function to execute table search
  const executeTableSearch = () => {
    if (!tableSearch) {
      // If search is cleared, show all events based on current filters
      setDataToDisplay(events);
      return;
    }
    
    // Filter events locally based on name or location or date only
    const filteredEvents = events.filter(event => 
      event.name.toLowerCase().includes(tableSearch) ||
      event.location.toLowerCase().includes(tableSearch) ||
      (event.date && new Date(event.date).toLocaleDateString().toLowerCase().includes(tableSearch))
    );
    
    setDataToDisplay(filteredEvents);
  };
  
  // Function to handle search on enter key
  const handleTableSearchKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      executeTableSearch();
    }
  };

  // Updated loadEvents function with console logs removed
  const loadEvents = useCallback(async () => {
    try {
      setLoading(true);
      
      // Add searchQuery to the API call
      const response = await getEvents(page, 10, { ...appliedFilters, query: searchQuery });
      
      // Assuming API returns { data, totalPages, totalCount } or similar structure
      const { data, totalPages: pages, totalCount: count } = response.data || 
        { data: response, totalPages: 1, totalCount: response.length };
      
      setEvents(data);
      setDataToDisplay(data);
      setTableSearch(''); // Reset table search when new data is loaded
      setTotalPages(pages || 1);
      setTotalCount(count || data.length);
    } catch (err) {
      setError('Failed to fetch events');
    } finally {
      setLoading(false);
    }
  }, [page, appliedFilters, searchQuery, setEvents, setError]);

  useEffect(() => {
    loadEvents();
  }, [loadEvents]);

  const handleDelete = async () => {
    try {
      setLoading(true);
      await deleteEvent(eventToDelete);
      setEvents(events.filter((event) => event.id !== eventToDelete));
      setDataToDisplay(dataToDisplay.filter((event) => event.id !== eventToDelete));
      setModalOpen(false);
    } catch (err) {
      setError('Failed to delete event');
    } finally {
      setLoading(false);
    }
  };

  const headers = ['Name', 'Date', 'Location', 'Capacity', 'Actions'];

  const renderRow = (event) => (
    <tr key={event.id}>
      <td>{event.name}</td>
      <td>{new Date(event.date).toLocaleDateString()}</td>
      <td>{event.location}</td>
      <td>{event.remainingCapacity}/{event.capacity}</td>
      <td className="action-buttons">
        <Button onClick={() => navigate(`/event/${event.id}`)}>View</Button>
        <Button onClick={() => navigate(`/update/${event.id}`)}>Edit</Button>
        <Button
          variant="danger"
          onClick={() => {
            setEventToDelete(event.id);
            setModalOpen(true);
          }}
        >
          Delete
        </Button>
      </td>
    </tr>
  );

  // Helper function to check if filters are active
  const isFilteringActive = () => {
    return Object.values(appliedFilters).some(value => value !== '') || searchQuery !== '';
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Event Management System</h1>
        <Button className="create-button" onClick={() => navigate('/create')}>Create Event</Button>
      </div>

      {loading ? (
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading events...</p>
        </div>
      ) : dataToDisplay.length > 0 ? (
        <>
          <div className="table-search-controls">
            <div className="table-search-input-group">
              <Input
                type="text"
                placeholder="Search By Name, Location, or Date"
                value={tableSearch}
                onChange={handleTableSearch}
                onKeyPress={handleTableSearchKeyPress}
                className="table-search-input"
              />
              <div className="table-button-group">
                <Button 
                  onClick={executeTableSearch}
                  className="table-search-button"
                  variant="primary"
                >
                  <i className="fa fa-search"></i> Search
                </Button>
                <Button 
                  onClick={() => {
                    setTableSearch('');
                    setDataToDisplay(events);
                    setCurrentPage(1); // Reset to first page when clearing search
                  }}
                  className="clear-search-button"
                  variant="secondary"
                >
                  Clear
                </Button>
              </div>
            </div>
          </div>
          <Table 
            headers={headers} 
            data={dataToDisplay
              .slice((currentPage - 1) * eventsPerPage, currentPage * eventsPerPage)} 
            renderRow={renderRow}
            isFiltering={isFilteringActive()}
            totalCount={totalCount}
          />
          
          <div className="pagination">
            <Button 
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} 
              disabled={currentPage === 1}
            >
              Previous
            </Button>
            <span className="page-indicator">
              Page {currentPage} of {Math.ceil(dataToDisplay.length / eventsPerPage)}
            </span>
            <Button 
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, Math.ceil(dataToDisplay.length / eventsPerPage)))} 
              disabled={currentPage >= Math.ceil(dataToDisplay.length / eventsPerPage)}
            >
              Next
            </Button>
          </div>
          {dataToDisplay.length > 0 && (
            <div className="pagination-info">
              Showing {(currentPage - 1) * eventsPerPage + 1} - {Math.min(currentPage * eventsPerPage, dataToDisplay.length)} of {dataToDisplay.length} events
            </div>
          )}
        </>
      ) : (
        <div className="no-events-message">
          {isFilteringActive() 
            ? "No events match your search criteria. Try adjusting your filters." 
            : "No events found. Create your first event using the button above."}
        </div>
      )}

      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onConfirm={handleDelete}
        title="Confirm Deletion"
      >
        Are you sure you want to delete this event?
      </Modal>
    </div>
  );
}

export default EventListPage;