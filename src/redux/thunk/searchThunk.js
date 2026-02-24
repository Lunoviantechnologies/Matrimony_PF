import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/axiosInstance";

export const searchProfiles = createAsyncThunk(
    "search/searchProfiles",
    async ({ filters, page = 0, size = 10 }, { rejectWithValue }) => {
        try {
            const cleanFilters = Object.fromEntries(Object.entries(filters || {})
                .filter(([_, value]) => value !== undefined && value !== null && value !== "" && !(Array.isArray(value) && value.length === 0)));

            const res = await api.post(`/profiles/search?page=${page}&size=${size}`, cleanFilters);

            return res.data;
        } catch (err) {
            return rejectWithValue(
                err.response?.data?.message || "Search failed"
            );
        }
    }
);