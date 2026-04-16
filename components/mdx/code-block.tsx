import { cn } from "@/lib/utils";

interface CodeBlockProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
}

export function CodeBlock({ children, className, title }: CodeBlockProps) {
  return (
    <div className={cn("group relative my-6", className)}>
      {title && (
        <div className="flex items-center border border-b-0 border-app-border bg-app-hover px-4 py-1.5 font-mono text-[10px] uppercase tracking-widest text-app-text-muted">
          {title}
        </div>
      )}
      <div className="overflow-x-auto rounded-sm border border-app-border bg-app-panel">
        {children}
      </div>
    </div>
  );
}
