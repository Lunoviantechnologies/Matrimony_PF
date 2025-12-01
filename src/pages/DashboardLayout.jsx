import React from "react"; 
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import { Outlet } from "react-router-dom";
import Footer from "../components/Footer";
import SubNavbar from "../components/SubNavbar";

const DashboardLayout = () => {
    return (
        <div style={{backgroundColor: '#D9F5E4'}}>
            <Navbar />
            <SubNavbar />  
            <div style={{ display: "flex", marginTop: "10px" }}>
                <Sidebar />
                <div style={{ flex: 1, background: "#D9F5E4", minHeight: "100vh", padding: 20 }}>
                    <Outlet />
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default DashboardLayout;
