import React, { useState } from "react";
import "../styleSheets/loginStyle.css";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import backendIP from "../api/api";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../redux/thunk/loginThunk";

const Login = ({ show, onClose }) => {
    if (!show) return null;

    const navigate = useNavigate();
    const [auth, setAuth] = useState({ emailId: "", createPassword: "" });
    const [showPassword, setShowPassword] = useState(false);
    const dispatch = useDispatch();
    const { loading, error, role, isLoggedIn } = useSelector( state => state.auth );

    const handleRegister = () => {
        onClose();
    };

    const handleForget = () => {
        onClose();
    };

    const handleLogin = (e) => {
        e.preventDefault();
        console.log("Attempting login with:", auth);
        
        dispatch( loginUser(auth) )
            .unwrap()
            .then( () => {
                onclose();
                if ( role === "admin" ) navigate("/admin");
                else navigate("/dashboard");
            })
            .catch( (err) => {
                alert("Login failed. Please check your credentials and try again.");
                console.error("Login error:", err);
            })
    };

    return (
        <div className="login-form">
            {/* Overlay background */}
            <div
                className={`blur-bg-overlay ${show ? "active" : ""}`}
                onClick={onClose}
            ></div>

            {/* Popup box */}
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
                            <div className="input-field">
                                <input type="text" required onChange={(e) => { setAuth({ ...auth, emailId: e.target.value }) }} />
                                <label>Email</label>
                            </div>

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

                            <Link to="forgotpassword" onClick={handleForget} className="forgot-pass-link">
                                Forgot password?
                            </Link>

                            <button type="submit" onClick={handleLogin}>Log In</button>
                        </form>

                        <div className="mt-4 signup-link">
                            <span>New to Matrimony? <Link to="register" onClick={handleRegister} className="signupa"> SignUp for Free</Link></span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;