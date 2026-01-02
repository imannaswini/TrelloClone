import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { FiMenu, FiHome, FiUsers, FiGrid, FiUser, FiLogOut } from "react-icons/fi";

export default function Sidebar() {
  const [open, setOpen] = useState(true);
  const navigate = useNavigate();

  // later replace with real user auth
  const user = {
    role: "Admin", // Admin | Manager | Member
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div
      className={`${
        open ? "w-64" : "w-16"
      } bg-gray-900 h-screen border-r border-gray-700 p-4 transition-all duration-300 fixed`}
    >
      {/* Toggle Button */}
      <button
        className="text-white mb-6 flex items-center gap-2"
        onClick={() => setOpen(!open)}
      >
        <FiMenu size={22} />
        {open && <span className="text-lg font-semibold">Menu</span>}
      </button>

      {/* Menu Items */}
      <div className="flex flex-col gap-3 text-gray-300">
        <SidebarLink to="/" icon={<FiHome />} open={open} label="Home" />

        {user.role === "Admin" && (
          <SidebarLink to="/admin" icon={<FiUsers />} open={open} label="Admin Dashboard" />
        )}

        {user.role === "Manager" && (
          <SidebarLink to="/manager" icon={<FiGrid />} open={open} label="Manager Dashboard" />
        )}

        {user.role === "Member" && (
          <SidebarLink to="/member" icon={<FiUser />} open={open} label="Member Dashboard" />
        )}
      </div>

      {/* Logout */}
      <button
        onClick={handleLogout}
        className="absolute bottom-6 left-4 right-4 bg-red-500 hover:bg-red-600 text-white py-2 rounded-md flex items-center justify-center gap-2"
      >
        <FiLogOut />
        {open && "Logout"}
      </button>
    </div>
  );
}

/* Reusable Sidebar Link Component */
function SidebarLink({ to, icon, label, open }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `flex items-center gap-3 px-3 py-2 rounded-md transition ${
          isActive
            ? "bg-blue-600 text-white"
            : "hover:bg-gray-700 hover:text-white"
        }`
      }
    >
      {icon}
      {open && <span>{label}</span>}
    </NavLink>
  );
}
