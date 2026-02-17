import { toast } from "react-toastify";
import api from "../api/axiosInstance";
import axios from "axios";
import backendIP from "./api";

// ADMIN APIS

export const fetchBlogsApi = async (page = 0) => {
    try {
        console.log("➡ Calling /admin/blogs page:", page);
        const response = await axios.get(`${backendIP}/admin/blogs?page=${page}`);
        console.log("✅ Blogs API success:", response.data);
        return response;
    } catch (error) {
        console.error("❌ Blogs API error:", error);
        throw error;
    }
};

export const createBlogApi = async (formData) => {
    try {
        const response = await api.post("/admin/blog/create", formData, {
            headers: { "Content-Type": "multipart/form-data" },
        });
        return response;
    } catch (error) {
        console.error("❌ Create blog error:", error);
        throw error;
    }
};

export const deleteBlogApi = async (id) => {
    try {
        const response = await api.delete(`/admin/blog/delete/${id}`);
        toast.success("Blog deleted successfully");
        return response;
    } catch (error) {
        console.error("❌ Delete blog error:", error);
        toast.error("Failed to delete blog");
        throw error;
    }
};

export const updateBlogApi = async (id, formData) => {
    try {
        const response = await api.put(`/admin/blog/update/${id}`, formData, {
            headers: { "Content-Type": "multipart/form-data" },
        });
        return response;
    } catch (error) {
        console.error("❌ Update blog error:", error);
        throw error;
    }
};

// PUBLIC APIS

export const fetchPublicBlogs = async (page = 0) => {
    try {
        const response = await axios.get(`${backendIP}/admin/blogs?page=${page}`);
        console.log("✅ Blogs API success:", response.data);
        return response;
    } catch (error) {
        console.error("❌ Blogs API error:", error);
        throw error;
    }
};

export const postLike = async (blogId) => {
    try {
        const response = await axios.post(`${backendIP}/blog/like/${blogId}`);
        console.log("✅ Blogs API success:", response.data);
        return response;
    } catch (error) {
        console.error("❌ Blogs API error:", error);
        throw error;
    }
};

export const postComment = async (blogId, comment) => {
    try {
        const response = await axios.post(`${backendIP}/blog/comment/${blogId}`, { comment });
        console.log("✅ Blogs API success:", response.data);
        return response;
    } catch (error) {
        console.error("❌ Blogs API error:", error);
        throw error;
    }
};

export const fetchBlogBySlug = async (slug) => {
    const response = await axios.get(`${backendIP}/blog/${slug}`);
    return response;
};