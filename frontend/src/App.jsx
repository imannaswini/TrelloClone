import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect } from "react";

// Layout
import Navbar from "./components/layout/Navbar";

// Pages
import Home from "./pages/Home";
import AdminCreateProject from "./pages/admin/AdminCreateProject";

import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminProjects from "./pages/admin/AdminProjects";
import AdminPending from "./pages/admin/AdminPending";
import ProjectBoard from "./pages/projects/ProjectBoard";
import ManagerDashboard from "./pages/manager/ManagerDashboard";
import MemberDashboard from "./pages/member/MemberDashboard";

import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";

// Auth
import useAuthStore from "./context/AuthStore";

// Guards
import ProtectedRoute from "./routes/ProtectedRoute";
import RoleRoute from "./routes/RoleRoute";

export default function App() {
  const initializeAuth = useAuthStore((state) => state.initializeAuth);

  useEffect(() => {
    initializeAuth();
  }, []);

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-900 text-white">
        <Navbar />

        <Routes>
          {/* ---------- Public Routes ---------- */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
           <Route path="/admin/projects/create" element={<AdminCreateProject />} />

          <Route path="/projects/:id" element={<ProjectBoard />} />   
          {/* ---------- Protected Role-Based Dashboards ---------- */}
          <Route
            path="/admin"
            element={
              <RoleRoute allowedRole="Admin">
                <AdminDashboard />
              </RoleRoute>
            }
          />
          <Route
  path="/admin/users"
  element={
    <RoleRoute allowedRole="Admin">
      <AdminUsers />
    </RoleRoute>
  }
/>

<Route
  path="/admin/projects"
  element={
    <RoleRoute allowedRole="Admin">
      <AdminProjects />
    </RoleRoute>
  }
/>

<Route
  path="/admin/pending"
  element={
    <RoleRoute allowedRole="Admin">
      <AdminPending />
    </RoleRoute>
  }
/>


          <Route
            path="/manager"
            element={
              <RoleRoute allowedRole="Manager">
                <ManagerDashboard />
              </RoleRoute>
            }
          />

          <Route
            path="/member"
            element={
              <RoleRoute allowedRole="Member">
                <MemberDashboard />
              </RoleRoute>
            }
          />

          {/* ---------- Optional 404 ---------- */}
          {/* <Route path="*" element={<NotFound />} /> */}
        </Routes>
      </div>
    </BrowserRouter>
  );
}
