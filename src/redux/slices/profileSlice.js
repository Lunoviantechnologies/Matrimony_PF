import { createSlice } from "@reduxjs/toolkit";
import { fetchUserProfiles, fetchAdminProfiles } from "../thunk/profileThunk";

const initialState = {
    profiles: [],
    loading: false,
    error: null,
};

const profileSlice = createSlice({
    name: "profile",
    initialState,
    reducers: {},

    extraReducers: (builder) => {
        builder
            // ADMIN
            .addCase(fetchAdminProfiles.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchAdminProfiles.fulfilled, (state, action) => {
                state.loading = false;
                state.profiles = action.payload;
            })
            .addCase(fetchAdminProfiles.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // USER
            .addCase(fetchUserProfiles.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchUserProfiles.fulfilled, (state, action) => {
                state.loading = false;
                state.profiles = action.payload;
            })
            .addCase(fetchUserProfiles.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export default profileSlice.reducer;