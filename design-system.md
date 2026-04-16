# Portfolio Frontend UI Design System

This is the design system for `siddhu12980`'s portfolio site. It's adapted from a terminal/editorial system originally built for a SaaS dashboard, with changes appropriate for a single-person portfolio focused on distributed-systems work. Read this alongside `project.md`.

When generating or refactoring UI, follow this so everything looks consistent in both light and dark mode. When this document and `project.md` disagree, **`project.md` wins**; flag the inconsistency so it can be reconciled.

---

## 1. Visual Principles

- **Terminal/editorial feel** — clean spacing, sharp typography, minimal ornamentation. The site should read as a piece of software, not a brochure.
- **High contrast and readable** in both themes. Dark theme is the default.
- **Prefer subtle borders/dividers over heavy shadows.** Thin `1px` low-opacity borders separate regions; no drop shadows beyond 1–2 elevation levels.
- **Use semantic theme tokens.** Never hardcode base colors like `bg-black`, `text-white`, or `border-white/*` in normal UI.
- **Background accents are limited** to the grid + noise overlays and one accent color used sparingly.
- **Every motion communicates a state change.** No decorative animation. See `project.md` §8 for the animation inventory.

---

## 2. Theme System (Light / Dark)

- Implemented with `next-themes`.
- `app/layout.tsx` wraps the app with:
  - `ThemeProvider attribute="class" defaultTheme="dark" enableSystem={true}`
  - **Default is dark** (different from the source system). The portfolio's control-panel concept reads better against a dark background; light remains available.
- Dark mode works by toggling the `.dark` class on the root element.
- Semantic CSS variables live in `app/globals.css` and are overridden inside `.dark`.

### 2.1 Semantic tokens to use everywhere

Use the Tailwind classes that map to the CSS variables in `globals.css`:

| Token | Purpose |
|---|---|
| `bg-app-bg` / `text-app-text` | Page background + primary text |
| `bg-app-panel` | Panel/card background |
| `bg-app-hover` | Hover/inset background |
| `bg-app-rail` | Left rail background (slightly offset from panel) |
| `text-app-text-muted` | Muted / tertiary text |
| `text-app-text-secondary` | Secondary text (labels, metadata) |
| `border-app-border` | Borders & dividers |
| `bg-app-solid` / `text-app-solid-text` | Filled surfaces (rare) |
| `text-app-accent` / `bg-app-accent` | The single signature accent color |
| `text-app-status-live` | Live / healthy status (green-adjacent) |
| `text-app-status-degraded` | Degraded status (amber) |
| `text-app-status-offline` | Offline / code-only status (gray/muted) |
| `text-app-node-service` | Architecture diagram: service nodes |
| `text-app-node-datastore` | Architecture diagram: datastore nodes |
| `text-app-node-external` | Architecture diagram: external/client nodes |

Selection styling is set globally via `selection:*` on the root.

### 2.2 Accent color

Pick **one** signature accent color and use it only for:
- The selection indicator sliding in the left rail
- Key CTAs (max 1–2 per screen)
- The "live" status dot
- Focused edges in architecture diagrams

Candidates (decide during build, flag in PR): warm amber (`oklch(0.78 0.14 70)`), specific cyan (`oklch(0.75 0.14 210)`), or a saturated green (`oklch(0.75 0.17 150)`). Avoid purple; avoid purple→pink gradients; avoid any multi-stop gradient as a primary accent.

### 2.3 Rule of thumb

- If you need a new color: first check whether an existing semantic token exists.
- Only use hardcoded colors for narrowly-scoped cases (e.g., a specific brand color inside an icon). Keep it isolated to that component.
- **Never** add a new token without also defining its dark-mode counterpart.

---

## 3. Typography

- Fonts are wired in `app/layout.tsx` via `next/font`:
  - `font-sans`: **Geist Sans** (variable) — not Inter. Inter is the single most overused font on dev portfolios.
  - `font-mono`: **JetBrains Mono** (variable) — stronger character than Space Mono, better at display weights.
  - If the UX/design skills loaded by Claude Code recommend a specific pair with better character (e.g., `General Sans`, `Satoshi`, `Neue Haas Grotesk`, `Söhne`), you may substitute; record the choice in the PR description.

Use `font-mono` for:
- Left-rail project labels
- Buttons
- Badges/tags
- Architecture diagram node labels
- Status indicators
- Timestamps
- Small helper text
- Code blocks (obviously)

Use `font-sans` for:
- Landing page prose
- Notes/blog post body
- Project "About" tab prose
- Headings

### 3.1 Common text patterns

- `uppercase tracking-widest` for UI chrome (nav labels, category headers, button text, badge labels).
- `text-app-text-muted` and `text-app-text-secondary` for hierarchy.
- Notes body uses a generous reading width (~65ch) and standard sentence case.
- Headings in notes should **not** be uppercase — uppercase is for chrome only, not editorial content.

### 3.2 Type scale

Deliberate and tight. Six sizes site-wide, no more:
- `text-xs` (11px) — chrome, timestamps, tags
- `text-sm` (13px) — secondary UI, labels
- `text-base` (15px) — body prose
- `text-lg` (18px) — pull quotes, callouts
- `text-2xl` (24px) — section headings
- `text-4xl` / display — landing hero, note titles

### 3.3 Outline / stroke headlines

A `text-stroke` utility is available in `globals.css` for outline-style display text (optional, used sparingly — the landing hero is a candidate, but don't over-apply).

---

## 4. Layout & Background Patterns

- Root background is always `bg-app-bg text-app-text`.
- Signature overlays (defined in `globals.css`):
  - `bg-grid` — fine grid lines (low-opacity, visible but not dominant)
  - `bg-noise` — fixed film-grain noise (~2% opacity SVG)
- Both overlays are positioned `fixed inset-0 pointer-events-none` behind content.

### 4.1 Shell layout

Matches `project.md` §6:

- **Desktop (≥1024px):** fixed left rail ~260px wide + main panel flex-1.
- **Tablet (768–1023px):** rail collapses to hamburger; main panel full width.
- **Mobile (<768px):** rail becomes a slide-out drawer.

The rail uses `bg-app-rail`, the main panel uses `bg-app-bg` or `bg-app-panel` depending on content.

### 4.2 Landing layout

- Centered content; overlays visible behind.
- Boot-sequence intro at top (see §7), manifesto, systems grid, one featured project teaser.
- No full-bleed hero images.

### 4.3 Project page layout

- Top bar inside main panel: project title + tagline + stack chips + repo link + tabs.
- Tab content fills below with generous vertical padding (`py-10` or `py-12`).
- Architecture diagrams get horizontal overflow on mobile; don't try to squish them.

### 4.4 Notes layout

- Index: list items with date + title + tags + summary. No cards.
- Post: centered reading column (~65ch), no sidebar.

---

## 5. Left Rail (Portfolio-specific)

This pattern replaces the source system's fixed 72px dashboard sidebar.

- Width: `260px` on desktop, fixed, scrollable if content overflows.
- Sections, top to bottom:
  1. **Identity block:** avatar (circular, ~40px), name (`font-sans` medium), one-line role (`font-mono uppercase text-xs text-app-text-muted`).
  2. **Socials row:** icon-only links (GitHub, LinkedIn, email, Twitter, LeetCode) — `size-4` icons, muted by default, accent on hover.
  3. **Divider.**
  4. **Project list,** grouped by category. Each category header: `font-mono uppercase text-xs tracking-widest text-app-text-muted`. Each project item: status dot + project label (`font-mono text-sm`) + optional category chip on hover.
  5. **Divider.**
  6. **Notes link** — its own row.
  7. **Divider.**
  8. **"Looking for work" pill** — small, rounded, low-weight.

### 5.1 Status dots (rail-specific)

- `size-1.5` (6px) filled circles to the left of each project label.
- Colors map to semantic tokens: `bg-app-status-live`, `bg-app-status-degraded`, `bg-app-status-offline`.
- **Only live (green) dots animate** — opacity loop `0.6 → 1.0 → 0.6` over 2s. Dead things don't breathe. The animation itself is the signal.
- Respect `prefers-reduced-motion`: disable breathing; keep colors.

### 5.2 Selection indicator

- A background shape (`bg-app-hover` or a subtle accent tint) slides between active items using Framer Motion's `layoutId`.
- 250ms spring, stiffness ~400, damping ~30. This is the single highest-impact animation detail on the site; don't skip it.

---

## 6. Modal Pattern (Reusable)

Same as source. Portfolio uses modals only for: a "click a node in the architecture diagram" side-panel (optional; can also be implemented as a push panel instead of a modal).

When creating modals:
- Fixed overlay container: `fixed inset-0 z-50 flex items-center justify-center bg-app-bg/80 backdrop-blur-sm`
- Place modal content inside `Card`.
- Default width: `w-full max-w-md mx-4` (or `max-w-2xl` for architecture code-snippet panels).

---

## 7. UI Primitives

Follow these component APIs instead of recreating styles.

### 7.1 Button (`components/ui/Button.tsx`)

Props:
- `variant`: `primary | secondary | ghost | danger`
- `size`: `sm | md | lg`
- `fullWidth?: boolean`
- `loading?: boolean`

Uses monospace uppercase styling and semantic tokens. (`success` variant from the source system is removed — portfolio doesn't need it. Add back only if a real use case emerges.)

### 7.2 Card (`components/ui/Card.tsx`)

**Changed from source:** the "3-dot window header" is removed. That pattern became a SaaS-dashboard cliché; on a portfolio it reads as template.

- Plain terminal-style container: `bg-app-panel border border-app-border rounded-none` (sharp corners, no rounding — matches editorial/technical feel) or `rounded-sm` if softness is needed somewhere specific.
- Optional `title` prop renders a minimal header: `font-mono uppercase text-xs tracking-widest text-app-text-muted` with a bottom border.
- Accepts `className` for overrides.

### 7.3 Badge (`components/ui/Badge.tsx`)

Props:
- `variant`: `default | live | degraded | offline | muted`

Used for project status, stack chips, and tags. `success | warning | danger` variants from the source system are renamed to match portfolio semantics (`live | degraded | offline`).

### 7.4 Divider (`components/ui/Divider.tsx`)

Optional `text` renders a labeled divider between `hr` lines. Text is `font-mono uppercase text-xs text-app-text-muted`.

### 7.5 EmptyState (`components/ui/EmptyState.tsx`)

Props:
- `title`
- optional `description`, `icon`, `action`

Used for empty list states **and** for the "demo not available" fallback on project pages. A single, consistent empty state across the site.

### 7.6 ThemeToggle (`components/ui/ThemeToggle.tsx`)

Toggles theme via `next-themes`. Placed in the left rail footer area. Uses sun/moon icons from `lucide-react`.

### 7.7 StatusDot (`components/ui/StatusDot.tsx`) — new for portfolio

Props:
- `status`: `live | degraded | offline`
- `size?`: `sm | md` (default `sm`)
- `animated?`: `boolean` (default `true`; ignored for non-live statuses)

Handles the breathing animation and `prefers-reduced-motion`. Used in rail and anywhere a status indicator appears.

### 7.8 Pieces removed from the source system

The following primitives are **not** part of the portfolio design system and should not be ported:
- `Toaster` / `showToast` — portfolio has no user feedback loop needing toasts.
- `Input` with error prop — no forms beyond a possible contact link.
- Any form-validation / Zod pattern — out of scope.
- `AuthGuard` — no auth.

If a specific need arises later, add them back deliberately rather than preemptively.

---

## 8. Architecture Diagram Styling (new)

This is portfolio-specific and has no analog in the source system.

### 8.1 Nodes

Built as **custom React Flow node components**. Defaults from React Flow are never shipped.

- Shape: rounded rectangle (`rounded-sm`), `bg-app-panel`, `1px` border in a category-specific token (`border-app-node-service` etc.), padding `px-3 py-2`.
- Label: `font-mono uppercase text-xs tracking-widest`.
- Optional sub-label (stack, e.g. "Express"): `font-mono text-[10px] text-app-text-muted` on a second line.
- Hover: border brightens to the accent; cursor becomes pointer.
- Selected / active: full accent border + subtle `bg-app-hover` fill.

### 8.2 Edges

Custom edge component.

- Default: `stroke-app-border`, `1.5px`, no arrow head (arrows drawn as small mono chevrons at the target end).
- Label: small mono text on a pill with `bg-app-bg` background so it sits cleanly over grid overlay.
- On mount: `stroke-dashoffset` animation draws the edge in after nodes have landed.
- On hover: a small dot (`3px`, `fill-app-accent`) travels along the path on a 1s loop, communicating flow direction.
- During demo interaction: edge pulses briefly (stroke brightens + subtle thickness change), traveling dot runs once.

### 8.3 Reduced motion

Respect `prefers-reduced-motion` globally: skip the mount stagger, skip edge-draw animation (show final state immediately), skip hover traveling dots. Keep selection indicator (instant) and node hover states (CSS only).

---

## 9. Live Demo Panel (new)

Each project's Demo tab is a bespoke widget, but they share these conventions:

- Layout: split-pane when it fits — controls left (~40%), live output right (~60%). On mobile, stack vertically.
- Controls use `Button` primitives. Primary action is a `primary` variant; secondary actions are `ghost`.
- Live output is a monospace log view with `bg-app-panel`, `border border-app-border`, fixed-height with scroll, auto-scroll to bottom on new entries.
- Log line format: `[timestamp] [source] message`, with source-based subtle color coding via node tokens (service, datastore, external).
- Loading: existing spinner look (`animate-spin` + `border-app-border` + `border-t-transparent`).
- Empty (demo not running): `EmptyState` with a "Run demo" CTA. If the demo is entirely unavailable: `EmptyState` with copy explaining it's code-only + repo link. **Never fake a response.**
- Rate-limit hit (429): `EmptyState` with copy "Slow down — 10 requests per minute. Try again in a moment."

When the demo triggers an action, the architecture diagram kept in a mini-view (top-right of the demo panel) should pulse the relevant nodes/edges. This is the signature moment described in `project.md` §8.

---

## 10. Notes / MDX Styling (new)

### 10.1 Index (`/notes`)

- List, not cards.
- Each row: `grid grid-cols-[auto_1fr_auto] gap-6` — date | title + summary | tags.
- Date: `font-mono text-xs text-app-text-muted`, fixed width.
- Title: `font-sans text-lg`. Summary below in `text-app-text-secondary`.
- Tags: small mono pills, right-aligned.
- Hover: entire row shifts `4px` right (transform, not margin); background transitions to `bg-app-hover`.

### 10.2 Post (`/notes/[slug]`)

- Centered column, `max-w-[65ch]`, generous padding (`py-20 md:py-28`).
- Top of post: date (mono, muted), title (`text-4xl font-sans`), reading time + tags below.
- Body: `font-sans text-base leading-relaxed`.
- Code blocks: Shiki via `rehype-pretty-code`, themed against our tokens. `bg-app-panel`, `border border-app-border`, padding, `font-mono text-sm`. Line numbers on blocks >6 lines.
- Inline code: `bg-app-hover px-1 rounded-sm font-mono text-sm`.
- Links: underlined with `text-underline-offset-4`, accent on hover.
- Blockquotes: left border `border-app-accent`, italic, `text-app-text-secondary`.
- Footer: date, tags, mailto "reply by email" link. No comment section.

### 10.3 Scroll reveal for notes

- Paragraphs fade in with `8px` upward shift on entering viewport.
- `viewport={{ once: true }}`, threshold ~20%.
- **Do not** stagger individual words. That's the AI-slop tell.
- Disable entirely under `prefers-reduced-motion`.

---

## 11. Data / API Conventions

### 11.1 Internal API routes (`/api/demo/*`)

- All demo Route Handlers return:
  - Success: `{ ok: true, data?: T }` or a streamed response
  - Error: `{ ok: false, error: { message: string; code?: string } }` with appropriate HTTP status
- Rate limit via Upstash (`@upstash/ratelimit`): 10 req/min per IP.
- Streaming responses (worker logs, mining progress) use `ReadableStream` — client consumes via `EventSource` or `fetch` + reader.

### 11.2 No external auth, no localStorage tokens

The portfolio has no login. The source system's `Authorization: Bearer` convention and `AuthGuard` do not apply.

### 11.3 Content loading

- MDX loaded at build time via `@next/mdx` or `next-mdx-remote/rsc`.
- Frontmatter validated with a Zod schema (`lib/content.ts`) — typed, fails loudly at build if a post is malformed.

---

## 12. Loading / Empty UI

- **Loading:** existing spinner look — `size-4 border-2 border-app-border border-t-transparent rounded-full animate-spin`.
- **Empty:** use `EmptyState` rather than custom placeholders.
- **Suspense boundaries:** use them around PPR dynamic holes (see `project.md` §4). Skeletons should use `bg-app-hover` with a subtle shimmer — not the loud gradient sweep kind.

---

## 13. File Organization Rules

Matches `project.md` §11:

- `components/ui/` — reusable primitives (`Button`, `Card`, `Badge`, `Divider`, `EmptyState`, `StatusDot`, `ThemeToggle`).
- `components/shell/` — left rail, main panel, tab bar, theme provider wrapper.
- `components/architecture/` — React Flow custom nodes/edges + diagram wrapper.
- `components/demos/` — one file per project's demo widget.
- `components/mdx/` — custom MDX components (callout, code block wrapper, inline link previews).
- `app/` — routes and layouts. Page-level components using hooks marked `"use client"`.
- `content/projects/*.mdx`, `content/notes/*.mdx` — all content.
- `lib/` — content loading, rate-limit, OG image generation.

---

## 14. Accessibility (reinforced from `project.md` §13)

- Full keyboard navigability. Tab order follows visual order.
- Visible focus rings — define a single `focus-visible:ring` style via CSS variable; never `outline: none` without replacement.
- `prefers-reduced-motion`:
  - Disable stagger reveals, edge draw, traveling dots, breathing status dots, scroll-reveal on notes.
  - Keep instant state changes (tab swap, selection indicator positioning — just remove the spring, snap instead).
- Color contrast ≥ WCAG AA for body; AAA where feasible.
- Every diagram also has a prose description elsewhere on the page — visual info is never the only info.

---

## 15. What's been removed from the source system and why

Short summary so no one adds these back by accident:

| Removed | Why |
|---|---|
| `defaultTheme="light"` | Dark default suits the control-panel concept. |
| Inter font | Overused on dev portfolios; Geist Sans instead. |
| Space Mono | Replaced with JetBrains Mono for stronger display weights. |
| `Card` 3-dot window header | SaaS-dashboard cliché. |
| `Toaster` / `showToast` | Portfolio has no user feedback loop needing it. |
| `Input` with error prop | No forms in v1. |
| Zod form-validation pattern | No forms in v1. |
| `AuthGuard` | No auth. |
| `Authorization: Bearer` API convention | No authenticated API. |
| 72px fixed dashboard sidebar | Replaced with 260px portfolio rail with different structure. |
| `success` Button variant | Unused. |

---

## 16. What's been added that's portfolio-specific

| Added | Why |
|---|---|
| Node/edge/status color tokens | Architecture diagrams need semantic colors. |
| `StatusDot` primitive | Used everywhere; deserves its own component. |
| Architecture diagram styling (§8) | Core to the portfolio concept. |
| Live demo panel pattern (§9) | Signature interactive moment. |
| Notes/MDX styling (§10) | Blog is a major section. |
| Accent color (single, deliberate) | Replaces the source's more distributed use of color. |
| Scroll-reveal rules with reduced-motion handling | Notes posts need this; source system didn't. |

---

## 17. Open decisions to make during build

Flag in PR description for review:

- Final accent color choice (amber / cyan / green / other).
- Final font pair (Geist + JetBrains Mono is the default; substitute only if UX skill suggests something stronger with recorded rationale).
- Whether `text-stroke` display treatment appears on the landing hero or not at all.
- Corner radius policy: full `rounded-none` for maximum technical feel, or `rounded-sm` as a soft default? Decide once, apply consistently.

When in doubt: choose the option that feels most like a piece of software and least like a website.