import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";

const UpdateBlog = () => {
  const { id } = useParams();
  const redirect = useNavigate();
  const backendLink = useSelector((state) => state.prod.link);

  const [blogTitle, setTitle] = useState("");
  const [blogDescription, setDescription] = useState("");
  const [blogContent, setContent] = useState("");
  const [blogImage, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [blogCategory, setBlogCategory] = useState("");

  const [categories, setCategories] = useState([]);

  const [fetching, setFetching] = useState(true);
  const [loading, setLoading] = useState(false);

  // Fetch existing blog details
  useEffect(() => {
    const fetchBlog = async () => {
      if (!backendLink || !id) return;

      try {
        setFetching(true);
        const response = await axios.get(
          `${backendLink}/api/blog/blog-details/${id}`,
          { withCredentials: true }
        );

        const blog =
          response.data?.blog || response.data?.data || response.data?.message;

        if (blog) {
          setTitle(blog.blogTitle || "");
          setDescription(blog.blogDescription || "");
          setContent(blog.blogContent || "");
          setBlogCategory(blog.blogCategory?._id || blog.blogCategory || "");
          
          // Display existing image if present
          if (blog.image || blog.blogImage) {
            setImagePreview(blog.image || blog.blogImage);
          }
        }
      } catch (error) {
        toast.error(
          error.response?.data?.message || "Failed to load blog details."
        );
      } finally {
        setFetching(false);
      }
    };

    fetchBlog();
  }, [id, backendLink]);

  // Fetch categories dropdown
  useEffect(() => {
    const fetchCategories = async () => {
      if (!backendLink) return;

      try {
        const response = await axios.get(
          `${backendLink}/api/blog/show-categories`,
          { withCredentials: true }
        );
        setCategories(response.data?.categories || response.data?.data || []);
      } catch (error) {
        toast.error(
          error.response?.data?.message || "Failed to load categories."
        );
      }
    };

    fetchCategories();
  }, [backendLink]);

  // File Selection Handler
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  // Submit Handler
  const handleUpdateBlog = async (e) => {
    e.preventDefault();

    if (!blogTitle || !blogDescription || !blogContent || !blogCategory) {
      toast.warning("Please complete all required form fields.");
      return;
    }

    try {
      setLoading(true);
      const updatedBlog = new FormData();
      updatedBlog.append("blogTitle", blogTitle);
      updatedBlog.append("blogDescription", blogDescription);
      updatedBlog.append("blogContent", blogContent);
      updatedBlog.append("blogCategory", blogCategory);

      if (blogImage) {
        updatedBlog.append("image", blogImage);
      }

      const response = await axios.put(
        `${backendLink}/api/blog/update-blog/${id}`,
        updatedBlog,
        {
          headers: { "Content-Type": "multipart/form-data" },
          withCredentials: true,
        }
      );

      if (response.data?.success !== false) {
        toast.success(response.data?.message || "Blog updated successfully!");
        redirect("/admin-dashboard/manage-blog");
      } else {
        toast.error(response.data?.message || "Failed to update blog.");
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Something went wrong while updating the blog."
      );
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-2 text-muted fw-semibold">Loading Blog Details . . .</p>
      </div>
    );
  }

  return (
    <div className="container py-4">
      <div className="mb-4">
        <h2 className="fw-bold">Update This Blog</h2>
        <p className="text-muted">Fill in the details below to update this existing blog.</p>
      </div>

      <form className="card border-0 shadow-sm rounded-4 p-4" onSubmit={handleUpdateBlog}>
        <div className="form-floating mb-3">
          <input
            type="text"
            className="form-control"
            id="title"
            placeholder="Blog Title"
            value={blogTitle}
            onChange={(e) => setTitle(e.target.value)}
          />
          <label htmlFor="title">Title</label>
        </div>

        <div className="form-floating mb-3">
          <input
            type="text"
            className="form-control"
            id="description"
            placeholder="Short description"
            value={blogDescription}
            onChange={(e) => setDescription(e.target.value)}
          />
          <label htmlFor="description">Description</label>
        </div>

        <div className="form-floating mb-3">
          <textarea
            className="form-control"
            placeholder="Write your blog content"
            id="content"
            style={{ height: "150px" }}
            value={blogContent}
            onChange={(e) => setContent(e.target.value)}
          ></textarea>
          <label htmlFor="content">Content</label>
        </div>

        <div className="mb-3">
          <select
            className="form-select"
            value={blogCategory}
            onChange={(e) => setBlogCategory(e.target.value)}
          >
            <option value="">Select Category</option>
            {categories.map((category) => (
              <option key={category._id} value={category._id}>
                {category.categoryName}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-4">
          <label className="form-label fw-semibold">Upload Image</label>

          {imagePreview && (
            <div className="mb-3">
              <img
                src={imagePreview}
                alt="Blog Preview"
                className="rounded-3 border shadow-sm"
                style={{ width: "150px", height: "100px", objectFit: "cover" }}
              />
            </div>
          )}

          <input
            type="file"
            className="form-control"
            accept=".jpg,.jpeg,.png"
            onChange={handleImageChange}
          />
          <small className="text-muted">
            Leave empty to keep current image. Allowed formats: JPG, JPEG, PNG
          </small>
        </div>

        <button
          type="submit"
          className={`btn ${loading ? "btn-warning" : "btn-primary"} w-100 py-2 fw-semibold rounded-3`}
          disabled={loading}
        >
          {loading ? "Updating Blog . . ." : "Update Blog"}
        </button>
      </form>
    </div>
  );
};

export default UpdateBlog;