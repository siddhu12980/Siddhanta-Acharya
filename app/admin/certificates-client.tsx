"use client";

import { useState, useTransition } from "react";
import { Trash2, Award, ExternalLink } from "lucide-react";
import type { Certificate } from "@/lib/certificates";
import { addCertificate, deleteCertificate } from "./actions";

export function CertificatesClient({
  initialCerts,
}: {
  initialCerts: Certificate[];
}) {
  const [certs, setCerts] = useState(initialCerts);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  // Form state
  const [title, setTitle] = useState("");
  const [issuer, setIssuer] = useState("");
  const [date, setDate] = useState("");
  const [credentialUrl, setCredentialUrl] = useState("");

  const handleAdd = () => {
    setError(null);
    startTransition(async () => {
      const result = await addCertificate({ title, issuer, date, credentialUrl });
      if (result.error) {
        setError(result.error);
        return;
      }
      // Optimistically update UI with the new cert
      const newCert: Certificate = {
        id: result.id!,
        title: title.trim(),
        issuer: issuer.trim(),
        date: date.trim(),
        credentialUrl: credentialUrl.trim() || undefined,
      };
      setCerts((prev) => [...prev, newCert]);
      setTitle("");
      setIssuer("");
      setDate("");
      setCredentialUrl("");
    });
  };

  const handleDelete = (id: string) => {
    startTransition(async () => {
      const result = await deleteCertificate(id);
      if (result.error) {
        setError(result.error);
        return;
      }
      setCerts((prev) => prev.filter((c) => c.id !== id));
    });
  };

  return (
    <div className="space-y-6">
      {/* Existing certificates */}
      {certs.length > 0 ? (
        <div className="rounded border border-app-border overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-app-border bg-app-panel">
                <th className="px-4 py-2.5 text-left font-mono text-[10px] uppercase tracking-widest text-app-text-muted">
                  Title
                </th>
                <th className="px-4 py-2.5 text-left font-mono text-[10px] uppercase tracking-widest text-app-text-muted">
                  Issuer
                </th>
                <th className="px-4 py-2.5 text-left font-mono text-[10px] uppercase tracking-widest text-app-text-muted">
                  Date
                </th>
                <th className="px-4 py-2.5 text-left font-mono text-[10px] uppercase tracking-widest text-app-text-muted">
                  URL
                </th>
                <th className="px-4 py-2.5" />
              </tr>
            </thead>
            <tbody>
              {certs.map((cert, i) => (
                <tr
                  key={cert.id}
                  className={`border-b border-app-border last:border-0 ${
                    i % 2 === 0 ? "" : "bg-app-panel/40"
                  }`}
                >
                  <td className="px-4 py-3 font-sans text-sm text-app-text max-w-[260px]">
                    <div className="flex items-start gap-2">
                      <Award className="size-3.5 shrink-0 text-app-accent mt-0.5" strokeWidth={1.5} />
                      <span className="leading-snug">{cert.title}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 font-mono text-xs text-app-text-muted">
                    {cert.issuer}
                  </td>
                  <td className="px-4 py-3 font-mono text-xs text-app-text-muted">
                    {cert.date}
                  </td>
                  <td className="px-4 py-3">
                    {cert.credentialUrl ? (
                      <a
                        href={cert.credentialUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 font-mono text-xs text-app-text-muted hover:text-app-accent transition-colors"
                      >
                        <ExternalLink className="size-3" />
                        Link
                      </a>
                    ) : (
                      <span className="font-mono text-xs text-app-text-muted">—</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => handleDelete(cert.id)}
                      disabled={isPending}
                      aria-label="Delete certificate"
                      className="text-app-text-muted hover:text-red-400 transition-colors disabled:opacity-50"
                    >
                      <Trash2 className="size-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="rounded border border-app-border bg-app-panel p-6 text-center">
          <p className="font-mono text-xs text-app-text-muted">
            No certificates yet.
          </p>
        </div>
      )}

      {/* Error */}
      {error && (
        <p className="font-mono text-xs text-red-400">{error}</p>
      )}

      {/* Add form */}
      <div className="rounded border border-app-border bg-app-panel p-4 space-y-3">
        <p className="font-mono text-[10px] uppercase tracking-widest text-app-text-muted">
          Add certificate
        </p>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <label className="flex flex-col gap-1">
            <span className="font-mono text-[10px] uppercase tracking-wider text-app-text-muted">
              Title *
            </span>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="AWS Certified Solutions Architect"
              className={inputCls}
            />
          </label>

          <label className="flex flex-col gap-1">
            <span className="font-mono text-[10px] uppercase tracking-wider text-app-text-muted">
              Issuer *
            </span>
            <input
              type="text"
              value={issuer}
              onChange={(e) => setIssuer(e.target.value)}
              placeholder="Amazon Web Services"
              className={inputCls}
            />
          </label>

          <label className="flex flex-col gap-1">
            <span className="font-mono text-[10px] uppercase tracking-wider text-app-text-muted">
              Date * (YYYY-MM)
            </span>
            <input
              type="month"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className={inputCls}
            />
          </label>

          <label className="flex flex-col gap-1">
            <span className="font-mono text-[10px] uppercase tracking-wider text-app-text-muted">
              Credential URL
            </span>
            <input
              type="url"
              value={credentialUrl}
              onChange={(e) => setCredentialUrl(e.target.value)}
              placeholder="https://..."
              className={inputCls}
            />
          </label>
        </div>

        <button
          onClick={handleAdd}
          disabled={isPending}
          className="mt-1 rounded border border-app-accent bg-app-accent px-4 py-1.5 font-mono text-xs text-app-bg transition-opacity hover:opacity-80 disabled:opacity-50"
        >
          {isPending ? "Saving…" : "Add certificate"}
        </button>
      </div>
    </div>
  );
}

const inputCls =
  "w-full rounded border border-app-border bg-app-bg px-3 py-1.5 font-mono text-sm text-app-text placeholder:text-app-text-muted focus:outline-none focus:ring-1 focus:ring-app-accent";
