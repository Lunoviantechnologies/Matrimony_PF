import React, { useState } from "react";
import { Button, Box, Paper, Typography } from "@mui/material";
import { useSelector } from "react-redux";
import ChangePassword from "./ChangePassword";
import CreateAdmin from "./CreateAdmin";

const AdminSettings = () => {

    const { id } = useSelector((state) => state.auth);
    const [tab, setTab] = useState(0);
    const [securityPassword, setSecurityPassword] = useState({
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
    });

    const tabs = [
        { label: "Security", index: 0 },
        { label: "Create Admin", index: 1 },
    ];

    // console.log("AdminSettings rendered", id);

    return (
        <Box sx={{ maxWidth: 900, mx: "auto", mt: 3, px: 2 }}>
            <Paper
                elevation={3}
                sx={{
                    borderRadius: 3,
                    p: 3,
                    background: "linear-gradient(135deg,#f9fafb,#f0fff4)",
                }}
            >
                <Typography variant="h5" fontWeight={700} mb={2} color="#064e3b">
                    Admin Settings
                </Typography>

                {/* 🔹 BUTTON TABS */}
                <Box
                    sx={{
                        display: "flex",
                        gap: 2,
                        mb: 3,
                        flexWrap: "wrap",
                    }}
                >
                    {tabs.map((t) => (
                        <Button
                            key={t.index}
                            fullWidth
                            onClick={() => setTab(t.index)}
                            variant={tab === t.index ? "contained" : "outlined"}
                            sx={{
                                flex: 1,
                                textTransform: "none",
                                fontWeight: 600,
                                borderRadius: "999px",
                                px: 3,
                                py: 1.2,
                                boxShadow:
                                    tab === t.index
                                        ? "0 4px 12px rgba(16, 185, 129, 0.35)"
                                        : "none",
                                backgroundColor: tab === t.index ? "#0a6817ff" : "#ffffff",
                                color: tab === t.index ? "#f9fafb" : "#065f46",
                                borderColor: "#0a6817ff",
                                "&:hover": {
                                    backgroundColor:
                                        tab === t.index ? "#089226ff" : "#f0fdf4",
                                },
                            }}
                        >
                            {t.label}
                        </Button>
                    ))}
                </Box>

                {/* Content */}
                <Box sx={{ mt: 2 }}>
                    {tab === 0 && (
                        <ChangePassword
                            securityPassword={securityPassword}
                            setSecurityPassword={setSecurityPassword}
                            adminId={id}
                        />
                    )}
                    {tab === 1 && <CreateAdmin adminId={id} />}
                </Box>
            </Paper>
        </Box>
    );
};

export default AdminSettings;