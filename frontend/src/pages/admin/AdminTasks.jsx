import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckSquare, Trash2, Edit2, Search, Filter, Plus, Clock } from "lucide-react";
import api from "../../api/axios";
import toast from "react-hot-toast";
import { Button } from "../../components/ui/Button";
import { Badge } from "../../components/ui/Badge";
import { Skeleton } from "../../components/ui/Skeleton";
import { EmptyState } from "../../components/ui/EmptyState";
import { Modal } from "../../components/ui/Modal";
import { Input } from "../../components/ui/Input";
import { useNavigate } from "react-router-dom";

export default function AdminTasks() {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]);
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const [editingTask, setEditingTask] = useState(null);
  const [updatedTitle, setUpdatedTitle] = useState("");
  const [updatedAssignedTo, setUpdatedAssignedTo] = useState("");
  const [updatedStatus, setUpdatedStatus] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    fetchTasks();
    fetchUsers();
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
      const res = await api.get("/tasks");
      setTasks(res.data);
    } catch {
      toast.error("Failed to load tasks");
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await api.get("/users");
      setUsers(res.data);
    } catch {
      console.error("Failed to load users");
    }
  };

  const handleEdit = (task) => {
    setEditingTask(task);
    setUpdatedTitle(task.title);
    setUpdatedAssignedTo(task.assignedTo?._id || "");
    setUpdatedStatus(task.status);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setIsUpdating(true);
    try {
      await api.put(`/tasks/${editingTask._id}`, {
        title: updatedTitle,
        assignedTo: updatedAssignedTo,
        status: updatedStatus,
      });

      toast.success("Task updated successfully ✨");
      setEditingTask(null);
      fetchTasks();
    } catch {
      toast.error("Update failed");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDelete = async (id, e) => {
    e.stopPropagation();
    if (!window.confirm("Are you sure you want to delete this task?")) return;

    try {
      await api.delete(`/tasks/${id}`);
      toast.success("Task deleted 🗑️");
      fetchTasks();
    } catch {
      toast.error("Delete failed");
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
            <CheckSquare className="text-primary-400" /> All Tasks
          </h1>
          <p className="text-zinc-400 text-sm mt-1">Manage and track organizational tasks globally.</p>
        </div>
        <Button onClick={() => navigate("/admin/create-task")} className="gap-2 shrink-0 shadow-lg shadow-primary-500/20">
          <Plus size={16} /> Create Task
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
          <input 
            type="text" 
            placeholder="Search tasks..." 
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
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} className="h-20 w-full rounded-2xl" />
          ))}
        </div>
      ) : filteredTasks.length === 0 ? (
        <EmptyState 
          type="tasks"
          title={searchQuery || statusFilter !== "all" ? "No matching tasks" : "No tasks found"}
          description={searchQuery || statusFilter !== "all" 
            ? "Try adjusting your search or filters to find what you're looking for." 
            : "Get started by creating a new task."}
          actionText={searchQuery || statusFilter !== "all" ? "Clear Filters" : "Create Task"}
          onAction={searchQuery || statusFilter !== "all" ? () => { setSearchQuery(""); setStatusFilter("all"); } : () => navigate("/admin/create-task")}
        />
      ) : (
        <div className="grid gap-4">
          <AnimatePresence>
            {filteredTasks.map((task) => (
              <motion.div
                key={task._id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="glass-panel p-5 rounded-xl border border-white/5 hover:border-white/10 flex flex-col md:flex-row gap-6 md:items-center justify-between transition-all group"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-semibold text-white text-lg truncate group-hover:text-primary-300 transition-colors">{task.title}</h3>
                    {getStatusBadge(task.status)}
                  </div>
                  <div className="flex flex-wrap items-center gap-4 text-sm text-zinc-400">
                    <span className="flex items-center gap-1">
                      <div className="w-5 h-5 rounded-full bg-zinc-800 flex items-center justify-center text-[10px] text-white border border-white/10">
                        {task.assignedTo?.name ? task.assignedTo.name.charAt(0).toUpperCase() : "?"}
                      </div>
                      {task.assignedTo?.name || "Unassigned"}
                    </span>
                    <span className="hidden sm:inline text-zinc-600">•</span>
                    <span className="flex items-center gap-1">
                      <span className="text-zinc-500">Project:</span> {task.project?.name || "Unknown"}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto w-full sm:w-auto mt-2 sm:mt-0 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => handleEdit(task)}
                    className="flex-1 sm:flex-none text-zinc-400 hover:text-white"
                  >
                    <Edit2 size={16} />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={(e) => handleDelete(task._id, e)}
                    className="flex-1 sm:flex-none text-zinc-400 hover:text-red-400 hover:bg-red-500/10"
                  >
                    <Trash2 size={16} />
                  </Button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Edit Modal */}
      <Modal
        isOpen={!!editingTask}
        onClose={() => setEditingTask(null)}
        title="Edit Task"
      >
        <form onSubmit={handleUpdate} className="space-y-4">
          <Input
            label="Task Title"
            value={updatedTitle}
            onChange={(e) => setUpdatedTitle(e.target.value)}
            required
            placeholder="Enter task title"
          />
          
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-2 ml-1">Assigned Member</label>
            <select
              value={updatedAssignedTo}
              onChange={(e) => setUpdatedAssignedTo(e.target.value)}
              className="w-full px-4 py-2 bg-zinc-900 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
            >
              <option value="">Unassigned</option>
              {users.map((u) => (
                <option key={u._id} value={u._id}>{u.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-2 ml-1">Status</label>
            <select
              value={updatedStatus}
              onChange={(e) => setUpdatedStatus(e.target.value)}
              className="w-full px-4 py-2 bg-zinc-900 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
            >
              <option value="todo">To Do</option>
              <option value="progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="button" variant="outline" className="flex-1" onClick={() => setEditingTask(null)}>
              Cancel
            </Button>
            <Button type="submit" className="flex-1" isLoading={isUpdating}>
              Save Changes
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
