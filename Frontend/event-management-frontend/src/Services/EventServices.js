import axios from 'axios';
import { API_BASE_URL } from '../Constants';

// Fetch all events
export const getEvents = (params) => axios.get(`${API_BASE_URL}/events`, { params });

// Fetch single event
export const getEventById = (id) => axios.get(`${API_BASE_URL}/events/${id}`);

// Create event
export const createEvent = (data) => axios.post(`${API_BASE_URL}/events`, data);

// Update event
export const updateEvent = (id, data) => axios.put(`${API_BASE_URL}/events/${id}`, data);

// Delete event
export const deleteEvent = (id) => axios.delete(`${API_BASE_URL}/events/${id}`);

// Register attendee
export const registerAttendee = (eventId, attendee) => 
  axios.post(`${API_BASE_URL}/events/${eventId}/attendees`, attendee);

// Get attendees
export const getAttendeesByEvent = (eventId) =>
  axios.get(`${API_BASE_URL}/events/${eventId}/attendees`);
