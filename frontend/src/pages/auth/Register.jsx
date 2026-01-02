import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import useAuthStore from "../../context/AuthStore";

export default function Register() {
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "Member",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleRegister = async (e) => {
    e.preventDefault();

    if (!form.name || !form.email || !form.password) {
      toast.error("Please fill all fields");
      return;
    }

    try {
      setLoading(true);

      // ---------- TEMP FRONTEND AUTH MODE ----------
      const fakeUser = {
        name: form.name,
        role: form.role,
        email: form.email,
      };

      const fakeToken = "testtoken123";

      login(fakeToken, fakeUser);

      localStorage.setItem("token", fakeToken);
      localStorage.setItem("user", JSON.stringify(fakeUser));

      toast.success("Registration Successful 🎉");

      if (fakeUser.role === "Admin") navigate("/admin");
      else if (fakeUser.role === "Manager") navigate("/manager");
      else navigate("/member");
    } catch {
      toast.error("Registration Failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen flex items-center justify-center bg-gray-900 text-white px-4">
      <Toaster position="top-center" />

      <div className="bg-gray-800 border border-gray-700 rounded-xl p-8 w-full max-w-md">
        <h1 className="text-3xl font-bold text-center text-green-400 mb-6">
          Create Account
        </h1>

        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <label className="text-sm text-gray-400">Full Name</label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 mt-1 outline-none focus:border-green-500"
              placeholder="Enter your name"
            />
          </div>

          <div>
            <label className="text-sm text-gray-400">Email</label>
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 mt-1 outline-none focus:border-green-500"
              placeholder="Enter email"
            />
          </div>

          <div>
            <label className="text-sm text-gray-400">Password</label>
            <input
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 mt-1 outline-none focus:border-green-500"
              placeholder="Enter password"
            />
          </div>

          <div>
            <label className="text-sm text-gray-400">Select Role</label>
            <select
              name="role"
              value={form.role}
              onChange={handleChange}
              className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 mt-1 outline-none focus:border-green-500"
            >
              <option value="Admin">Admin</option>
              <option value="Manager">Manager</option>
              <option value="Member">Member</option>
            </select>
          </div>

          <button
            disabled={loading}
            className="w-full bg-green-600 hover:bg-green-700 transition py-2 rounded font-semibold disabled:opacity-50"
          >
            {loading ? "Creating Account..." : "Register"}
          </button>
        </form>

        <p className="text-gray-400 text-sm text-center mt-4">
          Already have an account?{" "}
          <span
            onClick={() => navigate("/login")}
            className="text-blue-400 cursor-pointer hover:underline"
          >
            Login
          </span>
        </p>
      </div>
    </div>
  );
}
