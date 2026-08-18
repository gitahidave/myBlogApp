import { useEffect } from "react";
import { useSelector } from "react-redux";
import { Navigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { isLoggedIn, loading, user } = useSelector((state) => state.auth);
  const location = useLocation();

  useEffect(() => {
    if (!loading) {
      if (!isLoggedIn) {
        toast.warning("Oops! You must log in to access this page.");
      } else if (
        allowedRoles.length > 0 &&
        user?.role &&
        !allowedRoles.includes(user.role)
      ) {
        toast.error("Access denied. You do not have permission for this page.");
      }
    }
  }, [loading, isLoggedIn, user, allowedRoles]);

  // Wait until authentication status has been verified
  if (loading) {
    return (
      <div className="d-flex flex-column align-items-center justify-content-center min-vh-50 py-5">
        <div className="spinner-border text-primary mb-3" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="text-muted fw-semibold">Checking authentication . . .</p>
      </div>
    );
  }

  // Redirect unauthenticated users to login and save the attempted path
  if (!isLoggedIn) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Redirect users lacking required roles to their main dashboard or homepage
  if (
    allowedRoles.length > 0 &&
    user?.role &&
    !allowedRoles.includes(user.role)
  ) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;