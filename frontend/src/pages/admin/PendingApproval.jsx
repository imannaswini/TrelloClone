import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import api from "../../services/api";

export default function PendingApprovals() {
  const [users, setUsers] = useState([]);
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [usersRes, projectsRes] = await Promise.all([
        api.get("/users/pending"),
        api.get("/projects"),
      ]);

      setUsers(usersRes.data);
      setProjects(projectsRes.data);
    } catch {
      toast.error("Failed to load approvals");
    }
  };

  const approveUser = async (userId, role, projectId) => {
    try {
      await api.put(`/users/${userId}/approve`, {
        role: role || undefined,
        projectId: projectId || undefined,
      });

      toast.success("User approved ✅");
      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.message || "Approval failed");
    }
  };

  const rejectUser = async (userId) => {
    try {
      await api.delete(`/users/${userId}/reject`);
      toast.success("User rejected ❌");
      fetchData();
    } catch {
      toast.error("Reject failed");
    }
  };

  return (
    <div className="min-h-screen bg-[#0B1120] text-white p-8">
      <h1 className="text-3xl font-bold mb-6">Pending Approvals</h1>

      {users.length === 0 ? (
        <p className="text-gray-400">No pending users 🎉</p>
      ) : (
        <div className="space-y-4">
          {users.map((user) => (
            <ApprovalCard
              key={user._id}
              user={user}
              projects={projects}
              onApprove={approveUser}
              onReject={rejectUser}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function ApprovalCard({ user, projects, onApprove, onReject }) {
  const [role, setRole] = useState("");
  const [projectId, setProjectId] = useState("");

  return (
    <div className="bg-gray-900 border border-gray-700 rounded-xl p-5">
      <p className="text-lg font-semibold">{user.name}</p>
      <p className="text-sm text-gray-400 mb-4">{user.email}</p>

      {/* Role Selector */}
      <select
        value={role}
        onChange={(e) => setRole(e.target.value)}
        className="bg-gray-800 px-3 py-2 rounded mr-3"
      >
        <option value="">Keep Role ({user.role})</option>
        <option value="member">Member</option>
        <option value="manager">Manager</option>
        <option value="admin">Admin</option>
      </select>

      {/* Project Selector */}
      <select
        value={projectId}
        onChange={(e) => setProjectId(e.target.value)}
        className="bg-gray-800 px-3 py-2 rounded"
      >
        <option value="">No Project</option>
        {projects.map((p) => (
          <option key={p._id} value={p._id}>
            {p.name}
          </option>
        ))}
      </select>

      <div className="flex gap-3 mt-4">
        <button
          onClick={() => onApprove(user._id, role, projectId)}
          className="bg-green-600 hover:bg-green-700 px-4 py-1 rounded"
        >
          Approve
        </button>

        <button
          onClick={() => onReject(user._id)}
          className="bg-red-600 hover:bg-red-700 px-4 py-1 rounded"
        >
          Reject
        </button>
      </div>
    </div>
  );
}
