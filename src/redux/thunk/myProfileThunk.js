import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/axiosInstance";

export const fetchMyProfile = createAsyncThunk (
    "auth/fetchMyProfile",
    async ( id, { rejectWithValue } ) => {
        try {
            const response = await api.get( `/profiles/myprofiles/${id}` );
            return response.data;
        } catch ( err ) {
            return rejectWithValue( err.response?.data || "Failed to fetch user profile" );
        }   
    }
);