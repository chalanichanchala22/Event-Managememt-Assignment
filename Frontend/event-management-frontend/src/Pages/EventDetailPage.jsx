import { useState, useEffect } from 'react';
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
  const [filterText, setFilterText] = useState('');
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

  // Filter attendees based on search text
  const filteredAttendees = filterText
    ? attendees.filter(
        (attendee) => {
          const searchTerm = filterText.toLowerCase();
          return (
            (attendee.name && attendee.name.toLowerCase().includes(searchTerm)) ||
            (attendee.email && attendee.email.toLowerCase().includes(searchTerm))
            // Note: The attendee object likely doesn't have a location property
          );
        }
      )
    : attendees;
  
  const isFiltering = filterText.length > 0;

  // If you want to be able to search by clicking a button instead of live filtering:
  // eslint-disable-next-line no-empty-pattern
  const [] = useState('');
  

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

  return (
    <div className="page-container">
      <div className="event-detail-box">
        <h1>{event.name}</h1>
        <p><strong>Description:</strong> {event.description}</p>
        <p><strong>Date:</strong> {event.date}</p>
        <p><strong>Location:</strong> {event.location}</p>
        <p><strong>Capacity:</strong> {event.remainingCapacity}/{event.capacity}</p>
        <p><strong>Tags:</strong> {event.tags}</p>
      </div>
      
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
      
      {analytics && (
        <div className="event-detail-box">
          <h2>Analytics</h2>
          <p>Total Attendees: {analytics.totalAttendees}</p>
          <p>Capacity Utilization: {analytics.capacityUtilization}%</p>
        </div>
      )}
      <br></br>
      
      <div className="attendees-section">
        <h2>Attendees</h2>
        <div className="filter-container">
          
         
        </div>
        <Table 
          headers={headers} 
          data={filteredAttendees} 
          renderRow={renderRow} 
          isFiltering={isFiltering}
          totalCount={attendees.length}
        />
      </div>
      <Button onClick={() => navigate('/')}>Back to Events</Button>
    </div>
  );
}

export default EventDetailPage;