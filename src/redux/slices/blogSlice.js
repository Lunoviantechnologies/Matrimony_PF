import { createSlice } from "@reduxjs/toolkit";
import { fetchBlogs, addBlog, deleteBlog, updateBlog } from "../thunk/blogThunk";

const blogSlice = createSlice({
    name: "blog",
    initialState: {
        blogs: [],
        page: 0,
        totalPages: 0,
        loading: false,
    },
    reducers: {
        setPage: (state, action) => {
            state.page = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchBlogs.pending, s => {
                s.loading = true;
            })
            .addCase(fetchBlogs.fulfilled, (s, a) => {
                s.loading = false;
                s.blogs = a.payload.content || [];
                s.totalPages = a.payload.totalPages || 0;
            })
            .addCase(addBlog.fulfilled, (s, a) => {
                s.blogs.unshift(a.payload);
            })
            .addCase(deleteBlog.fulfilled, (s, a) => {
                s.blogs = s.blogs.filter(b => b.id !== a.payload);
            })
            .addCase(updateBlog.fulfilled, (s, a) => {
                const updatedBlog = a.payload;
                s.blogs = s.blogs.map(b => b.id === updatedBlog.id ? updatedBlog : b);
            });
    },
});

export const { setPage } = blogSlice.actions;
export default blogSlice.reducer;