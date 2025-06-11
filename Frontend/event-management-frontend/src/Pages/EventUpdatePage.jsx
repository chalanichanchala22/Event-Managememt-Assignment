import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { updateEvent } from '../Api/EventApi';
import { useEventContext } from '../Context/EventContext';
import Input from '../Components/Input';
import Button from '../Components/Button';
import '../Styles/EventUpdatePage.css';

function EventUpdatePage() {
  const { id } = useParams();
  const { events, setEvents, setError } = useEventContext();
  const [formData, setFormData] = useState(null);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const [originalEvent, setOriginalEvent] = useState(null);

  useEffect(() => {
    const event = events.find((e) => e.id === parseInt(id));
    if (event) {
      setOriginalEvent(event); // Store the original event
      setFormData({
        name: event.name,
        date: event.date,
        location: event.location,
        capacity: event.capacity,
        tags: Array.isArray(event.tags) ? event.tags.join(', ') : event.tags,
      });
    } else {
      setError('Event not found');
      navigate('/');
    }
  }, [id, events, setError, navigate]);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name) newErrors.name = 'Name is required';
    if (!formData.date) newErrors.date = 'Date is required';
    if (!formData.location) newErrors.location = 'Location is required';
    if (!formData.capacity || formData.capacity <= 0) {
      newErrors.capacity = 'Capacity must be greater than 0';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    try {
      // Calculate new remainingCapacity based on the difference between new and old capacity
      const capacityDifference = parseInt(formData.capacity) - originalEvent.capacity;
      const newRemainingCapacity = originalEvent.remainingCapacity + capacityDifference;
      
      // Create the payload with all required fields
      const eventPayload = {
        ...formData,
        capacity: parseInt(formData.capacity),
        remainingCapacity: newRemainingCapacity,
        id: parseInt(id),
        tags: formData.tags.split(',').map(tag => tag.trim()).filter(Boolean),
        // Preserve any other fields from the original event that should be kept
        registrations: originalEvent.registrations || []
      };
      
      const updatedEvent = await updateEvent(id, eventPayload);
      
      // Update the events state with the complete updated event
      setEvents(prev => prev.map(e => e.id === parseInt(id) ? updatedEvent : e));
      navigate('/');
    } catch (err) {
      console.error('Update error:', err);
      setError('Failed to update event: ' + (err.message || 'Unknown error'));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  if (!formData) return null;

  return (
    <div className="page-container">
      <h1>Update Event</h1>
      <form onSubmit={handleSubmit} className="form-container">
        <div className="input-group">
          <label htmlFor="name">Name</label>
          <Input
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Event Name"
            className={errors.name ? 'error' : ''}
          />
          {errors.name && <div className="error-msg">{errors.name}</div>}
        </div>
        <div className="input-group">
          <label htmlFor="date">Date</label>
          <Input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            className={errors.date ? 'error' : ''}
          />
          {errors.date && <div className="error-msg">{errors.date}</div>}
        </div>

        <div className="input-group">
          <label htmlFor="location">Location</label>
          <Input
            name="location"
            value={formData.location}
            onChange={handleChange}
            placeholder="Event Location"
            className={errors.location ? 'error' : ''}
          />
          {errors.location && <div className="error-msg">{errors.location}</div>}
        </div>

        <div className="input-group">
          <label htmlFor="capacity">Capacity</label>
          <Input
            type="number"
            name="capacity"
            value={formData.capacity}
            onChange={handleChange}
            placeholder="Number of participants"
            min="1"
            className={errors.capacity ? 'error' : ''}
          />
          {errors.capacity && <div className="error-msg">{errors.capacity}</div>}
        </div>

        <div className="input-group">
          <label htmlFor="tags">Tags</label>
          <Input
            name="tags"
            value={formData.tags}
            onChange={handleChange}
            placeholder="e.g. conference, tech, workshop"
          />
        </div>

        <div className="button-group">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Updating...' : 'Update Event'}
          </Button>
          <Button type="button" onClick={() => navigate('/')}>
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
}

export default EventUpdatePage;