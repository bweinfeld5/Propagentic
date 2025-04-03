import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';

console.log('Starting React application...');

// Disable any service workers that might be causing issues
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.getRegistrations().then(function(registrations) {
    for (let registration of registrations) {
      registration.unregister();
      console.log('Service worker unregistered');
    }
  });
}

// Render the React application with proper error handling
try {
  console.log('Attempting to render React app...');
  const rootElement = document.getElementById('root');
  
  if (!rootElement) {
    throw new Error('Could not find root element to mount React app');
  }
  
  ReactDOM.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
    rootElement
  );
  console.log('React app rendered successfully');
} catch (error) {
  console.error('Fatal error rendering React app:', error);
  
  // Display a user-friendly error message
  document.body.innerHTML = `
    <div style="font-family: sans-serif; max-width: 600px; margin: 50px auto; padding: 20px; border: 1px solid #f44336; border-radius: 4px;">
      <h2 style="color: #f44336;">Something went wrong</h2>
      <p>We're sorry, but something went wrong while loading the application.</p>
      <p><strong>Error:</strong> ${error.message}</p>
      <pre style="background: #f5f5f5; padding: 10px; overflow: auto;">${error.stack}</pre>
      <p>Please try refreshing the page. If the problem persists, contact support.</p>
      <button onclick="window.location.reload()" style="background: #4CAF50; color: white; border: none; padding: 10px 15px; border-radius: 4px; cursor: pointer;">
        Refresh Page
      </button>
    </div>
  `;
}
