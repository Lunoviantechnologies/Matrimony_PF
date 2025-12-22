import React from "react";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logout } from "../redux/slices/authSlice";
import { useNavigate } from "react-router-dom";
import AdminNotification from "./AdminNotifications";

const AdminNavbar = () => {

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleLogout = () => {
        dispatch(logout());
        alert("Logged out successfully!");
        navigate("/");
    };

    return (
        <>
            <AdminNotification />

            <div className="dropdown">
                <button className="btn" data-bs-toggle="dropdown">
                    Admin <i className="bi bi-chevron-down"></i>
                </button>

                <ul className="dropdown-menu dropdown-menu-end">
                    <li><Link className="dropdown-item" to="/admin/settings">Settings</Link></li>
                    <li><hr className="dropdown-divider" /></li>
                    <li><button className="dropdown-item text-danger" onClick={handleLogout}>Logout</button></li>
                </ul>
            </div>
        </>
    );
};

export default AdminNavbar;