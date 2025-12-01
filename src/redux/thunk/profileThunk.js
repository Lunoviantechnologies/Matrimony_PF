import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import backendIP from "../../api/api";

export const fetchUserProfiles = createAsyncThunk (
    "profile/fetchUserProfiles",
    async ( _, { rejectWithValue } ) => {
        try {
            const response = await axios.get( `${backendIP}/admin/profiles`);
            return response.data;
        } catch ( err ) {
            return rejectWithValue( err.response?.data || "Failed to fetch user profiles" );
        }
    }
);