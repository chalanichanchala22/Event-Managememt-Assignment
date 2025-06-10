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
    if (!formData.capacity || formData.capacity <= 0) newErrors.capacity = 'Valid capacity is required';
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
        capacity: parseInt(formData.capacity) || 0,
        remainingCapacity: parseInt(formData.capacity) || 0,
        tags: formData.tags.split(',').map(tag => tag.trim()).filter(Boolean)
      };
      
      const newEvent = await createEvent(eventData);
      setEvents(prev => [...prev, newEvent]);
      navigate('/');
    } catch (err) {
      console.error("Error creating event:", err);
      setError('Failed to create event: ' + (err.message || 'Unknown error'));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  return (
    <div className="page-container">
      <h1>Create Event</h1>
      <form onSubmit={handleSubmit} className="form-container">
        <Input
          label="Name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          error={errors.name}
          required
        />
        <Input
          label="Description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          as="textarea"
        />
        <Input
          label="Date"
          type="date"
          name="date"
          value={formData.date}
          onChange={handleChange}
          error={errors.date}
          required
        />
        <Input
          label="Location"
          name="location"
          value={formData.location}
          onChange={handleChange}
          error={errors.location}
          required
        />
        <Input
          label="Capacity"
          type="number"
          name="capacity"
          value={formData.capacity}
          onChange={handleChange}
          error={errors.capacity}
          required
          min="1"
        />
        <Input
          label="Tags"
          name="tags"
          value={formData.tags}
          onChange={handleChange}
          placeholder="e.g. conference, tech, workshop"
        />
        <div className="button-group">
          <Button 
            type="submit" 
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Creating...' : 'Create Event'}
          </Button>
          <Button 
            type="button" 
            onClick={() => navigate('/')}
          >
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
}

export default EventCreationPage;