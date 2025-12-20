import { Card, CardContent, Typography, Button } from "@mui/material";
import axios from "axios";
import backendIP from "../../api/api";
import React from "react";
import { logout } from "../../redux/slices/authSlice";
import { useDispatch } from "react-redux";

export default function SupportSettings({ userId }) {
    const dispatch = useDispatch();

    const handleDeleteAccount = async () => {
        if (window.confirm("Are you sure you want to delete your account?")) {
            try {
                await axios.delete(`${backendIP}/profiles/delete/${userId}`);
                alert("Account deleted successfully.");
                dispatch(logout());
            } catch (error) {
                console.error("Failed to delete account:", error);
                alert("Failed to delete account.");
            }
        }
    };

    return (
        <Card>
            <CardContent>
                <Typography variant="h6">Help & Support</Typography>
                <Button fullWidth sx={{ mt: 1 }} variant="contained">View FAQ</Button>
                <Button fullWidth sx={{ mt: 1 }} variant="contained">Contact Support</Button>
                <Button fullWidth sx={{ mt: 1 }} variant="contained" color="error" onClick={handleDeleteAccount}>
                    Delete Account
                </Button>
            </CardContent>
        </Card>
    );
};