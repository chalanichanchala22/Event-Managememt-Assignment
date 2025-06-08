package com.example.eventManagement.Event;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Attendee {

        @Id
        @GeneratedValue(strategy = GenerationType.IDENTITY)
        private Long id;

        private String name;
        private String email;

        @ManyToOne
        @JoinColumn(name = "event_id")
        private Event event;
        //Each attendee is linked to one event.
       //The database will have a column called event_id in the attendee table to store this link.
    }


