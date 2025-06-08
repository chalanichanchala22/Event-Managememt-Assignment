import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useEventContext } from '../Context/EventContext';
import Input from '../Components/Input';
import Button from '../Components/Button';
import Table from '../Components/Table'; // Import Table component
import '../App.css';

const initialAttendee = {
  name: '',
  email: '',
};

const EventDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const {
    getEventById,
    getAttendeesByEvent,
    registerAttendee,
  } = useEventContext();

  const [event, setEvent] = useState(null);
  const [attendees, setAttendees] = useState([]);
  const [attendee, setAttendee] = useState(initialAttendee);
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      const eventData = await getEventById(id);
      const attendeeList = await getAttendeesByEvent(id);
      setEvent(eventData);
      setAttendees(attendeeList);
    };
    fetchData();
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setAttendee((prev) => ({ ...prev, [name]: value }));
  };

  const validate = () => {
    const newErrors = {};
    if (!attendee.name) newErrors.name = 'Name is required';
    if (!attendee.email) newErrors.email = 'Email is required';
    return newErrors;
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    try {
      await registerAttendee(id, attendee);
      setMessage('Registration successful!');
      setAttendee(initialAttendee);
      // Refresh both attendees and event data to get updated remaining capacity
      const updatedAttendees = await getAttendeesByEvent(id);
      const updatedEvent = await getEventById(id);
      setAttendees(updatedAttendees);
      setEvent(updatedEvent);
    } catch (err) {
      setMessage('Registration failed: ' + err.message);
    }
  };

  if (!event) return <p>Loading...</p>;

  return (
    <div className="page-container">
      <h2>Event Detail</h2>
      <div className="event-detail-box">
        <p><strong>Name:</strong> {event.name}</p>
        <p><strong>Date:</strong> {event.date?.substring(0, 10)}</p>
        <p><strong>Location:</strong> {event.location}</p>
        <p><strong>Description:</strong> {event.description}</p>
        <p><strong>Capacity:</strong> {event.capacity}</p>
        <p><strong>Remaining Capacity:</strong> {event.remainingCapacity}</p>
        <p><strong>Tags:</strong> {event.tags}</p>
      </div>

      <h3>Register as Attendee</h3>
      <form className="form-container" onSubmit={handleRegister}>
        <Input label="Name" name="name" value={attendee.name} onChange={handleInputChange} error={errors.name} />
        <Input label="Email" name="email" value={attendee.email} onChange={handleInputChange} error={errors.email} />
        <Button type="submit" disabled={event.remainingCapacity <= 0}>Register</Button>
      </form>

      {event.remainingCapacity <= 0 && <p style={{ color: 'red' }}>This event is at full capacity</p>}
      {message && <p style={{ color: message.includes('failed') ? 'red' : 'green' }}>{message}</p>}

      <h3>Registered Attendees</h3>
      {attendees && attendees.length > 0 ? (
        <div className="attendee-list">
          <Table 
            headers={['Name', 'Email']} 
            data={attendees} 
            renderRow={(attendee, index) => (
              <tr key={index}>
                <td>{attendee.name}</td>
                <td>{attendee.email}</td>
              </tr>
            )}
          />
        </div>
      ) : (
        <p>No attendees registered yet.</p>
      )}

      <Button variant="secondary" onClick={() => navigate('/events')}>Back to Events</Button>
    </div>
  );
};

export default EventDetail;
