import React, { useState } from "react";
import { TextField, Button, Card, CardContent, Typography, Alert, Box, IconButton, InputAdornment, } from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import axios from "axios";
import backendIp from "../api/api";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

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
  const navigate = useNavigate();

  const resetMessages = () => {
    setSuccess("");
    setError("");
  };

  // STEP 1
  const sendOtp = async (e) => {
    e.preventDefault();
    resetMessages();
    setLoading(true);

    try {
      const res = await axios.post(`${backendIp}/auth/forgot-password`, { email });
      setSuccess(res.data.message || "OTP sent to your email");
      setStep(2);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  // STEP 2
  const verifyOtp = async (e) => {
    e.preventDefault();
    resetMessages();
    setLoading(true);

    try {
      const res = await axios.post(`${backendIp}/auth/verify-otp`, { email, otp });
      setSuccess(res.data.message || "OTP verified");
      setStep(3);
    } catch (err) {
      setError(err.response?.data?.message || "Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

  // STEP 3
  const resetPassword = async (e) => {
    e.preventDefault();
    resetMessages();
    setLoading(true);

    try {
      const res = await axios.post(`${backendIp}/auth/reset-password`, { email, newPassword, confirmPassword });
      setSuccess(res.data.message || "Password reset successful");
      setStep(1);
      setEmail("");
      setOtp("");
      setNewPassword("");
      setConfirmPassword("");
      navigate("/login");
      toast.success("Password reset successful");
    } catch (err) {
      setError(err.response?.data?.message || "Password reset failed");
      toast.error("Password reset failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", bgcolor: "#D9F5E4", px: 2, }}>
      <Card sx={{ width: "100%", maxWidth: 420, boxShadow: 4, borderRadius: 2, }}>
        <CardContent sx={{ p: { xs: 2.5, sm: 4 } }}>
          <Typography variant="h5" fontWeight="bold" textAlign="center" gutterBottom>
            Forgot Password
          </Typography>
          
          <Typography variant="body2" sx={{ opacity: 0.6, mb: 2 }}>
            Enter your email address to receive a one-time password (OTP) and continue
            the password reset process.
          </Typography>

          {success && (
            <Alert severity="success" sx={{ mb: 2 }}>
              {success}
            </Alert>
          )}
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          {/* STEP 1 */}
          {step === 1 && (
            <Box component="form" onSubmit={sendOtp}>
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
                sx={{ mt: 2, py: 1.2 }}
              >
                {loading ? "Sending OTP..." : "Send OTP"}
              </Button>
            </Box>
          )}

          {/* STEP 2 */}
          {step === 2 && (
            <Box component="form" onSubmit={verifyOtp}>
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
                sx={{ mt: 2, py: 1.2 }}
              >
                {loading ? "Verifying..." : "Verify OTP"}
              </Button>
            </Box>
          )}

          {/* STEP 3 */}
          {step === 3 && (
            <Box component="form" onSubmit={resetPassword}>
              <TextField
                label="New Password"
                type={showPassword ? "text" : "password"}
                fullWidth
                required
                margin="normal"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
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

              <Button
                fullWidth
                variant="contained"
                type="submit"
                disabled={loading}
                sx={{ mt: 2, py: 1.2 }}
              >
                {loading ? "Resetting..." : "Reset Password"}
              </Button>
            </Box>
          )}
        </CardContent>
      </Card>
    </Box>
  );
};
