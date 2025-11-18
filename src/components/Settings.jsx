import React, { useState } from "react";
import { Tabs, Tab, TextField, Switch, FormControlLabel, Button, MenuItem, Card, CardContent, Typography } from "@mui/material";

export default function Settings() {
  const [tab, setTab] = useState(0);

  const AccountSettings = () => (
    <Card>
      <CardContent>
        <Typography variant="h6" fontWeight="600" gutterBottom>
          Account Details
        </Typography>

        <TextField label="Full Name" fullWidth margin="normal" />
        <TextField label="Email Address" fullWidth margin="normal" />
        <TextField label="Phone Number" fullWidth margin="normal" />

        <Button variant="contained" color="primary" sx={{ mt: 2 }}>
          Save Changes
        </Button>
      </CardContent>
    </Card>
  );

  const PrivacySettings = () => (
    <Card>
      <CardContent>
        <Typography variant="h6" fontWeight="600" gutterBottom>
          Privacy Settings
        </Typography>

        <TextField select label="Profile Visibility" fullWidth margin="normal">
          <MenuItem>Everyone</MenuItem>
          <MenuItem>Only Matches</MenuItem>
          <MenuItem>Premium Members</MenuItem>
        </TextField>

        <FormControlLabel control={<Switch />} label="Hide Profile Photo" />

        <Button variant="contained" color="primary" sx={{ mt: 2 }}>
          Save Changes
        </Button>
      </CardContent>
    </Card>
  );

  const NotificationSettings = () => (
    <Card>
      <CardContent>
        <Typography variant="h6" fontWeight="600" gutterBottom>
          Notification Preferences
        </Typography>

        <FormControlLabel control={<Switch />} label="Email Notifications" />
        <FormControlLabel control={<Switch />} label="SMS Alerts" />
        <FormControlLabel control={<Switch />} label="App Push Notifications" />

        <Button variant="contained" color="primary" sx={{ mt: 2 }}>
          Save Preferences
        </Button>
      </CardContent>
    </Card>
  );

  const SubscriptionSettings = () => (
    <Card>
      <CardContent>
        <Typography variant="h6" fontWeight="600" gutterBottom>
          Subscription Details
        </Typography>

        <Typography variant="body1" gutterBottom>
          Current Plan: <b>Free Plan</b>
        </Typography>

        <Button variant="contained" color="success" sx={{ mt: 2 }}>
          Upgrade Plan
        </Button>
      </CardContent>
    </Card>
  );

  const SecuritySettings = () => (
    <Card>
      <CardContent>
        <Typography variant="h6" fontWeight="600" gutterBottom>
          Security Settings
        </Typography>

        <TextField type="password" label="New Password" fullWidth margin="normal" />
        <TextField type="password" label="Confirm Password" fullWidth margin="normal" />

        <Button variant="contained" color="primary" sx={{ mt: 2 }}>
          Update Password
        </Button>
      </CardContent>
    </Card>
  );

  const SupportSettings = () => (
    <Card>
      <CardContent>
        <Typography variant="h6" fontWeight="600" gutterBottom>
          Help & Support
        </Typography>

        <Button fullWidth variant="contained" color="secondary" sx={{ mt: 1 }}>
          View FAQ
        </Button>
        <Button fullWidth variant="contained" color="secondary" sx={{ mt: 1 }}>
          Contact Support
        </Button>
        <Button fullWidth variant="contained" color="error" sx={{ mt: 1 }}>
          Delete Account
        </Button>
      </CardContent>
    </Card>
  );

  return (
    <div style={{ width: "100%", padding: "10px" }}>
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        Settings
      </Typography>

      <Tabs
        value={tab}
        onChange={(e, v) => setTab(v)}
        variant="scrollable"
        scrollButtons
        allowScrollButtonsMobile
      >
        <Tab label="Account" />
        <Tab label="Privacy" />
        <Tab label="Notifications" />
        <Tab label="Subscription" />
        <Tab label="Security" />
        <Tab label="Support" />
      </Tabs>

      <div style={{ marginTop: "20px" }}>
        {tab === 0 && <AccountSettings />}
        {tab === 1 && <PrivacySettings />}
        {tab === 2 && <NotificationSettings />}
        {tab === 3 && <SubscriptionSettings />}
        {tab === 4 && <SecuritySettings />}
        {tab === 5 && <SupportSettings />}
      </div>
    </div>
  );
};