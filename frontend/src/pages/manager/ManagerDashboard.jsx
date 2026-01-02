import Sidebar from "../../components/layout/Sidebar";

export default function ManagerDashboard() {
  return (
    <div className="flex min-h-screen bg-gray-900 text-white">
      {/* Sidebar */}
      <Sidebar />

      {/* Content Area */}
      <div className="ml-64 p-8 w-full">
        <h1 className="text-3xl font-bold mb-4">
          Manager Dashboard
        </h1>

        <p className="text-gray-400 mb-6">
          Create and manage project boards, assign tasks, and track progress.
        </p>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
            <h2 className="text-lg font-semibold">Boards Created</h2>
            <p className="text-3xl font-bold text-blue-400 mt-2">4</p>
          </div>

          <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
            <h2 className="text-lg font-semibold">Active Tasks</h2>
            <p className="text-3xl font-bold text-green-400 mt-2">18</p>
          </div>

          <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
            <h2 className="text-lg font-semibold">Completed</h2>
            <p className="text-3xl font-bold text-yellow-400 mt-2">9</p>
          </div>
        </div>

        {/* Boards Section Placeholder */}
        <div className="bg-gray-800 mt-8 p-6 rounded-lg border border-gray-700">
          <h2 className="text-xl font-semibold mb-2">Your Boards</h2>
          <p className="text-gray-400">
            Boards will be displayed here. You will be able to create, edit, and manage boards.
          </p>
        </div>
      </div>
    </div>
  );
}
