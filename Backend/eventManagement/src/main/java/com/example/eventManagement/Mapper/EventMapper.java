package com.example.eventManagement.Mapper;

import com.example.eventManagement.Event.Event;
import com.example.eventManagement.Dto.EventDTO;
import java.util.stream.Collectors;

public class EventMapper {
    public static EventDTO toDTO(Event event) {
        EventDTO dto = new EventDTO();
        dto.setId(event.getId());
        dto.setName(event.getName());
        dto.setDescription(event.getDescription());
        dto.setDate(event.getDate());
        dto.setLocation(event.getLocation());
        dto.setCapacity(event.getCapacity());
        dto.setRemainingCapacity(event.getRemainingCapacity());
        dto.setTags(event.getTags());
        if (event.getAttendees() != null) {
            dto.setAttendees(
                    event.getAttendees().stream()
                            .map(AttendeeMapper::toDTO)
                            .collect(Collectors.toList())
            );
        }
        return dto;
    }

    public static Event toEntity(EventDTO dto) {
        Event event = new Event();
        event.setId(dto.getId());
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
