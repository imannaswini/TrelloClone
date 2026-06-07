import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, FolderKanban } from "lucide-react";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import api from "../../api/axios";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";

export default function AdminCreateProject() {
  const navigate = useNavigate();

  const [project, setProject] = useState({
    name: "",
    description: "",
    cover: "",
    status: "active",
  });

  const [loading, setLoading] = useState(false);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!project.name.trim()) {
      toast.error("Project name is required");
      return;
    }

    try {
      setLoading(true);

      await api.post("/projects", {
        name: project.name,
        status: project.status,
      });

      toast.success("Project Created Successfully 🚀");
      navigate("/admin/projects");
    } catch (err) {
      toast.error(err.response?.data?.message || "Creation failed");
      console.error("Create Project Error:", err);
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
          <FolderKanban className="text-primary-400" size={28} /> Create New Project
        </h1>
        <p className="text-zinc-400 mt-2">Initialize a new workspace board for your team.</p>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-panel p-8 rounded-2xl border border-white/5 relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary-600/5 blur-[80px] rounded-full pointer-events-none" />
        
        <form onSubmit={handleCreate} className="space-y-5 relative z-10">
          <Input
            label="Project Name"
            placeholder="e.g. Website Redesign"
            value={project.name}
            onChange={(e) => setProject({ ...project, name: e.target.value })}
            required
            autoFocus
          />

          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-2 ml-1">
              Description (Optional)
            </label>
            <textarea
              className="w-full bg-zinc-900/50 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all resize-none"
              rows="3"
              placeholder="What is this project about?"
              value={project.description}
              onChange={(e) => setProject({ ...project, description: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-2 ml-1">Status</label>
            <select
              className="w-full px-4 py-3 bg-zinc-900/50 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
              value={project.status}
              onChange={(e) => setProject({ ...project, status: e.target.value })}
            >
              <option value="active">Active</option>
              <option value="pending">Pending Approval</option>
            </select>
          </div>

          <div className="flex gap-3 pt-4 border-t border-white/5 mt-6">
            <Button 
              type="button" 
              variant="outline" 
              className="flex-1"
              onClick={() => navigate("/admin/projects")}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              className="flex-1 shadow-lg shadow-primary-500/20"
              isLoading={loading}
            >
              Create Project
            </Button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
