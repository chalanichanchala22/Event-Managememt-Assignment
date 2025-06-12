// src/pages/EventAttendeePage.js
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { registerAttendee, getAttendeesByEvent } from '../Api/EventApi';
import Input from '../Components/Input';
import Button from '../Components/Button';
import '../Styles/EventAttendeePage.css'; 
function EventAttendeePage() {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const [attendees, setAttendees] = useState([]);
  const [formData, setFormData] = useState({ name: '', email: '' });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState(null);

  useEffect(() => {
    const fetchAttendees = async () => {
      try {
        setIsLoading(true);
        const response = await getAttendeesByEvent(eventId);
        setAttendees(response.data);
        setApiError(null);
      } catch (err) {
        setApiError('Failed to fetch attendees: ' + (err.message || 'Unknown error'));
      } finally {
        setIsLoading(false);
      }
    };
    fetchAttendees();
  }, [eventId]);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name) newErrors.name = 'Name is required';
    if (!formData.email) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    setApiError(null);
    try {
      await registerAttendee(eventId, formData);
      const response = await getAttendeesByEvent(eventId);
      setAttendees(response.data);
      setFormData({ name: '', email: '' });
    } catch (err) {
      setApiError('Failed to register attendee: ' + (err.message || 'Unknown error'));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="page-container">
      <h1>Attendees for Event #{eventId}</h1>
      
      {apiError && <div className="error-banner">{apiError}</div>}

      <div className="two-column-layout">
        <div className="column registration-column">
         
          <form onSubmit={handleSubmit} className="form-container">
            <h2>Register Attendee</h2>
            <div className="input-group">
               
              <label htmlFor="name">Name</label>
              <Input
                name="name"
                value={formData.name}
                onChange={handleChange}
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
                value={formData.email}
                onChange={handleChange}
                placeholder="Attendee Email"
                className={errors.email ? 'error' : ''}
              />
              {errors.email && <div className="error-msg">{errors.email}</div>}
            </div>

            <div className="button-group">
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Registering...' : 'Register Attendee'}
              </Button>
            </div>
          </form>
        </div>

        <div className="column attendees-column">
          <div className="attendees-section">
            <h2>Attendee List</h2>
            {isLoading ? (
              <div className="loading">Loading attendees...</div>
            ) : attendees.length > 0 ? (
              <ul className="attendee-list">
                {attendees.map((attendee) => (
                  <li key={attendee.id} className="attendee-item">
                    <span className="attendee-name">{attendee.name}</span>
                    <span className="attendee-email">({attendee.email})</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="no-attendees">No attendees registered yet.</p>
            )}
          </div>
        </div>
      </div>

      <div className="back-button-container">
        <Button onClick={() => navigate(-1)} className="back-button">
          Back to Event
        </Button>
      </div>
    </div>
  );
}

export default EventAttendeePage;
