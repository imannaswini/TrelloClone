import { useNavigate } from "react-router-dom";
import { FaUser, FaSignOutAlt } from "react-icons/fa";
import { useAuth } from "../../context/AuthContext";
import logo from "../../assets/logo.png";

export default function Navbar() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  // Decide dashboard route based on role
  const dashboardPath =
    user?.role === "admin"
      ? "/admin"
      : user?.role === "member"
      ? "/member"
      : "/";

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="bg-slate-900 text-white border-b border-slate-800 px-6 py-3 flex items-center justify-between">
      {/* Logo */}
      <div
        className="flex items-center gap-2 cursor-pointer"
        onClick={() => navigate(dashboardPath)}
      >
        <img src={logo} className="w-9 h-9 rounded" alt="SPARK logo" />
        <span className="text-xl font-bold tracking-wide">
          SPARK
        </span>
      </div>

      {/* Right Section */}
      {user && (
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-2 bg-slate-800 px-3 py-1 rounded-full text-sm">
            <FaUser />
            {user.name || "SPARK User"}
            <span className="text-blue-400 capitalize">
              ({user.role})
            </span>
          </span>

          <button
            onClick={handleLogout}
            className="bg-red-600 hover:bg-red-700 transition flex items-center gap-2 px-4 py-2 rounded-lg"
          >
            <FaSignOutAlt />
            Logout
          </button>
        </div>
      )}
    </nav>
  );
}
