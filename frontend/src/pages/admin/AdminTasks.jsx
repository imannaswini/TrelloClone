import { useEffect, useState } from "react";
import AppLayout from "../../components/layout/AppLayout";
import api from "../../services/api";
import toast from "react-hot-toast";

export default function AdminTasks() {
  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]);

  const [loading, setLoading] = useState(true);

  const [editingTask, setEditingTask] = useState(null);
  const [updatedTitle, setUpdatedTitle] = useState("");
  const [updatedAssignedTo, setUpdatedAssignedTo] = useState("");
  const [updatedStatus, setUpdatedStatus] = useState("");

  const sidebarLinks = [
    { label: "Dashboard", to: "/admin" },
    { label: "Users", to: "/admin/users" },
    { label: "Projects", to: "/admin/projects" },
    { label: "Pending", to: "/admin/pending" },
    { label: "Create Task", to: "/admin/create-task" },
    { label: "Tasks", to: "/admin/tasks" },
  ];

  useEffect(() => {
    fetchTasks();
    fetchUsers();
  }, []);

  const fetchTasks = async () => {
    try {
      const res = await api.get("/tasks");
      setTasks(res.data);
    } catch {
      toast.error("Failed to load tasks");
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await api.get("/users");
      setUsers(res.data);
    } catch {
      console.error("Failed to load users");
    }
  };

  const handleEdit = (task) => {
    setEditingTask(task);
    setUpdatedTitle(task.title);
    setUpdatedAssignedTo(task.assignedTo?._id || "");
    setUpdatedStatus(task.status);
  };

  const handleUpdate = async () => {
    try {
      await api.put(`/tasks/${editingTask._id}`, {
        title: updatedTitle,
        assignedTo: updatedAssignedTo,
        status: updatedStatus,
      });

      toast.success("Task updated ✨");
      setEditingTask(null);
      fetchTasks();
    } catch {
      toast.error("Update failed");
    }
  };

  const handleDelete = async (id) => {
    const confirm = window.confirm(
      "Are you sure you want to delete this task?"
    );

    if (!confirm) return;

    try {
      await api.delete(`/tasks/${id}`);
      toast.success("Task deleted 🗑️");
      fetchTasks();
    } catch {
      toast.error("Delete failed");
    }
  };

  if (loading)
    return <div className="text-white p-8">Loading tasks...</div>;

  return (
    <AppLayout sidebarLinks={sidebarLinks}>
      <div className="min-h-screen bg-[#0B1120] text-white p-8">
        <h1 className="text-3xl font-bold mb-6">All Tasks</h1>

        {tasks.length === 0 ? (
          <p className="text-gray-400">No tasks created yet</p>
        ) : (
          <div className="space-y-4">
            {tasks.map((task) => (
              <div
                key={task._id}
                className="bg-gray-800 p-4 rounded flex justify-between items-center"
              >
                <div>
                  <p className="font-semibold">{task.title}</p>
                  <p className="text-sm text-gray-400">
                    Project: {task.project?.name}
                  </p>
                  <p className="text-sm text-gray-400">
                    Assigned: {task.assignedTo?.name || "Unassigned"}
                  </p>
                  <p className="text-sm text-gray-400">
                    Status: {task.status}
                  </p>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(task)}
                    className="px-3 py-1 text-sm bg-yellow-500 rounded"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => handleDelete(task._id)}
                    className="px-3 py-1 text-sm bg-red-600 rounded"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ✅ EDIT MODAL */}
        {editingTask && (
          <div className="fixed inset-0 bg-black/60 flex items-center justify-center">
            <div className="bg-gray-900 p-6 rounded w-[420px]">
              <h2 className="text-lg font-semibold mb-4">Edit Task</h2>

              {/* Title */}
              <label className="text-sm text-gray-400">Title</label>
              <input
                value={updatedTitle}
                onChange={(e) => setUpdatedTitle(e.target.value)}
                className="w-full p-2 rounded bg-gray-800 mb-3"
              />

              {/* Assigned Member */}
              <label className="text-sm text-gray-400">
                Assigned Member
              </label>
              <select
                value={updatedAssignedTo}
                onChange={(e) => setUpdatedAssignedTo(e.target.value)}
                className="w-full p-2 rounded bg-gray-800 mb-3"
              >
                <option value="">Unassigned</option>
                {users.map((u) => (
                  <option key={u._id} value={u._id}>
                    {u.name}
                  </option>
                ))}
              </select>

              {/* Status */}
              <label className="text-sm text-gray-400">Status</label>
              <select
                value={updatedStatus}
                onChange={(e) => setUpdatedStatus(e.target.value)}
                className="w-full p-2 rounded bg-gray-800 mb-4"
              >
                <option value="todo">Todo</option>
                <option value="progress">In Progress</option>
                <option value="done">Done</option>
              </select>

              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setEditingTask(null)}
                  className="px-3 py-1 bg-gray-600 rounded"
                >
                  Cancel
                </button>

                <button
                  onClick={handleUpdate}
                  className="px-3 py-1 bg-green-600 rounded"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
