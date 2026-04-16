"use client";

import { Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ExternalLink, Package } from "lucide-react";
import type { ProjectFrontmatter } from "@/lib/content";
import { Badge } from "@/components/ui/badge-custom";
import { EmptyState } from "@/components/ui/empty-state";
import { ArchitectureTab } from "@/components/architecture/architecture-tab";
import { DemoTab } from "@/components/demos/demo-tab";

const TABS = ["architecture", "demo", "about"] as const;
type Tab = (typeof TABS)[number];

interface ProjectPageClientProps {
  frontmatter: ProjectFrontmatter;
  aboutContent: React.ReactNode;
}

export function ProjectPageClient({
  frontmatter,
  aboutContent,
}: ProjectPageClientProps) {
  return (
    <Suspense>
      <ProjectPageInner
        frontmatter={frontmatter}
        aboutContent={aboutContent}
      />
    </Suspense>
  );
}

function ProjectPageInner({
  frontmatter,
  aboutContent,
}: ProjectPageClientProps) {
  const searchParams = useSearchParams();
  const activeTab = (searchParams.get("tab") as Tab) || "architecture";

  const statusVariant =
    frontmatter.status === "live"
      ? "live"
      : frontmatter.status === "degraded"
        ? "degraded"
        : "offline";

  const hasArchitecture = !!frontmatter.architecture;
  const hasSimulation = !!frontmatter.simulation && hasArchitecture;
  const hasAbout = !!aboutContent;

  return (
    <div className="px-5 py-8 sm:px-8 sm:py-10 lg:px-10">
      {/* Header */}
      <div className="mb-6 sm:mb-8">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="text-xl sm:text-2xl font-sans font-semibold text-app-text">
              {frontmatter.title}
            </h1>
            <p className="mt-1 text-sm text-app-text-secondary">
              {frontmatter.tagline}
            </p>
          </div>
          <a
            href={frontmatter.liveUrl || frontmatter.repo}
            target="_blank"
            rel="noopener noreferrer"
            className="flex w-fit items-center gap-1.5 rounded-sm border border-app-border px-2.5 py-1 font-mono text-[10px] uppercase tracking-widest text-app-text-muted transition-colors hover:bg-app-hover hover:text-app-text"
          >
            {frontmatter.liveUrl ? "Open live" : "View code"}
            <ExternalLink className="size-3" />
          </a>
        </div>

        {/* Stack chips */}
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <Badge variant={statusVariant}>{frontmatter.status}</Badge>
          {frontmatter.stack.map((tech) => (
            <Badge key={tech} variant="muted">
              {tech}
            </Badge>
          ))}
        </div>

        {/* Tabs */}
        <div className="mt-5 sm:mt-6 flex gap-0 border-b border-app-border overflow-x-auto">
          {TABS.map((tab) => (
            <Link
              key={tab}
              href={`/projects/${frontmatter.slug}?tab=${tab}`}
              className="relative shrink-0 px-3 sm:px-4 py-2 font-mono text-xs uppercase tracking-widest text-app-text-muted transition-colors hover:text-app-text"
              scroll={false}
            >
              {activeTab === tab && (
                <motion.div
                  layoutId="project-tab-indicator"
                  className="absolute bottom-0 left-0 right-0 h-px bg-app-accent"
                  transition={{
                    type: "spring",
                    stiffness: 400,
                    damping: 30,
                  }}
                />
              )}
              <span
                className={
                  activeTab === tab ? "text-app-text" : ""
                }
              >
                {tab}
              </span>
            </Link>
          ))}
        </div>
      </div>

      {/* Tab content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.2 }}
        >
          {activeTab === "architecture" && (
            hasArchitecture ? (
              <ArchitectureTab
                nodes={frontmatter.architecture!.nodes}
                edges={frontmatter.architecture!.edges}
              />
            ) : (
              <EmptyState
                title="Architecture not built yet"
                description="The architecture diagram for this project is coming soon."
                icon={Package}
              />
            )
          )}
          {activeTab === "demo" && (
            hasSimulation ? (
              <DemoTab
                nodes={frontmatter.architecture!.nodes}
                edges={frontmatter.architecture!.edges}
                simulation={frontmatter.simulation!}
              />
            ) : (
              <EmptyState
                title="Demo not available"
                description="The interactive demo for this project is coming soon."
                icon={Package}
              />
            )
          )}
          {activeTab === "about" && (
            hasAbout ? (
              <div className="max-w-[65ch] space-y-4 text-sm sm:text-base leading-relaxed text-app-text-secondary">
                {aboutContent}
              </div>
            ) : (
              <EmptyState
                title="About not written yet"
                description="The write-up for this project is coming soon."
                icon={Package}
              />
            )
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
