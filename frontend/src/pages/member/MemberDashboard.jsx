import { useEffect, useState } from "react";
import api from "../../services/api";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import AppLayout from "../../components/layout/AppLayout";

export default function MemberDashboard() {
  const [stats, setStats] = useState({
    assigned: 0,
    inProgress: 0,
    completed: 0,
  });

  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  const sidebarLinks = [
    { label: "Dashboard", to: "/member" },
    { label: "My Tasks", to: "/member/tasks" },
  ];

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const [statsRes, tasksRes] = await Promise.all([
        api.get("/member/dashboard"),
        api.get("/member/tasks"),
      ]);

      setStats(statsRes.data);
      setTasks(tasksRes.data);
    } catch (err) {
      toast.error("Failed to load dashboard");
      console.error("Member Dashboard Error:", err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "todo":
        return "bg-slate-500";
      case "progress":
        return "bg-yellow-500";
      case "done":
        return "bg-green-500";
      default:
        return "bg-gray-500";
    }
  };

  return (
    <AppLayout sidebarLinks={sidebarLinks}>
      <motion.div
        className="min-h-screen bg-[#0B1120] text-white px-8 py-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        {/* Header */}
        <h1 className="text-3xl font-bold mb-2">Member Dashboard</h1>
        <p className="text-slate-400 mb-6">
          Track your tasks & progress 🚀
        </p>

        {/* ✅ Stats Cards */}
        <div className="grid md:grid-cols-3 gap-4 mb-8">
          <div className="bg-slate-900 p-5 rounded-xl border border-slate-800">
            <p className="text-slate-400 text-sm">Assigned Tasks</p>
            <h2 className="text-3xl font-bold text-blue-400">
              {loading ? "..." : stats.assigned}
            </h2>
          </div>

          
        </div>

        {/* ✅ Task Preview */}
        <div className="bg-slate-900 rounded-xl border border-slate-800 p-5">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Your Tasks</h2>

            <button
              onClick={() => navigate("/member/tasks")}
              className="text-sm text-blue-400 hover:underline"
            >
              View All →
            </button>
          </div>

          {tasks.length === 0 ? (
            <p className="text-slate-400 text-sm">
              No tasks assigned 🎉
            </p>
          ) : (
            <div className="space-y-3">
              {tasks.slice(0, 5).map((task) => (
                <div
                  key={task._id}
                  className="bg-slate-800 rounded-lg p-3 flex justify-between items-center"
                >
                  <div>
                    <p className="font-medium">{task.title}</p>
                    <p className="text-xs text-slate-400">
                      {task.project?.name}
                    </p>
                  </div>

                  <span
                    className={`text-xs px-2 py-1 rounded-full ${getStatusColor(
                      task.status
                    )}`}
                  >
                    {task.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </motion.div>
    </AppLayout>
  );
}
