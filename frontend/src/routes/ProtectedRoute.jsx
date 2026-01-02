import { Navigate } from "react-router-dom";
import useAuthStore from "../context/AuthStore";

export default function ProtectedRoute({ children }) {
  const { token } = useAuthStore();

  // If no token → kick to login
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
