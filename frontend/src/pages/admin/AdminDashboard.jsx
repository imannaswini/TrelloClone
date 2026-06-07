import { useEffect, useState } from "react";
import { Users, FolderKanban, Clock, CheckSquare, Plus, Activity } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import api from "../../api/axios";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import useAuthStore from "../../context/AuthStore";
import { Button } from "../../components/ui/Button";

const mockActivity = [
  { id: 1, text: "New user registered: John Doe", time: "2 mins ago" },
  { id: 2, text: "Project 'Alpha' created by Sarah", time: "1 hour ago" },
  { id: 3, text: "Task 'Fix UI bugs' marked completed", time: "3 hours ago" },
];

const chartData = [
  { name: 'Mon', tasks: 12, projects: 2 },
  { name: 'Tue', tasks: 19, projects: 3 },
  { name: 'Wed', tasks: 15, projects: 2 },
  { name: 'Thu', tasks: 22, projects: 4 },
  { name: 'Fri', tasks: 30, projects: 5 },
  { name: 'Sat', tasks: 10, projects: 1 },
  { name: 'Sun', tasks: 5, projects: 0 },
];

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { user } = useAuthStore();

  const [stats, setStats] = useState({
    totalUsers: 0,
    totalProjects: 0,
    pendingApprovals: 0,
    totalTasks: 0,
  });

  const [loading, setLoading] = useState(true);

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

  const statCards = [
    { title: "Total Users", value: stats.totalUsers, icon: Users, color: "from-blue-500 to-indigo-500", glow: "shadow-indigo-500/20" },
    { title: "Active Projects", value: stats.totalProjects, icon: FolderKanban, color: "from-emerald-500 to-teal-500", glow: "shadow-emerald-500/20" },
    { title: "Pending Approvals", value: stats.pendingApprovals, icon: Clock, color: "from-amber-500 to-orange-500", glow: "shadow-orange-500/20" },
    { title: "Total Tasks", value: stats.totalTasks, icon: CheckSquare, color: "from-purple-500 to-fuchsia-500", glow: "shadow-fuchsia-500/20" },
  ];

  return (
    <div className="space-y-8">
      {/* Hero Welcome */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 glass-panel rounded-2xl relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary-600/10 blur-[100px] rounded-full mix-blend-screen" />
        <div>
          <h1 className="text-3xl font-heading font-bold text-white mb-2">Welcome back, {user?.name?.split(' ')[0] || 'Admin'}</h1>
          <p className="text-zinc-400">Here's what's happening in your workspace today.</p>
        </div>
        <div className="flex items-center gap-3 relative z-10">
          <Button onClick={() => navigate("/admin/create-project")} variant="outline" className="gap-2">
            <Plus size={16} /> New Project
          </Button>
          <Button onClick={() => navigate("/admin/create-task")} className="gap-2">
            <Plus size={16} /> New Task
          </Button>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
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
              <span className="text-sm font-medium text-green-400">+12%</span>
            </div>
            <h3 className="text-zinc-400 text-sm font-medium">{stat.title}</h3>
            <p className="text-3xl font-bold text-white mt-1">
              {loading ? (
                <div className="h-9 w-16 bg-zinc-800 animate-pulse rounded mt-1" />
              ) : (
                stat.value
              )}
            </p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Chart */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
          className="lg:col-span-2 glass-panel p-6 rounded-2xl border border-white/5"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-white">Task Completion</h2>
            <select className="bg-zinc-900 border border-white/10 rounded-lg px-3 py-1.5 text-sm text-zinc-300 focus:outline-none focus:border-primary-500">
              <option>Last 7 days</option>
              <option>This Month</option>
            </select>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorTasks" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
                <XAxis dataKey="name" stroke="#71717a" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#71717a" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#18181b', borderColor: '#27272a', borderRadius: '8px' }}
                  itemStyle={{ color: '#fff' }}
                />
                <Area type="monotone" dataKey="tasks" stroke="#8B5CF6" strokeWidth={3} fillOpacity={1} fill="url(#colorTasks)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Recent Activity */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5 }}
          className="glass-panel p-6 rounded-2xl border border-white/5"
        >
          <div className="flex items-center gap-2 mb-6">
            <Activity className="text-primary-400" size={20} />
            <h2 className="text-lg font-semibold text-white">Recent Activity</h2>
          </div>
          <div className="space-y-6">
            {mockActivity.map((activity, i) => (
              <div key={activity.id} className="relative pl-6 before:absolute before:left-[11px] before:top-2 before:bottom-[-24px] before:w-px before:bg-white/10 last:before:hidden">
                <div className="absolute left-0 top-1.5 w-[23px] h-[23px] rounded-full bg-surface border-2 border-primary-500 flex items-center justify-center">
                  <div className="w-2 h-2 rounded-full bg-primary-500" />
                </div>
                <p className="text-sm text-zinc-300 leading-snug">{activity.text}</p>
                <p className="text-xs text-zinc-500 mt-1">{activity.time}</p>
              </div>
            ))}
          </div>
          <Button variant="outline" className="w-full mt-6 text-xs">View All Activity</Button>
        </motion.div>
      </div>
    </div>
  );
}
