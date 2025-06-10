import { Routes, Route } from 'react-router-dom';
import EventListPage from './Pages/EventListPage';
import EventDetailPage from './Pages/EventDetailPage';
import EventCreationPage from './Pages/EventCreationPage';
import EventUpdatePage from './Pages/EventUpdatePage';
import EventAttendeePage from './Pages/EventAttendeePage';
import './App.css';

function App() {
  return (
    <div className="app">
      <Routes>
        <Route path="/" element={<EventListPage />} />
        <Route path="/event/:id" element={<EventDetailPage />} />
        <Route path="/create" element={<EventCreationPage />} />
        <Route path="/update/:id" element={<EventUpdatePage />} />
        <Route path="/events/:eventId/attendees" element={<EventAttendeePage />} />
      </Routes>
    </div>
  );
}

export default App;