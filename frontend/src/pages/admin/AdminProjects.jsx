import { motion, AnimatePresence } from "framer-motion";
import { FolderKanban, Users, Clock, Trash2, Plus, Search, Filter, ArrowRight } from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../../api/axios";
import { Button } from "../../components/ui/Button";
import { Badge } from "../../components/ui/Badge";
import { Skeleton } from "../../components/ui/Skeleton";
import { EmptyState } from "../../components/ui/EmptyState";

export default function AdminProjects() {
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    fetchProjects();
  }, []);

  useEffect(() => {
    let result = projects;
    
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(p => p.name.toLowerCase().includes(q));
    }
    
    if (statusFilter !== "all") {
      result = result.filter(p => p.status === statusFilter);
    }
    
    setFilteredProjects(result);
  }, [searchQuery, statusFilter, projects]);

  const fetchProjects = async () => {
    try {
      const res = await api.get("/projects");
      setProjects(res.data);
    } catch (err) {
      toast.error("Failed to load projects");
      console.error("Projects Error:", err);
    } finally {
      setLoading(false);
    }
  };

  const deleteProject = async (id, e) => {
    e.stopPropagation();
    if (!window.confirm("Are you sure you want to delete this project? This action cannot be undone.")) return;

    try {
      await api.delete(`/projects/${id}`);
      toast.success("Project deleted successfully");
      fetchProjects();
    } catch (err) {
      toast.error("Failed to delete project");
      console.error(err);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "active": return <Badge variant="success">Active</Badge>;
      case "completed": return <Badge variant="primary">Completed</Badge>;
      case "archived": return <Badge variant="secondary">Archived</Badge>;
      default: return <Badge variant="warning">{status}</Badge>;
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            <FolderKanban className="text-primary-400" /> Active Projects
          </h1>
          <p className="text-zinc-400 text-sm mt-1">Monitor, manage and review all organizational projects.</p>
        </div>
        <Button onClick={() => navigate("/admin/create-project")} className="gap-2 shrink-0 shadow-lg shadow-primary-500/20">
          <Plus size={16} /> Create Project
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
          <input 
            type="text" 
            placeholder="Search projects..." 
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
            <option value="active">Active</option>
            <option value="completed">Completed</option>
            <option value="archived">Archived</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} className="h-48 w-full rounded-2xl" />
          ))}
        </div>
      ) : filteredProjects.length === 0 ? (
        <EmptyState 
          type="projects"
          title={searchQuery || statusFilter !== "all" ? "No matching projects" : "No projects found"}
          description={searchQuery || statusFilter !== "all" 
            ? "Try adjusting your search or filters to find what you're looking for." 
            : "Get started by creating your first project."}
          actionText={searchQuery || statusFilter !== "all" ? "Clear Filters" : "Create Project"}
          onAction={searchQuery || statusFilter !== "all" ? () => { setSearchQuery(""); setStatusFilter("all"); } : () => navigate("/admin/create-project")}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {filteredProjects.map((project) => (
              <motion.div
                key={project._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                whileHover={{ y: -4 }}
                onClick={() => navigate(`/projects/${project._id}`)}
                className="glass-panel rounded-2xl p-6 border border-white/5 hover:border-primary-500/50 hover:shadow-xl hover:shadow-primary-500/10 transition-all duration-300 cursor-pointer group flex flex-col h-full relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary-500/5 blur-[60px] rounded-full group-hover:bg-primary-500/10 transition-colors" />
                
                <div className="flex justify-between items-start mb-4 relative z-10">
                  <h2 className="text-xl font-semibold text-white group-hover:text-primary-300 transition-colors line-clamp-1 pr-2">
                    {project.name}
                  </h2>
                  <button 
                    onClick={(e) => deleteProject(project._id, e)}
                    className="p-1.5 text-zinc-500 hover:text-red-400 hover:bg-red-500/10 rounded-md transition-colors opacity-0 group-hover:opacity-100"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>

                <div className="mb-6 relative z-10">
                  {getStatusBadge(project.status || "active")}
                </div>

                <div className="mt-auto space-y-3 pt-4 border-t border-white/5 relative z-10">
                  <div className="flex items-center justify-between text-sm text-zinc-400">
                    <span className="flex items-center gap-1.5"><Users size={14} className="text-zinc-500" /> {project.members?.length || 0} Members</span>
                    <span className="flex items-center gap-1.5"><Clock size={14} className="text-zinc-500" /> {new Date(project.updatedAt).toLocaleDateString()}</span>
                  </div>

                  <div className="flex gap-2 pt-2">
                    <Button 
                      variant="outline" 
                      className="flex-1 text-xs py-1.5 h-auto bg-zinc-900/50"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/projects/${project._id}/members`);
                      }}
                    >
                      Manage Team
                    </Button>
                    <Button 
                      className="flex-1 text-xs py-1.5 h-auto gap-1"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/projects/${project._id}`);
                      }}
                    >
                      View Board <ArrowRight size={14} />
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
