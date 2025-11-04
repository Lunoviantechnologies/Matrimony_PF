import React from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import { Outlet } from "react-router-dom";
import Footer from "../components/Footer";

const DashboardLayout = () => {
    return (
        <div>
            <Navbar />
            <div style={{ display: "flex", marginTop: "70px" }}>
                <Sidebar />
                <div style={{ flex: 1, background: "#FAF8F2", minHeight: "100vh", padding: 20 }}>
                    <Outlet />
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default DashboardLayout;
