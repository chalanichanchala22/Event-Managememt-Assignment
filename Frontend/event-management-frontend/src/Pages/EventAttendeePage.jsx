// src/pages/EventAttendeePage.js
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { registerAttendee, getAttendeesByEvent } from '../Api/EventApi';
import Input from '../Components/Input';
import Button from '../Components/Button';

function EventAttendeePage() {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const [attendees, setAttendees] = useState([]);
  const [formData, setFormData] = useState({ name: '', email: '' });
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchAttendees = async () => {
      try {
        setIsLoading(true);
        const response = await getAttendeesByEvent(eventId);
        setAttendees(response.data);
        setError(null);
      } catch (err) {
        setError('Failed to fetch attendees: ' + (err.message || 'Unknown error'));
      } finally {
        setIsLoading(false);
      }
    };
    fetchAttendees();
  }, [eventId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      await registerAttendee(eventId, formData);
      const response = await getAttendeesByEvent(eventId);
      setAttendees(response.data);
      setFormData({ name: '', email: '' });
    } catch (err) {
      setError('Failed to register attendee: ' + (err.message || 'Unknown error'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', padding: '2rem' }}>
      <h2>Attendees for Event #{eventId}</h2>
      <form onSubmit={handleSubmit} style={{ marginBottom: '2rem' }}>
        <Input
          label="Name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
        />
        <Input
          label="Email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
          type="email"
        />
        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Registering...' : 'Register Attendee'}
        </Button>
      </form>
      {error && <div style={{ color: 'red', marginBottom: '1rem' }}>{error}</div>}
      <h3>Attendee List</h3>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {attendees.map((attendee) => (
          <li key={attendee.id} style={{ marginBottom: '0.5rem' }}>
            {attendee.name} ({attendee.email})
          </li>
        ))}
      </ul>
      <Button onClick={() => navigate(-1)}>Back to Event</Button>
    </div>
  );
}

export default EventAttendeePage;
