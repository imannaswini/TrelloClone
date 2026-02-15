import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";

import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminProjects from "./pages/admin/AdminProjects";
import AdminPending from "./pages/admin/AdminPending";
import AdminCreateProject from "./pages/admin/AdminCreateProject";
import AdminCreateTask from "./pages/admin/AdminCreateTask";

import MemberDashboard from "./pages/member/MemberDashboard";
import MemberTasks from "./pages/member/MemberTasks";

import ProjectBoard from "./pages/projects/ProjectBoard";
import ProjectMembers from "./pages/admin/ProjectMembers";

import AdminTasks from "./pages/admin/AdminTasks";

import Unauthorized from "./pages/Unauthorized";

import ProtectedRoute from "./components/common/ProtectedRoute";
import { Toaster } from "react-hot-toast";

export default function App() {
  return (
    <BrowserRouter>
      <Toaster position="top-right" />

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
  path="/admin/tasks"
  element={
    <ProtectedRoute allowedRoles={["admin"]}>
      <AdminTasks />
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

        <Route
          path="/admin/create-task"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminCreateTask />
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
        <Route
  path="/member/tasks"
  element={
    <ProtectedRoute allowedRoles={["member"]}>
      <MemberTasks />
    </ProtectedRoute>
  }
/>


        {/* ---------- Unauthorized ---------- */}
        <Route path="/unauthorized" element={<Unauthorized />} />
      </Routes>
    </BrowserRouter>
  );
}
