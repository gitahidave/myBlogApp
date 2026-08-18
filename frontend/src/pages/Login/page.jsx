import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { authActions } from "../../store/auth.js";

const Login = () => {
  const [userEmail, setUserEmail] = useState("");
  const [userPassword, setUserPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const redirect = useNavigate();
  const backendLink = useSelector((state) => state.prod.link);
  const dispatch = useDispatch();

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!userEmail.trim() || !userPassword.trim()) {
      toast.warning("Please enter both email and password.");
      return;
    }

    try {
      setLoading(true);
      const userData = { userEmail, userPassword };
      const response = await axios.post(
        `${backendLink}/api/user/login`,
        userData,
        {
          withCredentials: true,
        }
      );

      if (response.data?.success) {
        // Pass user object payload to Redux store if available
        dispatch(authActions.login(response.data?.user || response.data?.data || null));
        toast.success(response.data?.message || "Logged in successfully!");
        redirect("/profile");
      } else {
        toast.error(response.data?.message || "Login failed.");
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "An unexpected error occurred during login.";

      toast.error(errorMessage);
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
                <h2 className="fw-bold text-primary">Welcome Back</h2>
                <p className="text-muted">Login to Continue!</p>
              </div>

              <form onSubmit={handleLogin}>
                <div className="form-floating mb-3">
                  <input
                    type="email"
                    name="userEmail"
                    className="form-control"
                    id="userEmailInput"
                    placeholder="Enter Your Email"
                    value={userEmail}
                    onChange={(e) => setUserEmail(e.target.value)}
                  />
                  <label htmlFor="userEmailInput">Enter Your Email</label>
                </div>

                <div className="form-floating mb-3">
                  <input
                    type="password"
                    name="userPassword"
                    className="form-control"
                    id="userPasswordInput"
                    placeholder="Enter Your Password"
                    value={userPassword}
                    onChange={(e) => setUserPassword(e.target.value)}
                  />
                  <label htmlFor="userPasswordInput">Enter Password</label>
                </div>

                <button
                  type="submit"
                  className="btn btn-primary btn-lg w-100"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <span
                        className="spinner-border spinner-border-sm me-2"
                        role="status"
                        aria-hidden="true"
                      ></span>
                      Logging in...
                    </>
                  ) : (
                    "Login"
                  )}
                </button>
              </form>

              <div className="text-center mt-4">
                <p className="text-muted mb-0">
                  Don't have an account?{" "}
                  <Link
                    className="text-decoration-none fw-semibold"
                    to="/sign-up"
                  >
                    Sign-Up
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;