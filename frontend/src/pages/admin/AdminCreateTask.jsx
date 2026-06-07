import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import { ArrowLeft, CheckSquare } from "lucide-react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";

export default function AdminCreateTask() {
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [members, setMembers] = useState([]);
  const [title, setTitle] = useState("");
  const [projectId, setProjectId] = useState("");
  const [assignedTo, setAssignedTo] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const res = await api.get("/projects");
      setProjects(res.data);
    } catch {
      toast.error("Failed to load projects");
    }
  };

  const fetchMembers = async (pid) => {
    if (!pid) {
      setMembers([]);
      setAssignedTo("");
      return;
    }
    try {
      const res = await api.get(`/projects/${pid}`);
      setMembers(res.data.members || []);
    } catch {
      toast.error("Failed to load members");
    }
  };

  const createTask = async (e) => {
    e.preventDefault();
    if (!title || !projectId) {
      return toast.error("Title & Project are required");
    }

    try {
      setLoading(true);
      await api.post("/tasks", {
        title,
        projectId,
        assignedTo: assignedTo || null,
      });

      toast.success("Task created 🚀");
      navigate("/admin/tasks");
    } catch (err) {
      toast.error(err.response?.data?.message || "Task creation failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8 mt-4">
      <div>
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center gap-1.5 text-sm text-zinc-400 hover:text-white transition-colors mb-4"
        >
          <ArrowLeft size={16} /> Back
        </button>
        <h1 className="text-3xl font-bold text-white tracking-tight flex items-center gap-2">
          <CheckSquare className="text-primary-400" size={28} /> Create New Task
        </h1>
        <p className="text-zinc-400 mt-2">Add a new actionable item to an existing project.</p>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-panel p-8 rounded-2xl border border-white/5 relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary-600/5 blur-[80px] rounded-full pointer-events-none" />
        
        <form onSubmit={createTask} className="space-y-5 relative z-10">
          <Input
            label="Task Title"
            placeholder="e.g. Update user authentication flow"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            autoFocus
          />

          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-2 ml-1">
              Select Project
            </label>
            <select
              value={projectId}
              onChange={(e) => {
                setProjectId(e.target.value);
                fetchMembers(e.target.value);
              }}
              required
              className="w-full px-4 py-3 bg-zinc-900/50 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
            >
              <option value="" disabled>Choose a project...</option>
              {projects.map((p) => (
                <option key={p._id} value={p._id}>{p.name}</option>
              ))}
            </select>
          </div>

          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: projectId ? 1 : 0.5, height: 'auto' }}
            className="overflow-hidden"
          >
            <label className="block text-sm font-medium text-zinc-300 mb-2 ml-1">
              Assign Member (Optional)
            </label>
            <select
              value={assignedTo}
              onChange={(e) => setAssignedTo(e.target.value)}
              disabled={!projectId}
              className="w-full px-4 py-3 bg-zinc-900/50 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <option value="">Unassigned</option>
              {members.map((m) => (
                <option key={m._id} value={m._id}>{m.name}</option>
              ))}
            </select>
            {!projectId && (
              <p className="text-xs text-zinc-500 mt-2 ml-1">Select a project first to see available members.</p>
            )}
          </motion.div>

          <div className="flex gap-3 pt-4 border-t border-white/5 mt-6">
            <Button 
              type="button" 
              variant="outline" 
              className="flex-1"
              onClick={() => navigate("/admin/tasks")}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              className="flex-1 shadow-lg shadow-primary-500/20"
              isLoading={loading}
              disabled={!title || !projectId}
            >
              Create Task
            </Button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
