import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children, adminOnly }) => {
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));

  // Helper to check if token is expired
  const isTokenExpired = (token) => {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.exp * 1000 < Date.now();
    } catch (e) {
      return true; // If invalid format, treat as expired
    }
  };

  if (!token || isTokenExpired(token)) {
    // Clear invalid session
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    return <Navigate to="/login" replace={true} />;
  }

  // Fallback if the redirect above had a typo in path or if simple logical return
  if (!user && !token) return <Navigate to="/login" />;

  if (adminOnly && user?.role !== "admin") {
    return <Navigate to="/dashboard" />;
  }

  return children;
};

export default ProtectedRoute;
