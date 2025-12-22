import React, { useEffect, useState } from "react";
import { Card, CardContent, Typography, TextField, MenuItem, Switch, FormControlLabel, Button } from "@mui/material";
import axios from "axios";
import backendIP from "../../api/api";
import api from "../../api/axiosInstance";

export default function PrivacySettings({ userId }) {
    const [profileVisibility, setProfileVisibility] = useState("Everyone");
    const [hideProfilePhoto, setHideProfilePhoto] = useState(false);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        // Fetch current privacy settings
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
                hideProfilePhoto
            });
            alert("Privacy settings saved successfully!");
        } catch (error) {
            console.error("Failed to save privacy settings:", error);
            alert("Failed to save settings.");
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <Typography>Loading...</Typography>;

    return (
        <Card>
            <CardContent>
                <Typography variant="h6">Privacy</Typography>

                <TextField
                    select
                    fullWidth
                    label="Profile Visibility"
                    margin="normal"
                    value={profileVisibility}
                    onChange={(e) => setProfileVisibility(e.target.value)}
                >
                    <MenuItem value="Everyone">Everyone</MenuItem>
                    <MenuItem value="Only Matches">Only Matches</MenuItem>
                    <MenuItem value="Premium Members">Premium Members</MenuItem>
                </TextField>

                <FormControlLabel
                    control={
                        <Switch
                            checked={hideProfilePhoto}
                            onChange={(e) => setHideProfilePhoto(e.target.checked)}
                        />
                    }
                    label="Hide Profile Photo"
                />

                <Button
                    variant="contained"
                    sx={{ mt: 2 }}
                    onClick={handleSave}
                    disabled={saving}
                >
                    {saving ? "Saving..." : "Save"}
                </Button>
            </CardContent>
        </Card>
    );
};