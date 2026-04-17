import type { MetadataRoute } from "next";
import { getAllProjects, getAllNotes } from "@/lib/content";
import { SITE_URL } from "@/lib/seo";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [projects, notes] = await Promise.all([
    getAllProjects(),
    getAllNotes(),
  ]);

  const projectUrls = projects.map((p) => ({
    url: `${SITE_URL}/projects/${p.frontmatter.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  const noteUrls = notes.map((n) => ({
    url: `${SITE_URL}/notes/${n.frontmatter.slug}`,
    lastModified: new Date(n.frontmatter.date),
    changeFrequency: "never" as const,
    priority: 0.7,
  }));

  return [
    {
      url: SITE_URL,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${SITE_URL}/notes`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    ...projectUrls,
    ...noteUrls,
  ];
}
