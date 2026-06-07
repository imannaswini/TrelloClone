import { useEffect, useState } from "react";
import api from "../../api/axios";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import { CheckSquare, FolderKanban, Search, Filter } from "lucide-react";
import { Badge } from "../../components/ui/Badge";
import { Skeleton } from "../../components/ui/Skeleton";
import { EmptyState } from "../../components/ui/EmptyState";

export default function MemberTasks() {
  const [tasks, setTasks] = useState([]);
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingTaskId, setUpdatingTaskId] = useState(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    fetchTasks();
  }, []);

  useEffect(() => {
    let result = tasks;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(t => t.title.toLowerCase().includes(q));
    }
    if (statusFilter !== "all") {
      result = result.filter(t => t.status === statusFilter);
    }
    setFilteredTasks(result);
  }, [searchQuery, statusFilter, tasks]);

  const fetchTasks = async () => {
    try {
      const res = await api.get("/member/tasks");
      setTasks(res.data);
    } catch (err) {
      toast.error("Failed to load tasks");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (taskId, newStatus) => {
    try {
      setUpdatingTaskId(taskId);
      await api.put(`/tasks/${taskId}`, {
        status: newStatus,
      });

      toast.success("Task updated ✅");
      fetchTasks();
    } catch (err) {
      toast.error("Failed to update task");
      console.error(err);
    } finally {
      setUpdatingTaskId(null);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "todo": return <Badge variant="secondary">To Do</Badge>;
      case "progress": return <Badge variant="warning">In Progress</Badge>;
      case "completed": return <Badge variant="success">Completed</Badge>;
      default: return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            <CheckSquare className="text-primary-400" /> My Tasks
          </h1>
          <p className="text-zinc-400 text-sm mt-1">Manage and update the status of tasks assigned to you.</p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
          <input 
            type="text" 
            placeholder="Search my tasks..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-zinc-900 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm text-zinc-200 focus:outline-none focus:border-primary-500 transition-colors"
          />
        </div>
        <div className="relative min-w-[160px]">
          <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={16} />
          <select 
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full bg-zinc-900 border border-white/10 rounded-xl pl-9 pr-8 py-2.5 text-sm text-zinc-200 focus:outline-none focus:border-primary-500 transition-colors appearance-none"
          >
            <option value="all">All Statuses</option>
            <option value="todo">To Do</option>
            <option value="progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} className="h-40 w-full rounded-2xl" />
          ))}
        </div>
      ) : filteredTasks.length === 0 ? (
        <EmptyState 
          type="tasks"
          title={searchQuery || statusFilter !== "all" ? "No matching tasks" : "You're all caught up!"}
          description={searchQuery || statusFilter !== "all" 
            ? "Try adjusting your search or filters." 
            : "You have no tasks assigned to you right now. Relax 😌"}
          actionText={searchQuery || statusFilter !== "all" ? "Clear Filters" : null}
          onAction={searchQuery || statusFilter !== "all" ? () => { setSearchQuery(""); setStatusFilter("all"); } : null}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {filteredTasks.map((task) => (
              <motion.div
                key={task._id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="glass-panel p-5 rounded-2xl border border-white/5 hover:border-white/10 transition-all group flex flex-col h-full relative overflow-hidden"
              >
                {task.status === "completed" && (
                  <div className="absolute inset-0 bg-green-500/5 pointer-events-none" />
                )}
                <div className="flex justify-between items-start gap-4 mb-4 relative z-10">
                  <h2 className="font-semibold text-lg text-white group-hover:text-primary-300 transition-colors line-clamp-2">
                    {task.title}
                  </h2>
                  <div className="shrink-0 mt-1">
                    {getStatusBadge(task.status)}
                  </div>
                </div>

                <div className="flex items-center gap-2 text-sm text-zinc-400 mb-6 relative z-10">
                  <FolderKanban size={14} className="text-zinc-500" />
                  <span className="truncate">{task.project?.name || "Unknown Project"}</span>
                </div>

                <div className="mt-auto pt-4 border-t border-white/5 relative z-10">
                  <label className="block text-xs font-medium text-zinc-500 mb-2 uppercase tracking-wider">
                    Update Status
                  </label>
                  <select
                    value={task.status}
                    disabled={updatingTaskId === task._id}
                    onChange={(e) => updateStatus(task._id, e.target.value)}
                    className="w-full bg-zinc-900/50 border border-white/10 rounded-xl px-3 py-2 text-sm text-zinc-200 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all disabled:opacity-50"
                  >
                    <option value="todo">To Do</option>
                    <option value="progress">In Progress</option>
                    <option value="completed">Completed</option>
                  </select>
                  {updatingTaskId === task._id && (
                    <p className="text-xs text-primary-400 mt-2 animate-pulse">
                      Saving changes...
                    </p>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
