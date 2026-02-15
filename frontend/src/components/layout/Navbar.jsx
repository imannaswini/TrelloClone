import { useNavigate } from "react-router-dom";
import useAuthStore from "../../context/AuthStore";
import { FaSignOutAlt, FaUser } from "react-icons/fa";
import logo from "../../assets/logo.png";   // ✅ IMPORTANT

export default function Navbar() {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="w-full h-16 bg-[#0F172A] border-b border-gray-800 flex items-center justify-between px-6">

      {/* ✅ Logo Section */}
      <div
        onClick={() => navigate(user?.role === "admin" ? "/admin" : "/member")}
        className="flex items-center gap-3 cursor-pointer"
      >
        <img
          src={logo}
          alt="SPARK Logo"
          className="w-9 h-9 object-contain"
        />
        <span className="text-xl font-bold text-blue-400">
          SPARK
        </span>
      </div>

      {/* ✅ Right Section */}
      <div className="flex items-center gap-4">

        {/* ✅ User */}
        {user && (
          <div className="flex items-center gap-2 text-sm text-gray-300">
            <FaUser />
            <span>
              {user.name} ({user.role})
            </span>
          </div>
        )}

        {/* ✅ Logout */}
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 bg-red-600 hover:bg-red-700 px-3 py-1.5 rounded-lg text-sm"
        >
          <FaSignOutAlt />
          Logout
        </button>
      </div>
    </div>
  );
}
