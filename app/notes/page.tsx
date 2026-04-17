import type { Metadata } from "next";
import { getAllNotes } from "@/lib/content";
import { NotesIndexClient } from "./client";
import { SITE_URL } from "@/lib/seo";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Notes",
  description:
    "Writing about systems, debugging, and things I learned the hard way.",
  alternates: { canonical: `${SITE_URL}/notes` },
  openGraph: {
    url: `${SITE_URL}/notes`,
    title: "Notes",
    description:
      "Writing about systems, debugging, and things I learned the hard way.",
  },
};

export default async function NotesPage() {
  const notes = await getAllNotes();
  const notesData = notes.map((n) => ({
    ...n.frontmatter,
    readingTime: n.readingTime,
  }));

  return <NotesIndexClient notes={notesData} />;
}
