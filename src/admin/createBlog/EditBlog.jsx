import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateBlog } from "../../redux/thunk/blogThunk";
import { useNavigate, useParams } from "react-router-dom";
import "../../styleSheets/blog/blogForm.css";
import { toast } from "react-toastify";

export default function EditBlog() {

    const { id } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const blog = useSelector(state =>
        state.blog.blogs.find(b => b.id === Number(id))
    );

    const [loading, setLoading] = useState(false);
    const [preview, setPreview] = useState(null);

    const [form, setForm] = useState({
        title: "",
        content: "",
        category: "",
        keyword: "",
        image: null,
    });

    useEffect(() => {
        if (blog) {
            setForm({
                title: blog.title,
                content: blog.content,
                category: blog.category,
                keyword: blog.keyword,
                image: null,
            });

            setPreview(blog.imageUrl || null);
        }
    }, [blog]);

    const handleChange = (key, value) =>
        setForm(prev => ({ ...prev, [key]: value }));

    const handleImage = file => {
        handleChange("image", file);
        if (file) setPreview(URL.createObjectURL(file));
    };

    const submit = async e => {
        e.preventDefault();
        if (loading) return;
        setLoading(true);

        try {
            const data = new FormData();
            Object.entries(form).forEach(([k, v]) => v && data.append(k, v));
            await dispatch(updateBlog({ id, formData: data })).unwrap();
            toast.success("Blog updated successfully");
            navigate("/admin/blogs");
        } catch (error) {
            console.error("Blog update failed:", error);
            toast.error("Failed to update blog");
        } finally {
            setLoading(false);
        }
    };

    if (!blog) return <p className="status">Loading blog...</p>;

    return (
        <div className="blog-form-page">

            <form className="blog-form-card" onSubmit={submit}>

                <h2>Edit Blog</h2>

                <div className="form-group">
                    <label>Title</label>
                    <input
                        value={form.title}
                        onChange={e => handleChange("title", e.target.value)}
                        required
                    />
                </div>

                <div className="form-group">
                    <label>Content</label>
                    <textarea
                        rows={6}
                        value={form.content}
                        onChange={e => handleChange("content", e.target.value)}
                        required
                    />
                </div>

                <div className="form-group">
                    <label>Category</label>
                    <input
                        value={form.category}
                        onChange={e => handleChange("category", e.target.value)}
                        required
                    />
                </div>

                <div className="form-group">
                    <label>Keywords (comma separated)</label>
                    <input
                        value={form.keyword || ""}
                        onChange={e => handleChange("keyword", e.target.value)}
                        placeholder="matrimony, marriage tips, life partner"
                        required
                    />
                </div>

                <div className="form-group">
                    <label>Replace Image (optional)</label>

                    <input
                        type="file"
                        accept="image/*"
                        onChange={e => handleImage(e.target.files[0])}
                    />

                    {preview && (
                        <img
                            className="image-preview"
                            src={preview}
                            alt="Preview"
                        />
                    )}
                </div>

                <button disabled={loading}>
                    {loading ? "Updating..." : "Update Blog"}
                </button>

            </form>

        </div>
    );
}