"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, ExternalLink, Award, Send } from "lucide-react";
import { StatusDot } from "@/components/ui/status-dot";
import { Badge } from "@/components/ui/badge-custom";
import { TechIcon } from "@/components/ui/tech-icon";
import type { ProjectFrontmatter, NoteFrontmatter } from "@/lib/content";
import type { SkillCategory } from "@/lib/profile";
import type { Certificate } from "@/lib/certificates";

// ── GitHub heatmap colors ──────────────────────────────────────
const CONTRIB_COLORS = [
  "bg-app-hover",                    // 0 — no activity
  "bg-app-accent/25",                // 1 — light
  "bg-app-accent/50",                // 2 — medium
  "bg-app-accent/75",                // 3 — high
  "bg-app-accent",                   // 4 — max
];

function GitHubGraph({ weeks }: { weeks: number[][] }) {
  const total = useMemo(
    () => weeks.flat().reduce((s, v) => s + v, 0),
    [weeks],
  );

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <p className="font-mono text-[10px] uppercase tracking-widest text-app-text-muted">
          GitHub activity
        </p>
        <a
          href="https://github.com/siddhu12980"
          target="_blank"
          rel="noopener noreferrer"
          className="font-mono text-[10px] text-app-text-muted transition-colors hover:text-app-accent"
        >
          @siddhu12980
        </a>
      </div>

      {/* Heatmap grid */}
      <div className="overflow-x-auto rounded-sm border border-app-border bg-app-panel p-3 scrollbar-hide">
        <div className="flex gap-[3px] min-w-[680px]">
          {weeks.map((week, wi) => (
            <div key={wi} className="flex flex-col gap-[3px]">
              {week.map((level, di) => (
                <div
                  key={di}
                  className={`size-[10px] rounded-[2px] ${CONTRIB_COLORS[level]} transition-colors`}
                  title={`${level} contributions`}
                />
              ))}
            </div>
          ))}
        </div>

        {/* Legend */}
        <div className="mt-3 flex items-center justify-between">
          <span className="font-mono text-[10px] text-app-text-muted">
            {total} contributions in the last year
          </span>
          <div className="flex items-center gap-1">
            <span className="font-mono text-[10px] text-app-text-muted mr-1">Less</span>
            {CONTRIB_COLORS.map((color, i) => (
              <div key={i} className={`size-[10px] rounded-[2px] ${color}`} />
            ))}
            <span className="font-mono text-[10px] text-app-text-muted ml-1">More</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function ContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const subject = encodeURIComponent(`Portfolio contact from ${name}`);
    const body = encodeURIComponent(`From: ${name} (${email})\n\n${message}`);
    window.open(
      `mailto:dipendrabhatta.gdscfetju@gmail.com?subject=${subject}&body=${body}`,
      "_self",
    );
    setSent(true);
    setTimeout(() => setSent(false), 3000);
  };

  return (
    <div>
      <p className="font-mono text-[10px] uppercase tracking-widest text-app-text-muted mb-4">
        Get in touch
      </p>

      <form
        onSubmit={handleSubmit}
        className="rounded-sm border border-app-border bg-app-panel p-4 sm:p-5 space-y-4"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="contact-name"
              className="block font-mono text-[10px] uppercase tracking-widest text-app-text-muted mb-1.5"
            >
              Name
            </label>
            <input
              id="contact-name"
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-sm border border-app-border bg-app-bg px-3 py-2 font-mono text-xs text-app-text placeholder:text-app-text-muted outline-none transition-colors focus:border-app-accent"
              placeholder="Your name"
            />
          </div>
          <div>
            <label
              htmlFor="contact-email"
              className="block font-mono text-[10px] uppercase tracking-widest text-app-text-muted mb-1.5"
            >
              Email
            </label>
            <input
              id="contact-email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-sm border border-app-border bg-app-bg px-3 py-2 font-mono text-xs text-app-text placeholder:text-app-text-muted outline-none transition-colors focus:border-app-accent"
              placeholder="you@example.com"
            />
          </div>
        </div>
        <div>
          <label
            htmlFor="contact-message"
            className="block font-mono text-[10px] uppercase tracking-widest text-app-text-muted mb-1.5"
          >
            Message
          </label>
          <textarea
            id="contact-message"
            required
            rows={4}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="w-full resize-none rounded-sm border border-app-border bg-app-bg px-3 py-2 font-mono text-xs text-app-text placeholder:text-app-text-muted outline-none transition-colors focus:border-app-accent"
            placeholder="What's on your mind?"
          />
        </div>
        <button
          type="submit"
          className="inline-flex items-center gap-2 rounded-sm bg-app-solid px-4 py-2 font-mono text-xs uppercase tracking-widest text-app-solid-text transition-colors hover:bg-app-accent"
        >
          <Send className="size-3" />
          {sent ? "Opening mail client..." : "Send message"}
        </button>
      </form>
    </div>
  );
}

interface NoteDisplay extends NoteFrontmatter {
  readingTime: string;
}

interface LandingPageClientProps {
  projects: ProjectFrontmatter[];
  notes: NoteDisplay[];
  skills: SkillCategory[];
  certificates: Certificate[];
  contributions: number[][];
}

export function LandingPageClient({
  projects,
  notes,
  skills,
  certificates,
  contributions,
}: LandingPageClientProps) {
  return (
    <div className="px-5 py-10 sm:px-8 sm:py-14 lg:px-12 lg:py-16">
      {/* ── Boot sequence intro ─────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
      >
        <p className="font-mono text-[10px] uppercase tracking-widest text-app-text-muted mb-4 sm:mb-6">
          sys.init — portfolio v1.0
        </p>

        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-sans font-bold tracking-tight text-stroke mb-1 sm:mb-2">
          Siddhant
        </h1>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-sans font-bold tracking-tight text-app-text mb-6 sm:mb-8">
          Acharya
        </h1>
      </motion.div>

      {/* ── Manifesto ───────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.15 }}
        className="max-w-lg mb-10 sm:mb-16"
      >
        <p className="text-sm sm:text-base leading-relaxed text-app-text-secondary">
          I build backend systems that stay up. Job queues, pub/sub pipelines,
          order-matching engines — the kind of infrastructure that runs in the
          background while users see a button and a spinner. Currently looking
          for backend and infrastructure roles, remote or in Bangalore.
        </p>

        <div className="mt-5 sm:mt-6 flex flex-wrap gap-3">
          <Link
            href="/projects/redis-queue"
            className="inline-flex items-center gap-1.5 rounded-sm bg-app-solid px-3 py-1.5 font-mono text-xs uppercase tracking-widest text-app-solid-text transition-colors hover:bg-app-accent"
          >
            Browse projects
            <ArrowRight className="size-3" />
          </Link>
          <Link
            href="/notes"
            className="inline-flex items-center gap-1.5 rounded-sm border border-app-border px-3 py-1.5 font-mono text-xs uppercase tracking-widest text-app-text-secondary transition-colors hover:bg-app-hover hover:text-app-text"
          >
            Read notes
          </Link>
        </div>
      </motion.div>

      {/* ── Systems online ──────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.3 }}
        className="mb-14 sm:mb-20"
      >
        <p className="font-mono text-[10px] uppercase tracking-widest text-app-text-muted mb-4">
          Systems online
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {projects.map((project, i) => (
            <motion.div
              key={project.slug}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.35 + i * 0.06 }}
            >
              <Link
                href={`/projects/${project.slug}`}
                className="group flex flex-col gap-2 rounded-sm border border-app-border bg-app-panel p-4 transition-colors hover:border-app-accent/30 hover:bg-app-hover"
              >
                <div className="flex items-center gap-2">
                  <StatusDot status={project.status} />
                  <span className="font-mono text-sm text-app-text group-hover:text-app-accent transition-colors">
                    {project.title}
                  </span>
                </div>
                <p className="text-xs text-app-text-muted leading-relaxed">
                  {project.tagline}
                </p>
                <div className="flex flex-wrap gap-1 mt-1">
                  {project.stack.slice(0, 3).map((tech) => (
                    <Badge key={tech} variant="muted">
                      {tech}
                    </Badge>
                  ))}
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* ── Skills (simple badges) ──────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.1 }}
        transition={{ duration: 0.4 }}
        className="mb-14 sm:mb-20"
      >
        <p className="font-mono text-[10px] uppercase tracking-widest text-app-text-muted mb-5">
          Tech stack
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {skills.map((cat) => (
            <div key={cat.category}>
              <p className="font-mono text-[10px] uppercase tracking-widest text-app-text-secondary mb-2">
                {cat.category}
              </p>
              <div className="flex flex-wrap gap-1.5">
                {cat.items.map((item) => (
                  <span
                    key={item}
                    className="inline-flex items-center gap-1.5 rounded-sm border border-app-border bg-app-panel px-2 py-1 font-mono text-xs text-app-text transition-colors hover:border-app-accent/40 hover:text-app-accent"
                  >
                    <TechIcon name={item} className="size-3 opacity-60" />
                    {item}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* ── Two-column: Recent notes (left) + GitHub (right) ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 mb-14 sm:mb-20">
        {/* Recent notes — left */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.1 }}
          transition={{ duration: 0.4 }}
        >
          <div className="flex items-center justify-between mb-3">
            <p className="font-mono text-[10px] uppercase tracking-widest text-app-text-muted">
              Recent notes
            </p>
            <Link
              href="/notes"
              className="font-mono text-[10px] uppercase tracking-widest text-app-text-muted transition-colors hover:text-app-accent"
            >
              View all
            </Link>
          </div>

          {notes.length > 0 ? (
            <div className="space-y-0">
              {notes.map((note) => (
                <Link
                  key={note.slug}
                  href={`/notes/${note.slug}`}
                  className="group block border-b border-app-border py-4 transition-all duration-200 hover:bg-app-hover hover:translate-x-1"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <h3 className="text-sm font-sans text-app-text group-hover:text-app-accent transition-colors leading-snug">
                        {note.title}
                      </h3>
                      <p className="mt-1 text-xs text-app-text-muted leading-relaxed line-clamp-2">
                        {note.summary}
                      </p>
                    </div>
                    <span className="shrink-0 font-mono text-[10px] text-app-text-muted pt-0.5">
                      {note.readingTime}
                    </span>
                  </div>
                  <div className="mt-2 flex items-center gap-2">
                    <span className="font-mono text-[10px] text-app-text-muted">
                      {new Date(note.date).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      })}
                    </span>
                    <div className="flex gap-1">
                      {note.tags.map((tag) => (
                        <Badge key={tag} variant="muted">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="rounded-sm border border-app-border bg-app-panel p-6 text-center">
              <p className="font-mono text-xs text-app-text-muted">
                Notes coming soon.
              </p>
            </div>
          )}
        </motion.div>

        {/* GitHub activity + stats — right */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.1 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          <GitHubGraph weeks={contributions} />

          {/* GitHub stats */}
          <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { label: "Repos", value: "28" },
              { label: "Stars", value: "64" },
              { label: "Commits (yr)", value: "847" },
              { label: "PRs merged", value: "132" },
            ].map((stat) => (
              <div
                key={stat.label}
                className="rounded-sm border border-app-border bg-app-panel p-3 text-center"
              >
                <p className="font-mono text-lg font-semibold text-app-text">
                  {stat.value}
                </p>
                <p className="font-mono text-[10px] uppercase tracking-widest text-app-text-muted mt-0.5">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* ── Two-column: Contact form + Certifications ──────── */}
      <div className={`grid grid-cols-1 gap-10 lg:gap-14 ${certificates.length > 0 ? "lg:grid-cols-2" : ""}`}>
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.1 }}
          transition={{ duration: 0.4 }}
        >
          <ContactForm />
        </motion.div>

        {certificates.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.1 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          <p className="font-mono text-[10px] uppercase tracking-widest text-app-text-muted mb-4">
            Certifications
          </p>

          <div className="space-y-3">
            {certificates.map((cert) => (
              <div
                key={cert.title}
                className="group flex items-start gap-3 rounded-sm border border-app-border bg-app-panel p-3 transition-colors hover:border-app-accent/30 hover:bg-app-hover"
              >
                <Award className="size-4 shrink-0 text-app-accent mt-0.5" strokeWidth={1.5} />
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-sans text-app-text leading-snug">
                    {cert.title}
                  </p>
                  <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-0.5">
                    <span className="font-mono text-[10px] text-app-text-muted">
                      {cert.issuer}
                    </span>
                    <span className="font-mono text-[10px] text-app-text-muted">·</span>
                    <span className="font-mono text-[10px] text-app-text-muted">
                      {new Date(cert.date + "-01").toLocaleDateString("en-US", {
                        month: "short",
                        year: "numeric",
                      })}
                    </span>
                  </div>
                </div>
                {cert.credentialUrl && (
                  <a
                    href={cert.credentialUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="shrink-0 text-app-text-muted transition-colors hover:text-app-accent"
                    aria-label="View credential"
                  >
                    <ExternalLink className="size-3" />
                  </a>
                )}
              </div>
            ))}
          </div>
        </motion.div>
        )}
      </div>
    </div>
  );
}
