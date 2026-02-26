import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/axiosInstance";

/**
 * Fetch Matches
 * Backend handles:
 * - filtering
 * - sorting
 * - pagination
 * - match type logic
 */
export const fetchMatches = createAsyncThunk(
    "matches/fetchMatches",
    async (_, { getState, rejectWithValue }) => {
        try {
            const state = getState();
            const { filters, sort, page, size, matchType } = state.matches;
            const { myProfile } = state.auth;

            if (!myProfile?.id) {
                return rejectWithValue("User profile not loaded");
            }
            // console.log("myProfile in fetchMatches:", myProfile); // debug

            // CLEAN FILTERS FOR BACKEND
            const cleanedFilters = {
                profileFor: filters.profileFor || [],
                age: filters.age || [],
                maritalStatus: filters.maritalStatus || [],
                religion: filters.religion || [],
                country: filters.country || [],
                education: filters.education || [],
                profession: filters.profession || [],
                lifestyle: filters.lifestyle || [],
                habbits: filters.habbits || [],
                caste: filters.customCaste || filters.otherValues?.caste || null,
                height: filters.otherValues?.height || null,
                myId: myProfile?.id,
                myGender: myProfile?.gender,
                hiddenIds: []
            };

            if (matchType === "NEAR") {
                cleanedFilters.city = myProfile?.city;
            }

            const payload = {
                matchType,
                sort,
                page: page ?? 0,
                size: size && size > 0 ? size : 10,
                filters: cleanedFilters
            };

            console.log("MATCH PAYLOAD:", payload); // debug

            const response = await api.post("/profiles/matches/search", payload);
            console.log("MATCH RESPONSE:", response.data); // debug
            return response.data;

        } catch (error) {
            console.log("MATCH ERROR:", error.response?.data);
            return rejectWithValue(
                error.response?.data || "Failed to fetch matches"
            );
        }
    }
);