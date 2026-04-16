import { getAllProjects, getAllNotes } from "@/lib/content";
import { SKILLS, CERTIFICATES, generateContributions } from "@/lib/profile";
import { LandingPageClient } from "./landing-client";

export const dynamic = "force-static";

export default async function LandingPage() {
  const projects = await getAllProjects();
  const notes = await getAllNotes();
  const contributions = generateContributions();

  return (
    <LandingPageClient
      projects={projects.map((p) => p.frontmatter)}
      notes={notes.map((n) => ({ ...n.frontmatter, readingTime: n.readingTime }))}
      skills={SKILLS}
      certificates={CERTIFICATES}
      contributions={contributions}
    />
  );
}
