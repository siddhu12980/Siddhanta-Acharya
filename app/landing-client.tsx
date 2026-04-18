"use client";

import { useMemo, useRef, useState } from "react";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, ExternalLink, Award, Send, Download, GraduationCap } from "lucide-react";
import { RESUME_URL } from "@/lib/seo";
import { StatusDot } from "@/components/ui/status-dot";
import { Badge } from "@/components/ui/badge-custom";
import { TechIcon } from "@/components/ui/tech-icon";
import type { ProjectFrontmatter, NoteFrontmatter } from "@/lib/content";
import type { SkillCategory } from "@/lib/profile";
import type { Certificate } from "@/lib/certificates";
import type { GitHubStats } from "@/lib/github";
import type { WorkExperience } from "@/lib/experience";
import type { Education } from "@/lib/education";

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
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("sending");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, message }),
      });

      if (!res.ok) throw new Error();

      setStatus("sent");
      setName("");
      setEmail("");
      setMessage("");
      setTimeout(() => setStatus("idle"), 4000);
    } catch {
      setStatus("error");
      setTimeout(() => setStatus("idle"), 4000);
    }
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
          disabled={status === "sending" || status === "sent"}
          className="inline-flex items-center gap-2 rounded-sm bg-app-solid px-4 py-2 font-mono text-xs uppercase tracking-widest text-app-solid-text transition-colors hover:bg-app-accent disabled:opacity-60 disabled:cursor-not-allowed"
        >
          <Send className="size-3" />
          {status === "sending" && "Sending..."}
          {status === "sent" && "Message sent!"}
          {status === "error" && "Failed — try again"}
          {status === "idle" && "Send message"}
        </button>
      </form>
    </div>
  );
}

function ExperienceTimeline({ experience }: { experience: WorkExperience[] }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 0.85", "end 0.35"],
  });
  const lineScaleY = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.05 }}
      transition={{ duration: 0.4 }}
      className="mb-14 sm:mb-20"
    >
      <p className="font-mono text-[10px] uppercase tracking-widest text-app-text-muted mb-8">
        Experience
      </p>

      <div ref={containerRef} className="relative pl-7">
        {/* Static background rail */}
        <div className="absolute left-[6px] top-2 bottom-2 w-px bg-app-border" />

        {/* Scroll-tied progress line */}
        <motion.div
          className="absolute left-[6px] top-2 bottom-2 w-px bg-gradient-to-b from-app-accent via-app-accent/80 to-app-accent/20"
          style={{ scaleY: lineScaleY, transformOrigin: "top" }}
        />

        <div className="space-y-10">
          {experience.map((job, i) => (
            <TimelineEntry
              key={job.company}
              job={job}
              index={i}
              scrollYProgress={scrollYProgress}
              total={experience.length}
            />
          ))}
        </div>
      </div>
    </motion.div>
  );
}

function TimelineEntry({
  job,
  index,
  scrollYProgress,
  total,
}: {
  job: WorkExperience;
  index: number;
  scrollYProgress: ReturnType<typeof useScroll>["scrollYProgress"];
  total: number;
}) {
  // Each dot "activates" when the scroll progress passes its position
  const activationPoint = total > 1 ? index / (total - 1) : 0;
  const windowStart = Math.max(0, activationPoint - 0.08);
  const windowEnd = Math.min(1, activationPoint + 0.04);

  const dotScale = useTransform(
    scrollYProgress,
    [windowStart, windowEnd],
    [1, 1.35],
  );
  const innerScale = useTransform(
    scrollYProgress,
    [windowStart, windowEnd],
    [0.5, 1],
  );
  const glowOpacity = useTransform(
    scrollYProgress,
    [windowStart, windowEnd],
    [0, 0.5],
  );
  const glowScale = useTransform(
    scrollYProgress,
    [windowStart, windowEnd],
    [1, 2.2],
  );

  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.5, delay: index * 0.08 }}
      className="relative"
    >
      {/* Glow halo (behind dot) */}
      <motion.div
        className="absolute -left-7 top-1 size-[13px] rounded-full bg-app-accent blur-md pointer-events-none"
        style={{ opacity: glowOpacity, scale: glowScale }}
      />
      {/* Timeline dot */}
      <motion.div
        className="absolute -left-7 top-1 size-[13px] rounded-full border border-app-accent bg-app-bg flex items-center justify-center"
        style={{ scale: dotScale }}
      >
        <motion.div
          className="size-[5px] rounded-full bg-app-accent"
          style={{ scale: innerScale }}
        />
      </motion.div>

      <div className="flex items-start justify-between gap-4 flex-wrap mb-0.5">
        <p className="text-sm font-sans text-app-text">{job.role}</p>
        <span className="shrink-0 font-mono text-[10px] text-app-text-muted pt-0.5">
          {job.period}
        </span>
      </div>

      <div className="flex items-center gap-2 mb-3 flex-wrap">
        <p className="font-mono text-[10px] uppercase tracking-widest text-app-accent/70">
          {job.company}
        </p>
        {job.location && (
          <>
            <span className="font-mono text-[10px] text-app-text-muted">·</span>
            <span className="font-mono text-[10px] text-app-text-muted">
              {job.location}
            </span>
          </>
        )}
      </div>

      <ul className="space-y-2">
        {job.highlights.map((h) => (
          <li
            key={h}
            className="flex items-start gap-2 text-xs text-app-text-muted leading-relaxed"
          >
            <span className="mt-[7px] size-1 shrink-0 rounded-full bg-app-border" />
            {h}
          </li>
        ))}
      </ul>

      {job.stack && (
        <div className="flex flex-wrap gap-1 mt-3">
          {job.stack.map((tech) => (
            <Badge key={tech} variant="muted">
              {tech}
            </Badge>
          ))}
        </div>
      )}
    </motion.div>
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
  githubStats: GitHubStats;
  experience: WorkExperience[];
  education: Education[];
}

export function LandingPageClient({
  projects,
  notes,
  skills,
  certificates,
  contributions,
  githubStats,
  experience,
  education,
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
          Full-stack developer who keeps getting pulled toward the backend.
          I like building things that actually scale — queues, pipelines,
          distributed state — and understanding why they break under load.
          Learning fast, shipping real code and writing
          about what I pick up along the way.
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
          <a
            href={RESUME_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-sm border border-app-border px-3 py-1.5 font-mono text-xs uppercase tracking-widest text-app-text-secondary transition-colors hover:border-app-accent/40 hover:text-app-accent"
          >
            <Download className="size-3" />
            Download resume
          </a>
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

      {/* ── Work experience (timeline) ───────────────────────── */}
      {experience.length > 0 && <ExperienceTimeline experience={experience} />}

      {/* ── Education ────────────────────────────────────────── */}
      {education.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.1 }}
          transition={{ duration: 0.4 }}
          className="mb-14 sm:mb-20"
        >
          <p className="font-mono text-[10px] uppercase tracking-widest text-app-text-muted mb-5">
            Education
          </p>

          <div className="space-y-3">
            {education.map((ed) => (
              <div
                key={ed.institution}
                className="group flex items-start gap-3 rounded-sm border border-app-border bg-app-panel p-4 transition-colors hover:border-app-accent/30 hover:bg-app-hover"
              >
                <GraduationCap
                  className="size-4 shrink-0 text-app-accent mt-0.5"
                  strokeWidth={1.5}
                />
                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-4 flex-wrap">
                    <p className="text-sm font-sans text-app-text">{ed.degree}</p>
                    <span className="shrink-0 font-mono text-[10px] text-app-text-muted pt-0.5">
                      {ed.period}
                    </span>
                  </div>

                  <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-0.5">
                    <span className="font-mono text-[10px] uppercase tracking-widest text-app-accent/70">
                      {ed.institution}
                    </span>
                    <span className="font-mono text-[10px] text-app-text-muted">·</span>
                    <span className="font-mono text-[10px] text-app-text-muted">
                      {ed.location}
                    </span>
                    {ed.sgpa && (
                      <>
                        <span className="font-mono text-[10px] text-app-text-muted">·</span>
                        <span className="font-mono text-[10px] text-app-text-muted">
                          SGPA {ed.sgpa}
                        </span>
                      </>
                    )}
                  </div>

                  {ed.coursework && ed.coursework.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-1">
                      {ed.coursework.map((course) => (
                        <Badge key={course} variant="muted">
                          {course}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}

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
              { label: "Repos", value: String(githubStats.repos) },
              { label: "Stars", value: String(githubStats.stars) },
              { label: "Commits (yr)", value: String(githubStats.commitsThisYear) },
              { label: "PRs merged", value: String(githubStats.prsMerged) },
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
