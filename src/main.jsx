import React, { Suspense } from 'react';
import { RouterProvider } from 'react-router-dom';
import { createRoot } from 'react-dom/client';
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "./index.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import { Provider } from 'react-redux';
import store from './redux/store/store';
import AppRoutes from './routes/AppRoutes';
import { ToastContainer } from 'react-toastify';
import { HelmetProvider } from 'react-helmet-async';

createRoot(document.getElementById('root')).render(
    <HelmetProvider>
        <Provider store={store}>
            <Suspense fallback={<div style={{ textAlign: "center", marginTop: "100px" }}>Loading...</div>}>
                <RouterProvider router={AppRoutes} />
            </Suspense>

            {/* ✅ Toast lives at ROOT */}
            <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} newestOnTop closeOnClick pauseOnHover draggable />
        </Provider>
    </HelmetProvider>
);