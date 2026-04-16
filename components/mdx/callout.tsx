import { cn } from "@/lib/utils";
import { AlertTriangle, Info, Lightbulb } from "lucide-react";

type CalloutVariant = "info" | "warning" | "tip";

const icons: Record<CalloutVariant, React.ElementType> = {
  info: Info,
  warning: AlertTriangle,
  tip: Lightbulb,
};

const styles: Record<CalloutVariant, string> = {
  info: "border-app-accent/40 bg-app-accent-muted",
  warning: "border-app-status-degraded/40 bg-app-status-degraded/10",
  tip: "border-app-status-live/40 bg-app-status-live/10",
};

interface CalloutProps {
  variant?: CalloutVariant;
  children: React.ReactNode;
}

export function Callout({ variant = "info", children }: CalloutProps) {
  const Icon = icons[variant];

  return (
    <div
      className={cn(
        "my-6 flex gap-3 rounded-sm border-l-2 px-4 py-3",
        styles[variant],
      )}
    >
      <Icon className="mt-0.5 size-4 shrink-0 text-app-text-secondary" strokeWidth={1.5} />
      <div className="text-sm leading-relaxed text-app-text-secondary">
        {children}
      </div>
    </div>
  );
}
