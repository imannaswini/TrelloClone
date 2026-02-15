import { Navigate } from "react-router-dom";
import useAuthStore from "../../context/AuthStore";

export default function ProtectedRoute({ children, allowedRoles }) {
  const { token, user } = useAuthStore();

  if (!token) return <Navigate to="/login" replace />;
  if (!user) return <Navigate to="/login" replace />;

  if (allowedRoles) {
    const normalizedAllowedRoles = allowedRoles.map(r =>
      r.toLowerCase()
    );

    if (!normalizedAllowedRoles.includes(user.role?.toLowerCase())) {
      return <Navigate to="/unauthorized" replace />;
    }
  }

  return children;
}
