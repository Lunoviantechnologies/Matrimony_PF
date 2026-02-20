import React, { useEffect, useState } from "react";
import { Box, Typography, Button, TextField, Stack } from "@mui/material";
import api from "../../api/axiosInstance";

export default function ReferAndEarn() {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [copyDone, setCopyDone] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await api.get("/referrals/me");
        setSummary(res.data);
      } catch (e) {
        setError("Unable to load refer & earn details.");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const handleCopy = async () => {
    if (!summary?.referralCode) return;
    try {
      await navigator.clipboard.writeText(summary.referralCode);
      setCopyDone(true);
      setTimeout(() => setCopyDone(false), 1500);
    } catch {
      setCopyDone(false);
    }
  };

  const handleShare = () => {
    if (!summary) return;
    const msg = `Join Vivah Jeevan! Use my referral code ${summary.referralCode}. ${summary.referralLink || ""}`;
    if (navigator.share) {
      navigator
        .share({ title: "Vivah Jeevan – Refer & Earn", text: msg })
        .catch(() => {});
    } else {
      window.alert(msg);
    }
  };

  if (loading) {
    return (
      <Box sx={{ p: 2 }}>
        <Typography>Loading Refer &amp; Earn...</Typography>
      </Box>
    );
  }

  if (error || !summary) {
    return (
      <Box sx={{ p: 2 }}>
        <Typography color="error">{error || "No referral info available."}</Typography>
      </Box>
    );
  }

  const completed = summary.completedReferrals ?? 0;
  const totalNeeded = summary.totalReferralsNeeded ?? 2;

  return (
    <Box sx={{ p: 2, maxWidth: 600, margin: "0 auto" }}>
      <Typography variant="h5" fontWeight="bold" gutterBottom>
        Refer &amp; Earn
      </Typography>
      <Typography variant="body2" sx={{ mb: 2 }}>
        Invite 2 friends and get a flat <b>₹100</b> reward. Share your unique code or link below.
      </Typography>

      <Box
        sx={{
          bgcolor: "#f7fafc",
          borderRadius: 2,
          p: 2,
          border: "1px solid #e2e8f0",
          mb: 2,
        }}
      >
        <Typography variant="subtitle2" sx={{ mb: 1, color: "#4a5568" }}>
          Your referral code
        </Typography>
        <Stack direction="row" spacing={1} alignItems="center">
          <TextField
            value={summary.referralCode || ""}
            size="small"
            InputProps={{ readOnly: true }}
            sx={{ flex: 1 }}
          />
          <Button variant="contained" sx={{width: "150px"}} onClick={handleCopy}>
            {copyDone ? "Copied" : "Copy"}
          </Button>
        </Stack>

        {summary.referralLink && (
          <>
            <Typography variant="subtitle2" sx={{ mt: 2, mb: 1, color: "#4a5568" }}>
              Referral link
            </Typography>
            <TextField
              value={summary.referralLink}
              size="small"
              InputProps={{ readOnly: true }}
              sx={{ width: "100%" }}
            />
          </>
        )}

        <Button
          variant="outlined"
          sx={{ mt: 2, textTransform: "none", fontWeight: 600 }}
          onClick={handleShare}
        >
          Share with friends
        </Button>
      </Box>

      <Box
        sx={{
          bgcolor: "#fefce8",
          borderRadius: 2,
          p: 2,
          border: "1px solid #facc15",
        }}
      >
        <Typography variant="subtitle2" sx={{ mb: 0.5, color: "#854d0e" }}>
          Your progress
        </Typography>
        <Typography variant="body2" sx={{ mb: 0.5 }}>
          {completed}/{totalNeeded} referrals completed
        </Typography>
        <Typography variant="body2">
          Reward balance: <b>₹{summary.rewardBalance ?? 0}</b>
        </Typography>
      </Box>
    </Box>
  );
}

