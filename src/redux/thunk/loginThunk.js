import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import backendIP from "../../api/api";

export const loginUser = createAsyncThunk(
    "auth/loginUser",
    async ({ emailId, createPassword }, { rejectWithValue }) => {
        try {
            const response  = await axios.post(`${backendIP}/auth/login`, { emailId, createPassword });
            return response.data;
        } catch (err) {
            return rejectWithValue(err.response?.data || "Login failed");
        }
    }
);