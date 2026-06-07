import { cn } from "../../lib/utils";

export function Card({ className, children, ...props }) {
  return (
    <div className={cn("glass-panel rounded-xl overflow-hidden", className)} {...props}>
      {children}
    </div>
  );
}

export function CardHeader({ className, children, ...props }) {
  return (
    <div className={cn("px-6 py-4 border-b border-white/5", className)} {...props}>
      {children}
    </div>
  );
}

export function CardTitle({ className, children, ...props }) {
  return (
    <h3 className={cn("text-lg font-semibold tracking-tight text-white", className)} {...props}>
      {children}
    </h3>
  );
}

export function CardDescription({ className, children, ...props }) {
  return (
    <p className={cn("text-sm text-zinc-400 mt-1.5", className)} {...props}>
      {children}
    </p>
  );
}

export function CardContent({ className, children, ...props }) {
  return (
    <div className={cn("px-6 py-4", className)} {...props}>
      {children}
    </div>
  );
}

export function CardFooter({ className, children, ...props }) {
  return (
    <div className={cn("px-6 py-4 bg-white/[0.02] border-t border-white/5 flex items-center", className)} {...props}>
      {children}
    </div>
  );
}
