import { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { FaBlog, FaUsers, FaHeart, FaComments } from "react-icons/fa";

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState({
    blogsCount: 0,
    usersCount: 0,
    likesCount: 0,
    commentsCount: 0,
  });
  const [recentBlogs, setRecentBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  const backendLink = useSelector((state) => state.prod.link);

  useEffect(() => {
    const fetchDashboardStats = async () => {
      if (!backendLink) return;

      try {
        setLoading(true);
        const response = await axios.get(
          `${backendLink}/api/admin/dashboard-stats`,
          { withCredentials: true }
        );

        if (response.data?.success) {
          setDashboardData({
            blogsCount: response.data.blogsCount || 0,
            usersCount: response.data.usersCount || 0,
            likesCount: response.data.likesCount || 0,
            commentsCount: response.data.commentsCount || 0,
          });
          setRecentBlogs(response.data.recentBlogs || []);
        }
      } catch (error) {
        toast.error(
          error.response?.data?.message || "Failed to fetch dashboard statistics."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardStats();
  }, [backendLink]);

  const stats = [
    {
      title: "Blogs",
      value: dashboardData.blogsCount,
      icon: <FaBlog />,
      color: "primary",
    },
    {
      title: "Users",
      value: dashboardData.usersCount,
      icon: <FaUsers />,
      color: "success",
    },
    {
      title: "Likes",
      value: dashboardData.likesCount,
      icon: <FaHeart />,
      color: "danger",
    },
    {
      title: "Comments",
      value: dashboardData.commentsCount,
      icon: <FaComments />,
      color: "warning",
    },
  ];

  return (
    <div>
      <div className="mb-4">
        <h2 className="fw-bold">Admin Dashboard</h2>
        <p className="text-muted">Welcome back, Admin</p>
      </div>

      {/* Stats Grid */}
      <div className="row g-4">
        {stats.map((item, i) => (
          <div className="col-md-6 col-lg-3" key={i}>
            <div className="card border-0 shadow-sm rounded-4 h-100">
              <div className="card-body">
                <div
                  className={`bg-${item.color} bg-opacity-10 text-${item.color} rounded-3 d-inline-flex align-items-center justify-content-center mb-3`}
                  style={{
                    width: "55px",
                    height: "55px",
                    fontSize: "1.3rem",
                  }}
                >
                  {item.icon}
                </div>

                <h3 className="fw-bold mb-1">
                  {loading ? "..." : item.value}
                </h3>

                <p className="text-muted mb-0">{item.title}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Blogs */}
      <div className="card border-0 shadow-sm rounded-4 mt-5">
        <div className="card-body p-4">
          <h5 className="fw-bold mb-4">Recent Blogs</h5>

          {loading && (
            <div className="text-center py-3">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          )}

          {!loading && recentBlogs.length === 0 && (
            <p className="text-muted text-center py-3 mb-0">
              No recent blogs available.
            </p>
          )}

          {!loading && recentBlogs.length > 0 && (
            <div className="d-flex flex-column gap-3">
              {recentBlogs.map((blog, index) => (
                <div
                  key={blog._id || index}
                  className={`d-flex justify-content-between align-items-center ${
                    index !== recentBlogs.length - 1 ? "border-bottom pb-2" : ""
                  }`}
                >
                  <span className="fw-semibold">
                    {blog.blogTitle || blog.title}
                  </span>
                  <span
                    className={`badge ${
                      blog.isPublished !== false
                        ? "bg-success-subtle text-success border border-success-subtle"
                        : "bg-warning-subtle text-warning border border-warning-subtle"
                    } px-2 py-1 rounded-pill`}
                  >
                    {blog.isPublished !== false ? "Published" : "Draft"}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;