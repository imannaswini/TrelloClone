import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import api from "../../services/api";

export default function AdminPending() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

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
    try {
      await api.put(`/users/${id}/approve`);
      toast.success("User approved ✅");
      fetchPending();
    } catch {
      toast.error("Approval failed");
    }
  };

  const rejectUser = async (id) => {
    try {
      await api.delete(`/users/${id}/reject`);
      toast.success("User rejected ❌");
      fetchPending();
    } catch {
      toast.error("Rejection failed");
    }
  };

  if (loading) return <div className="text-white p-8">Loading...</div>;

  return (
    <div className="min-h-screen bg-[#0B1120] text-white p-8">
      <h1 className="text-3xl font-bold mb-6">Pending Approvals</h1>

      {users.length === 0 ? (
        <p className="text-gray-400">No pending users 🎉</p>
      ) : (
        <div className="space-y-4">
          {users.map((u) => (
            <div
              key={u._id}
              className="bg-gray-800 p-4 rounded flex justify-between items-center"
            >
              <div>
                <p className="font-semibold">{u.name}</p>
                <p className="text-sm text-gray-400">{u.email}</p>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => approveUser(u._id)}
                  className="bg-green-600 px-3 py-1 rounded"
                >
                  Approve
                </button>

                <button
                  onClick={() => rejectUser(u._id)}
                  className="bg-red-600 px-3 py-1 rounded"
                >
                  Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
