import { Navigate } from "react-router-dom";
import useAuthStore from "../../context/AuthStore";

export default function ProtectedRoute({ children, allowedRoles }) {
  const { token, user } = useAuthStore();

  if (!token) return <Navigate to="/login" replace />;

  if (allowedRoles && !allowedRoles.includes(user?.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
}
