package com.example.eventManagement.Service;

import com.example.eventManagement.Dto.AttendeeDTO;
import java.util.List;

public interface AttendeeService {
    List<AttendeeDTO> getAttendeesByEventId(Long eventId);
    AttendeeDTO registerAttendee(Long eventId, AttendeeDTO attendeeDTO);
}
