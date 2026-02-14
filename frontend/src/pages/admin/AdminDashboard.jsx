import { useEffect, useState } from "react";
import { FaUsers, FaProjectDiagram, FaUserClock, FaClock } from "react-icons/fa";
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
  });

  const [loading, setLoading] = useState(true);

  const sidebarLinks = [
    { label: "Dashboard", to: "/admin" },
    { label: "Users", to: "/admin/users" },
    { label: "Projects", to: "/admin/projects" },
    { label: "Pending", to: "/admin/pending" },
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
      color: "from-blue-500 to-cyan-400",
      border: "border-blue-500",
      glow: "shadow-blue-500/40",
      click: () => navigate("/admin/users"),
    },
    {
      title: "Active Projects",
      count: loading ? "..." : stats.totalProjects,
      icon: <FaProjectDiagram />,
      color: "from-green-500 to-emerald-400",
      border: "border-green-500",
      glow: "shadow-green-500/40",
      click: () => navigate("/admin/projects"),
    },
    {
      title: "Pending Approvals",
      count: loading ? "..." : stats.pendingApprovals,
      icon: <FaUserClock />,
      color: "from-yellow-400 to-amber-300",
      border: "border-yellow-500",
      glow: "shadow-yellow-400/40",
      click: () => navigate("/admin/pending"),
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
              whileHover={{ scale: 1.06, rotate: 0.5 }}
              whileTap={{ scale: 0.97 }}
              className={`
                cursor-pointer relative p-7 rounded-2xl
                bg-[#0F172A]/70 backdrop-blur-xl
                border ${card.border}
                hover:shadow-xl hover:${card.glow}
                transition duration-300
              `}
            >
              <div
                className={`
                  absolute top-0 right-0 w-24 h-24 opacity-10 blur-2xl
                  bg-gradient-to-r ${card.color} rounded-full
                `}
              />

              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">{card.title}</h2>
                <div className="text-3xl">{card.icon}</div>
              </div>

              <p className="text-5xl font-extrabold mt-3 bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
                {card.count}
              </p>

              <p className="text-gray-400 text-sm mt-1">
                Click to view details
              </p>
            </motion.div>
          ))}
        </motion.div>

        {/* Recent Activity */}
        <motion.div
          className="mt-12 p-7 rounded-2xl border border-gray-700 bg-[#0F172A]/80 backdrop-blur-xl"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center gap-2">
            <FaClock className="text-blue-400 text-xl" />
            <h2 className="text-xl font-semibold">Recent Activity</h2>
          </div>

          <ul className="mt-4 text-gray-300 space-y-2 text-sm">
            <motion.li whileHover={{ x: 6 }}>
              • Manager created a new board
            </motion.li>
            <motion.li whileHover={{ x: 6 }}>
              • Admin approved 2 members
            </motion.li>
            <motion.li whileHover={{ x: 6 }}>
              • Project “SPARK System” updated
            </motion.li>
          </ul>
        </motion.div>
      </motion.div>
    </AppLayout>
  );
}
