import React from "react";
import "../styleSheets/loginStyle.css";
import { useNavigate } from "react-router-dom";

const Login = ({ show, onClose }) => {
    if (!show) return null;

    const navigate = useNavigate();

    const handleRegister = () => {
        onClose();
        navigate('/register');
    };

    const handleLogin = (e) => {
        e.preventDefault();
        navigate('/dashboard');
        onClose();
    }

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
                    <i class="bi bi-x-circle"></i>
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
                                <input type="text" required />
                                <label>Email</label>
                            </div>

                            <div className="input-field">
                                <input type="password" required />
                                <label>Password</label>
                            </div>

                            <a href="#" className="forgot-pass-link">
                                Forgot password?
                            </a>

                            <button type="submit" onClick={handleLogin}>Log In</button>
                        </form>

                        <div className="mt-4 signup-link">
                            <span>New to Matrimony? <a onClick={handleRegister} className="signupa"> SignUp for Free</a></span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;