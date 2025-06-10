package com.example.eventManagement.Repository;

import com.example.eventManagement.Event.Attendee;
import com.example.eventManagement.Event.Event;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface AttendeeRepository extends JpaRepository<Attendee, Long> {
    List<Attendee> findByEventId(Long eventId);
    List<Attendee> findByEvent(Event event);
}
