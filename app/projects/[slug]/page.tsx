import { notFound } from "next/navigation";
import { getProject, getAllProjectSlugs } from "@/lib/content";
import { renderMDX } from "@/lib/mdx";
import { ProjectPageClient } from "./client";

export async function generateStaticParams() {
  const slugs = await getAllProjectSlugs();
  return slugs.map((slug) => ({ slug }));
}

export const revalidate = 3600;

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
