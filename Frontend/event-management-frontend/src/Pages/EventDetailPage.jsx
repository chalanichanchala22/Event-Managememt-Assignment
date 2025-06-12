import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getAttendeesByEvent, registerAttendee } from '../Api/EventApi';
import { useEventContext } from '../Context/EventContext';
import Table from '../Components/Table';
import Button from '../Components/Button';
import Input from '../Components/Input';
import '../Styles/EventDetailPage.css';

function EventDetailPage() {
  const { id } = useParams();
  const { events, setError } = useEventContext();
  const [attendees, setAttendees] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [attendeeData, setAttendeeData] = useState({ name: '', email: '' });
  const [errors, setErrors] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [attendeesPerPage] = useState(5);
  const navigate = useNavigate();

  const event = events.find((e) => e.id === parseInt(id));

  useEffect(() => {
    const loadData = async () => {
      try {
        const attendeesData = await getAttendeesByEvent(id);
        setAttendees(attendeesData);
        
        // Calculate analytics from available data instead of fetching
        if (event) {
          const analyticsData = {
            totalAttendees: attendeesData.length,
            capacityUtilization: event.capacity ? 
              Math.round((attendeesData.length / event.capacity) * 100) : 0
          };
          setAnalytics(analyticsData);
        }
      } catch (err) {
        setError('Failed to load event details');
      }
    };
    loadData();
  }, [id, setError, event]);

  // No need for filtering logic since it's not being used
  const filteredAttendees = attendees;
  const isFiltering = false;

  const validateForm = () => {
    const newErrors = {};
    if (!attendeeData.name) newErrors.name = 'Name is required';
    if (!attendeeData.email || !/\S+@\S+\.\S+/.test(attendeeData.email))
      newErrors.email = 'Valid email is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    try {
      await registerAttendee(id, attendeeData);
      const updatedAttendees = await getAttendeesByEvent(id);
      setAttendees(updatedAttendees);
      setAttendeeData({ name: '', email: '' });
    } catch (err) {
      setError('Failed to register attendee');
    }
  };

  const headers = ['Name', 'Email'];

  const renderRow = (attendee) => (
    <tr key={attendee.id}>
      <td>{attendee.name}</td>
      <td>{attendee.email}</td>
    </tr>
  );

  if (!event) return <div className="page-container">Event not found</div>;

  // Calculate current attendees to display based on pagination
  const indexOfLastAttendee = currentPage * attendeesPerPage;
  const indexOfFirstAttendee = indexOfLastAttendee - attendeesPerPage;
  const currentAttendees = filteredAttendees.slice(indexOfFirstAttendee, indexOfLastAttendee);
  const totalPages = Math.ceil(filteredAttendees.length / attendeesPerPage);
  
  // Change page
  const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);

  // Pagination component
  const Pagination = () => {
    if (totalPages <= 1) return null;
    
    return (
      <div className="pagination">
        <button 
          onClick={() => handlePageChange(currentPage - 1)} 
          disabled={currentPage === 1}
          className="pagination-button"
        >
          &laquo; Previous
        </button>
        
        <div className="pagination-pages">
          {Array.from({ length: totalPages }, (_, i) => i + 1)
            .filter(page => 
              page === 1 || 
              page === totalPages || 
              (page >= currentPage - 1 && page <= currentPage + 1)
            )
            .map((page, index, array) => (
              <React.Fragment key={page}>
                {index > 0 && array[index - 1] !== page - 1 && (
                  <span className="pagination-ellipsis">...</span>
                )}
                <button 
                  onClick={() => handlePageChange(page)}
                  className={`pagination-page-button ${currentPage === page ? 'active' : ''}`}
                >
                  {page}
                </button>
              </React.Fragment>
            ))}
        </div>
        
        <button 
          onClick={() => handlePageChange(currentPage + 1)} 
          disabled={currentPage === totalPages}
          className="pagination-button"
        >
          Next &raquo;
        </button>
      </div>
    );
  };

  return (
    <div className="page-container">
      <div className="event-detail-header">
        <h1>{event.name}</h1>
        <Button className="back-button" onClick={() => navigate('/')}>Back to Events</Button>
      </div>

      <div className="event-detail-box">
        <p><strong>Date:</strong> {event.date}</p>
        <p><strong>Location:</strong> {event.location}</p>
        <p><strong>Capacity:</strong> {event.remainingCapacity}/{event.capacity}</p>
        <p><strong>Tags:</strong> {event.tags}</p>
      </div>
      
      <div className="two-column-layout">
        <div className="left-column">
          <h2>Register Attendee</h2>
          <form onSubmit={handleRegister} className="form-container">
            <div className="input-group">
              <label htmlFor="name">Name</label>
              <Input
                name="name"
                value={attendeeData.name}
                onChange={(e) => setAttendeeData({ ...attendeeData, name: e.target.value })}
                placeholder="Attendee Name"
                className={errors.name ? 'error' : ''}
              />
              {errors.name && <div className="error-msg">{errors.name}</div>}
            </div>
            
            <div className="input-group">
              <label htmlFor="email">Email</label>
              <Input
                type="email"
                name="email"
                value={attendeeData.email}
                onChange={(e) => setAttendeeData({ ...attendeeData, email: e.target.value })}
                placeholder="Attendee Email"
                className={errors.email ? 'error' : ''}
              />
              {errors.email && <div className="error-msg">{errors.email}</div>}
            </div>
            
            <div className="button-group">
              <Button type="submit">Register Attendee</Button>
            </div>
          </form>
        </div>
        
        <div className="right-column">
          {analytics && (
            <div className="event-detail-box analytics-box">
              <h2>Event Statistics</h2>
              
              <div className="stat-card">
                <div className="stat-icon">👥</div>
                <div className="stat-content">
                  <div className="stat-value">{analytics.totalAttendees}</div>
                  <div className="stat-label">Registered Attendees</div>
                </div>
              </div>
              
              <div className="stat-card">
                <div className="stat-icon">📊</div>
                <div className="stat-content">
                  <div className="stat-value">{analytics.capacityUtilization}%</div>
                  <div className="stat-label">Capacity Filled</div>
                </div>
                <div className="progress-bar">
                  <div 
                    className={`progress-fill ${
                      analytics.capacityUtilization < 50 ? 'low' : 
                      analytics.capacityUtilization < 80 ? 'medium' : 'high'
                    }`}
                    style={{ width: `${Math.min(analytics.capacityUtilization, 100)}%` }}
                  ></div>
                </div>
              </div>
              
              <div className="stat-card">
                <div className="stat-icon">🪑</div>
                <div className="stat-content">
                  <div className="stat-value">{event.remainingCapacity}</div>
                  <div className="stat-label">Seats Available</div>
                </div>
              </div>

            </div>
          )}
        </div>
      </div>
      
      <div className="attendees-section">
        <h2>Attendees</h2>
        {/* Removed empty filter container */}
        <Table 
          headers={headers} 
          data={currentAttendees} 
          renderRow={renderRow} 
          isFiltering={isFiltering}
          totalCount={attendees.length}
        />
        <Pagination />
        {filteredAttendees.length > 0 && (
          <div className="pagination-info">
            Showing {indexOfFirstAttendee + 1} - {Math.min(indexOfLastAttendee, filteredAttendees.length)} of {filteredAttendees.length} attendees
          </div>
        )}
      </div>
    </div>
  );
}

export default EventDetailPage;