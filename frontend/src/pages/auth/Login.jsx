import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../../services/api";
import useAuthStore from "../../context/AuthStore";

export default function Login() {
  const [role, setRole] = useState("admin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);

  const handleLogin = async (e) => {
    e.preventDefault();

 
    if (!email.trim() || !password.trim()) {
      toast.error("Please enter email & password");
      return;
    }

    try {
      const res = await api.post("/auth/login", {
  email,
  password,
  role: role.toLowerCase(), 
});


      
      if (!res.data?.token || !res.data?.user) {
        toast.error("Invalid server response");
        return;
      }

      login(res.data.token, res.data.user);

      toast.success("Login Successful 🚀");

      navigate(role === "admin" ? "/admin" : "/member");
    } catch (err) {
      console.error("LOGIN ERROR:", err);

      toast.error(
        err.response?.data?.message ||
        err.message ||
        "Login failed"
      );
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 text-white">
      <form
        onSubmit={handleLogin}
        className="bg-slate-900 p-8 rounded-xl w-96 space-y-4"
      >
        <h2 className="text-2xl font-bold text-center text-blue-400">
          Login to SPARK
        </h2>

        <input
          className="w-full p-3 rounded bg-slate-800"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          className="w-full p-3 rounded bg-slate-800"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          className="w-full p-3 rounded bg-slate-800"
        >
          <option value="admin">Admin</option>
          <option value="member">Member</option>
        </select>

        <button className="w-full bg-blue-600 py-3 rounded hover:bg-blue-700 transition">
          Login
        </button>
      </form>
    </div>
  );
}
