import React, { useState } from "react";
import { FaHeart, FaUserPlus, FaRupeeSign, FaChartLine, FaFileAlt, FaCheckCircle, FaHeadset, FaStar, FaMoneyCheckAlt, FaComments, FaUserShield, FaBlog, FaChevronDown, FaChevronUp } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import "../styleSheets/adminSidebar.css";
import { MdConnectWithoutContact } from "react-icons/md";

export default function AdminSidebar() {
    const [blogOpen, setBlogOpen] = useState(false);
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

    const handleUserTicket = () => {
        navigate('/admin/user_tickets');
    };

    const handlePaymentDisplay = () => {
        navigate('/admin/paymentDisplay');
    };

    const handleAstroTalk = () => {
        navigate('/admin/astroTalk');
    };
    const handleAdminSupport = () => {
        navigate('/admin/admin_support');
    };

    const handleUserChatReport = () => {
        navigate('/admin/admin_chat_report');
    };

    const handleRelationshipManager = () => {
        navigate('/admin/relationship_manager');
    };

    const handleBlogDashboard = () => {
        navigate("/admin/blogs");
    };

    const handleCreateBlog = () => {
        navigate("/admin/blog/create");
    };

    return (
        <aside className="admin-sidebar">
            <div className="sidebar-logo" onClick={() => (navigate("/admin"))}>VivahJeevan</div>

            <nav className="sidebar-nav">
                <button onClick={handleAdminDashboard}><FaChartLine /><span>Dashboard</span></button>
                <button onClick={handleaprovals}><FaCheckCircle /><span>Approvals</span></button>
                <button onClick={handleMatches}><FaHeart /><span>Matches</span></button>
                <button onClick={handleProfiles}><FaUserPlus /><span>New Profiles</span></button>
                <button onClick={handleManageUser}><FaUserPlus /><span>Manage Users</span></button>
                <button onClick={handlepayments}><FaRupeeSign /><span>Payments</span></button>
                <button onClick={handleReport}><FaFileAlt /><span>Reports</span></button>
                <button onClick={handleUserTicket}><FaHeadset /><span>User Support</span></button>
                <button onClick={handlePaymentDisplay}><FaMoneyCheckAlt /><span>Payment Display</span></button>
                <button onClick={handleAstroTalk}><FaStar /><span>Astrology Service</span></button>
                <button onClick={handleAdminSupport}><FaUserShield /><span>Admin Support</span></button>
                <button onClick={handleUserChatReport}><FaComments /><span>User Chat Report</span></button>
                <button onClick={handleRelationshipManager}><MdConnectWithoutContact size={20} /><span>Relationship Manager</span></button>

                {/* BLOG DROPDOWN */}
                <div className="sidebar-dropdown">

                    <button onClick={() => setBlogOpen(!blogOpen)}>
                        <FaBlog />
                        <span>Blogs</span>
                        {blogOpen ? <FaChevronUp /> : <FaChevronDown />}
                    </button>

                    {blogOpen && (
                        <div className="dropdown-items">
                            <button onClick={handleBlogDashboard}> Blog Dashboard </button>
                            <button onClick={handleCreateBlog}> Create Blog </button>
                        </div>
                    )}

                </div>
            </nav>
        </aside>
    );
};