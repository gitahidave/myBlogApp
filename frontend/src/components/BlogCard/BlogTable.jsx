import { Link } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";

const BlogTable = ({ blogs = [], onBlogDeleted }) => {
    const backendLink = useSelector((state) => state.prod.link);
    const [deletingId, setDeletingId] = useState(null);

    const handleDelete = async (id) => {
        const confirmed = window.confirm(
            "Are you sure you want to delete this blog? This action cannot be undone."
        );
        if (!confirmed) return;

        try {
            setDeletingId(id);
            const response = await axios.delete(
                `${backendLink}/api/blog/delete-blog/${id}`,
                { withCredentials: true }
            );
            toast.success(response.data.message || "Blog deleted successfully!");
            onBlogDeleted?.(id);
        } catch (error) {
            const errorMessage =
                error.response?.data?.message ||
                error.message ||
                "Something went wrong while deleting the blog";
            toast.error(errorMessage);
        } finally {
            setDeletingId(null);
        }
    };

    return (
        <div className="table-responsive">
            <table className="table table-hover">
                <thead>
                    <tr>
                    <th scope="col">#</th>
                    <th scope="col">Title</th>
                    <th scope="col">Description</th>
                    <th scope="col">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        blogs.map((blog, index)=>{
                            return (
                                <tr key={blog._id}>
                                    <th scope="row">
                                        {index + 1}
                                    </th>
                                    <td>
                                        { blog.blogTitle }
                                    </td>
                                    <td>
                                        { blog.blogDescription }
                                    </td>
                                    <td>
                                        <Link
                                            className="btn btn-primary btn-sm me-2"
                                            to={`/admin-dashboard/update-blog/${blog._id}`}
                                        >
                                            Edit
                                        </Link>

                                        <button
                                            className="btn btn-danger btn-sm"
                                            onClick={() => handleDelete(blog._id)}
                                            disabled={deletingId === blog._id}
                                        >
                                            {deletingId === blog._id ? "Deleting..." : "Delete"}
                                        </button>
                                    </td>
                                </tr>
                            )
                        })
                    }
                </tbody>
                </table>
        </div>
    );
};

export default BlogTable;
