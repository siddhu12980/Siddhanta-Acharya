import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center px-5 text-center">
      <p className="font-mono text-xs uppercase tracking-widest text-app-text-muted mb-4">
        404
      </p>
      <h1 className="text-3xl sm:text-4xl font-sans font-bold text-app-text mb-3">
        Page not found
      </h1>
      <p className="max-w-sm text-sm text-app-text-secondary mb-8">
        The page you&apos;re looking for doesn&apos;t exist or has been moved.
      </p>
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 font-mono text-xs text-app-text-muted transition-colors hover:text-app-text"
      >
        <ArrowLeft className="size-3" />
        Back to home
      </Link>
    </div>
  );
}
