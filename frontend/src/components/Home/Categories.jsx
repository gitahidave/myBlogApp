import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
//import { toast } from "react-toastify";
import { useSelector } from "react-redux";

const Categories = () => {
    // Initialize with an empty array
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const backendLink = useSelector((state) => state.prod.link);

    // Fetch categories
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await axios.get(
                    `${backendLink}/api/blog/show-categories`,
                    {
                        withCredentials: true,
                    }
                );

                // Handle both { categories: [...] } and direct array responses safely
                const data = response.data?.categories || response.data || [];
                setCategories(Array.isArray(data) ? data : []);
            } catch (error) {
                console.error("Failed to fetch categories:", error);
                setCategories([]);
            } finally {
                setLoading(false);
            }
        };

        if (backendLink) {
            fetchCategories();
        }
    }, [backendLink]);

    if (loading) {
        return <div className="text-center my-5">Loading categories...</div>;
    }

    return (
        <div className="container my-5">
            <h3 className="mb-4 fw-bold text-center">Explore Categories</h3>
            <div className="row g-3 justify-content-center">
                {/* Optional chaining ensures no crash even if categories is momentarily non-array */}
                {categories?.map((category, index) => (
                    <div key={category._id || index} className="col-12 col-md-4">
                        <Link
                            to={`/categories/${category._id}`}
                            className="text-decoration-none"
                        >
                            <div className="p-4 text-center shadow-sm rounded category-card">
                                <h5 className="fw-semibold m-0">
                                    {category.categoryName}
                                </h5>
                            </div>
                        </Link>
                    </div>
                ))}
            </div>
            <style>
                {`
                    .category-card {
                        background: #f8fafc;
                        border: 1px solid #e2e8f0;
                        transition: 0.3s ease;
                        cursor: pointer;
                    }

                    .category-card:hover {
                        transform: translateY(-5px);
                        border-color: #0ea5e9;
                        box-shadow: 0 10px 25px rgba(14, 165, 233, 0.15);
                    }
                `}
            </style>
        </div>
    );
};

export default Categories;;