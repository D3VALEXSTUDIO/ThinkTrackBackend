import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ user, role, allowedRoles, children }) {
  if (!user) {
    return <Navigate to="/login" />;
  }

  if (!allowedRoles.includes(role)) {
    return <h1>Access Denied</h1>;
  }

  return children;
}