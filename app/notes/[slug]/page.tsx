"use client";

import { use } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, Mail } from "lucide-react";
import { MOCK_NOTES } from "@/lib/data";
import { Badge } from "@/components/ui/badge-custom";
import { EmptyState } from "@/components/ui/empty-state";
import { FileText } from "lucide-react";

// Scroll reveal wrapper for paragraphs
function Reveal({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.4, delay }}
    >
      {children}
    </motion.div>
  );
}

function RedisPostContent() {
  return (
    <article className="space-y-6 text-base leading-relaxed text-app-text-secondary">
      <Reveal>
        <p>
          Every few months, someone in my orbit discovers they need a job queue and
          immediately reaches for Kafka. I get it — Kafka is impressive technology,
          and mentioning it in a design doc makes the architecture feel serious. But
          for the vast majority of queue workloads I&apos;ve encountered, Redis does
          the job with a fraction of the operational complexity.
        </p>
      </Reveal>

      <Reveal>
        <h2 className="text-2xl font-sans font-semibold text-app-text pt-4">
          The LPUSH/BRPOP pattern
        </h2>
      </Reveal>

      <Reveal>
        <p>
          The core of a Redis-based job queue is embarrassingly simple. A producer
          pushes a serialized job onto a list with{" "}
          <code className="rounded-sm bg-app-hover px-1 py-0.5 font-mono text-sm">
            LPUSH
          </code>
          , and a consumer blocks on the other end with{" "}
          <code className="rounded-sm bg-app-hover px-1 py-0.5 font-mono text-sm">
            BRPOP
          </code>
          . That&apos;s it. No partitions, no consumer groups, no offset management.
          The list is the queue.
        </p>
      </Reveal>

      <Reveal>
        <div className="rounded-sm border border-app-border bg-app-panel p-4 overflow-x-auto">
          <pre className="font-mono text-sm text-app-text">
            <code>{`// Producer
await redis.lpush('jobs:email', JSON.stringify({
  id: generateId(),
  type: 'welcome-email',
  payload: { userId: '12345', template: 'onboarding' },
  createdAt: Date.now(),
}));

// Consumer
while (true) {
  const [, raw] = await redis.brpop('jobs:email', 0);
  const job = JSON.parse(raw);
  await processJob(job);
}`}</code>
          </pre>
        </div>
      </Reveal>

      <Reveal>
        <p>
          You get exactly-once delivery semantics (as long as the consumer
          finishes processing before crashing — more on that below), FIFO ordering,
          and the ability to scale consumers horizontally by just running more
          processes. Redis handles the blocking efficiently using its event loop,
          so idle consumers cost you almost nothing.
        </p>
      </Reveal>

      <Reveal>
        <h2 className="text-2xl font-sans font-semibold text-app-text pt-4">
          When to actually use Kafka
        </h2>
      </Reveal>

      <Reveal>
        <p>
          Kafka earns its complexity in specific scenarios: when you need event
          replay (reading the same stream from the beginning), when throughput is
          measured in hundreds of thousands of messages per second, or when you need
          multiple independent consumers processing the same stream differently.
          These are real requirements — they&apos;re just not most people&apos;s requirements.
        </p>
      </Reveal>

      <Reveal>
        <blockquote className="border-l-2 border-app-accent pl-4 italic text-app-text-secondary">
          The best infrastructure decision is the one that lets your team sleep
          through the night. A Redis list that you understand beats a Kafka cluster
          that nobody on the team can debug at 3 AM.
        </blockquote>
      </Reveal>

      <Reveal>
        <p>
          The failure mode question is where it gets nuanced. If a Redis worker
          crashes after popping a job but before completing it, that job is gone.
          The standard mitigation is the{" "}
          <code className="rounded-sm bg-app-hover px-1 py-0.5 font-mono text-sm">
            RPOPLPUSH
          </code>{" "}
          pattern: atomically pop from the work queue and push onto a processing
          queue, then remove from the processing queue on completion. A monitor
          process checks the processing queue for stale entries and re-enqueues
          them. It&apos;s not as elegant as Kafka&apos;s consumer group offset tracking,
          but it works, and you can reason about it by reading five lines of code
          instead of five pages of documentation.
        </p>
      </Reveal>

      <Reveal>
        <p>
          For the job queue I built, Redis handles around 2,000 jobs per second on
          a single $20/month Hetzner box. That&apos;s more than enough for most
          applications that aren&apos;t operating at a scale where they&apos;d have a
          dedicated infrastructure team anyway. Start simple. Add complexity when
          the metrics tell you to, not when the architecture diagram tells you to.
        </p>
      </Reveal>
    </article>
  );
}

export default function NotePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  const note = MOCK_NOTES.find((n) => n.slug === slug);

  if (!note) {
    return (
      <EmptyState
        title="Note not found"
        icon={FileText}
      />
    );
  }

  const hasContent = slug === "why-redis-is-enough";

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
          {new Date(note.date).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </p>
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-sans font-bold tracking-tight text-app-text leading-tight">
          {note.title}
        </h1>
        <div className="mt-3 flex items-center gap-3">
          <span className="font-mono text-xs text-app-text-muted">
            {note.readingTime}
          </span>
          <div className="flex gap-1.5">
            {note.tags.map((tag) => (
              <Badge key={tag} variant="muted">
                {tag}
              </Badge>
            ))}
          </div>
        </div>
      </motion.header>

      {/* Body */}
      {hasContent ? (
        <RedisPostContent />
      ) : (
        <EmptyState
          title="Content not built"
          description="This is a prototype. Only the first note has content."
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
            {note.tags.map((tag) => (
              <Badge key={tag} variant="muted">
                {tag}
              </Badge>
            ))}
          </div>
          <a
            href={`mailto:dipendrabhatta.gdscfetju@gmail.com?subject=Re: ${note.title}`}
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
