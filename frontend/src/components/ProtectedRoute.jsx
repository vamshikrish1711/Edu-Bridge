import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children, isAuthenticated, allowedRoles, userRole }) {
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(userRole)) {
    return <Navigate to="/" replace />;
  }

  return children;
}