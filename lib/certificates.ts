import fs from "node:fs/promises";
import path from "node:path";

const CERTS_FILE = path.join(process.cwd(), "content", "certificates.json");

export interface Certificate {
  id: string;
  title: string;
  issuer: string;
  date: string; // "YYYY-MM"
  credentialUrl?: string;
}

export async function getCertificates(): Promise<Certificate[]> {
  try {
    const raw = await fs.readFile(CERTS_FILE, "utf-8");
    return JSON.parse(raw) as Certificate[];
  } catch {
    return [];
  }
}
