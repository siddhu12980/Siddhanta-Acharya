"use client";

import { useRef, useState, useCallback, useTransition } from "react";
import { useRouter } from "next/navigation";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { saveNote } from "../../actions";

// ── Frontmatter helpers ───────────────────────────────────────────

function slugify(title: string) {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

function buildMdx(fields: {
  slug: string;
  title: string;
  date: string;
  tags: string;
  summary: string;
  body: string;
}) {
  const tagList = fields.tags
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean)
    .map((t) => `  - ${t}`)
    .join("\n");

  return `---
slug: ${fields.slug}
title: "${fields.title.replace(/"/g, '\\"')}"
date: "${fields.date}"
tags:
${tagList}
summary: "${fields.summary.replace(/"/g, '\\"')}"
---

${fields.body.trimStart()}`;
}

// Naively strip frontmatter to get just the body for preview
function stripFrontmatter(raw: string) {
  const match = raw.match(/^---\n[\s\S]*?\n---\n?([\s\S]*)$/);
  return match ? match[1] : raw;
}

// ── Toolbar ───────────────────────────────────────────────────────

type Wrap = { before: string; after?: string; placeholder?: string };

const TOOLBAR: Array<{ label: string; title: string; wrap: Wrap } | "sep"> = [
  { label: "B", title: "Bold", wrap: { before: "**", after: "**", placeholder: "bold" } },
  { label: "I", title: "Italic", wrap: { before: "_", after: "_", placeholder: "italic" } },
  { label: "`", title: "Inline code", wrap: { before: "`", after: "`", placeholder: "code" } },
  "sep",
  { label: "H2", title: "Heading 2", wrap: { before: "## ", placeholder: "Heading" } },
  { label: "H3", title: "Heading 3", wrap: { before: "### ", placeholder: "Heading" } },
  "sep",
  { label: "—", title: "Code block", wrap: { before: "```\n", after: "\n```", placeholder: "code here" } },
  { label: ">", title: "Blockquote", wrap: { before: "> ", placeholder: "quote" } },
  { label: "•", title: "Bullet list", wrap: { before: "- ", placeholder: "item" } },
  { label: "1.", title: "Ordered list", wrap: { before: "1. ", placeholder: "item" } },
  "sep",
  { label: "[]", title: "Link", wrap: { before: "[", after: "](url)", placeholder: "link text" } },
];

function applyWrap(
  textarea: HTMLTextAreaElement,
  wrap: Wrap,
  onChange: (v: string) => void,
) {
  const { selectionStart: start, selectionEnd: end, value } = textarea;
  const selected = value.slice(start, end);
  const before = wrap.before;
  const after = wrap.after ?? "";
  const text = selected || wrap.placeholder || "";
  const replacement = before + text + after;
  const next = value.slice(0, start) + replacement + value.slice(end);
  onChange(next);
  // Restore caret after React re-render
  requestAnimationFrame(() => {
    const cursor = start + before.length + text.length + after.length;
    textarea.setSelectionRange(
      selected ? start : start + before.length,
      selected ? start + replacement.length : cursor,
    );
    textarea.focus();
  });
}

// ── Main component ────────────────────────────────────────────────

type Mode = "compose" | "paste";

const today = new Date().toISOString().slice(0, 10);

export function NewNoteClient() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const [mode, setMode] = useState<Mode>("compose");

  // Compose fields
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [slugEdited, setSlugEdited] = useState(false);
  const [date, setDate] = useState(today);
  const [tags, setTags] = useState("");
  const [summary, setSummary] = useState("");
  const [body, setBody] = useState("");

  // Paste mode
  const [rawPaste, setRawPaste] = useState("");

  const [overwrite, setOverwrite] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const bodyRef = useRef<HTMLTextAreaElement>(null);
  const pasteRef = useRef<HTMLTextAreaElement>(null);

  const handleTitleChange = useCallback(
    (v: string) => {
      setTitle(v);
      if (!slugEdited) setSlug(slugify(v));
    },
    [slugEdited],
  );

  const previewSource =
    mode === "compose" ? body : stripFrontmatter(rawPaste);

  const handleSave = () => {
    setError(null);
    const rawContent =
      mode === "paste"
        ? rawPaste
        : buildMdx({ slug, title, date, tags, summary, body });

    startTransition(async () => {
      const result = await saveNote(rawContent, overwrite);
      if (result.error) {
        setError(result.error);
      } else {
        router.push(`/notes/${result.slug}`);
      }
    });
  };

  return (
    <div className="px-5 py-8 sm:px-8 sm:py-10 lg:px-10 max-w-[1400px]">
      {/* Header */}
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-sans font-semibold text-app-text">
            New note
          </h1>
          <p className="mt-0.5 font-mono text-xs text-app-text-muted">
            Writes to{" "}
            <code className="rounded bg-app-panel px-1">
              content/notes/{slug || "<slug>"}.mdx
            </code>
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Mode toggle */}
          <div className="flex rounded border border-app-border overflow-hidden">
            {(["compose", "paste"] as Mode[]).map((m) => (
              <button
                key={m}
                onClick={() => setMode(m)}
                className={`px-3 py-1.5 font-mono text-xs capitalize transition-colors ${
                  mode === m
                    ? "bg-app-accent text-app-bg"
                    : "text-app-text-muted hover:text-app-text"
                }`}
              >
                {m}
              </button>
            ))}
          </div>

          <button
            onClick={handleSave}
            disabled={isPending}
            className="rounded border border-app-accent bg-app-accent px-4 py-1.5 font-mono text-xs text-app-bg transition-opacity hover:opacity-80 disabled:opacity-50"
          >
            {isPending ? "Saving…" : "Save note"}
          </button>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="mb-4 rounded border border-red-500/40 bg-red-500/10 px-4 py-3 font-mono text-xs text-red-400">
          {error}
        </div>
      )}

      {/* Overwrite toggle */}
      <label className="mb-4 inline-flex items-center gap-2 cursor-pointer select-none">
        <input
          type="checkbox"
          checked={overwrite}
          onChange={(e) => setOverwrite(e.target.checked)}
          className="accent-app-accent"
        />
        <span className="font-mono text-xs text-app-text-muted">
          Overwrite if slug exists
        </span>
      </label>

      {/* ── Compose mode ─────────────────────────────────────── */}
      {mode === "compose" && (
        <div className="flex flex-col gap-6 xl:flex-row">
          {/* Left: form + editor */}
          <div className="flex flex-col gap-4 min-w-0 xl:w-1/2">
            {/* Frontmatter fields */}
            <div className="rounded border border-app-border bg-app-panel p-4 space-y-3">
              <p className="font-mono text-[10px] uppercase tracking-widest text-app-text-muted mb-1">
                Frontmatter
              </p>

              <Field label="Title">
                <input
                  type="text"
                  value={title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  placeholder="My note title"
                  className={inputCls}
                />
              </Field>

              <Field label="Slug">
                <input
                  type="text"
                  value={slug}
                  onChange={(e) => {
                    setSlug(e.target.value);
                    setSlugEdited(true);
                  }}
                  placeholder="my-note-title"
                  className={inputCls}
                />
              </Field>

              <div className="grid grid-cols-2 gap-3">
                <Field label="Date">
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className={inputCls}
                  />
                </Field>

                <Field label="Tags (comma-separated)">
                  <input
                    type="text"
                    value={tags}
                    onChange={(e) => setTags(e.target.value)}
                    placeholder="typescript, redis"
                    className={inputCls}
                  />
                </Field>
              </div>

              <Field label="Summary">
                <input
                  type="text"
                  value={summary}
                  onChange={(e) => setSummary(e.target.value)}
                  placeholder="One-sentence description shown in the notes list"
                  className={inputCls}
                />
              </Field>
            </div>

            {/* Markdown editor */}
            <div className="flex flex-col rounded border border-app-border bg-app-panel overflow-hidden">
              {/* Toolbar */}
              <div className="flex flex-wrap items-center gap-0.5 border-b border-app-border px-2 py-1.5">
                {TOOLBAR.map((item, i) =>
                  item === "sep" ? (
                    <span
                      key={i}
                      className="mx-1 h-4 w-px bg-app-border"
                    />
                  ) : (
                    <button
                      key={item.title}
                      title={item.title}
                      aria-label={item.title}
                      onClick={() => {
                        if (bodyRef.current)
                          applyWrap(bodyRef.current, item.wrap, setBody);
                      }}
                      className="rounded px-2 py-1 font-mono text-xs text-app-text-muted hover:bg-app-hover hover:text-app-text transition-colors"
                    >
                      {item.label}
                    </button>
                  ),
                )}
              </div>
              <textarea
                ref={bodyRef}
                value={body}
                onChange={(e) => setBody(e.target.value)}
                placeholder="Write your note in Markdown…"
                className="min-h-[380px] resize-y bg-transparent p-4 font-mono text-sm text-app-text placeholder:text-app-text-muted focus:outline-none"
                spellCheck={false}
              />
            </div>
          </div>

          {/* Right: preview */}
          <Preview source={previewSource} label="Body preview" />
        </div>
      )}

      {/* ── Paste mode ───────────────────────────────────────── */}
      {mode === "paste" && (
        <div className="flex flex-col gap-6 xl:flex-row">
          <div className="min-w-0 xl:w-1/2 flex flex-col gap-2">
            <p className="font-mono text-xs text-app-text-muted">
              Paste a complete <code>.mdx</code> file including frontmatter.
            </p>
            <textarea
              ref={pasteRef}
              value={rawPaste}
              onChange={(e) => setRawPaste(e.target.value)}
              placeholder={PASTE_PLACEHOLDER}
              className="min-h-[600px] resize-y rounded border border-app-border bg-app-panel p-4 font-mono text-sm text-app-text placeholder:text-app-text-muted focus:outline-none focus:ring-1 focus:ring-app-accent"
              spellCheck={false}
            />
          </div>

          <Preview source={previewSource} label="Content preview" />
        </div>
      )}
    </div>
  );
}

// ── Sub-components ────────────────────────────────────────────────

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="flex flex-col gap-1">
      <span className="font-mono text-[10px] uppercase tracking-wider text-app-text-muted">
        {label}
      </span>
      {children}
    </label>
  );
}

function Preview({
  source,
  label,
}: {
  source: string;
  label: string;
}) {
  return (
    <div className="min-w-0 xl:w-1/2 flex flex-col gap-2">
      <p className="font-mono text-xs text-app-text-muted">{label}</p>
      <div className="min-h-[400px] rounded border border-app-border bg-app-panel p-5 overflow-auto">
        {source.trim() ? (
          <article className="prose-admin">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {source}
            </ReactMarkdown>
          </article>
        ) : (
          <p className="font-mono text-xs text-app-text-muted">
            Nothing to preview yet.
          </p>
        )}
      </div>
    </div>
  );
}

// ── Constants ─────────────────────────────────────────────────────

const inputCls =
  "w-full rounded border border-app-border bg-app-bg px-3 py-1.5 font-mono text-sm text-app-text placeholder:text-app-text-muted focus:outline-none focus:ring-1 focus:ring-app-accent";

const PASTE_PLACEHOLDER = `---
slug: my-note
title: "My Note Title"
date: "${today}"
tags:
  - tag-one
  - tag-two
summary: "One sentence shown in the notes list."
---

Your note content here in Markdown…`;
