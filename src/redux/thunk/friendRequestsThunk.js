import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/axiosInstance";
import { toast } from "react-toastify";

/* ================= FETCH REQUESTS ================= */

export const fetchFriendRequests = createAsyncThunk(
    "friendRequests/fetchFriendRequests",
    async ({ userId, type }, { rejectWithValue }) => {
        try {
            const response = await api.get(`/friends/filter/${userId}?type=${type}`);
            return { type, data: response.data, };
        } catch (error) {
            return rejectWithValue(error.response?.data || "Failed to fetch friend requests");
        }
    }
);

/* ================= RESPOND REQUEST ================= */

export const respondToRequest = createAsyncThunk(
    "friendRequests/respondToRequest",
    async ({ requestId, accept, type }, { rejectWithValue }) => {
        try {
            await api.post(`/friends/respond/${requestId}?accept=${accept}`);
            toast.success(`Request ${accept ? "accepted" : "rejected"} successfully`);
            return { requestId, type, };
        } catch (error) {
            toast.error(`Failed to ${accept ? "accept" : "reject"} request`);
            return rejectWithValue(error.response?.data || "Failed to respond to request");
        }
    }
);

// cancel sent request

export const cancelFriendRequest = createAsyncThunk(
    "friendRequests/cancelFriendRequest",
    async ({ requestId, type }, { rejectWithValue }) => {
        try {
            await api.delete(`/friends/sent/delete/${requestId}`);
            toast.success("Request cancelled successfully");
            return { requestId, type };
        } catch (error) {
            toast.error("Failed to cancel request");
            return rejectWithValue("Failed to cancel request");
        }
    }
);

// send request api

export const sendFriendRequest = createAsyncThunk(
    "friend/sendFriendRequest",
    async ({ senderId, receiverId }, { rejectWithValue }) => {
        try {
            await api.post(`/friends/send/${senderId}/${receiverId}`);
            toast.success("Request sent successfully");
            return receiverId;
        } catch (error) {
            toast.error("Failed to send request");
            return rejectWithValue(error.response?.data || "Failed to send request");
        }
    }
);