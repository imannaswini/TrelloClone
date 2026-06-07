import { useNavigate } from "react-router-dom";
import useAuthStore from "../../context/AuthStore";
import { LogOut, Bell, Search, Menu } from "lucide-react";
import logo from "../../assets/logo.png";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function Navbar({ toggleSidebar }) {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="h-16 w-full glass-panel sticky top-0 z-40 px-4 md:px-6 flex items-center justify-between border-b border-white/5 shadow-sm">
      {/* Left section: Logo & Sidebar Toggle */}
      <div className="flex items-center gap-4">
        {user && (
          <button
            onClick={toggleSidebar}
            className="p-2 -ml-2 rounded-md text-zinc-400 hover:bg-white/5 hover:text-white transition-colors"
          >
            <Menu size={20} />
          </button>
        )}
        
        <div
          onClick={() => navigate(user?.role === "admin" ? "/admin" : "/member")}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="relative flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-accent-500 shadow-lg shadow-primary-500/20 group-hover:shadow-primary-500/40 transition-all">
            <span className="text-white font-bold text-lg leading-none pt-0.5">S</span>
          </div>
          <span className="text-xl font-bold tracking-tight text-white hidden sm:block">
            SPARK
          </span>
        </div>
      </div>

      {/* Middle section: Global Search (if logged in) */}
      {user && (
        <div className="hidden md:flex flex-1 max-w-md mx-6">
          <div className="relative w-full group">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-zinc-500 group-focus-within:text-primary-400 transition-colors">
              <Search size={16} />
            </div>
            <input
              type="text"
              placeholder="Search projects, tasks..."
              className="w-full bg-zinc-900/50 border border-white/10 rounded-full py-1.5 pl-10 pr-4 text-sm text-zinc-200 placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500/50 transition-all duration-300"
            />
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <span className="text-xs text-zinc-500 font-medium border border-white/10 rounded px-1.5 py-0.5 bg-zinc-800/50">⌘K</span>
            </div>
          </div>
        </div>
      )}

      {/* Right section: Actions & Profile */}
      <div className="flex items-center gap-2 sm:gap-4">
        {user ? (
          <>
            <button className="p-2 relative rounded-full text-zinc-400 hover:bg-white/5 hover:text-white transition-colors">
              <Bell size={20} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-accent-500 ring-2 ring-[#0a0a0a]"></span>
            </button>

            <div className="relative">
              <button
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="flex items-center gap-2 p-1 pr-2 rounded-full border border-white/10 hover:bg-white/5 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500/50"
              >
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-primary-600 to-accent-600 flex items-center justify-center text-sm font-medium text-white shadow-inner">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <div className="hidden sm:flex flex-col items-start mr-1">
                  <span className="text-sm font-medium text-zinc-200 leading-none">{user.name}</span>
                  <span className="text-[10px] text-zinc-500 font-medium uppercase tracking-wider mt-1">{user.role}</span>
                </div>
              </button>

              <AnimatePresence>
                {showProfileMenu && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 mt-2 w-56 rounded-xl border border-white/10 bg-zinc-900 shadow-2xl overflow-hidden py-1"
                  >
                    <div className="px-4 py-3 border-b border-white/5">
                      <p className="text-sm text-white font-medium truncate">{user.name}</p>
                      <p className="text-xs text-zinc-400 truncate mt-0.5">{user.email}</p>
                    </div>
                    <div className="p-1">
                      <button
                        onClick={handleLogout}
                        className="flex w-full items-center gap-2 px-3 py-2 text-sm text-red-400 hover:bg-red-500/10 rounded-md transition-colors"
                      >
                        <LogOut size={16} />
                        Sign out
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </>
        ) : (
          <div className="flex items-center gap-3">
            <button onClick={() => navigate("/login")} className="text-sm font-medium text-zinc-300 hover:text-white transition-colors px-3 py-2">
              Log in
            </button>
            <button onClick={() => navigate("/register")} className="text-sm font-medium bg-primary-600 hover:bg-primary-500 text-white px-4 py-2 rounded-full transition-colors shadow-lg shadow-primary-500/20">
              Get Started
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}
