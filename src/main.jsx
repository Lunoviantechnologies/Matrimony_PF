import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js'; 

const router = createBrowserRouter([
    {
        path: '/',
        element: <App />
    }
]);

createRoot(document.getElementById('root')).render(

        <RouterProvider router={router} />

);