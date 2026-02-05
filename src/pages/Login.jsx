import React, { useState } from "react";
import "../styleSheets/loginStyle.css";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../redux/thunk/loginThunk";
import { toast } from "react-toastify";

const Login = () => {

    const navigate = useNavigate();
    const [auth, setAuth] = useState({ emailId: "", createPassword: "" });
    const [showPassword, setShowPassword] = useState(false);

    const dispatch = useDispatch();
    const { loading } = useSelector(state => state.auth);

    const handleLogin = (e) => {
        e.preventDefault();

        dispatch(loginUser(auth))
            .unwrap()
            .then((data) => {
                const role = Array.isArray(data.role)
                    ? data.role[0]?.toUpperCase()
                    : typeof data.role === "string"
                        ? data.role.toUpperCase()
                        : "";

                if (role === "ADMIN") navigate("/admin");
                else if (role === "USER") navigate("/dashboard");
                else navigate("/");
            })
            .catch(() => {
                toast.error("Login failed. Please check your credentials.");
            });
    };

    return (
        <div className="login-page">
            <div className="login-form">

                {loading && (
                    <div className="loading-overlay">
                        <div className="spinner-border text-light"></div>
                    </div>
                )}

                <div className="form-box">

                    <div className="form-details">
                        <h2>WELCOME BACK !</h2>
                        <p>Please log in using your personal information to stay connected with us.</p>
                    </div>

                    <div className="form-content">

                        <div className="login-header">
                            <img src="/vivahjeevan_logo.png" alt="logo" />
                            <h2>LOGIN</h2>
                        </div>

                        <form onSubmit={handleLogin}>

                            <div className="input-field">
                                <input
                                    type="text"
                                    placeholder=" "
                                    required
                                    onChange={(e) =>
                                        setAuth({ ...auth, emailId: e.target.value })
                                    }
                                />
                                <label>Email</label>
                            </div>

                            <div className="input-field position-relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    placeholder=" "
                                    required
                                    onChange={(e) =>
                                        setAuth({ ...auth, createPassword: e.target.value })
                                    }
                                />
                                <label>Password</label>

                                <span
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="position-absolute top-50 end-0 translate-middle-y me-3"
                                    style={{ cursor: "pointer" }}
                                >
                                    <i className={`bi ${showPassword ? "bi-eye-slash" : "bi-eye"}`}></i>
                                </span>
                            </div>

                            <Link to="/forgotpassword" className="forgot-pass-link">
                                Forgot password?
                            </Link>

                            <button type="submit" disabled={loading}>
                                {loading ? (
                                    <>
                                        <span className="spinner-border spinner-border-sm me-2"></span>
                                        Logging in...
                                    </>
                                ) : "Log In"}
                            </button>

                        </form>

                        <div className="signup-link">
                            New to Matrimony?
                            <Link to="/register"> SignUp for Free</Link>
                        </div>

                        <div className="policy-links">
                            <span onClick={() => navigate("/terms&conditions")}>
                                Terms & Conditions
                            </span>
                            <span>|</span>
                            <span onClick={() => navigate("/privacy_policy")}>
                                Privacy Policy
                            </span>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;