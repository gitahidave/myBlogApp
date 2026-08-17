import { useEffect } from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { toast } from "react-toastify";

const ProtectedRoute = ({ children }) => {
    const { isLoggedIn, loading } = useSelector((state) => state.auth);

    useEffect(() => {
        if (!loading && !isLoggedIn) {
            toast.warning("Oops, You have to Login!");
        }
    }, [loading, isLoggedIn]);

    // 1. Show loading spinner until Redux finishes checking auth status
    if (loading) {
        return (
            <div className="text-center mt-5 py-5">
                <div className="spinner-border text-primary mb-2" role="status"></div>
                <h5>Checking authentication...</h5>
            </div>
        );
    }

    // 2. Redirect to login if loading is false and user is not logged in
    if (!isLoggedIn) {
        return <Navigate to="/login" replace />;
    }

    // 3. Render protected child components
    return children;
};

export default ProtectedRoute;