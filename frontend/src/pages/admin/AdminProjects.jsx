import { motion } from "framer-motion";
import {
  FaProjectDiagram,
  FaUsers,
  FaClock,
  FaTrash,
} from "react-icons/fa";
import { useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import useAuthStore from "../../context/AuthStore";

export default function AdminProjects() {
  const navigate = useNavigate();
  const { user } = useAuthStore();

  const [projects, setProjects] = useState([
    {
      id: 1,
      name: "SPARK Event System",
      status: "Active",
      updated: "2 days ago",
      members: [
        { id: 1, name: "John", role: "member" },
        { id: 2, name: "Emma", role: "member" },
        { id: 3, name: "Alex", role: "member" },
      ],
    },
    {
      id: 2,
      name: "AI Research Board",
      status: "Active",
      updated: "5 days ago",
      members: [
        { id: 4, name: "Sarah", role: "member" },
        { id: 5, name: "David", role: "member" },
      ],
    },
  ]);

  /* ------------------ STATE ------------------ */
  const [showModal, setShowModal] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [newMember, setNewMember] = useState("");

  const [newProject, setNewProject] = useState({
    name: "",
    status: "Active",
  });

  /* ------------------ CREATE PROJECT ------------------ */
  const handleCreateProject = () => {
    if (!newProject.name.trim()) {
      toast.error("Project name is required");
      return;
    }

    const project = {
      id: Date.now(),
      name: newProject.name,
      status: newProject.status,
      updated: "Just now",
      members: [],
    };

    setProjects([project, ...projects]);
    setShowModal(false);
    setNewProject({ name: "", status: "Active" });
    toast.success("Project Created Successfully 🚀");
  };

  /* ------------------ ADD MEMBER ------------------ */
  const addMember = () => {
    if (!newMember.trim()) return toast.error("Enter member name");

    const updated = projects.map((p) =>
      p.id === selectedProject.id
        ? {
            ...p,
            members: [
              ...p.members,
              {
                id: Date.now(),
                name: newMember,
                role: "member",
              },
            ],
          }
        : p
    );

    setProjects(updated);
    setNewMember("");
    toast.success("Member Added");
  };

  /* ------------------ REMOVE MEMBER ------------------ */
  const removeMember = (id) => {
    const updated = projects.map((p) =>
      p.id === selectedProject.id
        ? {
            ...p,
            members: p.members.filter((m) => m.id !== id),
          }
        : p
    );

    setProjects(updated);
    toast.success("Member Removed");
  };

  return (
    <motion.div
      className="min-h-screen bg-[#0B1120] text-white p-8 relative overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      {/* Glow */}
      <div className="absolute -top-16 -right-16 w-96 h-96 bg-green-500 opacity-20 blur-[150px] pointer-events-none -z-10" />

      {/* ------------------ HEADER ------------------ */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <FaProjectDiagram className="text-green-400 text-3xl" />
          <h1 className="text-4xl font-extrabold bg-gradient-to-r from-green-300 to-emerald-400 bg-clip-text text-transparent">
            Active Projects
          </h1>
        </div>

        {/* ✅ FIXED BUTTON */}
       <button
  onClick={() => navigate("/admin/create-project")}
  className="bg-green-600 hover:bg-green-700 px-5 py-2 rounded-lg shadow-lg hover:shadow-green-500/40 transition"
>
  + Create Project
</button>

      </div>

      <p className="text-gray-400 mb-6">
        Monitor, manage and review all active boards and ongoing work.
      </p>

      {/* ------------------ PROJECT CARDS ------------------ */}
      <motion.div
        className="space-y-5"
        initial={{ y: 40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        {projects.map((project) => (
          <motion.div
            key={project.id}
            className="bg-[#0F172A]/80 border border-gray-700 rounded-2xl p-6 backdrop-blur-xl hover:border-green-500 transition hover:shadow-green-400/30 shadow"
            whileHover={{ scale: 1.02 }}
          >
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-semibold">{project.name}</h2>
              <span className="px-3 py-1 bg-green-600/30 text-green-400 rounded-full text-sm">
                {project.status}
              </span>
            </div>

            <div className="flex items-center justify-between mt-3 text-gray-400">
              <p className="flex items-center gap-2">
                <FaUsers /> {project.members.length} Members
              </p>
              <p className="flex items-center gap-2">
                <FaClock /> Updated {project.updated}
              </p>
            </div>

            <div className="flex gap-3 mt-5">
              <button
                onClick={() => navigate(`/projects/${project.id}`)}
                className="flex-1 bg-green-600 hover:bg-green-700 py-2 rounded-lg transition"
              >
                View Board
              </button>

              <button
                onClick={() => setSelectedProject(project)}
                className="flex-1 bg-blue-600 hover:bg-blue-700 py-2 rounded-lg transition"
              >
                Manage Members
              </button>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* ================= MEMBER MANAGEMENT MODAL ================= */}
      {selectedProject && (
        <motion.div
          className="fixed inset-0 bg-black/70 backdrop-blur flex justify-center items-center z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <motion.div
            className="bg-gray-900 p-6 rounded-2xl border border-gray-700 w-[520px]"
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
          >
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">
                Members — {selectedProject.name}
              </h2>

              <button
                className="bg-red-600 hover:bg-red-700 px-3 py-1 rounded-lg"
                onClick={() => setSelectedProject(null)}
              >
                Close
              </button>
            </div>

            <div className="max-h-60 overflow-y-auto mt-4 space-y-2">
              {selectedProject.members.map((m) => (
                <div
                  key={m.id}
                  className="flex justify-between items-center bg-gray-800 px-3 py-2 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${m.name}`}
                      className="w-9 h-9 rounded-full border border-gray-600"
                    />
                    <div>
                      <p className="font-semibold">{m.name}</p>
                      <span className="text-blue-400 text-xs">
                        {m.role}
                      </span>
                    </div>
                  </div>

                  {user?.role === "admin" && (
                    <button
                      className="text-red-400 hover:text-red-500"
                      onClick={() => removeMember(m.id)}
                    >
                      <FaTrash />
                    </button>
                  )}
                </div>
              ))}
            </div>

            {user?.role === "admin" && (
              <div className="mt-4">
                <input
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2"
                  placeholder="Enter member name"
                  value={newMember}
                  onChange={(e) => setNewMember(e.target.value)}
                />
                <button
                  onClick={addMember}
                  className="w-full bg-green-600 hover:bg-green-700 mt-3 py-2 rounded-lg"
                >
                  Add Member
                </button>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}

     
  </motion.div>
  );
}
