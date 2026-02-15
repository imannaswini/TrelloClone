import { useEffect, useState } from "react";
import api from "../../services/api";
import toast from "react-hot-toast";

export default function MemberTasks() {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const res = await api.get("/member/tasks");
      setTasks(res.data);
    } catch {
      toast.error("Failed to load tasks");
    }
  };

  return (
    <div className="min-h-screen bg-[#0B1120] text-white p-8">
      <h1 className="text-3xl font-bold mb-6">My Tasks</h1>

      {tasks.length === 0 ? (
        <p className="text-gray-400">No tasks assigned 🎉</p>
      ) : (
        <div className="space-y-3">
          {tasks.map((task) => (
            <div
              key={task._id}
              className="bg-gray-800 border border-gray-700 p-4 rounded-lg"
            >
              <h2 className="font-semibold">{task.title}</h2>
              <p className="text-sm text-gray-400">
                Status: {task.status}
              </p>
              <p className="text-sm text-gray-500">
                Project: {task.project?.name}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
