import { useState } from "react";
import { NavLink, Outlet, useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  LayoutDashboard, FolderKanban, CheckSquare, Users, UserPlus, 
  LogOut, Menu, Search, Bell, ChevronLeft, ChevronRight 
} from "lucide-react";
import useAuthStore from "../../context/AuthStore";
import { cn } from "../../lib/utils";

export default function AppLayout() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const adminLinks = [
    { name: "Dashboard", path: "/admin", icon: LayoutDashboard },
    { name: "Projects", path: "/admin/projects", icon: FolderKanban },
    { name: "Tasks", path: "/admin/tasks", icon: CheckSquare },
    { name: "Users", path: "/admin/users", icon: Users },
    { name: "Pending Approvals", path: "/admin/pending", icon: UserPlus },
  ];

  const memberLinks = [
    { name: "Dashboard", path: "/member", icon: LayoutDashboard },
    { name: "My Tasks", path: "/member/tasks", icon: CheckSquare },
  ];

  const links = user?.role === "admin" ? adminLinks : memberLinks;

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-surface border-r border-white/5">
      <div className="h-16 flex items-center justify-between px-4 border-b border-white/5">
        <div className="flex items-center gap-2 overflow-hidden">
          <div className="w-8 h-8 shrink-0 rounded-lg bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center shadow-lg shadow-primary-500/20">
            <span className="text-white font-bold leading-none">S</span>
          </div>
          {!isCollapsed && <span className="text-white font-heading font-bold text-lg tracking-tight whitespace-nowrap">SPARK</span>}
        </div>
        <button 
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="hidden md:flex p-1 rounded-md text-zinc-400 hover:text-white hover:bg-white/5 transition-colors"
        >
          {isCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </button>
      </div>

      <div className="flex-1 overflow-y-auto py-6 px-3 space-y-1">
        {links.map((link) => (
          <NavLink
            key={link.path}
            to={link.path}
            end={link.path === "/admin" || link.path === "/member"}
            className={({ isActive }) => cn(
              "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group relative",
              isActive 
                ? "bg-primary-500/10 text-primary-400 font-medium" 
                : "text-zinc-400 hover:text-zinc-100 hover:bg-white/5"
            )}
            onClick={() => setIsMobileOpen(false)}
          >
            {({ isActive }) => (
              <>
                <link.icon size={20} className={cn("shrink-0", isActive && "text-primary-400")} />
                {!isCollapsed && <span className="whitespace-nowrap">{link.name}</span>}
                
                {/* Tooltip for collapsed mode */}
                {isCollapsed && (
                  <div className="absolute left-full ml-4 px-2 py-1 bg-zinc-800 text-xs text-white rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50">
                    {link.name}
                  </div>
                )}
              </>
            )}
          </NavLink>
        ))}
      </div>

      <div className="p-4 border-t border-white/5">
        <div className={cn("flex items-center", isCollapsed ? "justify-center" : "gap-3")}>
          <div className="w-10 h-10 shrink-0 rounded-full bg-gradient-to-tr from-accent-600 to-primary-600 flex items-center justify-center border border-white/10 text-white font-medium shadow-md">
            {user?.name?.charAt(0).toUpperCase() || "U"}
          </div>
          {!isCollapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">{user?.name}</p>
              <p className="text-xs text-zinc-500 truncate capitalize">{user?.role}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex bg-background text-zinc-100 selection:bg-primary-500/30">
      {/* Desktop Sidebar */}
      <motion.aside 
        initial={false}
        animate={{ width: isCollapsed ? "80px" : "260px" }}
        className="hidden md:block sticky top-0 h-screen shrink-0 z-40 transition-all duration-300 ease-in-out"
      >
        <SidebarContent />
      </motion.aside>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {isMobileOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden"
            />
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", bounce: 0, duration: 0.4 }}
              className="fixed inset-y-0 left-0 w-[260px] z-50 md:hidden bg-surface"
            >
              <SidebarContent />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Navbar */}
        <header className="h-16 sticky top-0 z-30 bg-background/80 backdrop-blur-xl border-b border-white/5 flex items-center justify-between px-4 sm:px-8">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsMobileOpen(true)}
              className="md:hidden p-2 -ml-2 text-zinc-400 hover:text-white rounded-lg hover:bg-white/5"
            >
              <Menu size={20} />
            </button>

            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-zinc-900 border border-white/10 rounded-full focus-within:border-primary-500/50 focus-within:ring-1 focus-within:ring-primary-500/50 transition-all w-64">
              <Search size={16} className="text-zinc-500" />
              <input 
                type="text" 
                placeholder="Search..." 
                className="bg-transparent border-none outline-none text-sm text-zinc-200 w-full placeholder:text-zinc-600"
              />
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-4">
            <button className="p-2 text-zinc-400 hover:text-white rounded-full hover:bg-white/5 transition-colors relative">
              <Bell size={20} />
              <span className="absolute top-1.5 right-2 w-2 h-2 bg-primary-500 rounded-full border-2 border-background"></span>
            </button>
            <div className="h-6 w-px bg-white/10 mx-1"></div>
            <button 
              onClick={handleLogout}
              className="flex items-center gap-2 text-sm font-medium text-zinc-400 hover:text-red-400 px-3 py-1.5 rounded-lg hover:bg-red-500/10 transition-colors"
            >
              <LogOut size={16} />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto p-4 sm:p-8">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.3 }}
            className="max-w-7xl mx-auto"
          >
            <Outlet />
          </motion.div>
        </main>
      </div>
    </div>
  );
}
