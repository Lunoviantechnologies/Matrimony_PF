import React, { useEffect, useState } from "react";
import { Typography, Button, Box } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { fetchMyProfile } from "../redux/thunk/myProfileThunk";
import { useNavigate } from "react-router-dom";

import SubscriptionSettings from "./settings/SubscriptionSettings";
import SupportSettings from "./settings/SupportSettings";
import PrivacySettings from "./settings/privacySettings";
import SecuritySettings from "./settings/securitySettings";

export default function Settings() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
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

  const tabs = [
    { label: "Privacy", index: 0 },
    { label: "Subscription", index: 1 },
    { label: "Security", index: 2 },
    { label: "Support", index: 3 },
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
          flexWrap: "wrap",
          mb: 3,
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
              px: 3,
              py: 1,
              backgroundColor: tab === t.index ? "#0a6817ff" : "transparent",
              color: tab === t.index ? "#efeaeaff" : "#089226ff",
              borderColor: "#0a6817ff",
              "&:hover": {
                backgroundColor:
                  tab === t.index
                    ? "#089226ff"
                    : "rgba(25, 118, 210, 0.08)",
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
      </div>
    </div>
  );
}
