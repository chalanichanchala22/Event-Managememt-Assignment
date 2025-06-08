import React, { useEffect, useState } from 'react';
import { useEventContext } from '../Context/EventContext';
import Table from '../Components/Table';
import Model from '../Components/Model';
import Button from '../Components/Button';
import { useNavigate } from 'react-router-dom';
import '../App.css';

const EventList = () => {
  const {
    events,
    loadEvents,
    handleDeleteEvent,
    loading,
    error,
  } = useEventContext() || {}; // Add fallback empty object

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedEventId, setSelectedEventId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Only call loadEvents when it's available
    if (loadEvents) {
      loadEvents();
    }
  }, [loadEvents]);

  const handleSearch = () => {
    if (loadEvents) {
      loadEvents({ search: searchTerm });
    }
  };

  const confirmDelete = (id) => {
    setSelectedEventId(id);
    setIsModalOpen(true);
  };

  const deleteConfirmed = async () => {
    if (handleDeleteEvent) {
      await handleDeleteEvent(selectedEventId);
    }
    setIsModalOpen(false);
  };

  const headers = ['Name', 'Date', 'Location', 'Actions'];

  const renderRow = (event) => (
    <tr key={event.id}>
      <td>{event.name}</td>
      <td>{new Date(event.date).toLocaleDateString()}</td>
      <td>{event.location}</td>
      <td>
        <Button onClick={() => navigate(`/events/${event.id}`)}>View</Button>{' '}
        <Button onClick={() => navigate(`/events/update/${event.id}`)}>Edit</Button>{' '}
        <Button onClick={() => confirmDelete(event.id)} variant="danger">Delete</Button>
      </td>
    </tr>
  );

  return (
    <div className="page-container">
      <h2>Event List</h2>

      <div className="search-filter-bar">
        <input
          type="text"
          placeholder="Search by name or location"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <Button onClick={handleSearch}>Search</Button>
        <Button onClick={() => navigate('/events/create')}>+ Create Event</Button>
      </div>

      {loading && <p>Loading...</p>}
      {error && <p className="error-msg">{error}</p>}

      <Table headers={headers} data={events || []} renderRow={renderRow} />

      <Model isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <h4>Confirm Deletion</h4>
        <p>Are you sure you want to delete this event?</p>
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
          <Button onClick={() => setIsModalOpen(false)}>Cancel</Button>
          <Button onClick={deleteConfirmed} variant="danger">Delete</Button>
        </div>
      </Model>
    </div>
  );
};

export default EventList;
