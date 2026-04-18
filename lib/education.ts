export interface Education {
  institution: string;
  degree: string;
  period: string;
  location: string;
  sgpa?: string;
  coursework?: string[];
}

export const EDUCATION: Education[] = [
  {
    institution: "Jain University",
    degree: "B.Tech in Computer Science and Engineering",
    period: "Aug 2023 – May 2027",
    location: "Bengaluru, India",
    sgpa: "8.9 / 10.0",
    coursework: [
      "Data Structures",
      "Algorithms",
      "Operating Systems",
      "Databases",
      "Computer Networks",
    ],
  },
];
