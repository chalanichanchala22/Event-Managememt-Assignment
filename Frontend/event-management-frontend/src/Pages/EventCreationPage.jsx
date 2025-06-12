import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createEvent } from '../Api/EventApi';
import { useEventContext } from '../Context/EventContext';
import Input from '../Components/Input';
import Button from '../Components/Button';
import '../Styles/EventCreationPage.css';

function EventCreationPage() {
  // Context and navigation
  const { setEvents, setError } = useEventContext();
  const navigate = useNavigate();
  
  // State management
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    name: '',
    date: '',
    location: '',
    capacity: '',
    tags: '',
  });

  // Form validation
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

  // Event handlers
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

  // Form rendering helper components
  const renderField = (name, label, type = 'text', placeholder = '', min = null) => (
    <div className="input-group">
      <label htmlFor={name}>{label}</label>
      <Input
        type={type}
        name={name}
        value={formData[name]}
        onChange={handleChange}
        placeholder={placeholder}
        className={errors[name] ? 'error' : ''}
        min={min}
      />
      {errors[name] && <div className="error-msg">{errors[name]}</div>}
    </div>
  );

  // Render
  return (
    <div className="page-container">
      <form onSubmit={handleSubmit} className="form-container">
        <h1>Create Event</h1>
        
        {renderField('name', 'Name', 'text', 'Event Name')} 
        {renderField('date', 'Date', 'date')}
        {renderField('location', 'Location', 'text', 'Event Location')}
        {renderField('capacity', 'Capacity', 'number', 'Number of participants', '1')}
        {renderField('tags', 'Tags', 'text', 'e.g. conference, tech, workshop')}

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
