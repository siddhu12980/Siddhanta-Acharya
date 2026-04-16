import { getAllNotes } from "@/lib/content";
import { NotesIndexClient } from "./client";

export const revalidate = 3600;

export default async function NotesPage() {
  const notes = await getAllNotes();
  const notesData = notes.map((n) => ({
    ...n.frontmatter,
    readingTime: n.readingTime,
  }));

  return <NotesIndexClient notes={notesData} />;
}
