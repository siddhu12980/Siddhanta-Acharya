import { cn } from "@/lib/utils";

type BadgeVariant = "default" | "live" | "degraded" | "offline" | "muted";

const variants: Record<BadgeVariant, string> = {
  default:
    "bg-app-hover text-app-text-secondary border-app-border",
  live: "bg-app-status-live/10 text-app-status-live border-app-status-live/20",
  degraded:
    "bg-app-status-degraded/10 text-app-status-degraded border-app-status-degraded/20",
  offline:
    "bg-app-status-offline/10 text-app-status-offline border-app-status-offline/20",
  muted: "bg-app-hover text-app-text-muted border-transparent",
};

export function Badge({
  children,
  variant = "default",
  className,
}: {
  children: React.ReactNode;
  variant?: BadgeVariant;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-sm border px-1.5 py-0.5 font-mono text-[10px] uppercase tracking-widest",
        variants[variant],
        className,
      )}
    >
      {children}
    </span>
  );
}
