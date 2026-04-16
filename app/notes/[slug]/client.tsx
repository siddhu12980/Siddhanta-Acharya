"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, Mail } from "lucide-react";
import { Badge } from "@/components/ui/badge-custom";
import { EmptyState } from "@/components/ui/empty-state";
import { FileText } from "lucide-react";
import type { NoteFrontmatter } from "@/lib/content";

interface NotePageClientProps {
  frontmatter: NoteFrontmatter;
  readingTime: string;
  content: React.ReactNode;
}

export function NotePageClient({
  frontmatter,
  readingTime,
  content,
}: NotePageClientProps) {
  return (
    <div className="mx-auto max-w-[65ch] px-5 py-10 sm:px-6 sm:py-16 lg:py-20">
      {/* Back link */}
      <Link
        href="/notes"
        className="mb-8 inline-flex items-center gap-1.5 font-mono text-xs text-app-text-muted transition-colors hover:text-app-text"
      >
        <ArrowLeft className="size-3" />
        Back to notes
      </Link>

      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="mb-10"
      >
        <p className="font-mono text-xs text-app-text-muted mb-3">
          {new Date(frontmatter.date).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </p>
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-sans font-bold tracking-tight text-app-text leading-tight">
          {frontmatter.title}
        </h1>
        <div className="mt-3 flex items-center gap-3">
          <span className="font-mono text-xs text-app-text-muted">
            {readingTime}
          </span>
          <div className="flex gap-1.5">
            {frontmatter.tags.map((tag) => (
              <Badge key={tag} variant="muted">
                {tag}
              </Badge>
            ))}
          </div>
        </div>
      </motion.header>

      {/* Body */}
      {content ? (
        <article className="space-y-4 text-base leading-relaxed text-app-text-secondary">
          {content}
        </article>
      ) : (
        <EmptyState
          title="Content not available"
          description="This note doesn't have content yet."
          icon={FileText}
        />
      )}

      {/* Footer */}
      <motion.footer
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="mt-16 border-t border-app-border pt-8"
      >
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap gap-1.5">
            {frontmatter.tags.map((tag) => (
              <Badge key={tag} variant="muted">
                {tag}
              </Badge>
            ))}
          </div>
          <a
            href={`mailto:dipendrabhatta.gdscfetju@gmail.com?subject=Re: ${frontmatter.title}`}
            className="inline-flex items-center gap-1.5 font-mono text-xs text-app-text-muted transition-colors hover:text-app-accent"
          >
            <Mail className="size-3" />
            Reply by email
          </a>
        </div>
      </motion.footer>
    </div>
  );
}
