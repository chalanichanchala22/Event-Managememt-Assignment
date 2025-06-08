package com.example.eventManagement.Dto;
import lombok.*;

import java.time.LocalDate;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class EventDTO {
    private Long id;
    private String name;
    private String description;
    private LocalDate date;
    private String location;
    private int capacity;
    private int remainingCapacity;
    private String tags;
    private List<AttendeeDTO> attendees; // optional: only populate in detail views

    public EventDTO(Long id, String name, String description, LocalDate date, String location, int capacity, int remainingCapacity, String tags) {
    }
}
