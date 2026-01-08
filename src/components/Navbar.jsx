import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import UserNavbar from "./UserNavbar";
import Login from "../pages/Login";
import { useState } from "react";
import AdminNavbar from "../admin/AdminNavbar";

const Navbar = () => {
    const navigate = useNavigate();
    const { isLoggedIn, role } = useSelector(state => state.auth);
    const [showLogin, setShowLogin] = useState(false);

    const handleDashboard = () => {
        if (role[0] === "USER") {
            navigate("/dashboard");
        } else if (role[0] === "ADMIN") {
            navigate("/admin");
        }
    };

    return (
        <nav className="navBody sticky-top container w-75 d-flex justify-content-between align-items-center">
            <img src="/vivahjeevan_logo.png" height="50" onClick={handleDashboard} />

            <div className="d-flex gap-4 align-items-center">

                {/* 🔓 PUBLIC NAVBAR (NOT LOGGED IN) */}
                {!isLoggedIn && (
                    <>
                        <Link className="navLink" to="/">Home</Link>
                        <Link className="navLink" to="/aboutUs">About Us</Link>
                        <Link className="navLink" to="/contactUs">Contact Us</Link>

                        {/* ✅ LOGIN BUTTON */}
                        <button
                            className="navLogin"
                            onClick={() => setShowLogin(true)}
                        >
                            Login
                        </button>
                    </>
                )}

                {/* 👤 USER NAVBAR */}
                {isLoggedIn && role[0] === "USER" && <UserNavbar />}

                {/* 🛠 ADMIN NAVBAR */}
                {isLoggedIn && role[0] === "ADMIN" && <AdminNavbar />}
            </div>

            {/* LOGIN MODAL */}
            <Login show={showLogin} onClose={() => setShowLogin(false)} />
        </nav>
    );
};

export default Navbar;