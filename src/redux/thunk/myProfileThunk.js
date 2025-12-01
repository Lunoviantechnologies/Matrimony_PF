import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import backendIP from "../../api/api";

export const fetchMyProfile = createAsyncThunk (
    "auth/fetchMyProfile",
    async ( id, { rejectWithValue } ) => {
        try {
            const response = await axios.get( `${backendIP}/admin/profiles/${id}`);
            return response.data;
        } catch ( err ) {
            return rejectWithValue( err.response?.data || "Failed to fetch user profile" );
        }   
    }
);