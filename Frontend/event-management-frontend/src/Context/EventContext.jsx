import React, { createContext, useContext, useState, useCallback } from 'react';
import * as EventService from '../Api/EventApi';

const EventContext = createContext();

export const useEventContext = () => useContext(EventContext);

export const EventProvider = ({ children }) => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  // Enhanced event fetching function
  const fetchEvents = useCallback(async (page = 1, limit = 10, filters = {}) => {
    try {
      setLoading(true);
      setError(null);
      const response = await EventService.getEvents(page, limit, filters);
      
      // Handle different API response structures
      const { data, totalPages, totalCount } = response.data || 
        { data: response, totalPages: 1, totalCount: response.length };
      
      setEvents(data);
      setTotalPages(totalPages || 1);
      setTotalCount(totalCount || data.length);
      return data;
    } catch (err) {
      setError('Failed to fetch events');
      console.error('Error fetching events:', err);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  // Clear error state
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const contextValue = {
    events,
    setEvents,
    loading,
    setLoading,
    error,
    setError,
    clearError,
    totalCount,
    totalPages,
    fetchEvents,
    getEvents: EventService.getEvents,
    getEventById: EventService.getEventById,
    createEvent: EventService.createEvent,
    updateEvent: EventService.updateEvent,
    deleteEvent: EventService.deleteEvent,
    registerAttendee: EventService.registerAttendee,
    getAttendeesByEvent: EventService.getAttendeesByEvent,
  };

  return (
    <EventContext.Provider value={contextValue}>
      {children}
    </EventContext.Provider>
  );
};
