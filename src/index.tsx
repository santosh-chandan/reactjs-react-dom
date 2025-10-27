//import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import AuthInitializer from './features/auth/components/AuthInitializer';

// Import global styles
import './assets/styles/global.css';
import './assets/styles/variables.css';

// Create React root and render the app
ReactDOM.createRoot(document.getElementById('root')!).render(
  // <React.StrictMode>
    <AuthInitializer>
       <App />
    </AuthInitializer>
  // </React.StrictMode>
);
