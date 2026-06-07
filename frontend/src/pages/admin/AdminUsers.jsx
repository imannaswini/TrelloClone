import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import { ShieldCheck, Mail, ShieldAlert, Search } from "lucide-react";
import api from "../../api/axios";
import useAuthStore from "../../context/AuthStore";
import { Button } from "../../components/ui/Button";
import { Badge } from "../../components/ui/Badge";
import { Skeleton } from "../../components/ui/Skeleton";
import { EmptyState } from "../../components/ui/EmptyState";
import { cn } from "../../lib/utils";

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const { user: currentUser } = useAuthStore();

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    const q = searchQuery.toLowerCase();
    setFilteredUsers(users.filter(u => 
      u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q)
    ));
  }, [searchQuery, users]);

  const fetchUsers = async () => {
    try {
      const res = await api.get("/users");
      setUsers(res.data.filter((u) => u.status === "approved"));
    } catch (err) {
      toast.error("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  const promoteToAdmin = async (id) => {
    setActionLoading(id);
    try {
      await api.put(`/users/${id}/promote-admin`);
      toast.success("User promoted to Admin! 🛡️");
      fetchUsers();
    } catch (err) {
      toast.error(err.response?.data?.message || "Promotion failed");
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">User Management</h1>
          <p className="text-zinc-400 text-sm mt-1">Manage approved users and roles</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={16} />
            <input 
              type="text" 
              placeholder="Search users..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-zinc-900 border border-white/10 rounded-lg pl-9 pr-4 py-2 text-sm text-zinc-200 focus:outline-none focus:border-primary-500 transition-colors w-full sm:w-64"
            />
          </div>
          <Badge variant="primary" className="text-sm px-3 py-1 shrink-0">
            {filteredUsers.length} Total
          </Badge>
        </div>
      </div>

      {loading ? (
        <div className="space-y-4">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-20 w-full rounded-xl" />
          ))}
        </div>
      ) : filteredUsers.length === 0 ? (
        <EmptyState 
          type="users"
          title={searchQuery ? "No users match your search" : "No users found"}
          description={searchQuery ? `We couldn't find any user matching "${searchQuery}".` : "There are no approved users in the system yet."}
          actionText={searchQuery ? "Clear Search" : null}
          onAction={searchQuery ? () => setSearchQuery("") : null}
        />
      ) : (
        <div className="grid gap-4">
          <AnimatePresence>
            {filteredUsers.map((u) => (
              <motion.div
                key={u._id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="glass-panel p-5 rounded-xl border border-white/5 hover:border-white/10 flex flex-col sm:flex-row gap-6 sm:items-center justify-between transition-all"
              >
                <div className="flex items-start gap-4">
                  <div className={cn(
                    "w-12 h-12 rounded-full flex items-center justify-center shrink-0 font-bold text-lg",
                    u.role === "admin" ? "bg-accent-500/20 text-accent-400" : "bg-primary-500/20 text-primary-400"
                  )}>
                    {u.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-white text-lg">{u.name}</h3>
                      {u._id === currentUser?._id && (
                        <Badge variant="primary">You</Badge>
                      )}
                    </div>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mt-1 text-sm text-zinc-400">
                      <span className="flex items-center gap-1.5"><Mail size={14} /> {u.email}</span>
                      <span className="hidden sm:inline text-zinc-600">•</span>
                      <Badge variant={u.role === "admin" ? "accent" : "default"} className="uppercase text-[10px]">
                        {u.role}
                      </Badge>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0 self-end sm:self-auto w-full sm:w-auto mt-2 sm:mt-0">
                  {u.role === "member" && u._id !== currentUser?._id && (
                    <Button 
                      variant="ghost"
                      size="sm"
                      onClick={() => promoteToAdmin(u._id)}
                      isLoading={actionLoading === u._id}
                      disabled={actionLoading !== null}
                      className="w-full sm:w-auto text-accent-400 hover:bg-accent-500/10 hover:text-accent-300 border border-accent-500/20 sm:border-transparent"
                    >
                      <ShieldCheck size={16} className="mr-1.5" /> Promote
                    </Button>
                  )}
                  {u.role === "admin" && (
                     <span className="text-sm font-medium text-accent-400 flex items-center gap-1.5 px-3 w-full justify-end sm:w-auto">
                       <ShieldAlert size={16} /> Admin Access
                     </span>
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
