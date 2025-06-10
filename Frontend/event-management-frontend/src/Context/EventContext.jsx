import React, { createContext, useContext, useState } from 'react';
import * as EventService from '../Api/EventApi';

const EventContext = createContext();

export const useEventContext = () => useContext(EventContext);

export const EventProvider = ({ children }) => {
  const [events, setEvents] = useState([]);
  const [error, setError] = useState(null);

  const contextValue = {
    events,
    setEvents,
    error,
    setError,
    getEvents: EventService.getEvents,
    getEventById: EventService.getEventById,
    createEvent: EventService.createEvent,
    updateEvent: EventService.updateEvent,
    deleteEvent: EventService.deleteEvent,
    registerAttendee: EventService.registerAttendee,
    getAttendeesByEvent: EventService.getAttendeesByEvent,
  };

  console.log('EventContext values:', contextValue);

  return (
    <EventContext.Provider value={contextValue}>
      {children}
    </EventContext.Provider>
  );
};
