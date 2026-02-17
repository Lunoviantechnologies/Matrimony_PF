import { useState } from "react";
import { useDispatch } from "react-redux";
import { addBlog } from "../../redux/thunk/blogThunk";
import { useNavigate } from "react-router-dom";
import "../../styleSheets/blog/blogForm.css";
import { toast } from "react-toastify";

export default function BlogForm() {

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [loading, setLoading] = useState(false);
    const [preview, setPreview] = useState(null);

    const [form, setForm] = useState({
        title: "",
        content: "",
        category: "",
        keyword: "",
        image: null,
    });

    const handleChange = (key, value) =>
        setForm(prev => ({ ...prev, [key]: value }));

    const handleImage = file => {
        handleChange("image", file);

        if (file) {
            setPreview(URL.createObjectURL(file));
        }
    };

    const submit = async (e) => {
        e.preventDefault();
        if (loading) return;
        setLoading(true);

        try {
            const data = new FormData();
            Object.entries(form).forEach(([k, v]) => v && data.append(k, v));
            await dispatch(addBlog(data)).unwrap();
            toast.success("Blog created successfully");
            navigate("/admin/blogs");
        } catch (error) {
            console.error("Blog creation failed:", error);
            toast.error("Failed to create blog");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="blog-form-page">

            <form className="blog-form-card" onSubmit={submit}>

                <h2>Create Blog</h2>

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
                        value={form.keyword}
                        onChange={e => handleChange("keyword", e.target.value)}
                        placeholder="matrimony, marriage tips, life partner"
                        required
                    />
                </div>

                <div className="form-group">
                    <label>Image</label>

                    <input
                        type="file"
                        accept="image/*"
                        onChange={e => handleImage(e.target.files[0])}
                        required
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
                    {loading ? "Creating..." : "Create Blog"}
                </button>

            </form>

        </div>
    );
}