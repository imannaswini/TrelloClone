import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../../services/api";

export default function AdminCreateProject() {
  const navigate = useNavigate();

  const [project, setProject] = useState({
    name: "",
    description: "",
    cover: "",
    status: "active",
  });

  const [loading, setLoading] = useState(false);

  const handleCreate = async () => {
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
    <div className="min-h-screen bg-[#0B1120] text-white p-8">
      <h1 className="text-4xl font-extrabold bg-gradient-to-r from-green-300 to-emerald-400 bg-clip-text text-transparent">
        Create New Project
      </h1>

      <p className="text-gray-400 mt-1">Fill details to create a project.</p>

      <div className="bg-gray-900 border border-gray-700 p-6 rounded-xl mt-6 space-y-4">
        <div>
          <label className="text-gray-400 text-sm">Project Name</label>
          <input
            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 mt-1 outline-none"
            placeholder="Enter project name"
            value={project.name}
            onChange={(e) =>
              setProject({ ...project, name: e.target.value })
            }
          />
        </div>

        <div>
          <label className="text-gray-400 text-sm">Description</label>
          <textarea
            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 mt-1 outline-none"
            rows="3"
            placeholder="Project Description"
            value={project.description}
            onChange={(e) =>
              setProject({ ...project, description: e.target.value })
            }
          />
        </div>

        <div>
          <label className="text-gray-400 text-sm">Cover Image URL</label>
          <input
            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 mt-1 outline-none"
            placeholder="Optional"
            value={project.cover}
            onChange={(e) =>
              setProject({ ...project, cover: e.target.value })
            }
          />
        </div>

        <div>
          <label className="text-gray-400 text-sm">Status</label>
          <select
            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 mt-1 outline-none"
            value={project.status}
            onChange={(e) =>
              setProject({ ...project, status: e.target.value })
            }
          >
            <option value="active">Active</option>
            <option value="pending">Pending Approval</option>
          </select>
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={() => navigate("/admin/projects")}
            className="bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded-lg"
          >
            Cancel
          </button>

          <button
            onClick={handleCreate}
            disabled={loading}
            className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg disabled:opacity-50"
          >
            {loading ? "Creating..." : "Create Project"}
          </button>
        </div>
      </div>
    </div>
  );
}
