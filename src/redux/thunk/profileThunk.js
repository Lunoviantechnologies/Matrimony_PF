import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/axiosInstance";

export const fetchAdminProfiles = createAsyncThunk(
    "profile/fetchAdminProfiles",
    async (params = {}, { rejectWithValue }) => {
        try {
            const cleanParams = Object.fromEntries(Object.entries(params).filter(([_, value]) => value !== undefined && value !== null && value !== ""));
            const res = await api.get("/admin/profiles", { params: cleanParams, });
            // console.log("API response for admin profiles:", res.data);
            return res.data;
        } catch (err) {
            return rejectWithValue(
                err.response?.data?.message || err.response?.data || "Failed to fetch user profiles in admin"
            );
        }
    }
);

// USER
// export const fetchUserProfiles = createAsyncThunk(
//     "profile/fetchUserProfiles",
//     async (_, { rejectWithValue }) => {
//         try {
//             const res = await api.get("/profiles/Allprofiles");
//             return res.data;
//         } catch (err) {
//             return rejectWithValue(err.response?.data || "User profiles failed to fetch");
//         }
//     }
// );

export const fetchUserProfiles = createAsyncThunk(
    "profile/fetchUserProfiles",
    async (params = {}, { rejectWithValue }) => {
        try {
            const cleanParams = Object.fromEntries(Object.entries(params).filter(([_, value]) => value !== undefined && value !== null && value !== ""));
            const res = await api.get("/profiles/Allprofiles", { params: cleanParams });
            // console.log("API response for user profiles:", res.data);
            return res.data;
        } catch (err) {
            return rejectWithValue(err.response?.data || "User profiles failed to fetch");
        }
    }
);

export const fetchProfileById = createAsyncThunk(
    "profiles/fetchProfileById",
    async ({ myId, userId }, { rejectWithValue }) => {
        try {
            const response = await api.get(`/profiles/view/${myId}/${userId}`);
            return response.data;
        } catch (error) {
            return rejectWithValue("Failed to fetch profile");
        }
    }
);