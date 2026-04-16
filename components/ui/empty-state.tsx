import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

export function EmptyState({
  title,
  description,
  icon: Icon,
  action,
  className,
}: {
  title: string;
  description?: string;
  icon?: LucideIcon;
  action?: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-4 py-20 text-center",
        className,
      )}
    >
      {Icon && (
        <Icon className="size-10 text-app-text-muted" strokeWidth={1} />
      )}
      <div className="space-y-1.5">
        <p className="font-mono text-sm uppercase tracking-widest text-app-text-secondary">
          {title}
        </p>
        {description && (
          <p className="max-w-sm text-sm text-app-text-muted">{description}</p>
        )}
      </div>
      {action}
    </div>
  );
}
