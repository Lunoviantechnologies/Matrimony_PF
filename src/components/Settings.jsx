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
    gap: 1.2,
    mb: 3,

    /* mobile & tablet → horizontal slider */
    overflowX: { xs: "auto", sm: "auto", md: "visible" },
    flexWrap: { xs: "nowrap", sm: "nowrap", md: "wrap" },

    WebkitOverflowScrolling: "touch",

    "&::-webkit-scrollbar": {
      display: "none",
    },
  }}
>
        {tabs.map((t) => (
          <Button
            key={t.index}
            onClick={() => setTab(t.index)}
            variant={tab === t.index ? "contained" : "outlined"}
         sx={{
  textTransform: "none",
  fontWeight: 600,
  borderRadius: "12px",
  px: 2.5,
  py: 1,

  whiteSpace: "nowrap",         // 🔥 important
  flexShrink: 0,                // 🔥 important

  minWidth: { xs: "auto", md: 120 },

  backgroundColor: tab === t.index ? "#0a6817ff" : "transparent",
  color: tab === t.index ? "#efeaeaff" : "#089226ff",
  borderColor: "#0a6817ff",

  "&:hover": {
    backgroundColor:
      tab === t.index ? "#089226ff" : "rgba(25, 118, 210, 0.08)",
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
