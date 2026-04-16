"use client";

import { cn } from "@/lib/utils";
import type { ProjectStatus } from "@/lib/content";

const statusColors: Record<ProjectStatus, string> = {
  live: "bg-app-status-live",
  degraded: "bg-app-status-degraded",
  offline: "bg-app-status-offline",
};

export function StatusDot({
  status,
  size = "sm",
  className,
}: {
  status: ProjectStatus;
  size?: "sm" | "md";
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-block shrink-0 rounded-full",
        size === "sm" ? "size-1.5" : "size-2.5",
        statusColors[status],
        status === "live" && "animate-breathe",
        className,
      )}
      aria-label={`Status: ${status}`}
    />
  );
}
