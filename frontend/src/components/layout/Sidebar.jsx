import { NavLink, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { cn } from "../../lib/utils";
import { LayoutDashboard, Users, FolderKanban, CheckSquare, Settings } from "lucide-react";
import useAuthStore from "../../context/AuthStore";

export default function Sidebar({ isCollapsed }) {
  const { user } = useAuthStore();
  const location = useLocation();

  const adminLinks = [
    { name: "Dashboard", path: "/admin", icon: LayoutDashboard },
    { name: "Projects", path: "/admin/projects", icon: FolderKanban },
    { name: "Users", path: "/admin/users", icon: Users },
    { name: "Tasks", path: "/admin/tasks", icon: CheckSquare },
  ];

  const memberLinks = [
    { name: "Dashboard", path: "/member", icon: LayoutDashboard },
    { name: "My Tasks", path: "/member/tasks", icon: CheckSquare },
  ];

  const links = user?.role === "admin" ? adminLinks : memberLinks;

  return (
    <motion.aside
      animate={{ width: isCollapsed ? 80 : 260 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className="h-[calc(100vh-64px)] shrink-0 border-r border-white/5 bg-zinc-950/50 backdrop-blur-xl flex flex-col hidden md:flex sticky top-16"
    >
      <div className="flex-1 py-6 flex flex-col gap-2 px-3 overflow-y-auto">
        {links.map((link) => {
          const isActive = location.pathname === link.path || (link.path !== "/admin" && link.path !== "/member" && location.pathname.startsWith(link.path));
          
          return (
            <NavLink
              key={link.path}
              to={link.path}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group relative",
                  isActive
                    ? "bg-primary-500/10 text-primary-400"
                    : "text-zinc-400 hover:bg-white/5 hover:text-zinc-200"
                )
              }
            >
              <link.icon
                size={20}
                className={cn(
                  "shrink-0 transition-colors",
                  isActive ? "text-primary-400" : "text-zinc-500 group-hover:text-zinc-300"
                )}
              />
              {!isCollapsed && (
                <span className="font-medium whitespace-nowrap">{link.name}</span>
              )}

              {/* Active Indicator Line */}
              {isActive && (
                <motion.div
                  layoutId="active-nav"
                  className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-primary-500 rounded-r-full"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.2 }}
                />
              )}
            </NavLink>
          );
        })}
      </div>

      <div className="p-3 border-t border-white/5">
        <button className="flex items-center gap-3 px-3 py-2.5 w-full rounded-lg text-zinc-400 hover:bg-white/5 hover:text-zinc-200 transition-colors group">
          <Settings size={20} className="shrink-0 text-zinc-500 group-hover:text-zinc-300" />
          {!isCollapsed && <span className="font-medium whitespace-nowrap">Settings</span>}
        </button>
      </div>
    </motion.aside>
  );
}
