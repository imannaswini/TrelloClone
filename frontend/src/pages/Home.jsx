import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useAuthStore from "../context/AuthStore";
import { motion } from "framer-motion";

export default function Home() {
  const navigate = useNavigate();
  const { token, user } = useAuthStore();

  // Auto redirect if logged in
  useEffect(() => {
    if (token && user?.role) {
      if (user.role === "Admin") navigate("/admin");
      if (user.role === "Manager") navigate("/manager");
      if (user.role === "Member") navigate("/member");
    }
  }, [token, user, navigate]);

  return (
    // <div className="relative h-[calc(100vh-64px)] flex items-center justify-center bg-gray-900 text-white overflow-hidden">
    <div className="min-h-screen w-full bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 flex items-center justify-center">

      {/* Glowing Background Elements */}
      <div className="absolute w-72 h-72 bg-blue-500 opacity-20 rounded-full blur-[120px] top-10 left-16 animate-pulse"></div>
      <div className="absolute w-72 h-72 bg-purple-600 opacity-20 rounded-full blur-[120px] bottom-10 right-16 animate-pulse"></div>

      <motion.div
        className="text-center max-w-3xl px-6 relative"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9 }}
      >
        {/* Title */}
        <motion.h1
          className="text-4xl md:text-6xl font-extrabold mb-4 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent"
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.8 }}
        >
          SPARK PROJECT TRACKER
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          className="text-gray-300 text-lg mb-8 leading-relaxed"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          An intelligent Trello-style Project Management platform with Role-Based Control.
          Empower Admins to manage users, Managers to build boards, and Members to collaborate
          smarter — all in a sleek modern dashboard.
        </motion.p>

        {/* Buttons */}
        <motion.div
          className="flex flex-wrap justify-center gap-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <button
            onClick={() => navigate("/login")}
            className="bg-purple-600 hover:bg-purple-700 px-7 py-3 rounded-lg font-semibold transition shadow-lg hover:shadow-purple-500/40 animate-bounce"
          >
            Login
          </button>

          <button
            onClick={() => navigate("/register")}
            className="bg-green-600 hover:bg-green-700 px-7 py-3 rounded-lg font-semibold transition shadow-lg hover:shadow-green-500/40"
          >
            Register
          </button>
        </motion.div>

        {/* Info Text */}
        <motion.p
          className="text-gray-500 text-sm mt-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9 }}
        >
          Admin → Manage Users and Create Boards  |  Member → Work on Tasks
        </motion.p>
      </motion.div>
    </div>
  );
}
