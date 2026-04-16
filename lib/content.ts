import fs from "node:fs/promises";
import path from "node:path";
import matter from "gray-matter";
import { z } from "zod";

// ── Directories ──────────────────────────────────────────────────

const CONTENT_DIR = path.join(process.cwd(), "content");
const PROJECTS_DIR = path.join(CONTENT_DIR, "projects");
const NOTES_DIR = path.join(CONTENT_DIR, "notes");

// ── Schemas ──────────────────────────────────────────────────────

const ProjectStatus = z.enum(["live", "degraded", "offline"]);

const ArchNodeSchema = z.object({
  id: z.string(),
  label: z.string(),
  sub: z.string().optional(),
  type: z.enum(["external", "service", "datastore"]),
  x: z.number(),
  y: z.number(),
});

const ArchEdgeSchema = z.object({
  id: z.string(),
  from: z.string(),
  to: z.string(),
  label: z.string(),
});

const SimulationStepSchema = z.object({
  delay: z.number(),
  edgeId: z.string().optional(),
  pulseNode: z.string().optional(),
  log: z.string(),
});

const SimulationSchema = z.object({
  steps: z.array(SimulationStepSchema),
  totalDuration: z.number(),
  buttonLabel: z.string(),
  counterPrefix: z.string(),
});

const ArchitectureSchema = z.object({
  nodes: z.array(ArchNodeSchema),
  edges: z.array(ArchEdgeSchema),
});

const ProjectFrontmatterSchema = z.object({
  slug: z.string(),
  title: z.string(),
  tagline: z.string(),
  category: z.string(),
  status: ProjectStatus,
  repo: z.string().url(),
  liveUrl: z.string().url().nullable().optional(),
  stack: z.array(z.string()),
  order: z.number(),
  architecture: ArchitectureSchema.optional(),
  simulation: SimulationSchema.optional(),
});

const NoteFrontmatterSchema = z.object({
  slug: z.string(),
  title: z.string(),
  date: z.string(), // ISO date string
  tags: z.array(z.string()),
  summary: z.string(),
});

// ── Exported types ───────────────────────────────────────────────

export type ProjectStatus = z.infer<typeof ProjectStatus>;
export type ArchNode = z.infer<typeof ArchNodeSchema>;
export type ArchEdge = z.infer<typeof ArchEdgeSchema>;
export type SimulationStep = z.infer<typeof SimulationStepSchema>;
export type Simulation = z.infer<typeof SimulationSchema>;
export type ProjectFrontmatter = z.infer<typeof ProjectFrontmatterSchema>;
export type NoteFrontmatter = z.infer<typeof NoteFrontmatterSchema>;

export interface Project {
  frontmatter: ProjectFrontmatter;
  content: string; // raw MDX body (About tab)
}

export interface Note {
  frontmatter: NoteFrontmatter;
  content: string; // raw MDX body
  readingTime: string;
}

// ── Helpers ──────────────────────────────────────────────────────

function computeReadingTime(text: string): string {
  const words = text.trim().split(/\s+/).length;
  const minutes = Math.max(1, Math.ceil(words / 200));
  return `${minutes} min`;
}

async function readMdxFile(filePath: string) {
  const raw = await fs.readFile(filePath, "utf-8");
  return matter(raw);
}

function parseProjectFrontmatter(
  data: Record<string, unknown>,
  filePath: string,
): ProjectFrontmatter {
  const result = ProjectFrontmatterSchema.safeParse(data);
  if (!result.success) {
    const errors = result.error.issues
      .map((i) => `  - ${i.path.join(".")}: ${i.message}`)
      .join("\n");
    throw new Error(
      `Invalid project frontmatter in ${filePath}:\n${errors}`,
    );
  }
  return result.data;
}

function parseNoteFrontmatter(
  data: Record<string, unknown>,
  filePath: string,
): NoteFrontmatter {
  const result = NoteFrontmatterSchema.safeParse(data);
  if (!result.success) {
    const errors = result.error.issues
      .map((i) => `  - ${i.path.join(".")}: ${i.message}`)
      .join("\n");
    throw new Error(
      `Invalid note frontmatter in ${filePath}:\n${errors}`,
    );
  }
  return result.data;
}

// ── Project loaders ──────────────────────────────────────────────

export async function getProject(slug: string): Promise<Project | null> {
  const filePath = path.join(PROJECTS_DIR, `${slug}.mdx`);
  try {
    const { data, content } = await readMdxFile(filePath);
    const frontmatter = parseProjectFrontmatter(data, filePath);
    return { frontmatter, content };
  } catch (err) {
    if ((err as NodeJS.ErrnoException).code === "ENOENT") return null;
    throw err;
  }
}

export async function getAllProjects(): Promise<Project[]> {
  let files: string[];
  try {
    files = await fs.readdir(PROJECTS_DIR);
  } catch {
    return [];
  }

  const mdxFiles = files.filter((f) => f.endsWith(".mdx"));
  const projects: Project[] = [];

  for (const file of mdxFiles) {
    const filePath = path.join(PROJECTS_DIR, file);
    const { data, content } = await readMdxFile(filePath);
    const frontmatter = parseProjectFrontmatter(data, filePath);
    projects.push({ frontmatter, content });
  }

  projects.sort((a, b) => a.frontmatter.order - b.frontmatter.order);
  return projects;
}

// ── Note loaders ─────────────────────────────────────────────────

export async function getNote(slug: string): Promise<Note | null> {
  let files: string[];
  try {
    files = await fs.readdir(NOTES_DIR);
  } catch {
    return null;
  }

  // Notes may be named with date prefix or just slug
  const mdxFiles = files.filter((f) => f.endsWith(".mdx"));
  for (const file of mdxFiles) {
    const filePath = path.join(NOTES_DIR, file);
    const { data, content } = await readMdxFile(filePath);
    const frontmatter = parseNoteFrontmatter(data, filePath);
    if (frontmatter.slug === slug) {
      return {
        frontmatter,
        content,
        readingTime: computeReadingTime(content),
      };
    }
  }

  return null;
}

export async function getAllNotes(): Promise<Note[]> {
  let files: string[];
  try {
    files = await fs.readdir(NOTES_DIR);
  } catch {
    return [];
  }

  const mdxFiles = files.filter((f) => f.endsWith(".mdx"));
  const notes: Note[] = [];

  for (const file of mdxFiles) {
    const filePath = path.join(NOTES_DIR, file);
    const { data, content } = await readMdxFile(filePath);
    const frontmatter = parseNoteFrontmatter(data, filePath);
    notes.push({
      frontmatter,
      content,
      readingTime: computeReadingTime(content),
    });
  }

  // Reverse chronological
  notes.sort(
    (a, b) =>
      new Date(b.frontmatter.date).getTime() -
      new Date(a.frontmatter.date).getTime(),
  );
  return notes;
}

// ── Slug helpers (for generateStaticParams) ──────────────────────

export async function getAllProjectSlugs(): Promise<string[]> {
  const projects = await getAllProjects();
  return projects.map((p) => p.frontmatter.slug);
}

export async function getAllNoteSlugs(): Promise<string[]> {
  const notes = await getAllNotes();
  return notes.map((n) => n.frontmatter.slug);
}
