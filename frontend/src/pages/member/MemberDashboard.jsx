import AppLayout from "../../components/layout/AppLayout";
import Card from "../../components/ui/Card";
import { motion } from "framer-motion";


const MemberDashboard = () => {
  const sidebarLinks = [
    { label: "Dashboard", to: "/member" },
    { label: "My Tasks", to: "/member/tasks" },
    { label: "Boards", to: "/member/boards" },
  ];

  return (
    <AppLayout sidebarLinks={sidebarLinks}>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold mb-2">
          Member Dashboard
        </h1>
        <p className="text-slate-400">
          Track your tasks, update progress, and collaborate efficiently 🚀
        </p>
      </motion.div>

      {/* Stats */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={{
          hidden: {},
          visible: {
            transition: { staggerChildren: 0.15 },
          },
        }}
        className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10"
      >
        <motion.div variants={cardAnim}>
          <Card>
            <h2 className="text-lg font-semibold">Assigned Tasks</h2>
            <p className="text-3xl font-bold text-blue-400 mt-2">10</p>
            <p className="text-slate-400 text-sm mt-1">
              Total tasks assigned
            </p>
          </Card>
        </motion.div>

        <motion.div variants={cardAnim}>
          <Card>
            <h2 className="text-lg font-semibold">In Progress</h2>
            <p className="text-3xl font-bold text-yellow-400 mt-2">4</p>
            <p className="text-slate-400 text-sm mt-1">
              Tasks currently active
            </p>
          </Card>
        </motion.div>

        <motion.div variants={cardAnim}>
          <Card>
            <h2 className="text-lg font-semibold">Completed</h2>
            <p className="text-3xl font-bold text-green-400 mt-2">6</p>
            <p className="text-slate-400 text-sm mt-1">
              Successfully finished
            </p>
          </Card>
        </motion.div>
      </motion.div>

      {/* Tasks Section */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <Card>
          <h2 className="text-xl font-semibold mb-3">
            Your Tasks
          </h2>
          <p className="text-slate-400 mb-2">
            Your task board will appear here. You’ll be able to:
          </p>

          <ul className="list-disc list-inside text-slate-400 space-y-1">
            <li>Drag & drop tasks</li>
            <li>Update task status</li>
            <li>Collaborate with your team</li>
          </ul>
        </Card>
      </motion.div>
    </AppLayout>
  );
};

/* 🔹 Animation Variant */
const cardAnim = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4 },
  },
};

export default MemberDashboard;
