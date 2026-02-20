import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchBlogs, deleteBlog } from "../../redux/thunk/blogThunk";
import { setPage } from "../../redux/slices/blogSlice";
import { useNavigate } from "react-router-dom";
import "../../styleSheets/blog/blogDashboard.css";
import backendIP from "../../api/api";
import { FaEye, FaHeart } from "react-icons/fa";

export default function BlogDashboard() {

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { blogs, page, totalPages, loading } = useSelector(state => state.blog);

    useEffect(() => {
        dispatch(fetchBlogs(page));
    }, [dispatch, page]);

    const handleDelete = (id) => {
        if (window.confirm("Delete this blog?")) {
            dispatch(deleteBlog(id));
        }
    };

    const getImageUrl = (blog) => {
        if (!blog.imageUrl) return "/placeholder.png";

        // If image is Base64
        if (blog.imageUrl.startsWith("data:image")) {
            return blog.imageUrl;
        }

        // If image is stored as file path from server
        const serverRoot = backendIP.replace("/api", "");
        return `${serverRoot}${blog.imageUrl}`;
    };

    const getPaginationRange = (currentPage, totalPages) => {
        const visiblePages = 5; // show 5 numbers
        const half = Math.floor(visiblePages / 2);

        let start = Math.max(currentPage - half, 0);
        let end = Math.min(start + visiblePages, totalPages);

        if (end - start < visiblePages) {
            start = Math.max(end - visiblePages, 0);
        }

        return Array.from({ length: end - start }, (_, i) => start + i);
    };

    return (
        <div className="blog-dashboard">

            {/* Header */}
            <div className="dashboard-header">
                <h2>Blog Dashboard</h2>
                <button className="primary-btn w-25" onClick={() => navigate("/admin/blog/create")}>
                    Create Blog
                </button>
            </div>

            {/* Loading */}
            {loading && <p className="status">Loading blogs...</p>}

            {/* Empty state */}
            {!loading && blogs.length === 0 && (
                <p className="status">No blogs found.</p>
            )}

            {/* Blog Grid */}
            <div className="blog-grid">

                {Array.isArray(blogs) && blogs.map(blog => (
                    <div key={blog.id} className="blog-card">

                        <div className="image-wrapper">
                            <img src={getImageUrl(blog)} alt={blog.title} onError={(e) => (e.target.src = "/placeholder.png")} />
                        </div>

                        <div className="card-content">

                            <h4>{blog.title}</h4>

                            <div className="meta">
                                <span>{blog.category}</span>
                                <span>{blog.status}</span>
                            </div>

                            <p className="snippet">
                                {blog.content?.slice(0, 90) || "No content available"}…
                            </p>

                            <div className="stats">
                                <FaEye size={15} color="blue" /> {blog.viewsCount} • <FaHeart size={15} color="red" /> {blog.likesCount}
                            </div>

                            <div className="actions">
                                <button className="edit-btn" onClick={() => navigate(`/admin/blog/edit/${blog.id}`)}>
                                    Edit
                                </button>

                                <button className="danger-btn" onClick={() => handleDelete(blog.id)}>
                                    Delete
                                </button>
                            </div>

                        </div>
                    </div>
                ))}

            </div>

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="pagination">

                    {/* FIRST */}
                    <button
                        disabled={page === 0}
                        onClick={() => dispatch(setPage(0))}
                    >
                        «
                    </button>

                    {/* PREVIOUS */}
                    <button
                        disabled={page === 0}
                        onClick={() => dispatch(setPage(page - 1))}
                    >
                        ‹
                    </button>

                    {/* PAGE NUMBERS */}
                    {getPaginationRange(page, totalPages).map((p) => (
                        <button
                            key={p}
                            className={page === p ? "active" : ""}
                            onClick={() => dispatch(setPage(p))}
                        >
                            {p + 1}
                        </button>
                    ))}

                    {/* NEXT */}
                    <button
                        disabled={page === totalPages - 1}
                        onClick={() => dispatch(setPage(page + 1))}
                    >
                        ›
                    </button>

                    {/* LAST */}
                    <button
                        disabled={page === totalPages - 1}
                        onClick={() => dispatch(setPage(totalPages - 1))}
                    >
                        »
                    </button>

                </div>
            )}

        </div>
    );
};