"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, FileText, Menu, X } from "lucide-react";
import { StatusDot } from "@/components/ui/status-dot";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { Divider } from "@/components/ui/divider";
import type { ProjectFrontmatter } from "@/lib/content";

// Brand SVG icons (lucide-react dropped brand icons)
function GithubIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
    </svg>
  );
}

function LinkedinIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

function TwitterIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

const SOCIAL_LINKS = [
  { icon: GithubIcon, href: "https://github.com/siddhu12980", label: "GitHub" },
  {
    icon: LinkedinIcon,
    href: "https://linkedin.com/in/siddhanta-acharya",
    label: "LinkedIn",
  },
  { icon: Mail, href: "mailto:dipendrabhatta.gdscfetju@gmail.com", label: "Email" },
  { icon: TwitterIcon, href: "https://twitter.com/siddhu12980", label: "Twitter" },
];

interface SidebarProps {
  projects: ProjectFrontmatter[];
}

function SidebarContent({
  projects,
  onNavigate,
}: {
  projects: ProjectFrontmatter[];
  onNavigate?: () => void;
}) {
  const pathname = usePathname();

  const activeSlug = pathname.startsWith("/projects/")
    ? pathname.split("/")[2]
    : null;

  const isNotesActive = pathname.startsWith("/notes");

  // Group projects by category
  const projectsByCategory = projects.reduce(
    (acc, project) => {
      if (!acc[project.category]) acc[project.category] = [];
      acc[project.category].push(project);
      return acc;
    },
    {} as Record<string, ProjectFrontmatter[]>,
  );

  return (
    <>
      {/* Identity block */}
      <div className="px-5 pt-6 pb-4">
        <Link href="/" className="block" onClick={onNavigate}>
          <h1 className="text-base font-medium text-app-text">
            Siddhant Acharya
          </h1>
          <p className="mt-0.5 font-mono text-[10px] uppercase tracking-widest text-app-text-muted">
            Full-stack · scalable systems
          </p>
        </Link>

        {/* Socials */}
        <div className="mt-3 flex items-center gap-2">
          {SOCIAL_LINKS.map(({ icon: Icon, href, label }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="flex size-7 items-center justify-center rounded-sm text-app-text-muted transition-colors hover:text-app-accent"
              aria-label={label}
            >
              <Icon className="size-3.5" />
            </a>
          ))}
        </div>
      </div>

      <Divider className="mx-5" />

      {/* Project list */}
      <nav className="flex-1 overflow-y-auto px-3 py-3" aria-label="Projects">
        {Object.entries(projectsByCategory).map(
          ([category, categoryProjects]) => (
            <div key={category} className="mb-4">
              <p className="mb-1.5 px-2 font-mono text-[10px] uppercase tracking-widest text-app-text-muted">
                {category}
              </p>
              {categoryProjects.map((project) => {
                const isActive = activeSlug === project.slug;
                return (
                  <Link
                    key={project.slug}
                    href={`/projects/${project.slug}`}
                    onClick={onNavigate}
                    className="relative flex items-center gap-2.5 rounded-sm px-2 py-1.5 font-mono text-xs text-app-text-secondary transition-colors hover:text-app-text"
                  >
                    {isActive && (
                      <motion.div
                        layoutId="sidebar-indicator"
                        className="absolute inset-0 rounded-sm bg-app-accent-muted"
                        transition={{
                          type: "spring",
                          stiffness: 400,
                          damping: 30,
                          duration: 0.25,
                        }}
                      />
                    )}
                    <StatusDot
                      status={project.status}
                      className="relative z-10"
                    />
                    <span className="relative z-10 truncate">
                      {project.title}
                    </span>
                  </Link>
                );
              })}
            </div>
          ),
        )}
      </nav>

      <Divider className="mx-5" />

      {/* Notes link */}
      <div className="px-3 py-2">
        <Link
          href="/notes"
          onClick={onNavigate}
          className="relative flex items-center gap-2.5 rounded-sm px-2 py-1.5 font-mono text-xs text-app-text-secondary transition-colors hover:text-app-text"
        >
          {isNotesActive && (
            <motion.div
              layoutId="sidebar-indicator"
              className="absolute inset-0 rounded-sm bg-app-accent-muted"
              transition={{
                type: "spring",
                stiffness: 400,
                damping: 30,
                duration: 0.25,
              }}
            />
          )}
          <FileText className="relative z-10 size-3.5" />
          <span className="relative z-10">Notes</span>
        </Link>
      </div>

      <Divider className="mx-5" />

      {/* Footer */}
      <div className="flex items-center justify-between px-5 py-4">
        <p className="font-mono text-[10px] leading-relaxed text-app-text-muted">
          Available for fullstack / backend roles
          <br />
          Remote or Bangalore
        </p>
        <ThemeToggle />
      </div>
    </>
  );
}

export function Sidebar({ projects }: SidebarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  // Close mobile drawer on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  // Prevent body scroll when drawer is open
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  return (
    <>
      {/* Mobile hamburger button */}
      <button
        onClick={() => setMobileOpen(true)}
        className="fixed left-4 top-4 z-50 flex size-10 items-center justify-center rounded-sm border border-app-border bg-app-panel text-app-text-secondary transition-colors hover:bg-app-hover lg:hidden"
        aria-label="Open menu"
      >
        <Menu className="size-5" />
      </button>

      {/* Desktop sidebar — always visible */}
      <aside className="fixed left-0 top-0 z-40 hidden h-screen w-[260px] flex-col border-r border-app-border bg-app-rail lg:flex">
        <SidebarContent projects={projects} />
      </aside>

      {/* Mobile drawer overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm lg:hidden"
              onClick={() => setMobileOpen(false)}
            />

            {/* Drawer */}
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", stiffness: 400, damping: 40 }}
              className="fixed left-0 top-0 z-50 flex h-screen w-[280px] flex-col border-r border-app-border bg-app-rail lg:hidden"
            >
              {/* Close button */}
              <button
                onClick={() => setMobileOpen(false)}
                className="absolute right-3 top-4 flex size-8 items-center justify-center rounded-sm text-app-text-muted transition-colors hover:bg-app-hover hover:text-app-text"
                aria-label="Close menu"
              >
                <X className="size-4" />
              </button>

              <SidebarContent
                projects={projects}
                onNavigate={() => setMobileOpen(false)}
              />
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
