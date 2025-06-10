package com.example.eventManagement.Service;

import com.example.eventManagement.Dto.AttendeeDTO;
import com.example.eventManagement.Event.Attendee;
import com.example.eventManagement.Event.Event;
import com.example.eventManagement.Repository.AttendeeRepository;
import com.example.eventManagement.Repository.EventRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class AttendeeServiceImpl implements AttendeeService {

    private final AttendeeRepository attendeeRepository;
    private final EventRepository eventRepository;

    @Autowired
    public AttendeeServiceImpl(AttendeeRepository attendeeRepository, EventRepository eventRepository) {
        this.attendeeRepository = attendeeRepository;
        this.eventRepository = eventRepository; // Fixed typo (was EventRepository)
    }

    @Override
    public List<AttendeeDTO> getAttendeesByEventId(Long eventId) {
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new EntityNotFoundException("Event not found with id: " + eventId));
        List<Attendee> attendees = attendeeRepository.findByEvent(event);
        return attendees.stream().map(this::mapToDTO).collect(Collectors.toList());
    }

    @Override
    public AttendeeDTO registerAttendee(Long eventId, AttendeeDTO attendeeDTO) { // Fixed typo (was Attendee365DTO)
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new EntityNotFoundException("Event not found with id: " + eventId));
        if (event.getRemainingCapacity() <= 0) {
            throw new IllegalStateException("Event is full");
        }
        Attendee attendee = new Attendee();
        attendee.setName(attendeeDTO.getName());
        attendee.setEmail(attendeeDTO.getEmail());
        attendee.setEvent(event);
        Attendee saved = attendeeRepository.save(attendee);
        event.setRemainingCapacity(event.getRemainingCapacity() - 1);
        eventRepository.save(event);
        return mapToDTO(saved);
    }

    private AttendeeDTO mapToDTO(Attendee attendee) {
        AttendeeDTO dto = new AttendeeDTO();
        dto.setId(attendee.getId());
        dto.setName(attendee.getName());
        dto.setEmail(attendee.getEmail());
        return dto;
    }
}
