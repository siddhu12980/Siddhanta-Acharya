"use server";

import fs from "node:fs/promises";
import path from "node:path";
import matter from "gray-matter";

const NOTES_DIR = path.join(process.cwd(), "content", "notes");

export interface SaveResult {
  slug?: string;
  error?: string;
}

export async function saveNote(
  rawContent: string,
  overwrite = false,
): Promise<SaveResult> {
  let parsed: ReturnType<typeof matter>;
  try {
    parsed = matter(rawContent);
  } catch {
    return { error: "Could not parse frontmatter — check YAML syntax" };
  }

  const { data, content } = parsed;
  const slug = (data.slug as string | undefined)?.trim();

  if (!slug) return { error: "Frontmatter is missing a `slug` field" };
  if (!/^[a-z0-9-]+$/.test(slug))
    return {
      error:
        "Slug must contain only lowercase letters, numbers, and hyphens",
    };
  if (!data.title) return { error: "Frontmatter is missing a `title` field" };
  if (!data.date) return { error: "Frontmatter is missing a `date` field" };
  if (!data.summary)
    return { error: "Frontmatter is missing a `summary` field" };
  if (!Array.isArray(data.tags) || data.tags.length === 0)
    return { error: "Frontmatter must include at least one tag" };

  if (content.trim().length === 0)
    return { error: "Note body cannot be empty" };

  await fs.mkdir(NOTES_DIR, { recursive: true });

  const filePath = path.join(NOTES_DIR, `${slug}.mdx`);

  if (!overwrite) {
    try {
      await fs.access(filePath);
      return {
        error: `A note with slug "${slug}" already exists. Enable overwrite to replace it.`,
      };
    } catch {
      // File does not exist — good
    }
  }

  await fs.writeFile(filePath, rawContent, "utf-8");
  return { slug };
}
