import api from "../api/axiosInstance";

export const fetchBlogsApi = async (page = 0) => {
    try {
        console.log("➡ Calling /admin/blogs page:", page);
        const response = await api.get(`/admin/blogs?page=${page}`);
        console.log("✅ Blogs API success:", response.data);
        return response;
    } catch (error) {
        console.error("❌ Blogs API error:", error);
        throw error;
    }
};

export const createBlogApi = async (formData) => {
    try {
        return await api.post("/admin/blog/create", formData, {
            headers: { "Content-Type": "multipart/form-data" },
        });
    } catch (error) {
        console.error("❌ Create blog error:", error);
        throw error;
    }
};

export const deleteBlogApi = async (id) => {
    try {
        return await api.delete(`/admin/blog/${id}`);
    } catch (error) {
        console.error("❌ Delete blog error:", error);
        throw error;
    }
};

export const updateBlogApi = async (id, formData) => {
    try {
        return await api.put(`/admin/blog/update/${id}`, formData, {
            headers: { "Content-Type": "multipart/form-data" },
        });
    } catch (error) {
        console.error("❌ Update blog error:", error);
        throw error;
    }
};