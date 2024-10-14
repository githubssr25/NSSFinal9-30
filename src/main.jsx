import React from 'react';

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import { BrowserRouter } from 'react-router-dom';  // Import BrowserRouter
import 'bootstrap/dist/css/bootstrap.min.css';
//import above is correct if Bootstrap was installed via NPM. When installed this way, 
//the Bootstrap CSS file is available within node_modules, and you can import it like this.

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>  {/* Add BrowserRouter to enable routing */}
      <App />
    </BrowserRouter>
  </StrictMode>,
);
