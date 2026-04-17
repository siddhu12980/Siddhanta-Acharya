import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getProject, getAllProjectSlugs } from "@/lib/content";
import { renderMDX } from "@/lib/mdx";
import { ProjectPageClient } from "./client";
import { SITE_URL, SITE_NAME } from "@/lib/seo";

export async function generateStaticParams() {
  const slugs = await getAllProjectSlugs();
  return slugs.map((slug) => ({ slug }));
}

export const revalidate = 3600;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProject(slug);
  if (!project) return {};
  const { frontmatter } = project;
  const url = `${SITE_URL}/projects/${slug}`;
  return {
    title: frontmatter.title,
    description: frontmatter.tagline,
    alternates: { canonical: url },
    openGraph: {
      url,
      type: "article",
      title: `${frontmatter.title} — ${SITE_NAME}`,
      description: frontmatter.tagline,
    },
    twitter: {
      title: `${frontmatter.title} — ${SITE_NAME}`,
      description: frontmatter.tagline,
    },
  };
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = await getProject(slug);

  if (!project) {
    notFound();
  }

  const { frontmatter, content: rawContent } = project;

  // Render the MDX body (About tab content) on the server
  let aboutContent: React.ReactNode = null;
  if (rawContent.trim()) {
    aboutContent = await renderMDX(rawContent);
  }

  return (
    <ProjectPageClient
      frontmatter={frontmatter}
      aboutContent={aboutContent}
    />
  );
}
