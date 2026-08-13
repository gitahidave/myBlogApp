import BlogCard from "../BlogCard/BlogCard";
import { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";

const RecentBlogs = () => {
    const [blogs, setBlogs] = useState([]);
    const backendLink = useSelector((state) => state.prod.link);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchBlogs = async () => {
            if (!backendLink) return;

            try {
                setLoading(true);
                const response = await axios.get(`${backendLink}/api/blog/recent-blogs`, {
                    withCredentials: true
                });

                // Extract array safely depending on your backend key (e.g., response.data.blogs or response.data)
                const blogData = response.data.blogs || response.data.recentBlogs || response.data;

                // Ensure state is only set to an actual array
                setBlogs(Array.isArray(blogData) ? blogData : []);
            } catch (error) {
                toast.error(error.response?.data?.message || "Failed to fetch blogs");
                setBlogs([]);
            } finally {
                setLoading(false);
            }
        };

        fetchBlogs();
    }, [backendLink]);

    if (loading) {
        return <div className="text-center my-5">Loading recent blogs...</div>;
    }

    return (
        <div className="container my-5">
            <h2
                className="text-center fw-bold mb-5"
                style={{ color: "#171819" }}
            >
                Recent Blogs
            </h2>

            <div className="row g-4">
                {Array.isArray(blogs) && blogs.map((blog, index) => (
                    <div key={blog._id || index} className="col-12 col-md-4">
                        <BlogCard blog={blog} />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default RecentBlogs;