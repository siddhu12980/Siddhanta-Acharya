// ── Profile data (not project content — static personal info) ────

export interface SkillCategory {
  category: string;
  items: string[];
}

export const SKILLS: SkillCategory[] = [
  { category: "Languages", items: ["TypeScript", "JavaScript", "Python", "Java", "Go", "SQL"] },
  { category: "Backend", items: ["Node.js", "Express", "FastAPI", "Spring Boot", "GraphQL"] },
  { category: "Infrastructure", items: ["Docker", "Kubernetes", "AWS", "Nginx", "GitHub Actions", "Terraform"] },
  { category: "Data & Messaging", items: ["Redis", "PostgreSQL", "MongoDB", "WebSockets", "Kafka"] },
  { category: "Frontend", items: ["React", "Next.js", "Tailwind CSS"] },
];

export interface Certificate {
  title: string;
  issuer: string;
  date: string;
  credentialUrl?: string;
}

export const CERTIFICATES: Certificate[] = [
  {
    title: "AWS Certified Solutions Architect - Associate",
    issuer: "Amazon Web Services",
    date: "2025-11",
    credentialUrl: "#",
  },
  {
    title: "Certified Kubernetes Application Developer (CKAD)",
    issuer: "The Linux Foundation",
    date: "2025-08",
    credentialUrl: "#",
  },
  {
    title: "Redis University — RU101: Introduction to Redis Data Structures",
    issuer: "Redis Inc.",
    date: "2025-05",
    credentialUrl: "#",
  },
  {
    title: "Meta Back-End Developer Professional Certificate",
    issuer: "Coursera / Meta",
    date: "2024-12",
    credentialUrl: "#",
  },
];

// ── Mock GitHub contribution data ─────────────────────────────────

export function generateContributions(): number[][] {
  // 52 weeks x 7 days, seeded pseudo-random
  const weeks: number[][] = [];
  let seed = 42;
  const rand = () => {
    seed = (seed * 16807 + 0) % 2147483647;
    return seed / 2147483647;
  };
  for (let w = 0; w < 52; w++) {
    const week: number[] = [];
    const recentBoost = w > 35 ? 1.5 : w > 20 ? 1.0 : 0.6;
    for (let d = 0; d < 7; d++) {
      const r = rand();
      if (r < 0.3 * recentBoost) week.push(0);
      else if (r < 0.55) week.push(1);
      else if (r < 0.75) week.push(2);
      else if (r < 0.9) week.push(3);
      else week.push(4);
    }
    weeks.push(week);
  }
  return weeks;
}
