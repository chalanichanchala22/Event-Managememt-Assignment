import axios from 'axios';
import { API_BASE_URL } from '../Constants';

// Add request interceptor for debugging
axios.interceptors.request.use(request => {
  if (request.url.includes('/events') && request.method === 'post') {
    console.log('Request data:', request.data);
  }
  return request;
});

// Fetch all events
export const getEvents = async (page, limit, filters) => {
  try {
    // Create URL with query parameters for pagination
    let url = `${API_BASE_URL}/events?page=${page}&limit=${limit}`;
    
    // Add filter parameters if they exist
    if (filters.date) url += `&date=${filters.date}`;
    if (filters.location) url += `&location=${encodeURIComponent(filters.location)}`;
    if (filters.tags) url += `&tags=${encodeURIComponent(filters.tags)}`;
    
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching events:', error);
    throw error;
  }
};

// Fetch single event
export const getEventById = (id) => axios.get(`${API_BASE_URL}/events/${id}`);

// Create event
export const createEvent = async (eventData) => {
  try {
    console.log('Sending event data:', JSON.stringify(eventData, null, 2));
    const response = await axios.post(`${API_BASE_URL}/events`, eventData);
    return response.data;
  } catch (error) {
    console.error('Error details:', error.response?.data);
    throw error;
  }
};

// Update event
export const updateEvent = (id, data) => axios.put(`${API_BASE_URL}/events/${id}`, data);

// Delete event
export const deleteEvent = (id) => axios.delete(`${API_BASE_URL}/events/${id}`);

// Register attendee for an event
export const registerAttendee = (eventId, attendee) =>
  axios.post(`${API_BASE_URL}/events/${eventId}/attendees`, attendee);

// Get all attendees for an event
export const getAttendeesByEvent = async (eventId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/events/${eventId}/attendees`);
    return response.data;
  } catch (error) {
    console.error('Error fetching attendees:', error.response?.data);
    throw error;
  }
};
