import { motion } from "framer-motion";
import {
  FaProjectDiagram,
  FaUsers,
  FaClock,
  FaTrash,
  FaEdit,
} from "react-icons/fa";
import { useState } from "react";
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

  const [selectedProject, setSelectedProject] = useState(null);
  const [newMember, setNewMember] = useState("");

  // Editing State
  const [editingMemberId, setEditingMemberId] = useState(null);
  const [editData, setEditData] = useState({ name: "", role: "" });

  // ------------------ ADD MEMBER ------------------
  const addMember = () => {
    if (!newMember.trim()) return;

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
  };

  // ------------------ REMOVE MEMBER ------------------
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
  };

  // ------------------ START EDIT ------------------
  const startEditing = (member) => {
    setEditingMemberId(member.id);
    setEditData({ name: member.name, role: member.role });
  };

  // ------------------ SAVE EDIT ------------------
  const saveEdit = () => {
    const updated = projects.map((p) =>
      p.id === selectedProject.id
        ? {
            ...p,
            members: p.members.map((m) =>
              m.id === editingMemberId
                ? { ...m, name: editData.name, role: editData.role }
                : m
            ),
          }
        : p
    );

    setProjects(updated);
    setEditingMemberId(null);
  };

  // ------------------ CANCEL EDIT ------------------
  const cancelEdit = () => {
    setEditingMemberId(null);
  };

  return (
    <motion.div
      className="min-h-screen bg-[#0B1120] text-white p-8 relative overflow-hidden"
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

      {/* Project Cards */}
      <div className="space-y-5">
        {projects.map((project) => (
          <motion.div
            key={project.id}
            className="bg-[#0F172A]/80 border border-gray-700 rounded-2xl p-6 backdrop-blur-xl"
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
      </div>

      {/* ================= MEMBER MODAL ================= */}
      {selectedProject && (
        <div className="fixed inset-0 bg-black/70 flex justify-center items-center z-50">
          <div className="bg-gray-900 p-6 rounded-2xl border border-gray-700 w-[520px]">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">
                Members — {selectedProject.name}
              </h2>

              <button
                className="bg-red-600 px-3 py-1 rounded-lg"
                onClick={() => setSelectedProject(null)}
              >
                Close
              </button>
            </div>

            <div className="mt-4 space-y-3">
              {selectedProject.members.map((m) => (
                <div
                  key={m.id}
                  className="flex justify-between items-center bg-gray-800 px-3 py-2 rounded-lg"
                >
                  {editingMemberId === m.id ? (
                    <>
                      <div className="flex gap-2 flex-1">
                        <input
                          value={editData.name}
                          onChange={(e) =>
                            setEditData({ ...editData, name: e.target.value })
                          }
                          className="bg-gray-700 px-2 py-1 rounded w-1/2"
                        />
                        <select
                          value={editData.role}
                          onChange={(e) =>
                            setEditData({ ...editData, role: e.target.value })
                          }
                          className="bg-gray-700 px-2 py-1 rounded w-1/2"
                        >
                          <option value="member">member</option>
                          <option value="admin">admin</option>
                        </select>
                      </div>

                      <div className="flex gap-2">
                        <button
                          onClick={saveEdit}
                          className="text-green-400"
                        >
                          Save
                        </button>
                        <button
                          onClick={cancelEdit}
                          className="text-gray-400"
                        >
                          Cancel
                        </button>
                      </div>
                    </>
                  ) : (
                    <>
                      <div>
                        <p className="font-semibold">{m.name}</p>
                        <p className="text-blue-400 text-sm">{m.role}</p>
                      </div>

                      <div className="flex gap-4 items-center">
                        <FaEdit
                          className="cursor-pointer text-yellow-400"
                          onClick={() => startEditing(m)}
                        />

                        {user?.role === "admin" && (
                          <FaTrash
                            className="cursor-pointer text-red-400"
                            onClick={() => removeMember(m.id)}
                          />
                        )}
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>

            {/* Add Member */}
            <div className="mt-4">
              <input
                value={newMember}
                onChange={(e) => setNewMember(e.target.value)}
                placeholder="Enter member name"
                className="w-full bg-gray-800 px-3 py-2 rounded-lg"
              />
              <button
                onClick={addMember}
                className="w-full bg-green-600 hover:bg-green-700 mt-3 py-2 rounded-lg"
              >
                Add Member
              </button>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
}
