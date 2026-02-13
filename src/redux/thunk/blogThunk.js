import { createAsyncThunk } from "@reduxjs/toolkit";
import * as blogApi from "../../api/blogApi";

export const fetchBlogs = createAsyncThunk(
    "blog/fetch",
    async (page = 0, { rejectWithValue }) => {
        try {
            console.log("🚀 Thunk started...");
            const res = await blogApi.fetchBlogsApi(page);
            console.log("✅ Spring response:", res.data);
            return res.data;

        } catch (err) {
            console.error("❌ Blog fetch failed:", err);
            return rejectWithValue(err.response?.data || err.message);
        }
    }
);

export const addBlog = createAsyncThunk(
    "blog/add",
    async (data, { rejectWithValue }) => {
        try {
            const res = await blogApi.createBlogApi(data);
            return res.data;
        } catch (err) {
            return rejectWithValue(err.response?.data || err.message);
        }
    }
);

export const deleteBlog = createAsyncThunk(
    "blog/delete",
    async (id, { rejectWithValue }) => {
        try {
            await blogApi.deleteBlogApi(id);
            return id;
        } catch (err) {
            return rejectWithValue(err.response?.data || err.message);
        }
    }
);

export const updateBlog = createAsyncThunk(
    "blog/update",
    async (data, { rejectWithValue }) => {
        try {
            const res = await blogApi.updateBlogApi(data.id, data.formData);
            return res.data;
        } catch (err) {
            return rejectWithValue(err.response?.data || err.message);
        }
    }
);