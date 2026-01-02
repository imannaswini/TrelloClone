import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import useAuthStore from "../../context/AuthStore";
import { motion } from "framer-motion";

export default function Login() {
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);

  const [form, setForm] = useState({
    email: "",
    password: "",
    role: "Member",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!form.email || !form.password) {
      toast.error("Please enter email & password");
      return;
    }

    try {
      setLoading(true);

      const fakeUser = {
        name: "SPARK User",
        email: form.email,
        role: form.role,
      };

      const fakeToken = "testtoken123";

      login(fakeToken, fakeUser);
      localStorage.setItem("token", fakeToken);
      localStorage.setItem("user", JSON.stringify(fakeUser));

      toast.success(`Welcome ${form.role}! 🎉`);

      if (form.role === "Admin") navigate("/admin");
      else if (form.role === "Manager") navigate("/manager");
      else navigate("/member");
    } catch {
      toast.error("Login Failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative h-screen flex items-center justify-center bg-gray-900 text-white overflow-hidden">
      <Toaster position="top-center" />

      {/* Glow Effects */}
      <div className="absolute w-80 h-80 bg-blue-500 opacity-20 rounded-full blur-[120px] top-10 left-16 animate-pulse"></div>
      <div className="absolute w-80 h-80 bg-purple-600 opacity-20 rounded-full blur-[120px] bottom-10 right-16 animate-pulse"></div>

      <motion.div
        className="bg-gray-800 border border-gray-700 rounded-xl p-8 w-full max-w-md relative shadow-xl"
        initial={{ opacity: 0, y: 40, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.8 }}
      >
        <h1 className="text-4xl font-extrabold text-center bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-6">
          Login
        </h1>

        <form onSubmit={handleLogin} className="space-y-4">

          {/* Email */}
          <div>
            <label className="text-sm text-gray-400">Email</label>
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 mt-1 outline-none focus:border-purple-500"
              placeholder="Enter email"
            />
          </div>

          {/* Password */}
          <div>
            <label className="text-sm text-gray-400">Password</label>
            <input
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 mt-1 outline-none focus:border-purple-500"
              placeholder="Enter password"
            />
          </div>

          {/* Role Select */}
          <div>
            <label className="text-sm text-gray-400">Login As</label>
            <select
              name="role"
              value={form.role}
              onChange={handleChange}
              className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 mt-1 outline-none focus:border-purple-500"
            >
              <option value="Admin">Admin</option>
              <option value="Manager">Manager</option>
              <option value="Member">Member</option>
            </select>
          </div>

          {/* Button */}
          <motion.button
            whileTap={{ scale: 0.95 }}
            disabled={loading}
            className="w-full bg-purple-600 hover:bg-purple-700 transition py-2 rounded font-semibold shadow-lg hover:shadow-purple-500/40 disabled:opacity-50"
          >
            {loading ? "Logging in..." : "Login"}
          </motion.button>
        </form>

        <p className="text-gray-400 text-sm text-center mt-4">
          Don't have an account?{" "}
          <span
            onClick={() => navigate("/register")}
            className="text-green-400 cursor-pointer hover:underline"
          >
            Register
          </span>
        </p>
      </motion.div>
    </div>
  );
}
