package com.example.eventManagement.Event;

import jakarta.persistence.*;//Provides annotations for JPA (e.g., @Entity, @Id, @GeneratedValue, etc.)
import lombok.*;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Event {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    //Auto-generates the primary key using the database’s identity column (auto-increment).
    private Long id;

    private String name;
    private String description;
    private LocalDate date;
    private String location;
    private int capacity;
    private int remainingCapacity;
    private String tags;

    @OneToMany(mappedBy = "event", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Attendee> attendees = new ArrayList<>();
    //This means one Event can have many Attendees.
    // mappedBy = "event" means the Attendee class has a field called event that links back to this.
    //cascade = CascadeType.ALL means if you save, update, or delete an event, its attendees will also be saved, updated, or deleted.
    //orphanRemoval = true means if an attendee is removed from the list, it will be deleted from the database.

}