import React, { useEffect, useState } from "react";
import { Card, CardContent, Typography, TextField, MenuItem, Switch, FormControlLabel, Button, Box, Stack,} from "@mui/material";
import api from "../../api/axiosInstance";
import { toast } from "react-toastify";

export default function PrivacySettings({ userId }) {
    const [profileVisibility, setProfileVisibility] = useState("Everyone");
    const [hideProfilePhoto, setHideProfilePhoto] = useState(false);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        const fetchPrivacySettings = async () => {
            try {
                const response = await api.get(`/profiles/${userId}/privacy`);
                setProfileVisibility(response.data.profileVisibility || "Everyone");
                setHideProfilePhoto(response.data.hideProfilePhoto || false);
            } catch (error) {
                console.error("Failed to fetch privacy settings:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchPrivacySettings();
    }, [userId]);

    const handleSave = async () => {
        setSaving(true);
        try {
            await api.put(`/profiles/${userId}/privacy`, {
                profileVisibility,
                hideProfilePhoto,
            });
            toast.success("Privacy settings saved successfully!");
        } catch (error) {
            console.error("Failed to save privacy settings:", error);
            toast.error("Failed to save settings.");
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <Typography align="center" sx={{ mt: 4 }}>
                Loading...
            </Typography>
        );
    }

    return (
        <Box
            sx={{
                maxWidth: 480,
                mx: "auto",
                px: { xs: 2, sm: 3 },
                py: 3,
            }}
        >
            <Card>
                <CardContent>
                    <Typography variant="h6" fontWeight={600} gutterBottom>
                        Privacy Settings
                    </Typography>

                    <Stack spacing={2}>
                        <TextField
                            select
                            fullWidth
                            label="Profile Visibility"
                            value={profileVisibility}
                            onChange={(e) => setProfileVisibility(e.target.value)}
                        >
                            <MenuItem value="Everyone">Everyone</MenuItem>
                            <MenuItem value="Only Matches">Only Matches</MenuItem>
                            <MenuItem value="Premium Members">
                                Premium Members
                            </MenuItem>
                        </TextField>

                        <FormControlLabel
                            control={
                                <Switch
                                    checked={hideProfilePhoto}
                                    onChange={(e) =>
                                        setHideProfilePhoto(e.target.checked)
                                    }
                                />
                            }
                            label="Hide Profile Photo"
                        />

                        <Button
                            variant="contained"
                            fullWidth
                            onClick={handleSave}
                            disabled={saving}
                        >
                            {saving ? "Saving..." : "Save Changes"}
                        </Button>
                    </Stack>
                </CardContent>
            </Card>
        </Box>
    );
};