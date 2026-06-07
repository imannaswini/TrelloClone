import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ShieldAlert, ArrowLeft } from "lucide-react";
import { Button } from "../components/ui/Button";

export default function Unauthorized() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen relative flex items-center justify-center bg-background overflow-hidden selection:bg-primary-500/30 py-12">
      <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-red-600/10 blur-[120px] rounded-full mix-blend-screen pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary-600/10 blur-[120px] rounded-full mix-blend-screen pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-full max-w-md z-10 mx-4"
      >
        <div className="glass-panel p-8 sm:p-12 rounded-2xl shadow-2xl border border-white/10 relative overflow-hidden text-center flex flex-col items-center">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-red-500 to-transparent opacity-50" />

          <div className="w-20 h-20 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center mb-6 shadow-inner">
            <ShieldAlert className="text-red-400" size={40} />
          </div>

          <h1 className="text-3xl font-heading font-bold text-white tracking-tight mb-2">
            Access Denied
          </h1>
          <p className="text-zinc-400 mb-8 max-w-[280px]">
            You do not have the required permissions to view this page.
          </p>

          <Button 
            onClick={() => navigate(-1)} 
            className="w-full max-w-[200px] flex items-center justify-center gap-2"
          >
            <ArrowLeft size={16} /> Go Back
          </Button>
        </div>
      </motion.div>
    </div>
  );
}
