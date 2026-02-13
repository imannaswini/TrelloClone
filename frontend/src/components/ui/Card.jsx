import { motion } from "framer-motion";

const Card = ({ children, className = "" }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className={`bg-slate-800/70 backdrop-blur-md border border-slate-700 rounded-xl p-6 shadow-lg ${className}`}
    >
      {children}
    </motion.div>
  );
};

export default Card;
