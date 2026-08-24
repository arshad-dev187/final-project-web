import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { OrderProvider } from './OrderContext';
import ScrollToTop from './ScrollToTop';
import App from './App';
import './styles.css';

createRoot(document.getElementById('root')).render(<BrowserRouter><ScrollToTop /><OrderProvider><App /></OrderProvider></BrowserRouter>);
