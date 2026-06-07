import { cn } from "../../lib/utils";

export function Badge({ className, variant = "default", children, ...props }) {
  const variants = {
    default: "bg-zinc-800 text-zinc-300 border-zinc-700",
    primary: "bg-primary-500/10 text-primary-400 border-primary-500/20",
    success: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    warning: "bg-amber-500/10 text-amber-400 border-amber-500/20",
    danger: "bg-red-500/10 text-red-400 border-red-500/20",
    accent: "bg-accent-500/10 text-accent-400 border-accent-500/20",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border",
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}
