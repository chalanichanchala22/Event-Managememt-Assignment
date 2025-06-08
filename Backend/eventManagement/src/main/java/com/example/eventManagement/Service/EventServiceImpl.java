package com.example.eventManagement.Service;

import com.example.eventManagement.Dto.EventDTO;
import com.example.eventManagement.Event.Event;
import com.example.eventManagement.Repository.EventRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service  // <-- Make sure this annotation is present
@RequiredArgsConstructor  // Generates constructor for final fields (for DI)
public class EventServiceImpl implements EventService {

    private final EventRepository eventRepository;

    @Override
    public List<EventDTO> getAllEvents(String date, String location, String tag) {
        // Simple fetch all example - add filtering logic as needed
        List<Event> events = eventRepository.findAll();
        // Map Event entities to EventDTO
        return events.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public EventDTO getEventById(Long id) {
        Event event = eventRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Event not found"));
        return convertToDTO(event);
    }

    @Override
    public EventDTO createEvent(EventDTO eventDTO) {
        Event event = convertToEntity(eventDTO);
        Event saved = eventRepository.save(event);
        return convertToDTO(saved);
    }

    @Override
    public EventDTO updateEvent(Long id, EventDTO eventDTO) {
        Event existing = eventRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Event not found"));
        // Update fields
        existing.setName(eventDTO.getName());
        existing.setDescription(eventDTO.getDescription());
        existing.setDate(eventDTO.getDate());
        existing.setLocation(eventDTO.getLocation());
        existing.setCapacity(eventDTO.getCapacity());
        existing.setRemainingCapacity(eventDTO.getRemainingCapacity());
        existing.setTags(eventDTO.getTags());
        Event updated = eventRepository.save(existing);
        return convertToDTO(updated);
    }

    @Override
    public void deleteEvent(Long id) {
        eventRepository.deleteById(id);
    }

    @Override
    public String getEventAnalytics(Long id) {
        Event event = eventRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Event not found"));
        int totalAttendees = event.getAttendees().size();
        int capacity = event.getCapacity();
        double utilization = (capacity == 0) ? 0 : ((double) totalAttendees / capacity) * 100;
        return String.format("Total Attendees: %d, Capacity Utilization: %.2f%%", totalAttendees, utilization);
    }

    // Helper method to convert Event entity to EventDTO
    private EventDTO convertToDTO(Event event) {
        return new EventDTO(
                event.getId(),
                event.getName(),
                event.getDescription(),
                event.getDate(),
                event.getLocation(),
                event.getCapacity(),
                event.getRemainingCapacity(),
                event.getTags()
        );
    }

    // Helper method to convert EventDTO to Event entity
    private Event convertToEntity(EventDTO dto) {
        Event event = new Event();
        event.setName(dto.getName());
        event.setDescription(dto.getDescription());
        event.setDate(dto.getDate());
        event.setLocation(dto.getLocation());
        event.setCapacity(dto.getCapacity());
        event.setRemainingCapacity(dto.getRemainingCapacity());
        event.setTags(dto.getTags());
        return event;
    }
}
