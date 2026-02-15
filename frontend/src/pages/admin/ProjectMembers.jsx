import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../../services/api";

export default function ProjectMembers() {
  const { projectId } = useParams(); // ✅ correct param

  const [project, setProject] = useState(null);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState("");
  const [loading, setLoading] = useState(true);

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
      setUsers(usersRes.data);
    } catch (err) {
      toast.error("Failed to load members");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const addMember = async () => {
    if (!selectedUser) return toast.error("Select user");

    try {
      await api.put(`/projects/${projectId}/members`, {
        userId: selectedUser,
      });

      toast.success("Member added 🚀");
      fetchData();
      setSelectedUser("");
    } catch (err) {
      toast.error(err.response?.data?.message || "Add failed");
    }
  };

  const removeMember = async (userId) => {
    if (!window.confirm("Remove this member?")) return;

    try {
      await api.delete(`/projects/${projectId}/members/${userId}`);
      toast.success("Member removed");
      fetchData();
    } catch {
      toast.error("Remove failed");
    }
  };

  if (loading)
    return <div className="text-white p-8">Loading...</div>;

  if (!project)
    return <div className="text-red-400 p-8">Project not found</div>;

  return (
    <div className="min-h-screen bg-[#0B1120] text-white p-8">
      <h1 className="text-3xl font-bold mb-6">
        Manage Members — {project.name}
      </h1>

      <div className="flex gap-3 mb-6">
        <select
          value={selectedUser}
          onChange={(e) => setSelectedUser(e.target.value)}
          className="bg-gray-800 px-3 py-2 rounded"
        >
          <option value="">Select user...</option>
          {users.map((u) => (
            <option key={u._id} value={u._id}>
              {u.name} ({u.role})
            </option>
          ))}
        </select>

        <button
          onClick={addMember}
          className="bg-green-600 px-4 rounded"
        >
          Add
        </button>
      </div>

      <div className="space-y-3">
        {project.members?.length === 0 ? (
          <p className="text-gray-400">No members yet</p>
        ) : (
          project.members.map((m) => (
            <div
              key={m._id}
              className="bg-gray-800 p-3 rounded flex justify-between"
            >
              <div>
                <p>{m.name}</p>
                <p className="text-sm text-gray-400">
                  {m.email}
                </p>
              </div>

              <button
                onClick={() => removeMember(m._id)}
                className="bg-red-600 px-3 rounded"
              >
                Remove
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
