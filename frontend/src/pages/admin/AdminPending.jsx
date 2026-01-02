import { motion } from "framer-motion";
import { FaUserClock, FaSearch } from "react-icons/fa";
import toast from "react-hot-toast";
import { useState } from "react";

export default function AdminPending() {

  const allPending = [
    { id: 1, name: "John Carter", email: "john@mail.com", role: "Manager", reason: "Needs to manage club events", requestedOn: "Jan 27, 2025" },
    { id: 2, name: "Emma Watson", email: "emma@mail.com", role: "Member", reason: "Joining project team", requestedOn: "Jan 26, 2025" },
    { id: 3, name: "David Wilson", email: "david@mail.com", role: "Member", reason: "Wants access to photography project", requestedOn: "Jan 25, 2025" },
    { id: 4, name: "Sarah Lee", email: "sarah@mail.com", role: "Manager", reason: "Club leadership role", requestedOn: "Jan 22, 2025" },
    { id: 5, name: "Kevin Hart", email: "kevin@mail.com", role: "Member", reason: "General participation", requestedOn: "Jan 20, 2025" },
  ];

  const [pendingUsers, setPendingUsers] = useState(allPending);
  const [search, setSearch] = useState("");
  const [filterRole, setFilterRole] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedUser, setSelectedUser] = useState(null);

  // Pagination Config
  const usersPerPage = 3;
  const filteredUsers = pendingUsers.filter(u =>
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase())
  ).filter(u =>
    filterRole === "All" ? true : u.role === filterRole
  );

  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);
  const indexStart = (currentPage - 1) * usersPerPage;
  const displayedUsers = filteredUsers.slice(indexStart, indexStart + usersPerPage);

  // Role Based Rules
  const approveUser = (user) => {
    if (user.role === "Manager") {
      toast("⚠ Manager approval requires Admin review", { icon: "⚠️" });
    }

    setPendingUsers(pendingUsers.filter(u => u.id !== user.id));
    toast.success(`${user.name} Approved 🎉`);
    setSelectedUser(null);
  };

  const rejectUser = (user) => {
    setPendingUsers(pendingUsers.filter(u => u.id !== user.id));
    toast.error(`${user.name} Rejected ❌`);
    setSelectedUser(null);
  };

  return (
    <motion.div
      className="min-h-screen bg-[#0B1120] text-white p-8 relative overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      {/* Glow */}
      <div className="absolute -top-16 -left-16 w-96 h-96 bg-yellow-500 opacity-20 blur-[150px]" />

      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <FaUserClock className="text-yellow-400 text-3xl" />
        <h1 className="text-4xl font-heading font-extrabold bg-gradient-to-r from-yellow-300 to-amber-400 bg-clip-text text-transparent">
          Pending Approvals
        </h1>
      </div>

      <p className="text-gray-400 mb-6">
        Review, search, filter and approve users requesting system access.
      </p>

      {/* Search + Filter */}
      <div className="flex flex-wrap gap-4 mb-6">
        <div className="flex items-center gap-2 bg-gray-800 px-4 py-2 rounded-lg border border-gray-700">
          <FaSearch />
          <input
            placeholder="Search user..."
            className="bg-transparent outline-none"
            value={search}
            onChange={(e) => {
              setCurrentPage(1);
              setSearch(e.target.value);
            }}
          />
        </div>

        <select
          className="bg-gray-800 border border-gray-700 px-4 py-2 rounded-lg outline-none"
          value={filterRole}
          onChange={(e) => {
            setCurrentPage(1);
            setFilterRole(e.target.value);
          }}
        >
          <option>All</option>
          <option>Member</option>
          <option>Manager</option>
        </select>
      </div>

      {/* Pending List */}
      <motion.div
        className="bg-[#0F172A]/80 backdrop-blur-xl border border-gray-700 rounded-2xl p-6"
        initial={{ y: 40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
      >
        {displayedUsers.length === 0 ? (
          <p className="text-gray-400 text-center py-10">
            🎉 No users matching filters.
          </p>
        ) : (
          displayedUsers.map(user => (
            <motion.div
              key={user.id}
              className="flex justify-between items-center bg-gray-800/60 border border-gray-700 rounded-xl p-4 mb-3 hover:border-yellow-400 transition cursor-pointer"
              whileHover={{ scale: 1.01 }}
              onClick={() => setSelectedUser(user)}
            >
              <div>
                <h2 className="text-lg font-semibold">{user.name}</h2>
                <p className="text-gray-400 text-sm">{user.email}</p>
                <p className="text-yellow-400 text-sm">Requested Role: {user.role}</p>
              </div>

              <span className="text-gray-400 text-xs">{user.requestedOn}</span>
            </motion.div>
          ))
        )}
      </motion.div>

      {/* Pagination */}
      <div className="flex justify-center mt-6 gap-3">
        {[...Array(totalPages)].map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrentPage(i + 1)}
            className={`px-4 py-2 rounded-lg ${
              currentPage === i + 1
                ? "bg-yellow-500 text-black"
                : "bg-gray-800 border border-gray-700"
            }`}
          >
            {i + 1}
          </button>
        ))}
      </div>

      {/* Modal */}
      {selectedUser && (
        <motion.div
          className="fixed inset-0 bg-black/60 flex justify-center items-center backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <motion.div
            className="bg-gray-900 border border-gray-700 p-6 rounded-2xl w-full max-w-lg"
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
          >
            <h2 className="text-2xl font-heading mb-2">{selectedUser.name}</h2>
            <p className="text-gray-400">{selectedUser.email}</p>

            <div className="mt-3">
              <p className="text-yellow-400">Requested Role: {selectedUser.role}</p>
              <p className="text-gray-300 mt-2">
                Reason: <span className="text-gray-400">{selectedUser.reason}</span>
              </p>
              <p className="text-gray-400 text-sm mt-1">
                Requested On: {selectedUser.requestedOn}
              </p>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => rejectUser(selectedUser)}
                className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg"
              >
                Reject
              </button>

              <button
                onClick={() => approveUser(selectedUser)}
                className="bg-green-600 hover:bg-green-700 px/4 py-2 rounded-lg"
              >
                Approve
              </button>

              <button
                onClick={() => setSelectedUser(null)}
                className="bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded-lg"
              >
                Close
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}

    </motion.div>
  );
}
