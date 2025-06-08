package com.example.eventManagement.Service;

import com.example.eventManagement.Dto.EventDTO;
import java.util.List;


public interface EventService {
    List<EventDTO> getAllEvents(String date, String location, String tag);
    EventDTO getEventById(Long id);
    EventDTO createEvent(EventDTO eventDTO);
    EventDTO updateEvent(Long id, EventDTO eventDTO);
    void deleteEvent(Long id);

    String getEventAnalytics(Long id);
}
