package com.example.eventManagement.Dto;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AttendeeDTO {
    private Long id;
    private String name;
    private String email;
    private Long eventId; // Add this if needed for mapping

    public AttendeeDTO(Long id, String name, String email) {
    }

    public void setEventId(Long id) {
        this.eventId = id;
    }
}
