import React, { useState } from "react";
import { TextField, Button, Card, CardContent, Typography, Alert, } from "@mui/material";
import axios from "axios";
import backendIp from "../api/api";

export default function ForgotPassword() {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const resetMessages = () => {
    setSuccess("");
    setError("");
  };

  // 🔹 STEP 1: SEND OTP
  const sendOtp = async (e) => {
    e.preventDefault();
    resetMessages();
    setLoading(true);

    try {
      const res = await axios.post(
        `${backendIp}/auth/forgot-password`,
        { email }
      );
      console.log(res.data)

      setSuccess(res.data.message || "OTP sent to your email");
      setStep(2);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  // 🔹 STEP 2: VERIFY OTP
  const verifyOtp = async (e) => {
    e.preventDefault();
    resetMessages();
    setLoading(true);

    try {
      const res = await axios.post(
        `${backendIp}/auth/verify-otp`,
        { email, otp }
      );

      setSuccess(res.data.message || "OTP verified");
      setStep(3);
    } catch (err) {
      setError(err.response?.data?.message || "Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

  // 🔹 STEP 3: RESET PASSWORD
  const resetPassword = async (e) => {
    e.preventDefault();
    resetMessages();
    setLoading(true);

    try {
      const res = await axios.post(
        `${backendIp}/auth/reset-password`,
        { email, newPassword, confirmPassword }
      );

      setSuccess(res.data.message || "Password reset successful");
      setStep(1);
      setEmail("");
      setOtp("");
      setNewPassword("");
    } catch (err) {
      setError(err.response?.data?.message || "Password reset failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 p-4">
      <Card sx={{ width: "100%", maxWidth: 450 }} className="shadow-lg">
        <CardContent>
          <Typography variant="h5" fontWeight="bold" gutterBottom>
            Forgot Password
          </Typography>

          {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

          {/* 🔹 STEP 1 */}
          {step === 1 && (
            <form onSubmit={sendOtp}>
              <TextField
                label="Email Address"
                fullWidth
                required
                margin="normal"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />

              <Button
                fullWidth
                variant="contained"
                type="submit"
                disabled={loading}
                sx={{ mt: 2 }}
              >
                {loading ? "Sending OTP..." : "Send OTP"}
              </Button>
            </form>
          )}

          {/* 🔹 STEP 2 */}
          {step === 2 && (
            <form onSubmit={verifyOtp}>
              <TextField
                label="Enter OTP"
                fullWidth
                required
                margin="normal"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
              />

              <Button
                fullWidth
                variant="contained"
                type="submit"
                disabled={loading}
                sx={{ mt: 2 }}
              >
                {loading ? "Verifying..." : "Verify OTP"}
              </Button>
            </form>
          )}

          {/* 🔹 STEP 3 */}
          {step === 3 && (
            <form onSubmit={resetPassword}>
              <TextField
                label="New Password"
                type={showPassword ? "text" : "password"}
                fullWidth
                required
                margin="normal"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />

              <TextField
                label="Confirm Password"
                type={showPassword ? "text" : "password"}
                fullWidth
                required
                margin="normal"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />

              <span
                onClick={() => setShowPassword(!showPassword)}
                className="position-absolute top-50 end-0 translate-middle-y me-3"
                style={{ cursor: "pointer", zIndex: 10 }}
              >
                <i className={`bi ${showPassword ? "bi-eye-slash" : "bi-eye"}`}></i>
              </span>

              <Button
                fullWidth
                variant="contained"
                type="submit"
                disabled={loading}
                sx={{ mt: 2 }}
              >
                {loading ? "Resetting..." : "Reset Password"}
              </Button>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}