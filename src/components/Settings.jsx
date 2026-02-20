import React, { useEffect, useState } from "react";
import { Typography, Button, Box } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { fetchMyProfile } from "../redux/thunk/myProfileThunk";
import { useLocation, useNavigate } from "react-router-dom";
import SubscriptionSettings from "./settings/SubscriptionSettings";
import SupportSettings from "./settings/SupportSettings";
import PrivacySettings from "./settings/PrivacySettings";
import SecuritySettings from "./settings/SecuritySettings";
import ReferAndEarn from "./settings/ReferAndEarn";

export default function Settings() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { id, myProfile } = useSelector((state) => state.auth);

  const [tab, setTab] = useState(0);
  const [securityPassword, setSecurityPassword] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  useEffect(() => {
    if (id) {
      dispatch(fetchMyProfile(id));
    }
  }, [id, dispatch]);

  // If URL query has ?tab=refer, open Refer & Earn tab by default
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const tabParam = params.get("tab");
    if (tabParam === "refer") {
      setTab(4);
    }
  }, [location.search]);

  const tabs = [
    { label: "Privacy", index: 0 },
    { label: "Subscription", index: 1 },
    { label: "Security", index: 2 },
    { label: "Support", index: 3 },
    { label: "Refer & Earn", index: 4 },
  ];

  return (
    <div style={{ padding: 10 }}>
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        Settings
      </Typography>

      {/* 🔹 BUTTON TABS */}
      <Box
        sx={{
          display: "flex",
          gap: 2,
          mb: 3,
          flexWrap: "nowrap",
          overflowX: "hidden",   // 🔥 remove scroll completely
        }}
      >
        {tabs.map((t) => (
          <Button
            key={t.index}
            onClick={() => setTab(t.index)}
            variant={tab === t.index ? "contained" : "outlined"}
            disableRipple
            sx={{
              whiteSpace: "nowrap",
              textTransform: "none",
              fontWeight: 600,
              borderRadius: "12px",
              px: 3,
              py: 1,
              minWidth: "auto",     // 🔥 important
              width: "auto",        // 🔥 important

              backgroundColor: tab === t.index ? "#0a6817" : "transparent",
              color: tab === t.index ? "#fff" : "#089226",
              borderColor: "#0a6817",

              "&:hover": {
                backgroundColor: tab === t.index ? "#089226" : "rgba(0,0,0,0.04)",
              },
            }}
          >
            {t.label}
          </Button>
        ))}
      </Box>

      {/* 🔹 CONTENT */}
      <div>
        {tab === 0 && <PrivacySettings userId={id} />}
        {tab === 1 && (
          <SubscriptionSettings myProfile={myProfile} navigate={navigate} />
        )}

        {tab === 2 && (
          <SecuritySettings
            securityPassword={securityPassword}
            setSecurityPassword={setSecurityPassword}
            userId={id}
          />
        )}

        {tab === 3 && <SupportSettings userId={id} />}
        {tab === 4 && <ReferAndEarn />}
      </div>
    </div>
  );
}
