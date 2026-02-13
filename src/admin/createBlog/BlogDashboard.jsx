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

    const { blogs, page, totalPages, loading } =
        useSelector(state => state.blog);

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
        const serverRoot = backendIP.replace("/api", "");
        return `${serverRoot}${blog.imageUrl}`;
    }

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

                {blogs.map(blog => (
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
                                {blog.content.slice(0, 90)}…
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
                    {[...Array(totalPages)].map((_, i) => (
                        <button
                            key={i}
                            className={page === i ? "active" : ""}
                            onClick={() => dispatch(setPage(i))}
                        >
                            {i + 1}
                        </button>
                    ))}
                </div>
            )}

        </div>
    );
}