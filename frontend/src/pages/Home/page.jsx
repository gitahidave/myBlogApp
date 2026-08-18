import { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import Categories from "../../components/Home/Categories";
import Header from "../../components/Home/Header";
import RecentBlogs from "../../components/Home/RecentBlogs";

const Home = () => {
  const [categories, setCategories] = useState([]);
  const [recentBlogs, setRecentBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  const backendLink = useSelector((state) => state.prod.link);

  useEffect(() => {
    const fetchHomeData = async () => {
      if (!backendLink) return;

      try {
        setLoading(true);

        // Fetch categories and recent blogs concurrently
        const [categoriesRes, blogsRes] = await Promise.all([
          axios.get(`${backendLink}/api/blog/show-categories`, {
            withCredentials: true,
          }),
          axios.get(`${backendLink}/api/blog/recent-blogs`, {
            withCredentials: true,
          }),
        ]);

        if (categoriesRes.data) {
          setCategories(
            categoriesRes.data.categories || categoriesRes.data.data || []
          );
        }

        if (blogsRes.data) {
          setRecentBlogs(
            blogsRes.data.blogs || blogsRes.data.data || blogsRes.data.message || []
          );
        }
      } catch (error) {
        toast.error(
          error.response?.data?.message || "Failed to load homepage content."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchHomeData();
  }, [backendLink]);

  return (
    <div className="home-container">
      {/* Hero Header Section */}
      <Header />

      {/* Main Content Areas */}
      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading homepage content...</span>
          </div>
          <p className="mt-2 text-muted fw-semibold">
            Loading homepage content . . .
          </p>
        </div>
      ) : (
        <>
          <Categories categories={categories} />
          <RecentBlogs blogs={recentBlogs} />
        </>
      )}
    </div>
  );
};

export default Home;