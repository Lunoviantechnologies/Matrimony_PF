import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import UserNavbar from "./UserNavbar";
import Login from "../pages/Login";
import { useState } from "react";
import AdminNavbar from "../admin/AdminNavbar";
import { FaBars } from "react-icons/fa";

const Navbar = () => {
    const navigate = useNavigate();
    const { isLoggedIn, role } = useSelector(state => state.auth);
    const [showLogin, setShowLogin] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
    const [resourceOpen, setResourceOpen] = useState(false);

    const handleDashboard = () => {
        if (role?.[0] === "USER") navigate("/dashboard");
        else if (role?.[0] === "ADMIN") navigate("/admin");
        else navigate("/");
    };

    return (
        <nav className="navBody container w-75">
            <div className="navInner">

                <div className="navBrand" onClick={handleDashboard}>
                    <img
                        src="/vivahjeevan_logo.png"
                        height="60"
                        width="60"
                        className="logo"
                        alt="logo"
                    />
                    <h4>VivahJeevan</h4>
                </div>

                {/* Hamburger */}
                <div className="hamburger" onClick={() => setMenuOpen(!menuOpen)}>
                    <FaBars />
                </div>

                <div className={`navMenu ${menuOpen ? "show" : ""}`}>

                    {!isLoggedIn && (
                        <>
                            <Link className="navLink" to="/" onClick={() => setMenuOpen(false)}>
                                Home
                            </Link>

                                        {/* 🔽 Resources Dropdown */}
                                        <div className="navDropdown">
                                        <span
                                            className="navLink dropdownTitle"
                                            onClick={() => setResourceOpen(prev => !prev)}
                                        >
                                            Resources ▾
                                        </span>

                                        <div className={`dropdownMenu ${resourceOpen ? "open" : ""}`}>
                                            <Link
                                            to="/resources/blog"
                                            onClick={() => {
                                                setMenuOpen(false);
                                                setResourceOpen(false);
                                            }}
                                            >
                                            Blog
                                            </Link>
                                        </div>
                                        </div>


                            <Link className="navLink" to="/aboutUs" onClick={() => setMenuOpen(false)}>
                                About Us
                            </Link>

                            <Link className="navLink" to="/contactUs" onClick={() => setMenuOpen(false)}>
                                Contact Us
                            </Link>

                            <button className="navAuthBtn" onClick={() => setShowLogin(true)}>
                                Login
                            </button>

                            <button className="navAuthBtn" onClick={() => navigate("/register")}>
                                Sign Up
                            </button>
                        </>
                    )}

                    {isLoggedIn && role?.[0] === "USER" && <UserNavbar />}
                    {isLoggedIn && role?.[0] === "ADMIN" && <AdminNavbar />}
                </div>
            </div>

            <Login show={showLogin} onClose={() => setShowLogin(false)} />
        </nav>
    );
};

export default Navbar;
