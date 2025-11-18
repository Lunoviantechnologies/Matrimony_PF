import React, { useState } from "react";
import { TextField, Button, Card, CardContent, Typography, Alert } from "@mui/material";
import axios from "axios";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccess("");
    setError("");
    setLoading(true);

    try {
      // 🔹 Replace URL with your backend API
      const response = await axios.post("http://your-backend.com/api/forgot-password", {
        email,
      });

      setSuccess(response.data.message || "Reset link sent to your email!");
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 p-4">
      <Card
        sx={{
          width: "100%",
          maxWidth: 450,
          margin: "0 auto",
        }}
        className="shadow-lg"
      >
        <CardContent>
          <Typography variant="h5" fontWeight="bold" gutterBottom>
            Forgot Password
          </Typography>

          <Typography variant="body2" color="text.secondary" gutterBottom>
            Enter your registered email, and we'll send you a password reset link.
          </Typography>

          {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

          <form onSubmit={handleSubmit}>
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
              {loading ? "Sending..." : "Send Reset Link"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );

};
