import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const AdminLogin = () => {
  const [userEmail, setEmail] = useState("");
  const [userPassword, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const backendLink = useSelector((state) => state.prod.link);
  const redirect = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!userEmail.trim() || !userPassword) {
      toast.warning("Please enter both email and password.");
      return;
    }

    try {
      setLoading(true);
      const userData = { userEmail, userPassword };
      const response = await axios.post(
        `${backendLink}/api/admin/admin-login`,
        userData,
        { withCredentials: true }
      );

      toast.success(response.data?.message || "Login successful!");
      redirect("/admin-dashboard");
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Login failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center align-items-center min-vh-100">
        <div className="col-md-8 col-lg-6">
          <div className="card shadow-lg border-0 rounded-4">
            <div className="card-body p-5">
              <div className="text-center mb-4">
                <h2 className="fw-bold text-primary">Welcome Admin</h2>
                <p className="text-muted">Login to Continue!</p>
              </div>

              <form onSubmit={handleLogin}>
                <div className="form-floating mb-3">
                  <input
                    type="email"
                    name="userEmail"
                    className="form-control"
                    id="adminEmail"
                    placeholder="Enter Your Email"
                    value={userEmail}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                  <label htmlFor="adminEmail">Enter Your Email</label>
                </div>

                <div className="form-floating mb-3">
                  <input
                    type="password"
                    name="userPassword"
                    className="form-control"
                    id="adminPassword"
                    placeholder="Enter Your Password"
                    value={userPassword}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <label htmlFor="adminPassword">Enter Password</label>
                </div>

                <button
                  type="submit"
                  className={`btn ${loading ? "btn-warning" : "btn-primary"} btn-lg w-100`}
                  disabled={loading}
                >
                  {loading ? "Logging in..." : "Login"}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;