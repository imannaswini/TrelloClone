import { motion } from "framer-motion";
import {
  FaProjectDiagram,
  FaUsers,
  FaClock,
  FaTrash,
} from "react-icons/fa";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../../services/api";

export default function AdminProjects() {
  const navigate = useNavigate();

  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProjects();
  }, []);

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

  const deleteProject = async (id) => {
    if (!window.confirm("Delete this project?")) return;

    try {
      await api.delete(`/projects/${id}`);
      toast.success("Project deleted");
      fetchProjects();
    } catch (err) {
      toast.error("Delete failed");
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0B1120] text-white flex items-center justify-center">
        <p className="text-lg">Loading projects...</p>
      </div>
    );
  }

  return (
    <motion.div
      className="min-h-screen bg-[#0B1120] text-white p-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <FaProjectDiagram className="text-green-400 text-3xl" />
          <h1 className="text-4xl font-extrabold bg-gradient-to-r from-green-300 to-emerald-400 bg-clip-text text-transparent">
            Active Projects
          </h1>
        </div>

        <button
          onClick={() => navigate("/admin/create-project")}
          className="bg-green-600 hover:bg-green-700 px-5 py-2 rounded-lg shadow-lg transition"
        >
          + Create Project
        </button>
      </div>

      <p className="text-gray-400 mb-6">
        Monitor, manage and review all active boards and ongoing work.
      </p>

      {/* Empty State */}
      {projects.length === 0 && (
        <div className="text-center text-gray-400 mt-20">
          <p>No projects found</p>
        </div>
      )}

      {/* Project Cards */}
      <div className="space-y-5">
        {projects.map((project) => (
          <motion.div
            key={project._id}
            className="bg-[#0F172A]/80 border border-gray-700 rounded-2xl p-6 backdrop-blur-xl"
            whileHover={{ scale: 1.02 }}
          >
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-semibold">{project.name}</h2>

              <span
                className={`px-3 py-1 rounded-full text-sm ${
                  project.status === "active"
                    ? "bg-green-600/30 text-green-400"
                    : "bg-yellow-500/20 text-yellow-400"
                }`}
              >
                {project.status}
              </span>
            </div>

            <div className="flex items-center justify-between mt-3 text-gray-400">
              <p className="flex items-center gap-2">
                <FaUsers /> {project.members?.length || 0} Members
              </p>

              <p className="flex items-center gap-2">
                <FaClock /> Updated{" "}
                {new Date(project.updatedAt).toLocaleDateString()}
              </p>
            </div>

            <div className="flex gap-3 mt-5">
              <button
                onClick={() => navigate(`/projects/${project._id}`)}
                className="flex-1 bg-green-600 hover:bg-green-700 py-2 rounded-lg transition"
              >
                View Board
              </button>

              <button
                onClick={() => navigate(`/admin/projects/${project._id}`)}
                className="flex-1 bg-blue-600 hover:bg-blue-700 py-2 rounded-lg transition"
              >
                Manage Members
              </button>

              <button
                onClick={() => deleteProject(project._id)}
                className="px-4 bg-red-600 hover:bg-red-700 rounded-lg transition"
              >
                <FaTrash />
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
