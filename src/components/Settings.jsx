import React, { useEffect, useState } from "react";
import { Tabs, Tab, Typography } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { fetchMyProfile } from "../redux/thunk/myProfileThunk";
import { useNavigate } from "react-router-dom";
import NotificationSettings from "./settings/NotificationSettings";
import SubscriptionSettings from "./settings/SubscriptionSettings";
import SupportSettings from "./settings/SupportSettings";
import PrivacySettings from "./settings/privacySettings";
import SecuritySettings from "./settings/securitySettings";

export default function Settings() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id, myProfile } = useSelector(state => state.auth);

  const [tab, setTab] = useState(0);
  const [securityPassword, setSecurityPassword] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  useEffect(() => {
    dispatch(fetchMyProfile(id));
  }, [id, dispatch]);

  return (
    <div style={{ padding: 10 }}>
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        Settings
      </Typography>

      <Tabs value={tab} onChange={(e, v) => setTab(v)} variant="scrollable">
        <Tab label="Privacy" />
        <Tab label="Notifications" />
        <Tab label="Subscription" />
        <Tab label="Security" />
        <Tab label="Support" />
      </Tabs>

      <div style={{ marginTop: 20 }}>
        {tab === 0 && <PrivacySettings userId={id} />}
        {tab === 1 && <NotificationSettings userId={id} />}
        {tab === 2 && (
          <SubscriptionSettings myProfile={myProfile} navigate={navigate} />
        )}
        {tab === 3 && (
          <SecuritySettings
            securityPassword={securityPassword}
            setSecurityPassword={setSecurityPassword}
            userId={id}
          />
        )}
        {tab === 4 && <SupportSettings userId={id} />}
      </div>
    </div>
  );
};