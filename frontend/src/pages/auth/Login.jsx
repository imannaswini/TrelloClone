import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useAuthStore from "../../context/AuthStore";

export default function Login() {
  const [role, setRole] = useState("admin");
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);

  const handleLogin = (e) => {
    e.preventDefault();

    const fakeToken = "spark-token-123";
    const user = {
      name: "Admin User",
      role: role, // "admin" | "member"
    };

    login(fakeToken, user);

    navigate(role === "admin" ? "/admin" : "/member");
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

        <input className="w-full p-3 rounded bg-slate-800" placeholder="Email" />
        <input className="w-full p-3 rounded bg-slate-800" type="password" placeholder="Password" />

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
