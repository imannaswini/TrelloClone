import { cn } from "../../lib/utils";

export function Button({ className, variant = "primary", size = "md", isLoading, children, ...props }) {
  const baseStyles = "inline-flex items-center justify-center font-medium transition-all duration-200 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-background disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variants = {
    primary: "bg-primary-500 text-white hover:bg-primary-600 focus:ring-primary-500 shadow-[0_0_15px_rgba(99,102,241,0.3)] hover:shadow-[0_0_20px_rgba(99,102,241,0.5)] border border-primary-400/20",
    secondary: "bg-surface text-zinc-100 hover:bg-surface-hover border border-border focus:ring-zinc-500",
    ghost: "bg-transparent text-zinc-300 hover:text-white hover:bg-white/5 focus:ring-zinc-500",
    danger: "bg-red-500/10 text-red-500 hover:bg-red-500/20 border border-red-500/20 focus:ring-red-500",
  };

  const sizes = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2",
    lg: "px-6 py-3 text-lg",
    icon: "p-2",
  };

  return (
    <button
      className={cn(baseStyles, variants[variant], sizes[size], className)}
      disabled={isLoading || props.disabled}
      {...props}
    >
      {isLoading ? (
        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      ) : null}
      {children}
    </button>
  );
}
