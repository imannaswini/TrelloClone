import { useEffect, useState } from "react";
import { FaUsers, FaProjectDiagram, FaUserClock, FaClock, FaAd, FaHistory } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import api from "../../services/api";
import AppLayout from "../../components/layout/AppLayout";

export default function AdminDashboard() {
  const navigate = useNavigate();

  const [stats, setStats] = useState({
    totalUsers: 0,
    totalProjects: 0,
    pendingApprovals: 0,
    totalTasks: 0, // ✅ NEW
  });

  const [loading, setLoading] = useState(true);

  const sidebarLinks = [
    { label: "Dashboard", to: "/admin" },
    { label: "Users", to: "/admin/users" },
    { label: "Projects", to: "/admin/projects" },
    { label: "Pending", to: "/admin/pending" },
    { label: "Create Task", to: "/admin/create-task" },
    { label: "Tasks", to: "/admin/tasks" },
  ];

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await api.get("/admin/dashboard");
      setStats(res.data);
    } catch (err) {
      toast.error("Failed to load dashboard");
      console.error("Dashboard Error:", err);
    } finally {
      setLoading(false);
    }
  };

  const cards = [
    {
      title: "Total Users",
      count: loading ? "..." : stats.totalUsers,
      icon: <FaUsers />,
      border: "border-blue-500",
      glow: "shadow-blue-500/40",
      click: () => navigate("/admin/users"),
    },
    {
      title: "Active Projects",
      count: loading ? "..." : stats.totalProjects,
      icon: <FaProjectDiagram />,
      border: "border-green-500",
      glow: "shadow-green-500/40",
      click: () => navigate("/admin/projects"),
    },
    {
      title: "Pending Approvals",
      count: loading ? "..." : stats.pendingApprovals,
      icon: <FaUserClock />,
      border: "border-yellow-500",
      glow: "shadow-yellow-400/40",
      click: () => navigate("/admin/pending"),
    },
    {
      title: "Create Tasks",
      count: "+",
      icon: <FaClock />,
      border: "border-purple-500",
      glow: "shadow-purple-500/40",
      click: () => navigate("/admin/create-task"),
    },
    {
      title: "Total Tasks",
      count: loading ? "..." : stats.totalTasks,
      icon: <FaHistory />,
      border: "border-pink-500",
      glow: "shadow-pink-500/40",
      click: () => navigate("/admin/tasks"),
    },
  ];

  return (
    <AppLayout sidebarLinks={sidebarLinks}>
      <motion.div
        className="min-h-screen bg-[#0B1120] text-white px-8 py-10 relative overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        {/* Floating Glows */}
        <div className="absolute -top-20 -left-20 w-96 h-96 bg-blue-700 opacity-20 blur-[150px]" />
        <div className="absolute -bottom-20 -right-20 w-96 h-96 bg-purple-700 opacity-20 blur-[150px]" />

        {/* Header */}
        <motion.div
          initial={{ y: -40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.7 }}
        >
          <h1 className="text-4xl font-extrabold tracking-wide bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            Admin Dashboard
          </h1>
          <p className="text-gray-400 mt-2">
            Control. Monitor. Manage — with elegance.
          </p>
        </motion.div>

        {/* Cards */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-10"
          initial="hidden"
          animate="visible"
          transition={{ staggerChildren: 0.2 }}
        >
          {cards.map((card, i) => (
            <motion.div
              key={i}
              onClick={card.click}
              variants={{
                hidden: { opacity: 0, scale: 0.8, y: 30 },
                visible: { opacity: 1, scale: 1, y: 0 },
              }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
              className={`
                cursor-pointer relative p-7 rounded-2xl
                bg-[#0F172A]/70 backdrop-blur-xl
                border ${card.border}
                hover:shadow-xl hover:${card.glow}
                transition duration-300
              `}
            >
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">{card.title}</h2>
                <div className="text-3xl">{card.icon}</div>
              </div>

              <p className="text-5xl font-extrabold mt-3 text-white">
                {card.count}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </AppLayout>
  );
}
