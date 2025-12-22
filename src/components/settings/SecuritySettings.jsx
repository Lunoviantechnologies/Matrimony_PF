import React from "react";
import { Card, CardContent, Typography, TextField, Button } from "@mui/material";
import axios from "axios";
import backendIP from "../../api/api";
import api from "../../api/axiosInstance";

export default function SecuritySettings({
    securityPassword,
    setSecurityPassword,
    userId,
}) {
    const handleSubmit = () => {
        const { oldPassword, newPassword, confirmPassword } = securityPassword;
        console.log("securityPassword", securityPassword);

        if (!oldPassword || !newPassword || !confirmPassword) {
            alert("All fields are required");
            return;
        }
        if (newPassword !== confirmPassword) {
            alert("Passwords do not match");
            return;
        }
        if (newPassword.length < 8) {
            alert("Password must be at least 8 characters");
            return;
        }

        api.put(`/auth/change-password/${userId}`, {
            currentPassword: oldPassword,
            newPassword,
            confirmPassword,
        })
            .then(() => {
                alert("Password changed successfully");
                setSecurityPassword({
                    oldPassword: "",
                    newPassword: "",
                    confirmPassword: "",
                });
            })
            .catch(() => alert("Failed to change password"));
    };

    return (
        <Card>
            <CardContent>
                <Typography variant="h6" fontWeight="600">
                    Security Settings
                </Typography>

                <TextField
                    type="text"
                    label="Old Password"
                    fullWidth
                    margin="normal"
                    value={securityPassword.oldPassword}
                    onChange={e =>
                        setSecurityPassword(p => ({ ...p, oldPassword: e.target.value }))
                    }
                />

                <TextField
                    type="text"
                    label="New Password"
                    fullWidth
                    margin="normal"
                    value={securityPassword.newPassword}
                    onChange={e =>
                        setSecurityPassword(p => ({ ...p, newPassword: e.target.value }))
                    }
                />

                <TextField
                    type="text"
                    label="Confirm Password"
                    fullWidth
                    margin="normal"
                    value={securityPassword.confirmPassword}
                    onChange={e =>
                        setSecurityPassword(p => ({
                            ...p,
                            confirmPassword: e.target.value,
                        }))
                    }
                />

                <Button variant="contained" sx={{ mt: 2 }} onClick={handleSubmit}>
                    Update Password
                </Button>
            </CardContent>
        </Card>
    );
};