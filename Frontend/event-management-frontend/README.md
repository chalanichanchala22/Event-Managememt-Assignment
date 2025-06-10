# Event Management System - Frontend

A React-based frontend for an Event Management System, integrated with a backend API (Spring Boot, .NET, or Node.js). The application allows users to create, update, delete, and view events, register attendees, and view event analytics. It uses React Context API for state management and CSS for styling.

## Features
- **Event List Page**: Paginated table with filters (date, location, tags) and search functionality.
- **Event Detail Page**: Displays event details, registered attendees, and analytics; includes attendee registration.
- **Event Creation Page**: Form for adding new events with validation.
- **Event Update Page**: Form for editing events with validation.
- **Reusable Components**: Button, Input, Modal, and Table components.
- **Responsive Design**: CSS with media queries for desktop, tablet, and mobile views.
- **State Management**: Uses React Context API for managing global state.
- **Form Validation**: Client-side validation for event creation and attendee registration.

## Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Backend API running (e.g., Spring Boot on `http://localhost:8081`)

## Setup Instructions
1. **Clone the Repository**:
   ```bash
   git clone <repository-url>
   cd event-management-frontend