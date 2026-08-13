import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

function ProtectedRoute() {
  const { user, loading } = useAuth();
  const location = useLocation();

  // Wait until authentication status is checked
  if (loading) {
    return <div>Loading...</div>;
  }

  // User is not logged in
  if (!user) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  // User is authenticated
  return <Outlet />;
}

export default ProtectedRoute;
