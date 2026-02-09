import React from "react";
import Navbar from "../components/Navbar";
import SubNavbar from "../components/SubNavbar";
import { Outlet } from "react-router-dom";
import Footer from "../components/Footer";
import ContactSupport from "../components/settings/ContactSupport";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchNotifications } from "../redux/thunk/notificationThunk";
import { startNotificationSocket, stopNotificationSocket } from "../hooks/notificationSocket";

const DashboardLayout = () => {

    const { id, token } = useSelector(s => s.auth);
    const dispatch = useDispatch();

    useEffect(() => {
        if (!id || !token) return;
        console.log("🔥 Dashboard socket init");
        dispatch(fetchNotifications(id));
        startNotificationSocket(id, token, dispatch);
        return stopNotificationSocket;
    }, [id, token]);

    return (
        <div
            className="d-flex flex-column min-vh-100"
            style={{ backgroundColor: "#D9F5E4" }}
        >
            {/* Top Navigation */}
            <Navbar />
            <SubNavbar />

            {/* Main Content */}
            <main className="flex-grow-1 container-fluid px-3 px-md-4 py-3">
                <Outlet />
            </main>

            {/* Footer */}
            <Footer />

            {/* ✅ Live chat ONLY for user dashboard */}
            <ContactSupport />
        </div>
    );
};

export default DashboardLayout;