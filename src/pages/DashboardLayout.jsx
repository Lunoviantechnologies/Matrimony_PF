import React from "react";
import Navbar from "../components/Navbar";
import SubNavbar from "../components/SubNavbar";
import { Outlet } from "react-router-dom";
import Footer from "../components/Footer";
import ContactSupport from "../components/settings/ContactSupport";

const DashboardLayout = () => {
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