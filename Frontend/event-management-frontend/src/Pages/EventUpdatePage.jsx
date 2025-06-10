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
  const navigate = useNavigate();

  useEffect(() => {
    const event = events.find((e) => e.id === parseInt(id));
    if (event) {
      setFormData({
        name: event.name,
        description: event.description,
        date: event.date,
        location: event.location,
        capacity: event.capacity,
        tags: event.tags,
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
    if (!formData.capacity || formData.capacity <= 0) newErrors.capacity = 'Valid capacity is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    try {
      const updatedEvent = await updateEvent(id, {
        ...formData,
        capacity: parseInt(formData.capacity),
        remainingCapacity: parseInt(formData.capacity),
      });
      setEvents((prev) => prev.map((e) => (e.id === parseInt(id) ? updatedEvent : e)));
      navigate('/');
    } catch (err) {
      setError('Failed to update event');
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  if (!formData) return null;

  return (
    <div className="page-container">
      <h1>Update Event</h1>
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
          type="capacity"
          name="capacity"
          value={formData.capacity}
          onChange={handleChange}
          error={errors.capacity}
          required
        />
        <Input
          label="Tags"
          name="tags"
          value={formData.tags}
          onChange={handleChange}
        />
        <Button type="submit">Update</Button>
        <Button onClick={() => navigate('/')}>Cancel</Button>
      </form>
    </div>
  );
}

export default EventUpdatePage;