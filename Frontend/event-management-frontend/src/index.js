import ReactDOM from 'react-dom/client';
import App from './App';
import './App.css';
import { BrowserRouter } from 'react-router-dom';
import { EventProvider } from './Context/EventContext';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <BrowserRouter>
    <EventProvider>
      <App />
    </EventProvider>
  </BrowserRouter>
);
