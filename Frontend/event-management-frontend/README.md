# Event Management System - Frontend

A React-based frontend for an Event Management System, integrated with a backend API. The application allows users to create, update, delete, and view events, register attendees, and view event analytics.

## Features
- **Event Management**: Create, view, update, and delete events
- **Attendee Registration**: Register attendees for events
- **Analytics**: View event statistics and attendee data
- **Responsive Design**: Works on desktop, tablet, and mobile devices

## Prerequisites
- Node.js (v20)
- npm
- Backend API running (e.g., Spring Boot on `http://localhost:8081`)

## Setup Instructions
1. **Clone the Repository**:
   ```bash
   git clone https://github.com/chalanichanchala22/Event-Managememt-Assignment.git
   cd event-management-frontend
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment**:
   ```
   REACT_APP_API_URL=http://localhost:8081/api
   ```

4. **Start Development Server**:
   ```bash
   npm start
   ```
   The application will be available at `http://localhost:3000`

## Project Structure
```
src/
├── Api/               # API client configurations
├── Components/        # Reusable UI components
├── Context/           # React Context for state management
├── Pages/             # Application pages
└── App.js             # Main application component
```

## Available Scripts
- `npm start` - Start development server
- `npm test` - Run tests
- `npm run build` - Build for production
- `npm run eject` - Eject from Create React App

## API Endpoints
- `GET /api/events` - List events
- `GET /api/events/{id}` - Get event details
- `POST /api/events` - Create event
- `PUT /api/events/{id}` - Update event
- `DELETE /api/events/{id}` - Delete event
- `POST /api/events/{id}/attendees` - Register attendee
- `GET /api/events/{id}/attendees` - List attendees