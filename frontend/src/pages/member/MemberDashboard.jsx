import Sidebar from "../../components/layout/Sidebar";

export default function MemberDashboard() {
  return (
    <div className="flex min-h-screen bg-gray-900 text-white">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="ml-64 p-8 w-full">
        <h1 className="text-3xl font-bold mb-4">
          Member Dashboard
        </h1>

        <p className="text-gray-400 mb-6">
          View your assigned tasks, update progress, and collaborate with your team.
        </p>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
            <h2 className="text-lg font-semibold">Assigned Tasks</h2>
            <p className="text-3xl font-bold text-blue-400 mt-2">10</p>
          </div>

          <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
            <h2 className="text-lg font-semibold">In Progress</h2>
            <p className="text-3xl font-bold text-yellow-400 mt-2">4</p>
          </div>

          <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
            <h2 className="text-lg font-semibold">Completed</h2>
            <p className="text-3xl font-bold text-green-400 mt-2">6</p>
          </div>
        </div>

        {/* Task Section Placeholder */}
        <div className="bg-gray-800 mt-8 p-6 rounded-lg border border-gray-700">
          <h2 className="text-xl font-semibold mb-2">Your Tasks</h2>
          <p className="text-gray-400">
            Your task board will appear here. You will be able to drag, update, and manage your tasks.
          </p>
        </div>
      </div>
    </div>
  );
}
