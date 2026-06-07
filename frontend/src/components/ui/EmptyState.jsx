import { motion } from "framer-motion";
import { FolderKanban, CheckSquare, Users, UserPlus, AlertCircle } from "lucide-react";
import { Button } from "./Button";
import { useNavigate } from "react-router-dom";

export function EmptyState({ type, title, description, actionText, actionPath, onAction }) {
  const navigate = useNavigate();

  const getIcon = () => {
    switch (type) {
      case "projects": return FolderKanban;
      case "tasks": return CheckSquare;
      case "users": return Users;
      case "pending": return UserPlus;
      default: return AlertCircle;
    }
  };

  const Icon = getIcon();

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center justify-center p-12 text-center border border-white/5 bg-zinc-900/20 backdrop-blur-sm rounded-2xl border-dashed"
    >
      <div className="w-16 h-16 rounded-2xl bg-zinc-800/50 flex items-center justify-center mb-6 shadow-inner border border-white/5">
        <Icon className="text-zinc-400" size={32} />
      </div>
      <h3 className="text-xl font-semibold text-white mb-2">{title}</h3>
      <p className="text-zinc-400 max-w-sm mb-8">{description}</p>
      
      {(actionText && (actionPath || onAction)) && (
        <Button 
          onClick={onAction || (() => navigate(actionPath))} 
          className="shadow-lg shadow-primary-500/20"
        >
          {actionText}
        </Button>
      )}
    </motion.div>
  );
}
