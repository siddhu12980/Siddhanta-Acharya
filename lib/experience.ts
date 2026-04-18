export interface WorkExperience {
  company: string;
  role: string;
  period: string;
  location?: string;
  highlights: string[];
  stack?: string[];
}

export const EXPERIENCE: WorkExperience[] = [
  {
    company: "100x Nepal",
    role: "Full-Stack Engineer",
    period: "Feb 2025 – Present",
    location: "Remote",
    highlights: [
      "Leading backend development across multiple web products with multi-role access control, real-time workflows, and multi-tenant data models",
      "Building an LLM-powered automation service that integrates with third-party messaging APIs for conversational workflows at scale",
      "Own backend architecture end-to-end using TypeScript, Node.js, and PostgreSQL; containerized with Docker and shipped through Kubernetes with automated CI/CD pipelines",
    ],
    stack: ["TypeScript", "Node.js", "PostgreSQL", "Docker", "Kubernetes"],
  },
  {
    company: "Google Developer Groups on Campus — FETJU",
    role: "Web Facilitator",
    period: "Sept 2024 – July 2025",
    location: "Bengaluru, India",
    highlights: [
      "Delivered two technical sessions for peers: Flutter for cross-platform mobile development and Backend engineering fundamentals (APIs, databases, deployment)",
      "Mentored students on full-stack project development and API integration",
    ],
  },
  {
    company: "Sajilo Dev",
    role: "Freelance Full-Stack Developer",
    period: "May 2024 – Dec 2024",
    location: "Remote",
    highlights: [
      "Built a multi-vendor e-commerce platform for a Nepali retail client with product catalog, cart, checkout, and order management using React, Node.js, and PostgreSQL",
      "Developed a campus Learning Management System with course management, student enrollment, and assignment workflows for a higher-education client",
      "Integrated Firebase for authentication/real-time data and third-party APIs for payment and notification flows",
    ],
    stack: ["React", "Node.js", "PostgreSQL", "Firebase"],
  },
];
