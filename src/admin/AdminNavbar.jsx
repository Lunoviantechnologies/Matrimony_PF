import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logout } from "../redux/slices/authSlice";
import AdminNotification from "./AdminNotifications";
// import { toast } from "react-toastify";
import "../styleSheets/navbar.css";

const AdminNavbar = ({ closeMenu }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);

    /* ===== outside click close ===== */

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(e.target)
            ) {
                setDropdownOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () =>
            document.removeEventListener(
                "mousedown",
                handleClickOutside
            );
    }, []);

    /* ===== actions ===== */

    const goTo = (path) => {
        closeMenu?.();
        setDropdownOpen(false);
        navigate(path);
    };

    const handleLogout = () => {
        dispatch(logout());
        // toast.success("Logged out successfully!");
        navigate("/");
    };

    /* ===== UI ===== */

    return (
        <>
            <AdminNotification />

            <div
                className="dropdown"
                ref={dropdownRef}
                style={{ position: "relative" }}
            >
                <button
                    className="btn d-flex align-items-center gap-2"
                    onClick={() =>
                        setDropdownOpen(prev => !prev)
                    }
                >
                    Admin <i className="bi bi-chevron-down"></i>
                </button>

                <ul
                    className={`dropdown-menu dropdown-menu-end ${dropdownOpen ? "show" : ""
                        }`}
                >
                    <li>
                        <button
                            className="dropdown-item"
                            onClick={() =>
                                goTo("/admin/admin_settings")
                            }
                        >
                            Settings
                        </button>
                    </li>

                    <li>
                        <hr className="dropdown-divider" />
                    </li>

                    <li>
                        <button
                            className="dropdown-item text-danger"
                            onClick={handleLogout}
                        >
                            Logout
                        </button>
                    </li>
                </ul>
            </div>
        </>
    );
};

export default AdminNavbar;