import React from 'react';
import { RouterProvider } from 'react-router-dom';
import { createRoot } from 'react-dom/client';
import './index.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js'; 
import { Provider } from 'react-redux';
import store from './redux/store/store';
import AppRoutes from './routes/AppRoutes';

createRoot(document.getElementById('root')).render(
    <Provider store={store}>
        <RouterProvider router={AppRoutes} />
    </Provider>
);