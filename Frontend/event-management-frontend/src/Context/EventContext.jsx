import React, { createContext, useContext } from 'react';
import * as EventService from '../Services/EventServices';

const EventContext = createContext();

export const useEventContext = () => useContext(EventContext);

export const EventProvider = ({ children }) => {
  const contextValue = {
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
