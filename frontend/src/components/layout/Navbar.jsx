import { Link, useNavigate } from "react-router-dom";
import { FaUser, FaSignOutAlt } from "react-icons/fa";
import useAuthStore from "../../context/AuthStore";
import logo from "../../assets/logo.png";

export default function Navbar() {
  const navigate = useNavigate();
  const { token, user, logout } = useAuthStore();

  const dashboardPath =
    user?.role === "admin"
      ? "/admin"
      : user?.role === "member"
      ? "/member"
      : "/";

  const handleLogout = () => {
    logout();
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  return (
    <nav className="bg-gray-900 text-white border-b border-gray-700 px-6 py-3 flex items-center justify-between">

      <div
        className="flex items-center gap-2 cursor-pointer"
        onClick={() => navigate(dashboardPath)}
      >
        <img src={logo} className="w-9 h-9 rounded" alt="logo" />
        <span className="text-xl font-bold">SPARK</span>
      </div>

      <div className="flex items-center gap-3">
        {token && (
          <>
            <span className="flex items-center gap-2 bg-gray-800 px-3 py-1 rounded-full text-sm">
              <FaUser />
              {user?.name}
              <span className="text-blue-400">
                ({user?.role})
              </span>
            </span>

            <button
              onClick={handleLogout}
              className="bg-red-600 hover:bg-red-700 transition flex items-center gap-2 px-3 py-1 rounded-lg"
            >
              <FaSignOutAlt /> Logout
            </button>
          </>
        )}
      </div>
    </nav>
  );
}
