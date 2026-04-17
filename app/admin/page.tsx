import Link from "next/link";
import { getAllNotes } from "@/lib/content";
import { getCertificates } from "@/lib/certificates";
import { CertificatesClient } from "./certificates-client";
import { Plus } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const [notes, certificates] = await Promise.all([
    getAllNotes(),
    getCertificates(),
  ]);

  return (
    <div className="px-5 py-8 sm:px-8 sm:py-10 lg:px-10 max-w-[900px]">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-sans font-semibold text-app-text">
            Admin
          </h1>
          <p className="mt-0.5 font-mono text-xs text-app-text-muted">
            {notes.length} note{notes.length !== 1 ? "s" : ""} in{" "}
            <code className="rounded bg-app-panel px-1">content/notes/</code>
          </p>
        </div>

        <Link
          href="/admin/notes/new"
          className="inline-flex items-center gap-1.5 rounded border border-app-accent bg-app-accent px-4 py-1.5 font-mono text-xs text-app-bg transition-opacity hover:opacity-80"
        >
          <Plus className="size-3" />
          New note
        </Link>
      </div>

      {notes.length > 0 ? (
        <div className="rounded border border-app-border overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-app-border bg-app-panel">
                <th className="px-4 py-2.5 text-left font-mono text-[10px] uppercase tracking-widest text-app-text-muted">
                  Title
                </th>
                <th className="px-4 py-2.5 text-left font-mono text-[10px] uppercase tracking-widest text-app-text-muted">
                  Slug
                </th>
                <th className="px-4 py-2.5 text-left font-mono text-[10px] uppercase tracking-widest text-app-text-muted">
                  Date
                </th>
                <th className="px-4 py-2.5 text-left font-mono text-[10px] uppercase tracking-widest text-app-text-muted">
                  Tags
                </th>
                <th className="px-4 py-2.5" />
              </tr>
            </thead>
            <tbody>
              {notes.map((note, i) => (
                <tr
                  key={note.frontmatter.slug}
                  className={`border-b border-app-border last:border-0 ${
                    i % 2 === 0 ? "" : "bg-app-panel/40"
                  }`}
                >
                  <td className="px-4 py-3 font-sans text-sm text-app-text">
                    {note.frontmatter.title}
                  </td>
                  <td className="px-4 py-3 font-mono text-xs text-app-text-muted">
                    {note.frontmatter.slug}
                  </td>
                  <td className="px-4 py-3 font-mono text-xs text-app-text-muted">
                    {note.frontmatter.date}
                  </td>
                  <td className="px-4 py-3 font-mono text-xs text-app-text-muted">
                    {note.frontmatter.tags.join(", ")}
                  </td>
                  <td className="px-4 py-3">
                    <Link
                      href={`/notes/${note.frontmatter.slug}`}
                      className="font-mono text-xs text-app-text-muted hover:text-app-accent transition-colors"
                    >
                      View →
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="rounded border border-app-border bg-app-panel p-10 text-center">
          <p className="font-mono text-xs text-app-text-muted">
            No notes yet.{" "}
            <Link href="/admin/notes/new" className="text-app-accent hover:underline">
              Create the first one →
            </Link>
          </p>
        </div>
      )}

      {/* ── Certificates ─────────────────────────────────────── */}
      <div className="mt-12">
        <h2 className="text-base font-sans font-semibold text-app-text mb-1">
          Certificates
        </h2>
        <p className="font-mono text-xs text-app-text-muted mb-5">
          {certificates.length} certificate{certificates.length !== 1 ? "s" : ""} ·{" "}
          shown on the landing page
        </p>
        <CertificatesClient initialCerts={certificates} />
      </div>
    </div>
  );
}
