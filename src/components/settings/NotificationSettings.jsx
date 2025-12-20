import { Card, CardContent, Typography, Switch, FormControlLabel, Button } from "@mui/material";

export default function NotificationSettings() {
    return (
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
};