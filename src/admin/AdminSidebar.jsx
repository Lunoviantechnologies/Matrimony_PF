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

    const handleMatches = () => {
        navigate('/admin/managematches');
    };

    const handleProfiles = () => {
        navigate('/admin/adminprofiles');
    };

    const handleManageUser = () => {
        navigate('/admin/manageusers');
    };

    const handlepayments = () => {
        navigate('/admin/payments');
    };

    const handleaprovals = () => {
        navigate('/admin/aprovals');
    };

    const handlesupport = () => {
        navigate('/admin/support');
    };

    const handlePaymentDisplay = () => {
        navigate('/admin/paymentDisplay');
    };

    const handleAstroTalk = () => {
        navigate('/admin/astroTalk');
    };
    return (
        <aside className="admin-sidebar">
            <div className="sidebar-logo" onClick={() => (navigate("/admin"))}>SaathJanam</div>

            <nav className="sidebar-nav">
                <button onClick={handleAdminDashboard}><FaChartLine /><span>Dashboard</span></button>
                <button onClick={handleMatches}><FaHeart /><span>Matches</span></button>
                <button onClick={handleProfiles}><FaUserPlus /><span>New Profiles</span></button>
                <button onClick={handleManageUser}><FaUserPlus /><span>Manage Users</span></button>
                <button onClick={handlepayments}><FaRupeeSign /><span>Payments</span></button>
                <button onClick={handleReport}><FaFileAlt /><span>Reports</span></button>
                <button onClick={handleaprovals}><FaCheckCircle /><span>Approvals</span></button>
                <button onClick={handlesupport}><FaHeadset /><span>User Support</span></button>
                <button onClick={handlePaymentDisplay}><FaHeadset /><span>Payment Display Data</span></button>
                <button onClick={handleAstroTalk}><FaHeadset /><span>Astro Talk Info</span></button>
            </nav>
        </aside>
    );
};