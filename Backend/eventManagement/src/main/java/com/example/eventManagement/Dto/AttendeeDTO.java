package com.example.eventManagement.Dto;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AttendeeDTO {
    private Long id;
    private String name;
    private String email;
    private Long eventId; // helps link to the event
}
