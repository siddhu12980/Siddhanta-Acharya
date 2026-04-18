import type { Metadata } from "next";
import { getAllProjects, getAllNotes } from "@/lib/content";
import { SKILLS } from "@/lib/profile";
import { getCertificates } from "@/lib/certificates";
import { fetchGitHubData } from "@/lib/github";
import { EXPERIENCE } from "@/lib/experience";
import { EDUCATION } from "@/lib/education";
import { LandingPageClient } from "./landing-client";
import { SITE_URL, SITE_NAME, SITE_DESCRIPTION } from "@/lib/seo";

export const revalidate = 3600; // refresh every hour

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
  const [projects, notes, certificates, github] = await Promise.all([
    getAllProjects(),
    getAllNotes(),
    getCertificates(),
    fetchGitHubData(),
  ]);

  return (
    <LandingPageClient
      projects={projects.map((p) => p.frontmatter)}
      notes={notes.map((n) => ({ ...n.frontmatter, readingTime: n.readingTime }))}
      skills={SKILLS}
      experience={EXPERIENCE}
      education={EDUCATION}
      certificates={certificates}
      contributions={github.contributions}
      githubStats={github.stats}
    />
  );
}
