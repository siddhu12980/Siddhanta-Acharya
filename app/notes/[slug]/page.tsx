import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getNote, getAllNoteSlugs } from "@/lib/content";
import { renderMDX } from "@/lib/mdx";
import { NotePageClient } from "./client";
import { SITE_URL, SITE_NAME } from "@/lib/seo";

export async function generateStaticParams() {
  const slugs = await getAllNoteSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const note = await getNote(slug);
  if (!note) return {};
  const { frontmatter } = note;
  const url = `${SITE_URL}/notes/${slug}`;
  return {
    title: frontmatter.title,
    description: frontmatter.summary,
    alternates: { canonical: url },
    openGraph: {
      url,
      type: "article",
      title: `${frontmatter.title} — ${SITE_NAME}`,
      description: frontmatter.summary,
      publishedTime: frontmatter.date,
      tags: frontmatter.tags,
    },
    twitter: {
      title: `${frontmatter.title} — ${SITE_NAME}`,
      description: frontmatter.summary,
    },
  };
}

export default async function NotePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const note = await getNote(slug);

  if (!note) {
    notFound();
  }

  let renderedContent: React.ReactNode = null;
  if (note.content.trim()) {
    renderedContent = await renderMDX(note.content);
  }

  return (
    <NotePageClient
      frontmatter={note.frontmatter}
      readingTime={note.readingTime}
      content={renderedContent}
    />
  );
}
