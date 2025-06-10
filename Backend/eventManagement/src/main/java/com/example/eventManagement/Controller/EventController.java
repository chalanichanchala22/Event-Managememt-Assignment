package com.example.eventManagement.Controller;

import com.example.eventManagement.Dto.EventDTO;
import com.example.eventManagement.Service.EventService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/events")
public class EventController {

    private final EventService eventService;

    @Autowired
    public EventController(EventService eventService) {
        this.eventService = eventService;
    }

    // Fetch all events with optional filters
    @GetMapping
    public List<EventDTO> getAllEvents(
            @RequestParam(required = false) String date,
            @RequestParam(required = false) String location,
            @RequestParam(required = false) String tag
    ) {
        return eventService.getAllEvents(date, location, tag);
    }

    // Get event by ID
    @GetMapping("/{id}")
    public EventDTO getEventById(@PathVariable Long id) {
        return eventService.getEventById(id);
    }

    // Create new event
    @PostMapping
    public EventDTO createEvent(@RequestBody EventDTO eventDTO) {
        return eventService.createEvent(eventDTO);
    }

    // Update event
    @PutMapping("/{id}")
    public EventDTO updateEvent(@PathVariable Long id, @RequestBody EventDTO eventDTO) {
        return eventService.updateEvent(id, eventDTO);
    }

    // Delete event
    @DeleteMapping("/{id}")
    public void deleteEvent(@PathVariable Long id) {
        eventService.deleteEvent(id);
    }

    // Event Analytics
    @GetMapping("/{id}/analytics")
    public String getAnalytics(@PathVariable Long id) {
        return eventService.getEventAnalytics(id);
    }
}
