import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import { UserCheck, UserX, Mail, Clock } from "lucide-react";
import api from "../../api/axios";
import { Button } from "../../components/ui/Button";
import { Badge } from "../../components/ui/Badge";
import { Skeleton } from "../../components/ui/Skeleton";
import { EmptyState } from "../../components/ui/EmptyState";

export default function AdminPending() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);

  useEffect(() => {
    fetchPending();
  }, []);

  const fetchPending = async () => {
    try {
      const res = await api.get("/users/pending");
      setUsers(res.data);
    } catch (err) {
      toast.error("Failed to load pending users");
    } finally {
      setLoading(false);
    }
  };

  const approveUser = async (id) => {
    setActionLoading(id);
    try {
      await api.put(`/users/${id}/approve`);
      toast.success("User approved! ✅");
      fetchPending();
    } catch {
      toast.error("Approval failed");
    } finally {
      setActionLoading(null);
    }
  };

  const rejectUser = async (id) => {
    setActionLoading(id);
    try {
      await api.delete(`/users/${id}/reject`);
      toast.success("User rejected ❌");
      fetchPending();
    } catch {
      toast.error("Rejection failed");
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Pending Approvals</h1>
          <p className="text-zinc-400 text-sm mt-1">Review and manage new user registrations</p>
        </div>
        <Badge variant="primary" className="text-sm px-3 py-1 shrink-0">
          {users.length} Pending
        </Badge>
      </div>

      {loading ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-24 w-full rounded-xl" />
          ))}
        </div>
      ) : users.length === 0 ? (
        <EmptyState 
          type="pending"
          title="All caught up!"
          description="There are no pending user registrations awaiting approval at this time."
        />
      ) : (
        <div className="grid gap-4">
          <AnimatePresence>
            {users.map((u) => (
              <motion.div
                key={u._id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
                className="glass-panel p-5 rounded-xl border border-white/5 hover:border-white/10 flex flex-col md:flex-row gap-6 md:items-center justify-between transition-all"
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full flex items-center justify-center shrink-0 font-bold text-lg bg-primary-500/20 text-primary-400">
                    {u.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-white text-lg">{u.name}</h3>
                      {u.role === "admin" && (
                        <Badge variant="warning" className="text-[10px] uppercase">Admin Request</Badge>
                      )}
                    </div>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mt-1 text-sm text-zinc-400">
                      <span className="flex items-center gap-1.5"><Mail size={14} /> {u.email}</span>
                      <span className="hidden sm:inline text-zinc-600">•</span>
                      <span className="flex items-center gap-1.5"><Clock size={14} /> Joined {new Date(u.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2 md:justify-end shrink-0 w-full sm:w-auto mt-2 sm:mt-0">
                  <Button 
                    variant="danger" 
                    size="sm"
                    onClick={() => rejectUser(u._id)}
                    isLoading={actionLoading === u._id}
                    disabled={actionLoading !== null}
                    className="flex-1 sm:flex-none flex items-center justify-center gap-1.5"
                  >
                    <UserX size={16} /> Reject
                  </Button>
                  
                  <Button 
                    variant="primary"
                    size="sm"
                    onClick={() => approveUser(u._id)}
                    isLoading={actionLoading === u._id}
                    disabled={actionLoading !== null}
                    className="flex-1 sm:flex-none flex items-center justify-center gap-1.5"
                  >
                    <UserCheck size={16} /> Approve
                  </Button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
