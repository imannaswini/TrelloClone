import { useEffect, useState } from "react";
import api from "../../api/axios";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { CheckSquare, Clock, AlertCircle, Play, ChevronRight, FolderKanban } from "lucide-react";
import useAuthStore from "../../context/AuthStore";
import { Button } from "../../components/ui/Button";
import { Badge } from "../../components/ui/Badge";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { EmptyState } from "../../components/ui/EmptyState";

export default function MemberDashboard() {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  
  const [stats, setStats] = useState({
    assigned: 0,
    inProgress: 0,
    completed: 0,
  });

  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

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

  const statCards = [
    { title: "Assigned Tasks", value: stats.assigned, icon: CheckSquare, color: "from-blue-500 to-indigo-500", glow: "shadow-indigo-500/20" },
    { title: "In Progress", value: stats.inProgress, icon: Play, color: "from-amber-500 to-orange-500", glow: "shadow-orange-500/20" },
    { title: "Completed", value: stats.completed, icon: CheckSquare, color: "from-emerald-500 to-teal-500", glow: "shadow-emerald-500/20" },
  ];

  const pieData = [
    { name: 'To Do', value: Math.max(0, stats.assigned - stats.inProgress - stats.completed), color: '#3b82f6' },
    { name: 'In Progress', value: stats.inProgress, color: '#f59e0b' },
    { name: 'Completed', value: stats.completed, color: '#10b981' },
  ];

  const getStatusBadge = (status) => {
    switch (status) {
      case "todo": return <Badge variant="secondary">To Do</Badge>;
      case "progress": return <Badge variant="warning">In Progress</Badge>;
      case "completed": return <Badge variant="success">Completed</Badge>;
      default: return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-8 glass-panel rounded-2xl relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-6"
      >
        <div className="absolute -top-24 -left-24 w-64 h-64 bg-accent-500/20 blur-[100px] rounded-full mix-blend-screen" />
        <div className="relative z-10">
          <h1 className="text-3xl font-heading font-bold text-white mb-2">Hello, {user?.name?.split(' ')[0]}</h1>
          <p className="text-zinc-400">Ready to crush your goals today? Here's an overview of your work.</p>
        </div>
        <Button onClick={() => navigate("/member/tasks")} className="relative z-10 shrink-0 shadow-lg shadow-primary-500/20">
          View My Tasks
        </Button>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {statCards.map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className={`glass p-6 rounded-2xl border-t-4 border-t-transparent hover:border-t-primary-500 transition-all duration-300 relative group overflow-hidden`}
          >
            <div className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-0 group-hover:opacity-5 transition-opacity duration-500`} />
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-xl bg-gradient-to-br ${stat.color} shadow-lg ${stat.glow}`}>
                <stat.icon className="text-white" size={24} />
              </div>
            </div>
            <h3 className="text-zinc-400 text-sm font-medium">{stat.title}</h3>
            <div className="text-3xl font-bold text-white mt-1">
              {loading ? <div className="h-9 w-16 bg-zinc-800 animate-pulse rounded mt-1" /> : stat.value}
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Progress Chart */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="glass-panel p-6 rounded-2xl border border-white/5 flex flex-col"
        >
          <h2 className="text-lg font-semibold text-white mb-6">Task Progress</h2>
          <div className="flex-1 flex items-center justify-center min-h-[250px]">
            {stats.assigned === 0 ? (
              <div className="text-center text-zinc-500">
                <AlertCircle className="mx-auto mb-2 opacity-50" size={32} />
                <p>No tasks assigned yet</p>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={pieData.filter(d => d.value > 0)}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                    stroke="none"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#18181b', borderColor: '#27272a', borderRadius: '8px' }}
                    itemStyle={{ color: '#fff' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
        </motion.div>

        {/* Assigned Tasks */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
          className="lg:col-span-2 glass-panel p-6 rounded-2xl border border-white/5"
        >
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-semibold text-white">Recent Tasks</h2>
            <button
              onClick={() => navigate("/member/tasks")}
              className="text-sm text-primary-400 hover:text-primary-300 font-medium flex items-center gap-1 transition-colors"
            >
              View All <ChevronRight size={16} />
            </button>
          </div>

          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-16 bg-zinc-800/50 animate-pulse rounded-xl border border-white/5" />
              ))}
            </div>
          ) : tasks.length === 0 ? (
            <EmptyState 
              type="tasks"
              title="You're all caught up!"
              description="You have no pending tasks assigned to you right now."
            />
          ) : (
            <div className="space-y-3">
              {tasks.slice(0, 5).map((task) => (
                <div
                  key={task._id}
                  className="bg-zinc-900/50 hover:bg-zinc-800/50 border border-white/5 rounded-xl p-4 flex items-center justify-between transition-colors cursor-pointer group"
                  onClick={() => navigate(`/projects/${task.project?._id}`)}
                >
                  <div className="flex items-start gap-3">
                    <div className="mt-1">
                      {getStatusBadge(task.status)}
                    </div>
                    <div>
                      <h3 className="font-medium text-white group-hover:text-primary-300 transition-colors">{task.title}</h3>
                      <p className="text-xs text-zinc-500 mt-1 flex items-center gap-1">
                        <FolderKanban size={12} /> {task.project?.name || "Unknown Project"}
                      </p>
                    </div>
                  </div>
                  <ChevronRight size={18} className="text-zinc-600 group-hover:text-white transition-colors" />
                </div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
