import axios from "axios";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";

const SignUp = () => {
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [userPassword, setUserPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const backendLink = useSelector((state) => state.prod.link);
  const redirect = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();

    if (!userName.trim() || !userEmail.trim() || !userPassword.trim()) {
      toast.warning("Please fill in all registration fields.");
      return;
    }

    try {
      setLoading(true);
      const userData = { userName, userEmail, userPassword };

      const response = await axios.post(
        `${backendLink}/api/user/sign-up`,
        userData,
        { withCredentials: true }
      );

      if (response.data?.success) {
        toast.success(response.data?.message || "Signed up successfully!");
        redirect("/login");
      } else {
        toast.error(response.data?.message || "Sign-up failed.");
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "An unexpected error occurred during sign-up.";

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
                <h2 className="fw-bold text-primary">Create Account</h2>
                <p className="text-muted">
                  Join us today and start your journey
                </p>
              </div>

              <form onSubmit={handleRegister}>
                <div className="form-floating mb-3">
                  <input
                    type="text"
                    name="userName"
                    className="form-control"
                    id="userNameInput"
                    placeholder="Enter Your Name"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                  />
                  <label htmlFor="userNameInput">Register Your Name</label>
                </div>

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
                  <label htmlFor="userEmailInput">Register Your Email</label>
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
                  <label htmlFor="userPasswordInput">Register Password</label>
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
                      Creating Account...
                    </>
                  ) : (
                    "Sign Up"
                  )}
                </button>
              </form>

              <div className="text-center mt-4">
                <p className="text-muted mb-0">
                  Already have an account?{" "}
                  <Link
                    className="text-decoration-none fw-semibold"
                    to="/login"
                  >
                    Login
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

export default SignUp;