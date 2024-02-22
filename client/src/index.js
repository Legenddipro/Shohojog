import React from 'react';
// eslint-disable-next-line
 import ReactDOM from 'react-dom';
//NEW LINE
//import ReactDOM from 'react-dom/client';
import { createRoot } from 'react-dom/client';
import App from './App';

const root = createRoot(document.getElementById('root')); // Use createRoot from react-dom/client
root.render(<App />);
//NEW LINE
// const root = ReactDOM.createRoot(document.getElementById('root'));
// root.render(
//   <React.StrictMode>
//     <App />
//   </React.StrictMode>
// );