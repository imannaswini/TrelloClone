import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { cn } from "../../lib/utils";
import { useEffect } from "react";

export function Modal({ isOpen, onClose, title, children, className }) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", duration: 0.5, bounce: 0.3 }}
            className={cn(
              "fixed left-1/2 top-1/2 z-50 w-full max-w-lg -translate-x-1/2 -translate-y-1/2",
              "glass-panel rounded-2xl shadow-2xl p-6",
              className
            )}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-white">{title}</h2>
              <button
                onClick={onClose}
                className="p-2 rounded-full hover:bg-white/10 text-zinc-400 hover:text-white transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            {children}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
