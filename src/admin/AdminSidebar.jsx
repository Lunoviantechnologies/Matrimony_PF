import React from "react";
import { FaUsers, FaHeart, FaUserPlus, FaRupeeSign, FaChartLine, FaFileAlt, FaCheckCircle, FaHeadset } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import "../stylesheets/adminSidebar.css";

export default function AdminSidebar() {
    const navigate = useNavigate();
    
    const handleReport = () => {
        navigate('/admin/viewreport');        
    };

    const handleAdminDashboard = () => {
        navigate('/admin');
    };
    
    return (
        <aside className="admin-sidebar">
            <div className="sidebar-logo">SJ</div>

            <nav className="sidebar-nav">
                <button onClick={handleAdminDashboard}><FaChartLine /><span>Dashboard</span></button>
                <button><FaHeart /><span>Matches</span></button>
                <button><FaUserPlus /><span>New Profiles</span></button>
                <button><FaRupeeSign /><span>Payments</span></button>
                <button onClick={handleReport}><FaFileAlt /><span>Reports</span></button>
                <button><FaCheckCircle /><span>Approvals</span></button>
                <button><FaHeadset /><span>Support</span></button>
            </nav>
        </aside>
    );
};