import React, { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Box, Button, Typography } from "@mui/material";

export default function ReferralLanding() {
  const { code } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (code) {
      // Store referral code so registration flow can pick it up
      localStorage.setItem("referralCode", code);
    }
  }, [code]);

  return (
    <Box
      sx={{
        minHeight: "60vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#f0fdf4",
        px: 2,
      }}
    >
      <Box
        sx={{
          maxWidth: 480,
          width: "100%",
          backgroundColor: "#ffffff",
          borderRadius: 3,
          p: 3,
          boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
          textAlign: "center",
          border: "1px solid #bbf7d0",
        }}
      >
        <Typography variant="h5" fontWeight="bold" gutterBottom>
          Welcome to VivahJeevan
        </Typography>
        <Typography variant="body2" sx={{ mb: 2, color: "#4b5563" }}>
          A friend invited you to join. Your referral code:
        </Typography>
        <Box
          sx={{
            borderRadius: 999,
            border: "1px dashed #22c55e",
            px: 3,
            py: 1.2,
            display: "inline-block",
            mb: 2,
          }}
        >
          <Typography fontWeight="800" letterSpacing={2} color="#15803d">
            {code || "—"}
          </Typography>
        </Box>
        <Typography variant="body2" sx={{ mb: 3, color: "#4b5563" }}>
          Continue to sign up or login. Your reward will be applied automatically
          once you complete the registration and conditions.
        </Typography>
        <Box sx={{ display: "flex", justifyContent: "center", gap: 1.5 }}>
          <Button
            variant="contained"
            sx={{ textTransform: "none", fontWeight: 700, backgroundColor: "#16a34a" }}
            onClick={() => navigate("/register")}
          >
            Sign up now
          </Button>
          <Button
            variant="outlined"
            sx={{ textTransform: "none", fontWeight: 700, borderColor: "#16a34a", color: "#16a34a" }}
            onClick={() => navigate("/login")}
          >
            I already have an account
          </Button>
        </Box>
      </Box>
    </Box>
  );
}

