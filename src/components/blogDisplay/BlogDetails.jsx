import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import { fetchBlogBySlug } from "../../api/blogApi";
import backendIP from "../../api/api";
import "../../styleSheets/blog/blogDetails.css";

const BlogDetails = () => {

    const { slug } = useParams();

    const [blog, setBlog] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const loadBlog = async () => {
            try {
                setLoading(true);
                setError(null);
                const response = await fetchBlogBySlug(slug);
                setBlog(response.data);
                window.scrollTo(0, 0);
            } catch (err) {
                setError("Blog not found.");
            } finally {
                setLoading(false);
            }
        };

        loadBlog();
    }, [slug]);

    if (loading) {
        return <div className="blog-loader">Loading...</div>;
    }

    if (error || !blog) {
        return <div className="blog-error">{error}</div>;
    }

    const getImageUrl = () => {
        if (!blog.imageUrl) return "/placeholder.png";

        if (blog.imageUrl.startsWith("data:image")) {
            return blog.imageUrl;
        }

        const serverRoot = backendIP.replace("/api", "");
        return `${serverRoot}${blog.imageUrl}`;
    };

    const formattedDate = new Date(blog.createdAt).toLocaleDateString(
        "en-IN",
        { year: "numeric", month: "long", day: "numeric" }
    );

    return (
        <div className="blog-details-page">

            <Helmet>
                <title>{blog.metaTitle || blog.title}</title>
                <meta
                    name="description"
                    content={
                        blog.metaDescription ||
                        blog.content.substring(0, 160)
                    }
                />
            </Helmet>

            <div className="blog-details-container">

                {/* Breadcrumb */}
                <div className="blog-breadcrumb">
                    <Link to="/resources/blog">Blogs</Link>
                    <span> / {blog.title}</span>
                </div>

                {/* Title */}
                <h1 className="blog-title">{blog.title}</h1>

                {/* Meta Info */}
                <div className="blog-meta">
                    <span>By {blog.author || "Admin"}</span>
                    <span>• {formattedDate}</span>
                    <span>• {blog.viewsCount} Views</span>
                </div>

                {/* Featured Image */}
                <div className="blog-featured-image">
                    <img
                        src={getImageUrl()}
                        alt={blog.title}
                        loading="lazy"
                    />
                </div>

                {/* Content */}
                <div className="blog-content">
                    {blog.content.split("\n").map((para, index) => (
                        <p key={index}>{para.trim()}</p>
                    ))}
                </div>

            </div>
        </div>
    );
};

export default BlogDetails;