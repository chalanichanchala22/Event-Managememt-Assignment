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
    private List<String> tags;
    private List<AttendeeDTO> attendees;
}
