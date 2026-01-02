import { Navigate } from "react-router-dom";
import useAuthStore from "../context/AuthStore";

export default function RoleRoute({ children, allowedRole }) {
  const { token, user } = useAuthStore();

  // Not logged in → go login
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // If role does not match → send user to correct dashboard
  if (user?.role !== allowedRole) {
    if (user?.role === "Admin") return <Navigate to="/admin" replace />;
    if (user?.role === "Manager") return <Navigate to="/manager" replace />;
    return <Navigate to="/member" replace />;
  }

  return children;
}
