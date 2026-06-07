import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Lock, Eye, EyeOff, User as UserIcon, BadgeCheck, ShieldAlert, ArrowLeft, CheckCircle2, XCircle } from "lucide-react";
import api from "../../api/axios";
import { Input } from "../../components/ui/Input";
import { Button } from "../../components/ui/Button";
import { cn } from "../../lib/utils";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [requestedRole, setRequestedRole] = useState("member");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Password strength logic
  const [strength, setStrength] = useState(0);
  
  useEffect(() => {
    let score = 0;
    if (password.length > 5) score += 1;
    if (password.length > 8) score += 1;
    if (/[A-Z]/.test(password)) score += 1;
    if (/[0-9]/.test(password)) score += 1;
    if (/[^A-Za-z0-9]/.test(password)) score += 1;
    setStrength(Math.min(score, 4));
  }, [password]);

  const getStrengthColor = () => {
    if (strength === 0) return "bg-zinc-700";
    if (strength === 1) return "bg-red-500";
    if (strength === 2) return "bg-orange-500";
    if (strength === 3) return "bg-yellow-500";
    return "bg-green-500";
  };

  const getStrengthLabel = () => {
    if (password.length === 0) return "";
    if (strength <= 1) return "Weak";
    if (strength === 2) return "Fair";
    if (strength === 3) return "Good";
    return "Strong";
  };

  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    if (isLoading) return;

    if (!name.trim() || !email.trim() || !password.trim()) {
      toast.error("Please fill all fields");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    setIsLoading(true);

    try {
      const res = await api.post("/auth/register", {
        name,
        email,
        password,
        requestedRole,
      });

      toast.success(res.data.message);
      if (res.data.user && res.data.user.role === "member") {
         // Optionally keep an icon or additional info if it's a member, but the message already says awaiting approval.
      }
      navigate("/login");
    } catch (err) {
      const message = err.response?.data?.message;

      if (message === "User already exists") {
        toast.error("Email already registered");
        navigate("/login");
      } else {
        toast.error(message || "Registration failed");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const passwordsMatch = password && confirmPassword && password === confirmPassword;
  const passwordsMismatch = confirmPassword && password !== confirmPassword;

  return (
    <div className="min-h-screen relative flex items-center justify-center bg-background overflow-hidden selection:bg-primary-500/30 py-12">
      {/* Animated Background Gradients */}
      <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-primary-600/20 blur-[120px] rounded-full mix-blend-screen animate-pulse" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-accent-600/20 blur-[120px] rounded-full mix-blend-screen animate-pulse" style={{ animationDelay: '2s' }} />

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
            <h2 className="text-3xl font-heading font-bold text-white tracking-tight">Create Account</h2>
            <p className="text-zinc-400 mt-2 text-sm">Join SPARK and start building</p>
          </div>

          <form onSubmit={handleRegister} className="space-y-5">
            {/* Requested Role Selector */}
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-2 ml-1">
                Requested Role
              </label>
              <div className="flex p-1 bg-zinc-900/50 rounded-lg border border-white/5 relative z-10">
                <button
                  type="button"
                  onClick={() => setRequestedRole("member")}
                  className={cn(
                    "flex-1 flex items-center justify-center gap-2 py-2 text-sm font-medium rounded-md transition-all duration-200",
                    requestedRole === "member" ? "bg-white/10 text-white shadow-sm" : "text-zinc-400 hover:text-zinc-200"
                  )}
                >
                  <BadgeCheck size={16} /> Member
                </button>
                <button
                  type="button"
                  onClick={() => setRequestedRole("admin")}
                  className={cn(
                    "flex-1 flex items-center justify-center gap-2 py-2 text-sm font-medium rounded-md transition-all duration-200",
                    requestedRole === "admin" ? "bg-white/10 text-white shadow-sm" : "text-zinc-400 hover:text-zinc-200"
                  )}
                >
                  <ShieldAlert size={16} /> Admin
                </button>
              </div>
            </div>

            <div className="space-y-4">
              <Input
                label="Full Name"
                type="text"
                icon={UserIcon}
                placeholder="John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />

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
                
                {/* Password Strength Indicator */}
                {password.length > 0 && (
                  <div className="mt-2 space-y-1 ml-1">
                    <div className="flex gap-1 h-1">
                      {[...Array(4)].map((_, i) => (
                        <div 
                          key={i} 
                          className={cn(
                            "flex-1 rounded-full transition-all duration-300", 
                            i < strength ? getStrengthColor() : "bg-zinc-800"
                          )} 
                        />
                      ))}
                    </div>
                    <p className={cn("text-xs text-right", `text-${getStrengthColor().replace('bg-', '')}`)}>
                      {getStrengthLabel()}
                    </p>
                  </div>
                )}
              </div>

              <div className="relative">
                <Input
                  label="Confirm Password"
                  type={showPassword ? "text" : "password"}
                  icon={Lock}
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
                <AnimatePresence>
                  {confirmPassword.length > 0 && (
                    <motion.div 
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0 }}
                      className="absolute right-3 top-[34px]"
                    >
                      {passwordsMatch && <CheckCircle2 size={18} className="text-green-500" />}
                      {passwordsMismatch && <XCircle size={18} className="text-red-500" />}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            <Button type="submit" className="w-full mt-4 py-2.5" isLoading={isLoading} disabled={passwordsMismatch}>
              Create Account
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-zinc-400">
            Already have an account?{" "}
            <Link to="/login" className="text-primary-400 hover:text-primary-300 font-medium transition-colors">
              Sign in here
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
