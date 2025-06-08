import React, { useState } from 'react';
import { useEventContext } from '../Context/EventContext';
import { useNavigate } from 'react-router-dom';
import Input from '../Components/Input';
import Button from '../Components/Button';
import '../App.css';

const initialForm = {
  name: '',
  description: '',
  date: '',
  location: '',
  created_by: '',
  capacity: '',
  tags: '',
};

const EventCreate = () => {
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const { handleCreateEvent } = useEventContext();

  const validate = () => {
    const newErrors = {};
    if (!form.name) newErrors.name = 'Name is required';
    if (!form.date) newErrors.date = 'Date is required';
    if (!form.location) newErrors.location = 'Location is required';
    if (!form.created_by) newErrors.created_by = 'Created By is required';
    if (!form.capacity || form.capacity <= 0) newErrors.capacity = 'Capacity must be greater than 0';
    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    try {
      await handleCreateEvent({ ...form, remaining_capacity: form.capacity });
      navigate('/events');
    } catch (err) {
      console.error('Creation failed', err);
    }
  };

  return (
    <div className="page-container">
      <h2>Create Event</h2>
      <form className="form-container" onSubmit={handleSubmit}>
        <Input label="Name" name="name" value={form.name} onChange={handleChange} error={errors.name} />
        <Input label="Description" name="description" value={form.description} onChange={handleChange} />
        <Input type="date" label="Date" name="date" value={form.date} onChange={handleChange} error={errors.date} />
        <Input label="Location" name="location" value={form.location} onChange={handleChange} error={errors.location} />
        <Input label="Created By" name="created_by" value={form.created_by} onChange={handleChange} error={errors.created_by} />
        <Input type="number" label="Capacity" name="capacity" value={form.capacity} onChange={handleChange} error={errors.capacity} />
        <Input label="Tags (comma-separated)" name="tags" value={form.tags} onChange={handleChange} />

        <div style={{ marginTop: '1rem' }}>
          <Button type="submit">Create</Button>
          <Button type="button" onClick={() => navigate('/events')} variant="secondary">Cancel</Button>
        </div>
      </form>
    </div>
  );
};

export default EventCreate;
