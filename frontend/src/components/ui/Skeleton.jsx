import { cn } from "../../lib/utils";

export function Skeleton({ className, ...props }) {
  return (
    <div
      className={cn("animate-pulse rounded-md bg-zinc-800", className)}
      {...props}
    />
  );
}
