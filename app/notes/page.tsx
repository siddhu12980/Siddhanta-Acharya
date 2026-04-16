"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { MOCK_NOTES } from "@/lib/data";
import { Badge } from "@/components/ui/badge-custom";

export default function NotesPage() {
  return (
    <div className="px-5 py-8 sm:px-8 sm:py-10 lg:px-10">
      <h1 className="text-xl sm:text-2xl font-sans font-semibold text-app-text mb-1">
        Notes
      </h1>
      <p className="text-sm text-app-text-muted mb-6 sm:mb-8">
        Writing about systems, debugging, and things I learned the hard way.
      </p>

      <div className="space-y-0">
        {MOCK_NOTES.map((note, i) => (
          <motion.div
            key={note.slug}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: i * 0.06 }}
          >
            <Link
              href={`/notes/${note.slug}`}
              className="group block border-b border-app-border py-4 sm:py-5 transition-all duration-200 hover:bg-app-hover hover:translate-x-1"
            >
              {/* Mobile: stacked layout */}
              <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:gap-6">
                {/* Date */}
                <span className="shrink-0 font-mono text-xs text-app-text-muted sm:w-[80px] sm:pt-0.5">
                  {new Date(note.date).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  })}
                </span>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <h2 className="text-base sm:text-lg font-sans text-app-text group-hover:text-app-accent transition-colors">
                    {note.title}
                  </h2>
                  <p className="mt-1 text-sm text-app-text-secondary leading-relaxed">
                    {note.summary}
                  </p>
                </div>

                {/* Tags + reading time */}
                <div className="flex items-center gap-3 sm:shrink-0 sm:flex-col sm:items-end sm:gap-2 sm:pt-0.5">
                  <span className="font-mono text-[10px] text-app-text-muted">
                    {note.readingTime}
                  </span>
                  <div className="flex gap-1">
                    {note.tags.map((tag) => (
                      <Badge key={tag} variant="muted">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
