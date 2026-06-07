import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Users, UserPlus, UserMinus, Mail, ShieldAlert } from "lucide-react";
import api from "../../api/axios";
import { Button } from "../../components/ui/Button";
import { Badge } from "../../components/ui/Badge";
import { Skeleton } from "../../components/ui/Skeleton";
import { EmptyState } from "../../components/ui/EmptyState";

export default function ProjectMembers() {
  const { projectId } = useParams();
  const navigate = useNavigate();

  const [project, setProject] = useState(null);
  const [availableUsers, setAvailableUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState("");
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [removeLoading, setRemoveLoading] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [projectRes, usersRes] = await Promise.all([
        api.get(`/projects/${projectId}`),
        api.get("/users"),
      ]);

      setProject(projectRes.data);
      
      // Filter out users already in the project and pending users
      const currentMemberIds = projectRes.data.members.map(m => m._id);
      setAvailableUsers(
        usersRes.data.filter(u => u.status === "approved" && !currentMemberIds.includes(u._id))
      );
    } catch (err) {
      toast.error("Failed to load members");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const addMember = async () => {
    if (!selectedUser) return toast.error("Please select a user to invite");

    setActionLoading(true);
    try {
      await api.put(`/projects/${projectId}/members`, {
        userId: selectedUser,
      });

      toast.success("Member added to project 🚀");
      fetchData();
      setSelectedUser("");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to add member");
    } finally {
      setActionLoading(false);
    }
  };

  const removeMember = async (userId, e) => {
    e.stopPropagation();
    if (!window.confirm("Are you sure you want to remove this member from the project?")) return;

    setRemoveLoading(userId);
    try {
      await api.delete(`/projects/${projectId}/members/${userId}`);
      toast.success("Member removed from project");
      fetchData();
    } catch {
      toast.error("Failed to remove member");
    } finally {
      setRemoveLoading(null);
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto space-y-6 mt-4">
        <Skeleton className="h-10 w-48 mb-8" />
        <Skeleton className="h-32 w-full rounded-2xl" />
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-20 w-full rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="max-w-4xl mx-auto mt-12">
        <EmptyState 
          type="projects" 
          title="Project not found" 
          description="The project you are looking for does not exist or you don't have access to it." 
          actionText="Back to Projects" 
          onAction={() => navigate("/admin/projects")} 
        />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 mt-4">
      <div>
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center gap-1.5 text-sm text-zinc-400 hover:text-white transition-colors mb-4"
        >
          <ArrowLeft size={16} /> Back
        </button>
        <h1 className="text-3xl font-bold text-white tracking-tight flex items-center gap-2">
          <Users className="text-primary-400" size={28} /> Manage Team
        </h1>
        <p className="text-zinc-400 mt-2">Manage access and members for <span className="font-semibold text-white">{project.name}</span></p>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-panel p-6 rounded-2xl border border-white/5 flex flex-col sm:flex-row gap-4 items-end sm:items-center relative overflow-hidden"
      >
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary-500 to-transparent opacity-50" />
        <div className="flex-1 w-full relative z-10">
          <label className="block text-sm font-medium text-zinc-300 mb-2 ml-1">Invite New Member</label>
          <select
            value={selectedUser}
            onChange={(e) => setSelectedUser(e.target.value)}
            className="w-full px-4 py-2.5 bg-zinc-900 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
          >
            <option value="" disabled>Select a user to invite...</option>
            {availableUsers.map((u) => (
              <option key={u._id} value={u._id}>
                {u.name} ({u.email})
              </option>
            ))}
          </select>
        </div>
        <Button 
          onClick={addMember} 
          isLoading={actionLoading}
          disabled={!selectedUser}
          className="w-full sm:w-auto shrink-0 flex items-center justify-center gap-2 relative z-10"
        >
          <UserPlus size={18} /> Invite to Project
        </Button>
      </motion.div>

      <div>
        <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          Current Members <Badge variant="secondary" className="px-2 rounded-full">{project.members?.length || 0}</Badge>
        </h2>
        
        {project.members?.length === 0 ? (
          <EmptyState 
            type="users"
            title="No team members yet"
            description="Invite users to collaborate on this project."
          />
        ) : (
          <div className="grid gap-3">
            <AnimatePresence>
              {project.members.map((m) => (
                <motion.div
                  key={m._id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="glass p-4 rounded-xl border border-white/5 hover:border-white/10 flex flex-col sm:flex-row gap-4 sm:items-center justify-between transition-all group"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 font-bold bg-primary-500/20 text-primary-400 border border-primary-500/10">
                      {m.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-semibold text-white">{m.name}</p>
                        {m.role === "admin" && (
                          <Badge variant="accent" className="text-[10px] uppercase h-auto py-0.5 px-1.5"><ShieldAlert size={10} className="mr-1 inline" /> Admin</Badge>
                        )}
                      </div>
                      <p className="text-sm text-zinc-400 flex items-center gap-1.5 mt-0.5">
                        <Mail size={12} /> {m.email}
                      </p>
                    </div>
                  </div>

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => removeMember(m._id, e)}
                    isLoading={removeLoading === m._id}
                    disabled={removeLoading !== null}
                    className="w-full sm:w-auto text-zinc-500 hover:text-red-400 hover:bg-red-500/10 flex items-center justify-center gap-1.5 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-all"
                  >
                    <UserMinus size={16} /> <span className="sm:hidden">Remove Member</span>
                  </Button>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
}
