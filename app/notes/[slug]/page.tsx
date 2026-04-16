import { notFound } from "next/navigation";
import { getNote, getAllNoteSlugs } from "@/lib/content";
import { renderMDX } from "@/lib/mdx";
import { NotePageClient } from "./client";

export async function generateStaticParams() {
  const slugs = await getAllNoteSlugs();
  return slugs.map((slug) => ({ slug }));
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
