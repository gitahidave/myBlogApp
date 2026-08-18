import { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import BlogCard from "../BlogCard/BlogCard";

const Favourites = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  const backendLink = useSelector((state) => state.prod.link);

  useEffect(() => {
    const fetchFavourites = async () => {
      if (!backendLink) return;

      try {
        setLoading(true);
        const response = await axios.get(
          `${backendLink}/api/user/get-favorites`,
          { withCredentials: true }
        );

        if (response.data?.success) {
          setBlogs(response.data.favorites || response.data.blogs || []);
        }
      } catch (error) {
        toast.error(
          error.response?.data?.message || "Failed to load favourite blogs."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchFavourites();
  }, [backendLink]);

  return (
    <div className="container my-5">
      <h2
        className="text-center fw-bold mb-5"
        style={{ color: "#171819" }}
      >
        Favourite Blogs
      </h2>

      {/* Loading State */}
      {loading && (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      )}

      {/* Empty State */}
      {!loading && blogs.length === 0 && (
        <div className="text-center text-muted py-5">
          <p className="fs-5 mb-0">No favourite blogs found.</p>
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

export default Favourites;