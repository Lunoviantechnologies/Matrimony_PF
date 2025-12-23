import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/axiosInstance";

export const fetchAdminProfiles = createAsyncThunk(
    "profile/fetchAdminProfiles",
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.get("/admin/profiles");
            return response.data;
        } catch (err) {
            return rejectWithValue(err.response?.data || "Failed to fetch user profiles in admin");
        }
    }
);

// USER
export const fetchUserProfiles = createAsyncThunk(
    "profile/fetchUserProfiles",
    async (_, { rejectWithValue }) => {
        try {
            const res = await api.get("/profiles/Allprofiles");
            return res.data;
        } catch (err) {
            return rejectWithValue(err.response?.data || "User profiles failed to fetch");
        }
    }
);