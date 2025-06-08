import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import EventList from './Pages/EventList';
import EventDetail from './Pages/EventDetail';
import EventCreate from './Pages/EventCreate';
import EventUpdate from './Pages/EventUpdate';
import { EventProvider } from './Context/EventContext';

const App = () => (
  <EventProvider>
    <Router>
      <Routes>
        <Route path="/" element={<EventList />} />
        <Route path="/events/:id" element={<EventDetail />} />
        <Route path="/create" element={<EventCreate />} />
        <Route path="/edit/:id" element={<EventUpdate />} />
      </Routes>
    </Router>
  </EventProvider>
);

export default App;
