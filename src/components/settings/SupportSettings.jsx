import { Card, CardContent, Typography, Button, Box, Dialog, DialogContent, IconButton, } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import React, { useState } from "react";
import { logout } from "../../redux/slices/authSlice";
import { useDispatch } from "react-redux";
import api from "../../api/axiosInstance";
import { toast } from "react-toastify";
import FAQ_user from "./FAQ_user";
// import ContactSupport from "./ContactSupport";

export default function SupportSettings({ userId }) {
    const dispatch = useDispatch();
    const [openFaq, setOpenFaq] = useState(false);
    // const [openContactSupport, setOpenContactSupport] = useState(false);

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
        <Box sx={{ display: "flex", justifyContent: "center", px: 2, }}>
            <Card sx={{ width: "100%", maxWidth: 420, boxShadow: 4, borderRadius: 2, }}>
                <CardContent sx={{ p: { xs: 2.5, sm: 4 } }}>
                    <Typography variant="h6" align="center" gutterBottom>
                        Help & Support
                    </Typography>

                    <Button fullWidth sx={{ mt: 2 }} variant="contained" onClick={() => setOpenFaq(true)}>
                        View FAQ
                    </Button>

                    <Button fullWidth sx={{ mt: 2 }} variant="contained" color="error" onClick={handleDeleteAccount} >
                        Delete Account
                    </Button>
                </CardContent>
            </Card>

            {/* ✅ FAQ POPUP */}
            <Dialog
                open={openFaq}
                onClose={() => setOpenFaq(false)}
                fullWidth
                maxWidth="md"
            >
                {/* Close button */}
                <IconButton
                    onClick={() => setOpenFaq(false)}
                    sx={{ position: "absolute", right: 8, top: 8 }}
                >
                    <CloseIcon />
                </IconButton>

                <DialogContent dividers>
                    <FAQ_user />
                </DialogContent>
            </Dialog>
        </Box>
    );
}
