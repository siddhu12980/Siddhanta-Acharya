// ── Mock data for the prototype ──────────────────────────────────

export type ProjectStatus = "live" | "degraded" | "offline";

export interface Project {
  slug: string;
  title: string;
  tagline: string;
  category: string;
  status: ProjectStatus;
  stack: string[];
  repo: string;
}

export const MOCK_PROJECTS: Project[] = [
  {
    slug: "redis-queue",
    title: "Redis Job Queue",
    tagline: "Distributed job queue with pub/sub workers",
    category: "Distributed Systems",
    status: "live",
    stack: ["TypeScript", "Redis", "Express", "Node.js"],
    repo: "https://github.com/siddhu12980/Redis-based-Job-Queue-System",
  },
  {
    slug: "websocket-pubsub",
    title: "WebSocket Pub/Sub",
    tagline: "Real-time messaging with Redis pub/sub backing",
    category: "Distributed Systems",
    status: "live",
    stack: ["TypeScript", "WebSocket", "Redis"],
    repo: "https://github.com/siddhu12980/Real-Time-WebSocket-Messaging-with-Redis-Pub-Sub",
  },
  {
    slug: "fastchain",
    title: "FastChain",
    tagline: "Python blockchain with proof-of-work and WebSocket peer sync",
    category: "Distributed Systems",
    status: "degraded",
    stack: ["Python", "FastAPI", "WebSocket"],
    repo: "https://github.com/siddhu12980/FastChain",
  },
  {
    slug: "opinion-trading",
    title: "Opinion Trading",
    tagline: "Order-book matching engine for prediction markets",
    category: "Trading",
    status: "live",
    stack: ["TypeScript"],
    repo: "https://github.com/siddhu12980/Opinion_trading_v1",
  },
  {
    slug: "multi-api-k8s",
    title: "Multi-API on K8s",
    tagline: "Auth + users + tasks services on Amazon EKS",
    category: "Infrastructure",
    status: "offline",
    stack: ["JavaScript", "Kubernetes", "Docker"],
    repo: "https://github.com/siddhu12980/Multi-api-kub-config",
  },
  {
    slug: "shoppie",
    title: "Shoppie",
    tagline: "Next.js + Spring Boot e-commerce app",
    category: "Web",
    status: "offline",
    stack: ["TypeScript", "Next.js", "Spring Boot"],
    repo: "https://github.com/siddhu12980/Shoppie",
  },
];

export const PROJECTS_BY_CATEGORY = MOCK_PROJECTS.reduce(
  (acc, project) => {
    if (!acc[project.category]) acc[project.category] = [];
    acc[project.category].push(project);
    return acc;
  },
  {} as Record<string, Project[]>,
);

export interface ArchNode {
  id: string;
  label: string;
  sub?: string;
  type: "external" | "service" | "datastore";
  x: number;
  y: number;
}

export interface ArchEdge {
  id: string;
  from: string;
  to: string;
  label: string;
}

export const REDIS_QUEUE_ARCH = {
  nodes: [
    { id: "client", label: "Client", type: "external" as const, x: 50, y: 180 },
    { id: "master", label: "Master API", sub: "Express", type: "service" as const, x: 280, y: 180 },
    { id: "redis", label: "Redis", sub: "Queue + Pub/Sub", type: "datastore" as const, x: 540, y: 180 },
    { id: "worker", label: "Worker", sub: "Node.js", type: "service" as const, x: 540, y: 360 },
  ] satisfies ArchNode[],
  edges: [
    { id: "e1", from: "client", to: "master", label: "POST /job" },
    { id: "e2", from: "master", to: "redis", label: "LPUSH jobs" },
    { id: "e3", from: "redis", to: "worker", label: "BRPOP jobs" },
    { id: "e4", from: "worker", to: "redis", label: "PUBLISH status" },
  ] satisfies ArchEdge[],
};

export interface DemoStep {
  delay: number;
  edgeId?: string;
  pulseNode?: string;
  log: string;
}

export function getDemoScript(jobId: number): DemoStep[] {
  return [
    {
      delay: 0,
      pulseNode: "client",
      log: `[00:00.00] [client] POST /job { type: "email", to: "user@example.com" }`,
    },
    {
      delay: 400,
      edgeId: "e1",
      pulseNode: "master",
      log: `[00:00.12] [master] received job #${jobId}`,
    },
    {
      delay: 900,
      edgeId: "e2",
      pulseNode: "redis",
      log: `[00:00.18] [redis] LPUSH jobs → length: 1`,
    },
    {
      delay: 1400,
      edgeId: "e3",
      pulseNode: "worker",
      log: `[00:00.24] [worker] BRPOP → processing job #${jobId}`,
    },
    {
      delay: 2100,
      log: `[00:00.31] [worker] sending email via SMTP`,
    },
    {
      delay: 2800,
      edgeId: "e4",
      pulseNode: "redis",
      log: `[00:00.38] [worker] PUBLISH status: completed`,
    },
    {
      delay: 3200,
      log: `[00:00.40] [master] notified: job #${jobId} done (312ms)`,
    },
  ];
}

// ── Skills / Tech stack ───────────────────────────────────────────

export interface SkillCategory {
  category: string;
  items: string[];
}

export const MOCK_SKILLS: SkillCategory[] = [
  { category: "Languages", items: ["TypeScript", "JavaScript", "Python", "Java", "Go", "SQL"] },
  { category: "Backend", items: ["Node.js", "Express", "FastAPI", "Spring Boot", "GraphQL"] },
  { category: "Infrastructure", items: ["Docker", "Kubernetes", "AWS", "Nginx", "GitHub Actions", "Terraform"] },
  { category: "Data & Messaging", items: ["Redis", "PostgreSQL", "MongoDB", "WebSockets", "Kafka"] },
  { category: "Frontend", items: ["React", "Next.js", "Tailwind CSS"] },
];

// ── Mock GitHub contribution data ─────────────────────────────────

export function generateMockContributions(): number[][] {
  // 52 weeks x 7 days, seeded pseudo-random
  const weeks: number[][] = [];
  let seed = 42;
  const rand = () => {
    seed = (seed * 16807 + 0) % 2147483647;
    return seed / 2147483647;
  };
  for (let w = 0; w < 52; w++) {
    const week: number[] = [];
    // more activity in recent weeks
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

// ── Certifications ────────────────────────────────────────────────

export interface Certificate {
  title: string;
  issuer: string;
  date: string;
  credentialUrl?: string;
}

export const MOCK_CERTIFICATES: Certificate[] = [
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

// ── Notes ─────────────────────────────────────────────────────────

export interface NotePost {
  slug: string;
  title: string;
  date: string;
  tags: string[];
  summary: string;
  readingTime: string;
}

export const MOCK_NOTES: NotePost[] = [
  {
    slug: "why-redis-is-enough",
    title: "Why Redis is enough for 90% of queue workloads",
    date: "2026-04-10",
    tags: ["distributed-systems", "redis"],
    summary:
      "On resisting the urge to reach for Kafka when LPUSH and BRPOP would do.",
    readingTime: "6 min",
  },
  {
    slug: "debugging-websocket-reconnects",
    title: "The race condition hiding in my WebSocket reconnect logic",
    date: "2026-03-22",
    tags: ["websockets", "debugging"],
    summary:
      "A bug that only surfaced under network flakiness in production.",
    readingTime: "9 min",
  },
  {
    slug: "notes-on-building-fastchain",
    title: "Notes on building a blockchain from scratch",
    date: "2026-02-14",
    tags: ["learning", "blockchain"],
    summary:
      "Lessons from implementing proof-of-work without a tutorial.",
    readingTime: "12 min",
  },
];
