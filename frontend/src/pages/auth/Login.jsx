import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import { Mail, Lock, Eye, EyeOff, ShieldCheck, User as UserIcon, ArrowLeft } from "lucide-react";
import api from "../../api/axios";
import useAuthStore from "../../context/AuthStore";
import { Input } from "../../components/ui/Input";
import { Button } from "../../components/ui/Button";
import { cn } from "../../lib/utils";

export default function Login() {
  const [role, setRole] = useState("member");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email.trim() || !password.trim()) {
      toast.error("Please enter email & password");
      return;
    }

    setIsLoading(true);

    try {
      const res = await api.post("/auth/login", { email, password });

      if (!res.data?.token || !res.data?.user) {
        toast.error("Invalid server response");
        return;
      }

      // Role Validation
      if (res.data.user.role !== role) {
        toast.error(`Role mismatch! You are registered as an ${res.data.user.role}.`);
        setIsLoading(false);
        return;
      }

      login(res.data.token, res.data.user);
      toast.success(`Welcome back, ${res.data.user.name} 🚀`);
      
      navigate(res.data.user.role === "admin" ? "/admin" : "/member");
    } catch (err) {
      toast.error(err.response?.data?.message || err.message || "Login failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center bg-background overflow-hidden selection:bg-primary-500/30">
      {/* Animated Background Gradients */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary-600/20 blur-[120px] rounded-full mix-blend-screen animate-pulse" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-accent-600/20 blur-[120px] rounded-full mix-blend-screen animate-pulse" style={{ animationDelay: '2s' }} />

      <Link 
        to="/" 
        className="absolute top-8 left-8 flex items-center gap-2 text-zinc-400 hover:text-white transition-colors z-20 font-medium"
      >
        <ArrowLeft size={18} /> Back to Home
      </Link>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-full max-w-md z-10 mx-4"
      >
        <div className="glass-panel p-8 sm:p-10 rounded-2xl shadow-2xl border border-white/10 relative overflow-hidden">
          {/* Shine effect */}
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary-500 to-transparent opacity-50" />

          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", bounce: 0.5, delay: 0.2 }}
              className="w-12 h-12 bg-gradient-to-br from-primary-500 to-accent-500 rounded-xl mx-auto flex items-center justify-center mb-4 shadow-lg shadow-primary-500/30"
            >
              <span className="text-white font-bold text-2xl leading-none pt-0.5">S</span>
            </motion.div>
            <h2 className="text-3xl font-heading font-bold text-white tracking-tight">Welcome back</h2>
            <p className="text-zinc-400 mt-2 text-sm">Enter your credentials to access SPARK</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            {/* Role Selector */}
            <div className="flex p-1 bg-zinc-900/50 rounded-lg border border-white/5 relative z-10">
              <button
                type="button"
                onClick={() => setRole("member")}
                className={cn(
                  "flex-1 flex items-center justify-center gap-2 py-2 text-sm font-medium rounded-md transition-all duration-200",
                  role === "member" ? "bg-white/10 text-white shadow-sm" : "text-zinc-400 hover:text-zinc-200"
                )}
              >
                <UserIcon size={16} /> Member
              </button>
              <button
                type="button"
                onClick={() => setRole("admin")}
                className={cn(
                  "flex-1 flex items-center justify-center gap-2 py-2 text-sm font-medium rounded-md transition-all duration-200",
                  role === "admin" ? "bg-white/10 text-white shadow-sm" : "text-zinc-400 hover:text-zinc-200"
                )}
              >
                <ShieldCheck size={16} /> Admin
              </button>
            </div>

            <div className="space-y-4">
              <Input
                label="Email address"
                type="email"
                icon={Mail}
                placeholder="name@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />

              <div className="relative">
                <Input
                  label="Password"
                  type={showPassword ? "text" : "password"}
                  icon={Lock}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-[34px] text-zinc-500 hover:text-zinc-300 transition-colors focus:outline-none"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 cursor-pointer group">
                <div className="w-4 h-4 rounded border border-zinc-600 bg-zinc-900/50 group-hover:border-primary-500 flex items-center justify-center transition-colors">
                  <input type="checkbox" className="opacity-0 absolute" />
                </div>
                <span className="text-zinc-400 group-hover:text-zinc-300 transition-colors">Remember me</span>
              </label>
              <a href="#" className="text-primary-400 hover:text-primary-300 font-medium transition-colors">
                Forgot password?
              </a>
            </div>

            <Button type="submit" className="w-full mt-2 py-2.5" isLoading={isLoading}>
              Sign in to {role === "admin" ? "Admin Panel" : "Dashboard"}
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-zinc-400">
            Don't have an account?{" "}
            <Link to="/register" className="text-primary-400 hover:text-primary-300 font-medium transition-colors">
              Create an account
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
