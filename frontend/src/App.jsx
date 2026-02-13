import { BrowserRouter, Routes, Route } from "react-router-dom";

// Public Pages
import Home from "./pages/Home";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";

// Admin Pages
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminProjects from "./pages/admin/AdminProjects";
import AdminPending from "./pages/admin/AdminPending";
import AdminCreateProject from "./pages/admin/AdminCreateProject";

// Member Pages
import MemberDashboard from "./pages/member/MemberDashboard";

// Project Pages
import ProjectBoard from "./pages/projects/ProjectBoard";
import ProjectMembers from "./pages/admin/ProjectMembers";

// Common
import Unauthorized from "./pages/Unauthorized";

// Guard
import ProtectedRoute from "./components/common/ProtectedRoute";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* ---------- Public ---------- */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* ---------- Admin ---------- */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/users"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminUsers />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/projects"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminProjects />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/create-project"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminCreateProject />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/pending"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminPending />
            </ProtectedRoute>
          }
        />

        {/* ---------- Projects ---------- */}
        <Route
          path="/projects/:projectId"
          element={
            <ProtectedRoute allowedRoles={["admin", "member"]}>
              <ProjectBoard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/projects/:projectId/members"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <ProjectMembers />
            </ProtectedRoute>
          }
        />

        {/* ---------- Member ---------- */}
        <Route
          path="/member"
          element={
            <ProtectedRoute allowedRoles={["member"]}>
              <MemberDashboard />
            </ProtectedRoute>
          }
        />

        {/* ---------- Unauthorized ---------- */}
        <Route path="/unauthorized" element={<Unauthorized />} />
      </Routes>
    </BrowserRouter>
  );
}
