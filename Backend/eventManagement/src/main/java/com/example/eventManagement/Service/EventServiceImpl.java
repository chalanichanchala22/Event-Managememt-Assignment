package com.example.eventManagement.Service;

import com.example.eventManagement.Dto.EventDTO;
import com.example.eventManagement.Dto.AttendeeDTO;
import com.example.eventManagement.Event.Event;
import com.example.eventManagement.Repository.EventRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.ArrayList;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class EventServiceImpl implements EventService {

    private final EventRepository eventRepository;

    @Override
    public List<EventDTO> getAllEvents(String date, String location, String tag) {
        List<Event> events = eventRepository.findAll();
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

        existing.setName(eventDTO.getName());
        existing.setDescription(eventDTO.getDescription());
        existing.setDate(eventDTO.getDate());
        existing.setLocation(eventDTO.getLocation());
        existing.setCapacity(eventDTO.getCapacity());
        existing.setRemainingCapacity(eventDTO.getRemainingCapacity());
        existing.setTags(eventDTO.getTags() != null ? eventDTO.getTags() : new ArrayList<>());

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
        int totalAttendees = event.getAttendees() != null ? event.getAttendees().size() : 0;
        int capacity = event.getCapacity();
        double utilization = (capacity == 0) ? 0 : ((double) totalAttendees / capacity) * 100;
        return String.format("Total Attendees: %d, Capacity Utilization: %.2f%%", totalAttendees, utilization);
    }

    // Convert Event to DTO
    private EventDTO convertToDTO(Event event) {
        EventDTO dto = new EventDTO();
        dto.setId(event.getId());
        dto.setName(event.getName());
        dto.setDescription(event.getDescription());
        dto.setDate(event.getDate());
        dto.setLocation(event.getLocation());
        dto.setCapacity(event.getCapacity());
        dto.setRemainingCapacity(event.getRemainingCapacity());
        dto.setTags(event.getTags() != null ? event.getTags() : new ArrayList<>());

        if (event.getAttendees() != null) {
            List<AttendeeDTO> attendeeDTOs = event.getAttendees().stream()
                    .map(attendee -> new AttendeeDTO(
                            attendee.getId(),
                            attendee.getName(),
                            attendee.getEmail()
                    ))
                    .collect(Collectors.toList());
            dto.setAttendees(attendeeDTOs);
        } else {
            dto.setAttendees(new ArrayList<>());
        }

        return dto;
    }

    // Convert DTO to Event
    private Event convertToEntity(EventDTO dto) {
        Event event = new Event();
        event.setId(dto.getId());
        event.setName(dto.getName());
        event.setDescription(dto.getDescription());
        event.setDate(dto.getDate());
        event.setLocation(dto.getLocation());
        event.setCapacity(dto.getCapacity());
        event.setRemainingCapacity(dto.getRemainingCapacity());
        event.setTags(dto.getTags() != null ? dto.getTags() : new ArrayList<>());
        event.setAttendees(new ArrayList<>());
        return event;
    }
}
