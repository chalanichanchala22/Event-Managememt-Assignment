package com.example.eventManagement.Repository;

import com.example.eventManagement.Event.Event;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface EventRepository extends JpaRepository<Event, Long> {
    // Add custom query methods if needed
}
