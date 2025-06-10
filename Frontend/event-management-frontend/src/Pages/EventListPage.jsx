import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { getEvents, deleteEvent } from '../Api/EventApi';
import { useEventContext } from '../Context/EventContext';
import Table from '../Components/Table';
import Button from '../Components/Button';
import Modal from '../Components/Modal';
import Input from '../Components/Input';
import '../Styles/EventListPage.css';

function EventListPage() {
  const { events, setEvents, setError } = useEventContext();
  const [page, setPage] = useState(1);
  const [filterValues, setFilterValues] = useState({ date: '', location: '', tags: '' });
  const [appliedFilters, setAppliedFilters] = useState({ date: '', location: '', tags: '' });
  const [modalOpen, setModalOpen] = useState(false);
  const [eventToDelete, setEventToDelete] = useState(null);
  const [allData, setAllData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [isFiltering, setIsFiltering] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Extract query parameters on component mount
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const date = searchParams.get('date') || '';
    const loc = searchParams.get('location') || '';
    const tags = searchParams.get('tags') || '';
    
    if (date || loc || tags) {
      const newFilters = { date, location: loc, tags };
      setFilterValues(newFilters);
      setAppliedFilters(newFilters);
    }
  }, [location.search]);

  // Updated useEffect to log the filters being applied for debugging
  useEffect(() => {
    const loadEvents = async () => {
      try {
        console.log('Fetching events with filters:', appliedFilters);
        const data = await getEvents(page, 10, appliedFilters);
        setEvents(data);
        setAllData(data); // Set all data on fetch
      } catch (err) {
        setError('Failed to fetch events');
      }
    };
    loadEvents();
  }, [page, appliedFilters, setEvents, setError]);

  const handleFilterChange = (e) => {
    setFilterValues({ ...filterValues, [e.target.name]: e.target.value });
  };

  // Improved filter application
  const applyFilters = () => {
    // Log for debugging
    console.log('Applying filters:', filterValues);
    
    // Apply filters to state
    setAppliedFilters(filterValues);
    setPage(1);
    
    // Update URL with query parameters
    const searchParams = new URLSearchParams();
    if (filterValues.date) searchParams.set('date', filterValues.date);
    if (filterValues.location) searchParams.set('location', filterValues.location);
    if (filterValues.tags) searchParams.set('tags', filterValues.tags);
    
    // Get the base path and ensure we use the correct route
    const currentPath = location.pathname.replace(/\/+$/, '');
    
    // Navigate to the current path with the search parameters
    navigate({
      pathname: currentPath, 
      search: searchParams.toString()
    }, { replace: true });
  };

  const clearFilters = () => {
    setFilterValues({ date: '', location: '', tags: '' });
    setAppliedFilters({ date: '', location: '', tags: '' });
    setPage(1);
    
    // Remove query parameters from URL
    navigate(location.pathname, { replace: true });
  };

  const handleDelete = async () => {
    try {
      await deleteEvent(eventToDelete);
      setEvents(events.filter((event) => event.id !== eventToDelete));
      setModalOpen(false);
    } catch (err) {
      setError('Failed to delete event');
    }
  };

  const handleSearch = () => {
    // Apply your filter logic here
    const filtered = allData.filter(item => {
      // Your filter conditions based on item properties and filterValues
      return (
        (!filterValues.date || item.date === filterValues.date) &&
        (!filterValues.location || item.location.includes(filterValues.location)) &&
        (!filterValues.tags || item.tags.some(tag => tag.includes(filterValues.tags)))
      );
    });
    setFilteredData(filtered);
    setIsFiltering(true);
  };

  const headers = ['Name', 'Date', 'Location', 'Capacity', 'Actions'];

  const renderRow = (event) => (
    <tr key={event.id}>
      <td>{event.name}</td>
      <td>{event.date}</td>
      <td>{event.location}</td>
      <td>{event.remainingCapacity}/{event.capacity}</td>
      <td>
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
    return Object.values(appliedFilters).some(value => value !== '');
  };

  // Pass filteredData when filtering is active, otherwise pass allData
  const dataToDisplay = isFiltering ? filteredData : allData;

  return (
    <div className="page-container">
      <h1>Events</h1>
      <Button onClick={() => navigate('/create')}>Create Event</Button>
      <div className="search-filter-container">
        <h3>Filter Events</h3>
        <div className="search-filter-bar">
          <Input
            label="Date"
            type="date"
            name="date"
            value={filterValues.date}
            onChange={handleFilterChange}
            placeholder="Select date"
          />
          <Input
            label="Location"
            name="location"
            value={filterValues.location}
            onChange={handleFilterChange}
            placeholder="Enter location"
          />
          <Input
            label="Tags"
            name="tags"
            value={filterValues.tags}
            onChange={handleFilterChange}
            placeholder="Enter tags"
          />
          <div className="filter-buttons">
            <Button onClick={applyFilters}>Search</Button>
            <Button variant="secondary" onClick={clearFilters}>Clear</Button>
          </div>
        </div>
      </div>
      <Table 
        headers={headers} 
        data={dataToDisplay} 
        renderRow={renderRow}
        isFiltering={isFiltering} 
      />
      <div className="pagination">
        <Button onClick={() => setPage(page - 1)} disabled={page === 1}>
          Previous
        </Button>
        <Button onClick={() => setPage(page + 1)}>Next</Button>
      </div>
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