package com.example.eventManagement.Controller;

import com.example.eventManagement.Dto.AttendeeDTO;
import com.example.eventManagement.Service.AttendeeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

        import java.util.List;

@RestController
@RequestMapping("/api/attendees")
@CrossOrigin(origins = "*")
public class AttendeeController {

    private final AttendeeService attendeeService;

    @Autowired
    public AttendeeController(AttendeeService attendeeService) {
        this.attendeeService = attendeeService;
    }

    // Register attendee to event
    @PostMapping("/register/{eventId}")
    public AttendeeDTO register(@PathVariable Long eventId, @RequestBody AttendeeDTO attendeeDTO) {
        return attendeeService.registerAttendee(eventId, attendeeDTO);
    }

    // Get attendees for a specific event
    @GetMapping("/event/{eventId}")
    public List<AttendeeDTO> getByEvent(@PathVariable Long eventId) {
        return attendeeService.getAttendeesByEventId(eventId);
    }
}
