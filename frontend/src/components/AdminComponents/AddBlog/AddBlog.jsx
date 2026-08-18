import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";

const AddBlog = () => {
  // Blog Form States
  const [blogTitle, setTitle] = useState("");
  const [blogDescription, setDescription] = useState("");
  const [blogContent, setContent] = useState("");
  const [blogImage, setImage] = useState(null);
  const [blogCategory, setBlogCategory] = useState("");
  const [fileInputKey, setFileInputKey] = useState(Date.now()); // Used to reset the file input field

  const [loading, setLoading] = useState(false);

  // Category States
  const [categoryName, setName] = useState("");
  const [categoryLoading, setCategoryLoading] = useState(false);
  const [categories, setCategories] = useState([]);

  const backendLink = useSelector((state) => state.prod.link);

  // Fetch Categories Function
  const fetchCategories = useCallback(async () => {
    try {
      const response = await axios.get(
        `${backendLink}/api/blog/show-categories`,
        { withCredentials: true }
      );
      setCategories(response.data.categories || []);
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to load categories."
      );
    }
  }, [backendLink]);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  // Create Blog Handler
  const handleCreateBlog = async (e) => {
    e.preventDefault();

    if (!blogTitle || !blogDescription || !blogContent || !blogCategory || !blogImage) {
      toast.warning("Please fill in all fields including selecting an image and category.");
      return;
    }

    try {
      setLoading(true);
      const myBlog = new FormData();
      myBlog.append("blogTitle", blogTitle);
      myBlog.append("blogDescription", blogDescription);
      myBlog.append("blogContent", blogContent);
      myBlog.append("image", blogImage);
      myBlog.append("blogCategory", blogCategory);

      const response = await axios.post(
        `${backendLink}/api/blog/create-blog`,
        myBlog,
        {
          headers: { "Content-Type": "multipart/form-data" },
          withCredentials: true,
        }
      );

      toast.success(response.data?.message || "Blog published successfully!");

      // Reset form states ONLY on success
      setTitle("");
      setDescription("");
      setContent("");
      setImage(null);
      setBlogCategory("");
      setFileInputKey(Date.now()); // Reset file input UI
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to create blog post."
      );
    } finally {
      setLoading(false);
    }
  };

  // Create Category Handler
  const handleCreateCategory = async (e) => {
    e.preventDefault();

    if (!categoryName.trim()) {
      toast.warning("Please enter a category name.");
      return;
    }

    try {
      setCategoryLoading(true);
      const data = { categoryName };
      const response = await axios.post(
        `${backendLink}/api/blog/create-category`,
        data,
        { withCredentials: true }
      );

      toast.success(response.data?.message || "Category created!");
      setName("");
      fetchCategories(); // Refresh categories dropdown
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to create category."
      );
    } finally {
      setCategoryLoading(false);
    }
  };

  return (
    <div className="container py-4">
      <div className="mb-4">
        <h2 className="fw-bold">Create New Blog</h2>
        <p className="text-muted">Fill in the details below to publish a new blog post.</p>
      </div>

      <form className="card border-0 shadow-sm rounded-4 p-4" onSubmit={handleCreateBlog}>
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
            value={blogContent}
            onChange={(e) => setContent(e.target.value)}
            className="form-control"
            placeholder="Write your blog content"
            id="content"
            style={{ height: "150px" }}
          ></textarea>
          <label htmlFor="content">Content</label>
        </div>

        <div className="mb-3">
          <select
            className="form-select"
            value={blogCategory}
            onChange={(e) => setBlogCategory(e.target.value)}
          >
            <option value="">Select Categories</option>
            {categories.map((category) => (
              <option key={category._id} value={category._id}>
                {category.categoryName}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-4">
          <label className="form-label fw-semibold">Upload Image</label>
          <input
            key={fileInputKey}
            type="file"
            className="form-control"
            accept=".jpg,.jpeg,.png"
            onChange={(e) => setImage(e.target.files[0] || null)}
          />
          <small className="text-muted">Allowed formats: JPG, JPEG, PNG</small>
        </div>

        <button
          type="submit"
          className={`btn ${loading ? "btn-warning" : "btn-primary"} w-100 py-2 fw-semibold rounded-3`}
          disabled={loading}
        >
          {loading ? "Publishing Blog . . ." : "Publish Blog"}
        </button>
      </form>

      {/* Create Category Form */}
      <h4 className="mt-5 fw-bold">Create New Category</h4>
      <form className="mt-3 card border-0 shadow-sm rounded-4 p-4" onSubmit={handleCreateCategory}>
        <div className="form-floating mb-3">
          <input
            type="text"
            className="form-control"
            id="categoryTitle"
            placeholder="Blog Category"
            value={categoryName}
            onChange={(e) => setName(e.target.value)}
          />
          <label htmlFor="categoryTitle">Enter a Category Name</label>
        </div>
        <button
          type="submit"
          className="btn btn-primary fw-semibold"
          disabled={categoryLoading}
        >
          {categoryLoading ? "Creating..." : "Create Category"}
        </button>
      </form>
    </div>
  );
};

export default AddBlog;