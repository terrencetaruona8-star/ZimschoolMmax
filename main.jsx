import React from 'react';
import { createRoot } from 'react-dom/client';
import ZimSchoolMax from './ZimSchoolMax.jsx';
import './index.css';

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ZimSchoolMax />
  </React.StrictMode>,
);
