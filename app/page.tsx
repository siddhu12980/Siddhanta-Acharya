import type { Metadata } from "next";
import { getAllProjects, getAllNotes } from "@/lib/content";
import { SKILLS, generateContributions } from "@/lib/profile";
import { getCertificates } from "@/lib/certificates";
import { LandingPageClient } from "./landing-client";
import { SITE_URL, SITE_NAME, SITE_DESCRIPTION } from "@/lib/seo";

export const dynamic = "force-static";

export const metadata: Metadata = {
  title: SITE_NAME,
  description: SITE_DESCRIPTION,
  alternates: { canonical: SITE_URL },
  openGraph: {
    url: SITE_URL,
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
  },
  twitter: {
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
  },
};

export default async function LandingPage() {
  const [projects, notes, certificates] = await Promise.all([
    getAllProjects(),
    getAllNotes(),
    getCertificates(),
  ]);
  const contributions = generateContributions();

  return (
    <LandingPageClient
      projects={projects.map((p) => p.frontmatter)}
      notes={notes.map((n) => ({ ...n.frontmatter, readingTime: n.readingTime }))}
      skills={SKILLS}
      certificates={certificates}
      contributions={contributions}
    />
  );
}
