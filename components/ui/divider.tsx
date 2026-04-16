import { cn } from "@/lib/utils";

export function Divider({
  text,
  className,
}: {
  text?: string;
  className?: string;
}) {
  if (text) {
    return (
      <div className={cn("flex items-center gap-3", className)}>
        <hr className="flex-1 border-app-border" />
        <span className="font-mono text-[10px] uppercase tracking-widest text-app-text-muted">
          {text}
        </span>
        <hr className="flex-1 border-app-border" />
      </div>
    );
  }

  return <hr className={cn("border-app-border", className)} />;
}
