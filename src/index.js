import React from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App';
import { msalInstance } from './components/AuthContext';
import { EventType } from '@azure/msal-browser';

const container = document.getElementById('root');
const root = createRoot(container);

// This will ensure MSAL is ready to handle redirects before the app renders
msalInstance.initialize().then(() => {
  // Account selection logic is handled in AuthContext.js
  // The event callback lets us logging and debugging.
  msalInstance.addEventCallback((event) => {
    if (event.eventType === EventType.LOGIN_SUCCESS && event.payload.account) {
      msalInstance.setActiveAccount(event.payload.account);
    }
  });

  root.render(<App />);
});
