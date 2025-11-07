import React from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App';
import { msalInstance } from './components/AuthContext';

const container = document.getElementById('root');
const root = createRoot(container);

// This will ensure MSAL is ready to handle redirects before the app renders
msalInstance.initialize().then(() => root.render(<App />));
