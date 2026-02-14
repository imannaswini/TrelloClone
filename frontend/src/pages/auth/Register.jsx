import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../../services/api";
import useAuthStore from "../../context/AuthStore";

export default function Register() {
  const [role, setRole] = useState("member");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);

  const handleRegister = async (e) => {
    e.preventDefault();

    if (loading) return;

    setLoading(true);

    try {
      
      const res = await api.post("/auth/register", {
  name,
  email,
  password,
  role: role.toLowerCase(), // 
});


      login(res.data.token, res.data.user);

      toast.success("Account Created ");

      navigate(role === "admin" ? "/admin" : "/member");
    } catch (err) {
      const message = err.response?.data?.message;

      if (message === "User already exists") {
        toast.error("Email already registered. Redirecting to login 👀");

        setTimeout(() => {
          navigate("/login");
        }, 1200);
      } else {
        toast.error(message || "Registration failed");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 text-white">
      <form
        onSubmit={handleRegister}
        className="bg-slate-900 p-8 rounded-xl w-96 space-y-4"
      >
        <h2 className="text-2xl font-bold text-center text-green-400">
          Create SPARK Account
        </h2>

        <input
          className="w-full p-3 rounded bg-slate-800"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

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
          <option value="member">Member</option>
          <option value="admin">Admin</option>
        </select>

        <button
          disabled={loading}
          className={`w-full py-3 rounded transition ${
            loading
              ? "bg-gray-600 cursor-not-allowed"
              : "bg-green-600 hover:bg-green-700"
          }`}
        >
          {loading ? "Creating Account..." : "Register"}
        </button>

        <p className="text-sm text-gray-400 text-center">
          Already have an account?{" "}
          <span
            className="text-blue-400 cursor-pointer hover:underline"
            onClick={() => navigate("/login")}
          >
            Login
          </span>
        </p>
      </form>
    </div>
  );
}
