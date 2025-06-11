import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createEvent } from '../Api/EventApi';
import { useEventContext } from '../Context/EventContext';
import Input from '../Components/Input';
import Button from '../Components/Button';
import '../Styles/EventCreationPage.css';

function EventCreationPage() {
  const { setEvents, setError } = useEventContext();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    date: '',
    location: '',
    capacity: '',
    tags: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

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
      const eventData = {
        ...formData,
        capacity: parseInt(formData.capacity),
        remainingCapacity: parseInt(formData.capacity),
        tags: formData.tags.split(',').map(tag => tag.trim()).filter(Boolean),
      };
      const newEvent = await createEvent(eventData);
      setEvents(prev => [...prev, newEvent]);
      navigate('/');
    } catch (err) {
      console.error('Error creating event:', err);
      setError('Failed to create event: ' + (err.message || 'Unknown error'));
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

  return (
    <div className="page-container">
      <h1>Create Event</h1>
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
            {isSubmitting ? 'Creating...' : 'Create Event'}
          </Button>
          <Button type="button" onClick={() => navigate('/')}>
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
}

export default EventCreationPage;
