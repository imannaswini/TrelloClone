import { useEffect, useState } from "react";
import api from "../../services/api";
import toast from "react-hot-toast";
import { motion } from "framer-motion";

export default function MemberTasks() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingTaskId, setUpdatingTaskId] = useState(null);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const res = await api.get("/member/tasks");
      setTasks(res.data);
    } catch (err) {
      toast.error("Failed to load tasks");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (taskId, newStatus) => {
    try {
      setUpdatingTaskId(taskId);

      await api.put(`/tasks/${taskId}`, {
        status: newStatus,
      });

      toast.success("Task updated ✅");

      // Refresh tasks
      fetchTasks();
    } catch (err) {
      toast.error("Failed to update task");
      console.error(err);
    } finally {
      setUpdatingTaskId(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0B1120] text-white p-8">
        <h1 className="text-3xl font-bold mb-6">My Tasks</h1>
        <p className="text-slate-400">Loading your tasks...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0B1120] text-white p-8">
      <h1 className="text-3xl font-bold mb-6">My Tasks</h1>

      {tasks.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-slate-900 border border-slate-800 rounded-xl p-6 text-center"
        >
          <p className="text-gray-400 text-lg">
            No tasks assigned yet 🎉
          </p>
          <p className="text-slate-500 text-sm mt-2">
            Relax 😌 Your admin hasn’t given you work.
          </p>
        </motion.div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {tasks.map((task) => (
            <motion.div
              key={task._id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-lg"
            >
              <h2 className="font-semibold text-lg mb-2">
                {task.title}
              </h2>

              <p className="text-sm text-slate-400 mb-1">
                Project:{" "}
                <span className="text-white">
                  {task.project?.name || "Unknown"}
                </span>
              </p>

              <div className="mt-3">
                <label className="text-sm text-slate-400">
                  Status
                </label>

                <select
                  value={task.status}
                  disabled={updatingTaskId === task._id}
                  onChange={(e) =>
                    updateStatus(task._id, e.target.value)
                  }
                  className="w-full mt-1 bg-slate-800 border border-slate-700 rounded p-2 text-sm"
                >
                  <option value="todo">Todo</option>
                  <option value="progress">In Progress</option>
                  <option value="done">Completed</option>
                </select>
              </div>

              {updatingTaskId === task._id && (
                <p className="text-xs text-yellow-400 mt-2">
                  Updating...
                </p>
              )}
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
