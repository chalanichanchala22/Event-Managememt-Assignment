package com.example.eventManagement.Mapper;

import com.example.eventManagement.Event.Attendee;
import com.example.eventManagement.Dto.AttendeeDTO;

public class AttendeeMapper {

    public static AttendeeDTO toDTO(Attendee attendee) {
        AttendeeDTO dto = new AttendeeDTO();
        dto.setId(attendee.getId());
        dto.setName(attendee.getName());
        dto.setEmail(attendee.getEmail());
        if (attendee.getEvent() != null) {
            dto.setEventId(attendee.getEvent().getId());
        }
        return dto;
    }

    public static Attendee toEntity(AttendeeDTO dto) {
        Attendee attendee = new Attendee();
        attendee.setId(dto.getId());
        attendee.setName(dto.getName());
        attendee.setEmail(dto.getEmail());
        // Event must be set separately in service
        return attendee;
    }
}
