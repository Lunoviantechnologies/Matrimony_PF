import { createSlice } from "@reduxjs/toolkit";
import { fetchUserProfiles, fetchAdminProfiles, fetchProfileById } from "../thunk/profileThunk";

const initialState = {
    // profiles: [],
    userProfiles: [],
    profileMap: {},   // for quick lookup by ID
    adminProfiles: [],
    totalPages: 0,
    totalElements: 0,
    adminloading: false,
    userloading: false,
    profileLoading: false,      // for view profile modal
    selectedProfile: null,      // full profile details
    profileCache: {},     // cache for viewed profiles to avoid refetching
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
                state.adminloading = true;
                state.error = null;
            })
            .addCase(fetchAdminProfiles.fulfilled, (state, action) => {
                state.adminloading = false;
                const payload = action.payload || {};
                state.adminProfiles = payload.content || [];
                state.totalPages = payload.totalPages ?? 0;
                state.totalElements = payload.totalElements ?? 0;
            })
            .addCase(fetchAdminProfiles.rejected, (state, action) => {
                state.adminloading = false;
                state.error = action.payload;
            })

            // USER
            .addCase(fetchUserProfiles.pending, (state) => {
                state.userloading = true;
                state.error = null;
            })
            .addCase(fetchUserProfiles.fulfilled, (state, action) => {
                state.userloading = false;
                const payload = action.payload || {};
                const list = payload.content || [];

                state.userProfiles = list;
                state.totalPages = payload.totalPages ?? 0;
                state.totalElements = payload.totalElements ?? 0;

                list.forEach(p => {
                    if (p?.id) {
                        state.profileMap[p.id] = p;
                    }
                });
            })
            .addCase(fetchUserProfiles.rejected, (state, action) => {
                state.userloading = false;
                state.error = action.payload;
            })

            // FETCH PROFILE BY ID (VIEW PROFILE)
            .addCase(fetchProfileById.pending, (state) => {
                state.profileLoading = true;
                state.error = null;
            })

            .addCase(fetchProfileById.fulfilled, (state, action) => {
                state.profileLoading = false;
                const profile = action.payload;
                state.selectedProfile = profile;

                // optional caching
                if (profile?.id) {
                    state.profileCache[profile.id] = profile;
                }
            })

            .addCase(fetchProfileById.rejected, (state, action) => {
                state.profileLoading = false;
                state.error = action.payload;
            });

    },
});

export default profileSlice.reducer;