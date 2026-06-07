import { forwardRef } from "react";
import { cn } from "../../lib/utils";

export const Input = forwardRef(({ className, label, error, icon: Icon, ...props }, ref) => {
  return (
    <div className="w-full relative">
      {label && (
        <label className="block text-sm font-medium text-zinc-300 mb-1.5 ml-1">
          {label}
        </label>
      )}
      <div className="relative flex items-center">
        {Icon && (
          <div className="absolute left-3 text-zinc-500">
            <Icon size={18} />
          </div>
        )}
        <input
          ref={ref}
          className={cn(
            "w-full bg-zinc-900/50 border border-white/10 rounded-md text-white placeholder:text-zinc-500",
            "focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500/50",
            "transition-all duration-200",
            Icon ? "pl-10" : "px-4",
            "py-2.5",
            error && "border-red-500/50 focus:ring-red-500/50 focus:border-red-500/50",
            className
          )}
          {...props}
        />
      </div>
      {error && (
        <p className="mt-1.5 text-sm text-red-400 ml-1 font-medium">{error}</p>
      )}
    </div>
  );
});

Input.displayName = "Input";
