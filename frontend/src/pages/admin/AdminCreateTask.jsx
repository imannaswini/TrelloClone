import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import api from "../../services/api";

export default function AdminCreateTask() {
  const [projects, setProjects] = useState([]);
  const [members, setMembers] = useState([]);
  const [title, setTitle] = useState("");
  const [projectId, setProjectId] = useState("");
  const [assignedTo, setAssignedTo] = useState("");

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
    try {
      const res = await api.get(`/projects/${pid}`);
      setMembers(res.data.members || []);
    } catch {
      toast.error("Failed to load members");
    }
  };

  const createTask = async () => {
    if (!title || !projectId) {
      return toast.error("Title & Project required");
    }

    try {
      await api.post("/tasks", {
        title,
        projectId,
        assignedTo: assignedTo || null,
      });

      toast.success("Task created 🚀");
      setTitle("");
      setAssignedTo("");
    } catch (err) {
      toast.error(err.response?.data?.message || "Task creation failed");
    }
  };

  return (
    <div className="min-h-screen bg-[#0B1120] text-white p-8">
      <h1 className="text-3xl font-bold mb-6">Create Task</h1>

      <div className="bg-[#0F172A] border border-gray-700 rounded-xl p-6 max-w-2xl">
        {/* Title */}
        <div className="mb-4">
          <label className="text-sm text-gray-400">Task Title</label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter task title"
            className="w-full mt-1 bg-gray-800 border border-gray-700 rounded-lg px-3 py-2"
          />
        </div>

        {/* Project */}
        <div className="mb-4">
          <label className="text-sm text-gray-400">Select Project</label>
          <select
            value={projectId}
            onChange={(e) => {
              setProjectId(e.target.value);
              fetchMembers(e.target.value);
            }}
            className="w-full mt-1 bg-gray-800 border border-gray-700 rounded-lg px-3 py-2"
          >
            <option value="">Choose project...</option>
            {projects.map((p) => (
              <option key={p._id} value={p._id}>
                {p.name}
              </option>
            ))}
          </select>
        </div>

        {/* Members */}
        <div className="mb-6">
          <label className="text-sm text-gray-400">
            Assign Member (optional)
          </label>
          <select
            value={assignedTo}
            onChange={(e) => setAssignedTo(e.target.value)}
            className="w-full mt-1 bg-gray-800 border border-gray-700 rounded-lg px-3 py-2"
          >
            <option value="">Unassigned</option>
            {members.map((m) => (
              <option key={m._id} value={m._id}>
                {m.name}
              </option>
            ))}
          </select>
        </div>

        {/* Button */}
        <button
          onClick={createTask}
          className="bg-green-600 hover:bg-green-700 px-5 py-2 rounded-lg"
        >
          Create Task
        </button>
      </div>
    </div>
  );
}
