import { useParams } from "react-router-dom";
import BlogCard from "../../components/BlogCard/BlogCard";
import { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";

const Categories = () => {
  const { id } = useParams();
  const backendLink = useSelector((state) => state.prod.link);

  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlogs = async () => {
      if (!backendLink || !id) return;

      try {
        setLoading(true);
        const response = await axios.get(
          `${backendLink}/api/blog/blog-by-category/${id}`,
          { withCredentials: true }
        );

        // Handles response arrays safely across various API return formats
        const fetchedBlogs =
          response.data?.blogs ||
          response.data?.data ||
          response.data?.message;

        setBlogs(Array.isArray(fetchedBlogs) ? fetchedBlogs : []);
      } catch (error) {
        toast.error(
          error.response?.data?.message || "Failed to load category blogs."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, [id, backendLink]);

  return (
    <div className="container my-5">
      <h2
        className="text-center fw-bold mb-5"
        style={{ color: "#171819" }}
      >
        Read Our Blogs
      </h2>

      {/* Loading Spinner */}
      {loading && (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      )}

      {/* Empty Category Fallback */}
      {!loading && blogs.length === 0 && (
        <div className="text-center text-muted py-5">
          <p className="fs-5 mb-0">No blogs found for this category.</p>
        </div>
      )}

      {/* Blogs Grid */}
      {!loading && blogs.length > 0 && (
        <div className="row g-4">
          {blogs.map((blog, index) => (
            <div key={blog._id || blog.id || index} className="col-12 col-md-4">
              <BlogCard blog={blog} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Categories;