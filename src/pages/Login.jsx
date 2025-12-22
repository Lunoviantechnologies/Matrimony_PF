import React, { useState } from "react";
import "../styleSheets/loginStyle.css";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../redux/thunk/loginThunk";

const Login = ({ show, onClose }) => {
    if (!show) return null;

    const navigate = useNavigate();
    const [auth, setAuth] = useState({ emailId: "", createPassword: "" });
    const [showPassword, setShowPassword] = useState(false);

    const dispatch = useDispatch();
    const { loading, error, role, isLoggedIn } = useSelector(state => state.auth);

    const handleRegister = () => onClose();
    const handleForget = () => onClose();

    const handleLogin = (e) => {
        e.preventDefault();

        dispatch(loginUser(auth))
            .unwrap()
            .then((data) => {
                onClose();
                const role = Array.isArray(data.role)
                    ? data.role[0]?.toUpperCase() : typeof data.role === "string" ? data.role.toUpperCase() : "";

                if (role === "ADMIN") {
                    navigate("/admin");
                } else if (role === "USER") {
                    navigate("/dashboard");
                } else {
                    navigate("/"); // fallback
                }
            })
            .catch(() => {
                alert("Login failed. Please check your credentials.");
            });
    };

    return (
        <div className="login-form">

            {/* Loading Overlay */}
            {loading && (
                <div className="loading-overlay">
                    <div className="spinner-border text-light"></div>
                </div>
            )}

            {/* Blur background */}
            <div
                className={`blur-bg-overlay ${show ? "active" : ""}`}
                onClick={onClose}
            ></div>

            {/* Popup */}
            <div className={`form-popup ${show ? "show" : ""}`}>
                <span className="close-btn material-symbols-rounded" onClick={onClose}>
                    <i className="bi bi-x-circle"></i>
                </span>

                <div className="form-box login">
                    <div className="form-details">
                        <h2>WELCOME BACK !</h2>
                        <p>Please log in using your personal information to stay connected with us.</p>
                    </div>

                    <div className="form-content">
                        <h2>LOGIN</h2>

                        <form>
                            {/* EMAIL */}
                            <div className="input-field">
                                <input
                                    type="text"
                                    required
                                    onChange={(e) => setAuth({ ...auth, emailId: e.target.value })}
                                />
                                <label>Email</label>
                            </div>

                            {/* PASSWORD */}
                            <div className="input-field position-relative">
                                <input
                                    id="loginPassword"
                                    type={showPassword ? "text" : "password"}
                                    placeholder=" "
                                    required
                                    onChange={(e) =>
                                        setAuth({ ...auth, createPassword: e.target.value })
                                    }
                                />
                                <label htmlFor="loginPassword">Password</label>

                                <span
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="position-absolute top-50 end-0 translate-middle-y me-3"
                                    style={{ cursor: "pointer", zIndex: 10 }}
                                >
                                    <i className={`bi ${showPassword ? "bi-eye-slash" : "bi-eye"}`}></i>
                                </span>
                            </div>

                            <Link
                                to="forgotpassword"
                                onClick={handleForget}
                                className="forgot-pass-link"
                            >
                                Forgot password?
                            </Link>

                            {/* LOGIN BUTTON WITH SPINNER */}
                            <button
                                type="submit"
                                onClick={handleLogin}
                                disabled={loading}
                                className="login-btn"
                            >
                                {loading ? (
                                    <span>
                                        <span className="spinner-border spinner-border-sm me-2"></span>
                                        Logging in...
                                    </span>
                                ) : (
                                    "Log In"
                                )}
                            </button>
                        </form>

                        <div className="mt-4 signup-link">
                            <span>
                                New to Matrimony?
                                <Link to="register" onClick={handleRegister} className="signupa">
                                    {" "}SignUp for Free
                                </Link>
                            </span>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;