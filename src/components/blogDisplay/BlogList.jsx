import { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { fetchPublicBlogs } from "../../api/blogApi";
import "../../styleSheets/blog/blogList.css";

const BlogList = () => {

    const [blogs, setBlogs] = useState([]);
    const [page, setPage] = useState(0);
    const [hasMore, setHasMore] = useState(true);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const loadBlogs = useCallback(async () => {
        if (loading || !hasMore) return;

        try {
            setLoading(true);
            setError(null);

            const response = await fetchPublicBlogs(page);

            const { content, last } = response.data;

            setBlogs(prev => [...prev, ...content]);
            setHasMore(!last);
            setPage(prev => prev + 1);

        } catch (err) {
            setError("Failed to load blogs. Please try again.");
        } finally {
            setLoading(false);
        }
    }, [page, hasMore, loading]);

    useEffect(() => {
        loadBlogs();
    }, []);

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

    return (
        <div className="blog-list-page">

            <div className="blog-list-header-card">
                <h1>Marriage & Matrimony Blogs - Tips & Guides | Vivah Jeevan</h1>
                <p>
                    Expert marriage advice, matrimony tips, wedding planning guides & relationship
                    insights. Read our comprehensive blogs on finding your perfect life partner.
                </p>
            </div>

            <div className="blog-grid">

                {blogs.map((blog) => (
                    <div className="blog-card" key={blog.id}>

                        <div className="blog-image">
                            <img src={getImageUrl(blog)} alt={blog.title} />
                        </div>

                        <div className="blog-content">

                            <div className="blog-author">
                                {blog.author}
                            </div>

                            <h6 className="blog-title">
                                {blog.title}
                            </h6>

                            <p className="blog-desc">
                                {blog.content?.slice(0, 90) || "No content available"}…
                            </p>

                            <Link to={`/resources/blog/${blog.slug}`} className="read-more">
                                READ MORE
                            </Link>

                        </div>
                    </div>
                ))}

            </div>

            {error && (
                <div style={{ textAlign: "center", marginTop: "20px", color: "red" }}>
                    {error}
                </div>
            )}

            {hasMore && (
                <div className="load-more-wrapper">
                    <button
                        onClick={loadBlogs}
                        className="load-more-btn"
                        disabled={loading}
                    >
                        {loading ? "Loading..." : "CLICK TO LOAD MORE"}
                    </button>
                </div>
            )}

        </div>
    );
};

export default BlogList;