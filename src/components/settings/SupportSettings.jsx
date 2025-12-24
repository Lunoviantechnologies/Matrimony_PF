import { Card, CardContent, Typography, Button, Box} from "@mui/material";
import React from "react";
import { logout } from "../../redux/slices/authSlice";
import { useDispatch } from "react-redux";
import api from "../../api/axiosInstance";
import { toast } from "react-toastify";

export default function SupportSettings({ userId }) {
    const dispatch = useDispatch();

    const handleDeleteAccount = async () => {
        if (window.confirm("Are you sure you want to delete your account?")) {
            try {
                await api.delete(`/profiles/delete/${userId}`);
                toast.success("Account deleted successfully");
                dispatch(logout());
            } catch (error) {
                console.error("Failed to delete account:", error);
                toast.error("Failed to delete account");
            }
        }
    };

    return (
        <Box
            sx={{
                // minHeight: "100vh",
                display: "flex",
                // alignItems: "center",
                justifyContent: "center",
                px: 2,              // padding for mobile
            }}
        >
            <Card
                sx={{
                    width: "100%",
                    maxWidth: 420,     // keeps it compact on desktop
                    boxShadow: 4,
                    borderRadius: 2,
                }}
            >
                <CardContent sx={{ p: { xs: 2.5, sm: 4 } }}>
                    <Typography variant="h6" align="center" gutterBottom>
                        Help & Support
                    </Typography>

                    <Button
                        fullWidth
                        sx={{ mt: 2 }}
                        variant="contained"
                    >
                        View FAQ
                    </Button>

                    <Button
                        fullWidth
                        sx={{ mt: 1.5 }}
                        variant="contained"
                    >
                        Contact Support
                    </Button>

                    <Button
                        fullWidth
                        sx={{ mt: 2 }}
                        variant="contained"
                        color="error"
                        onClick={handleDeleteAccount}
                    >
                        Delete Account
                    </Button>
                </CardContent>
            </Card>
        </Box>
    );
}
