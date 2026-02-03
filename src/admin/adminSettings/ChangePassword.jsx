import React, { useState } from "react";
import { Card, CardContent, Typography, TextField, Button, Box, Stack, IconButton, InputAdornment, } from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import api from "../../api/axiosInstance";
import { toast } from "react-toastify";

export default function ChangePassword({
    securityPassword,
    setSecurityPassword,
    adminId,
}) {
    const [showOldPassword, setShowOldPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const handleSubmit = () => {
        const { oldPassword, newPassword, confirmPassword } = securityPassword;

        if (!oldPassword || !newPassword || !confirmPassword) {
            toast.error("All fields are required");
            return;
        }
        // if (newPassword !== confirmPassword) {
        //     toast.error("Passwords do not match");
        //     return;
        // }
        if (newPassword.length < 8) {
            toast.error("Password must be at least 8 characters");
            return;
        }

        api
            .put(`/admin/account/change-password`, {
                oldPassword: oldPassword,
                newPassword,
                confirmPassword,
            })
            .then((res) => {
                toast.success("Password changed successfully");
                setSecurityPassword({
                    oldPassword: "",
                    newPassword: "",
                    confirmPassword: "",
                });
                console.log("res: ", res);
            })
            .catch((err) => {
                toast.error(err.response.data.message);
                console.log("err: ", err.response.data.message);
            });
    };

    return (
        <Box
            sx={{ maxWidth: 480, mx: "auto", px: { xs: 2, sm: 3 }, py: 3, }}
        >
            <Card sx={{boxShadow: 10, borderRadius: 2,}}>
                <CardContent>
                    <Typography variant="h6" fontWeight={600} gutterBottom>
                        Security Settings
                    </Typography>

                    <Stack spacing={2}>
                        {/* Old Password */}
                        <TextField
                            label="Old Password"
                            type={showOldPassword ? "text" : "password"}
                            fullWidth
                            value={securityPassword.oldPassword}
                            onChange={(e) =>
                                setSecurityPassword((p) => ({
                                    ...p,
                                    oldPassword: e.target.value,
                                }))
                            }
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton
                                            onClick={() => setShowOldPassword((s) => !s)}
                                            edge="end"
                                        >
                                            {showOldPassword ? <VisibilityOff /> : <Visibility />}
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            }}
                        />

                        {/* New Password */}
                        <TextField
                            label="New Password"
                            type={showNewPassword ? "text" : "password"}
                            fullWidth
                            value={securityPassword.newPassword}
                            onChange={(e) =>
                                setSecurityPassword((p) => ({
                                    ...p,
                                    newPassword: e.target.value,
                                }))
                            }
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton
                                            onClick={() => setShowNewPassword((s) => !s)}
                                            edge="end"
                                        >
                                            {showNewPassword ? <VisibilityOff /> : <Visibility />}
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            }}
                        />

                        {/* Confirm Password */}
                        <TextField
                            label="Confirm Password"
                            type={showConfirmPassword ? "text" : "password"}
                            fullWidth
                            value={securityPassword.confirmPassword}
                            onChange={(e) =>
                                setSecurityPassword((p) => ({
                                    ...p,
                                    confirmPassword: e.target.value,
                                }))
                            }
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton
                                            onClick={() => setShowConfirmPassword((s) => !s)}
                                            edge="end"
                                        >
                                            {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            }}
                        />

                        <Button
                            fullWidth
                            variant="contained"
                            onClick={handleSubmit}
                        >
                            Update Password
                        </Button>
                    </Stack>
                </CardContent>
            </Card>
        </Box>
    );
};