import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useEventContext } from '../Context/EventContext';
import Input from '../Components/Input';
import Button from '../Components/Button';
import '../App.css';

const EventUpdate = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getEventById, handleUpdateEvent } = useEventContext();

  const [form, setForm] = useState(null);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true);
  const [disabled, setDisabled] = useState(false);

  useEffect(() => {
    const fetchEvent = async () => {
      const data = await getEventById(id);
      if (new Date(data.date) < new Date()) {
        setDisabled(true);
      }
      setForm(data);
      setLoading(false);
    };
    fetchEvent();
  }, [id]);

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
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    await handleUpdateEvent(id, form);
    navigate('/events');
  };

  if (loading) return <p>Loading...</p>;

  if (!form) return <p>Event not found</p>;

  return (
    <div className="page-container">
      <h2>Update Event</h2>
      {disabled ? (
        <p style={{ color: 'red' }}>You can't update a past event.</p>
      ) : (
        <form className="form-container" onSubmit={handleSubmit}>
          <Input label="Name" name="name" value={form.name} onChange={handleChange} error={errors.name} />
          <Input label="Description" name="description" value={form.description} onChange={handleChange} />
          <Input type="date" label="Date" name="date" value={form.date?.substring(0, 10)} onChange={handleChange} error={errors.date} />
          <Input label="Location" name="location" value={form.location} onChange={handleChange} error={errors.location} />
          <Input label="Created By" name="created_by" value={form.created_by} onChange={handleChange} error={errors.created_by} />
          <Input type="number" label="Capacity" name="capacity" value={form.capacity} onChange={handleChange} error={errors.capacity} />
          <Input label="Tags" name="tags" value={form.tags} onChange={handleChange} />

          <div style={{ marginTop: '1rem' }}>
            <Button type="submit">Update</Button>
            <Button type="button" onClick={() => navigate('/events')} variant="secondary">Cancel</Button>
          </div>
        </form>
      )}
    </div>
  );
};

export default EventUpdate;
