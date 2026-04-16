# Project.md — Siddhant's Portfolio

> This is the single source of truth for building siddhu12980's portfolio site. Read it fully before writing any code. When you're unsure, prefer decisions already made here over inventing new ones.

---

## 0. Pre-flight: Skills to load

Before implementing, load any locally available skills that apply:

- **Frontend design skill** — for aesthetic direction, typography choices, avoiding AI-slop patterns. Load if present.
- **GSAP skill** (user-provided) — we'll use GSAP alongside Framer Motion. Load before writing any animation code.
- **UI/UX skill** (user-provided) — load before finalizing layout decisions.

If these skills live in `.claude/skills/` or a similar project-local path, read their `SKILL.md` first. If they're not present, proceed with Framer Motion + tasteful CSS animations and flag it in the final report.

---

## 1. Context & intent

**Who this is for:** Siddhant Acharya (GitHub: `siddhu12980`), a backend/infra-leaning engineer based in Bangalore. Projects skew toward distributed systems: Redis-based job queues, WebSocket pub/sub messaging, a from-scratch blockchain (FastChain), Kubernetes multi-service configs, an opinion-trading engine, and a Next.js + Spring Boot e-commerce app (Shoppie).

**Who it's for (audience):** Primary — recruiters and hiring managers (leaning toward jobs). Secondary — fellow engineers (peer credibility, collabs). The site must serve a 30-second skim **and** a 10-minute deep dive without compromising either.

**Why this exists:** Existing portfolio templates are saturated (terminal aesthetic, brutalist-with-gradient, glass cards, bouncy emoji intros). Siddhant's work is backend-heavy and doesn't screenshot well, which makes the generic card-based portfolio a bad fit. This site needs to make invisible systems visible — by showing architecture and letting visitors poke at live endpoints.

---

## 2. The core concept

**The portfolio is a control panel for Siddhant's own work.**

Think: opening an internal admin dashboard that happens to showcase real systems. Sidebar of "services" (projects). Main panel shows the selected one. Each project has an architecture diagram, a live interactive demo, and a short write-up. Notes live as a separate blog area.

Three top-level areas:
1. **Landing** — intro, identity, what Siddhant is looking for.
2. **Projects** — the control panel. Sidebar + main panel with tabs.
3. **Notes** — standalone blog. Independent of projects; Siddhant writes what he wants.

**Guiding principles** (enforce throughout):
- **Honesty over polish.** Don't fake demos. If a project can't be live, label it code-only. Don't seed fake blog posts to make it look active.
- **Animation earns its place.** Every motion must communicate a state change or spatial relationship. If it's purely decorative, cut it.
- **Show the shape of systems.** Diagrams and live behavior do the talking; prose is minimal.
- **Platform-native.** Use Next.js + Vercel primitives properly. Static where possible, dynamic where needed, streaming when it helps.

---

## 3. Information architecture

```
/                       → Landing (static)
/projects               → Redirects to first project OR project index
/projects/[slug]        → Project page (default tab: architecture)
  ?tab=architecture     → Interactive architecture diagram
  ?tab=demo             → Live interactive demo
  ?tab=about            → Short write-up: what's interesting, what was hard
/notes                  → Blog index (list of posts, reverse chrono)
/notes/[slug]           → Individual MDX post
/feed.xml               → RSS feed for notes
/sitemap.xml            → Auto-generated sitemap
/api/demo/[project]/*   → Proxied demo endpoints (rate-limited)
```

Tabs within a project page use **search params** (`?tab=demo`), not nested routes — makes the sidebar-to-main layout behave like a real control panel (fast tab switches without re-fetching the shell) and keeps URLs shareable.

---

## 4. Rendering strategy (Next.js 15, App Router)

Use each Next.js primitive deliberately:

| Route | Strategy | Rationale |
|---|---|---|
| `/` | `export const dynamic = 'force-static'` | Never changes per request. Prerendered, served from edge. |
| `/projects/[slug]` | SSG + ISR (`revalidate: 3600`) via `generateStaticParams` | Content is MDX/config in repo. Build-time prerender; rebuild on push within the hour. |
| `/notes` | SSG + ISR (`revalidate: 3600`) | Same reasoning. |
| `/notes/[slug]` | SSG via `generateStaticParams` | Pure MDX. No revalidate needed — git push triggers rebuild. |
| `/api/demo/*` | Route Handlers, edge runtime where possible | Proxy to demo backend; rate-limit; stream responses. |
| `/feed.xml`, `/sitemap.xml` | Route Handlers (cached) | Generated from MDX frontmatter. |

**Opt into Partial Prerendering (PPR)** in `next.config.js` via `experimental.ppr = 'incremental'`. Apply to project pages so the static shell (diagram, prose) streams immediately while dynamic holes (e.g., "is the demo backend alive right now?" status indicator) stream in via Suspense. If PPR misbehaves, fall back to plain Suspense boundaries — same effect.

**Metadata:** Every route exports `generateMetadata` with proper Open Graph tags. Project pages get a generated OG image (via `opengraph-image.tsx`) showing the project name + a simplified architecture preview. Recruiters share links; this matters.

**Image optimization:** Use `next/image` everywhere, even for inline MDX images (custom MDX component mapping).

---

## 5. Content model

Content lives in the repo. No CMS.

```
/content
  /projects
    redis-queue.mdx
    websocket-pubsub.mdx
    fastchain.mdx
    multi-api-k8s.mdx
    opinion-trading.mdx
    shoppie.mdx
  /notes
    2026-04-17-why-i-built-a-blockchain.mdx
    ...
```

**Project MDX frontmatter:**
```yaml
---
slug: redis-queue
title: "Redis-Based Job Queue"
tagline: "A distributed job queue with pub/sub workers"
category: "Distributed Systems"
status: "live" | "code-only" | "archived"
repo: "https://github.com/siddhu12980/Redis-based-Job-Queue-System"
demoUrl: "/api/demo/redis-queue"  # optional
stack: ["TypeScript", "Redis", "Express", "Node.js"]
order: 1
architecture:
  nodes:
    - { id: "client", label: "Client", type: "external", x: 100, y: 200 }
    - { id: "master", label: "Master API", type: "service", x: 350, y: 200, stack: ["Express"] }
    - { id: "redis", label: "Redis", type: "datastore", x: 600, y: 200 }
    - { id: "worker", label: "Worker", type: "service", x: 600, y: 400, stack: ["Node.js"] }
  edges:
    - { from: "client", to: "master", label: "POST /job" }
    - { from: "master", to: "redis", label: "LPUSH" }
    - { from: "redis", to: "worker", label: "BRPOP" }
    - { from: "worker", to: "redis", label: "PUBLISH status" }
---

MDX body: the "About" tab content. Short — 3 paragraphs.
What's interesting, what was hard, what you'd do differently.
```

**Notes MDX frontmatter:**
```yaml
---
slug: why-i-built-a-blockchain
title: "Why I built a blockchain from scratch"
date: 2026-04-17
tags: ["distributed-systems", "learning"]
summary: "One-line description for the index page and RSS."
---
```

MDX should support: syntax-highlighted code blocks (use `shiki` via `rehype-pretty-code`), custom components (callout boxes, embedded diagrams, links that preview on hover), and `<ArchitectureDiagram />` as a component that can be embedded *inside* notes if a post wants to illustrate a system.

---

## 6. Layout & components

### 6.1 Shell

Desktop-first, responsive down to mobile.

**Desktop (≥1024px):**
- **Left rail** (fixed, ~260px wide): identity block at top, project list grouped by category, a separator, a "Notes" link, socials footer.
- **Main panel** (flex-1): everything else. Top bar shows current route/breadcrumb + tabs when on a project.

**Tablet (768–1023px):** Left rail collapses to a hamburger; main panel takes full width.

**Mobile (<768px):** Rail becomes a bottom sheet / slide-out drawer. Architecture diagrams are horizontally scrollable; don't try to squish them.

### 6.2 Left rail specifics

- Identity block: avatar (from GitHub), name, one-line role ("Backend & distributed systems engineer · Bangalore"), a tight row of icon links (GitHub, LinkedIn, email, Twitter, LeetCode).
- Project list: each item = tiny status dot + project name + category chip on hover. Status dot colors: **green** (live demo up), **gray** (code-only), **amber** (demo degraded). Green dot has a gentle breathing animation (opacity 0.6→1.0→0.6, 2s). Gray/amber are static — living things breathe, dead ones don't.
- The current selection has a background highlight that slides between items via Framer Motion's `layoutId` — this is a non-negotiable detail. It's the single move that makes the rail feel like one piece of software.
- Footer of rail: small "Looking for backend / infra roles · remote or Bangalore" pill, with a link to contact.

### 6.3 Landing page

Not a hero with bouncy text. Instead: a "boot sequence" aesthetic that plays into the control-panel concept.

- Ascii-or-mono-styled name display that feels like a terminal banner (but not literally a terminal — no fake cursor blinking, no fake `$` prompts).
- A short manifesto (3–5 sentences) about what Siddhant builds and what he's looking for.
- A "systems online" section: a live grid of all projects with their current status. Makes the site feel like infrastructure from the first paint.
- One featured project teaser that animates a simplified version of its architecture diagram while the visitor scrolls.
- Clear CTAs: "Browse projects" and "Read notes." No "Download CV" unless there's an actual CV PDF — don't add a button that links to a placeholder.

### 6.4 Project page

Top bar inside main panel: project title, tagline, stack chips, repo link, and the three tabs (`Architecture` · `Demo` · `About`).

**Architecture tab:** React Flow with custom-styled nodes. Nodes are rectangles with a category-based accent (service = one color, datastore = another, external = another). Edges are labeled. On mount, nodes fade/scale in with a stagger (80ms delay each), then edges draw themselves via SVG stroke-dashoffset animation. On hover of an edge, a small dot travels along its path (1s cycle) indicating data flow direction. Click a node → side panel slides in showing the code snippet or config file powering that node (pulled from the project's MDX or a linked file).

**Demo tab:** Each project has a bespoke interactive widget. For Redis queue: an "Enqueue job" button + a streaming log view showing the worker processing it, with the corresponding nodes in the architecture diagram (kept visible in a mini-view) pulsing as work flows. For blockchain: "Mine a block" with hash computation visualized. For opinion trading: a tiny market UI. If demo is unavailable, show a clean empty state: "This demo isn't live right now — here's a 20s video instead" (or just a static preview + link to the repo). Never fake a response.

**About tab:** Rendered MDX body. Short. Prose + embedded code or diagrams if relevant.

### 6.5 Notes

- **Index:** reverse-chronological list. Each item: date (dim), title (prominent), tags (tiny chips), one-line summary. Hovering shifts the item slightly right (4px) — subtle affordance.
- **Post:** generous reading width (~65ch), good typography, no sidebar. Code blocks are syntax-highlighted with line numbers where appropriate. Inline footnotes for digressions rather than parenthetical clutter. A footer with date, tags, and a "reply by email" mailto link (more honest than a comment section).
- Reading time indicator under the title.

---

## 7. Aesthetic direction

Commit to a clear point of view. **Refined, technical, confident.** Not brutalist, not minimal-to-a-fault, not maximalist. Think: the best developer tooling (Vercel dashboard, Linear, Raycast) but with more personality and zero generic SaaS cleanliness.

### 7.1 Color

Lean into a **dark theme by default** with a light theme available (respect `prefers-color-scheme`; persist user toggle).

**Dark palette (proposed — iterate):**
- Background: deep neutral, not pure black. Something like `oklch(0.16 0.01 260)` — a hint of cool blue.
- Surface (cards, rail): one step lighter.
- Text: high-contrast off-white, not pure white.
- Accent: pick ONE signature color and use it sparingly for status dots, selection highlights, and key CTAs. Suggested: a warm amber or a specific cyan — not purple, not a gradient. Avoid the purple-to-pink gradient at all costs.
- Category colors for node types in diagrams: three distinct, desaturated hues. Services, datastores, externals. Pick once, reuse everywhere.

Define these as CSS variables in `app/globals.css`. Implement the light theme by overriding the same variables under a `.light` class or `[data-theme="light"]` attribute.

### 7.2 Typography

**Do not use Inter.** It's the most overused font on dev portfolios.

Suggested pairing (open for reinterpretation):
- **Display / headings:** a sharp grotesque with character — `Neue Haas Grotesk`, `Söhne`, or open-source alternatives like `Geist Sans` (barely acceptable), `General Sans`, or `Satoshi`. If going distinctive: `JetBrains Mono` display-weight for a technical feel, or a serif like `Fraunces` for editorial contrast.
- **Body:** a refined sans — `Geist Sans`, `Inter Tight` (tighter than regular Inter so it feels less default), or pair the grotesque with itself.
- **Mono:** `JetBrains Mono` or `Geist Mono`. Use for code, status labels, timestamps, and anywhere a mono-treatment reinforces the "infrastructure" feel.

Load via `next/font` with `display: 'swap'`. Use variable fonts where possible.

Type scale: tight and deliberate. Headings, body, small — no more than 6 total sizes site-wide.

### 7.3 Spatial and compositional

- Generous negative space in the main panel. Content doesn't fill edges.
- The left rail is dense; the main panel is airy. This contrast is part of the aesthetic.
- Thin borders (`1px` at most, low-opacity) to separate regions — not hard lines.
- Subtle noise texture overlay on the background (~2% opacity SVG noise) to kill flat digital feel.

---

## 8. Animation plan

Use **Framer Motion** as the primary library for React-land animations. Use **GSAP** (if skill loaded) for anything involving timeline orchestration, SVG path animations, or scroll-driven sequences where GSAP's ScrollTrigger is genuinely better. Don't use both for the same effect — pick one per surface.

### 8.1 What to animate (each entry must earn its place)

1. **Sidebar selection indicator** — `layoutId` Framer Motion, 250ms spring. *Communicates:* which project is active.
2. **Project panel swap** — 200ms crossfade + 8px y-offset. *Communicates:* navigation event.
3. **Architecture diagram reveal on mount** — nodes fade+scale in staggered (80ms), then edges draw via `stroke-dashoffset`. Total ≤ 1200ms. *Communicates:* the structure of the system (components → connections).
4. **Edge hover flow dot** — 1s traveling dot along hovered edge. *Communicates:* data flow direction.
5. **Demo interaction → diagram pulse** — when user triggers a demo action, the source node pulses, a dot travels the edge, the destination node pulses. *Communicates:* the system is actually doing the thing. This is the site's signature moment. Spend real time here.
6. **Status dot breathing** — green dots only, 2s opacity loop. *Communicates:* "this is alive right now."
7. **Notes post scroll reveal** — paragraphs fade in with 8px y-shift, `viewport={{ once: true }}`, threshold ~20%. *Communicates:* focus on current reading position. Do NOT stagger words within paragraphs.
8. **Page transitions** between top-level routes — a subtle slide of the main panel (not the rail). 250ms ease-out.

### 8.2 What NOT to do

Explicitly avoid:
- Cursor-following blobs or spotlights
- Scroll-jacking or pinned section scrolling
- Typewriter text effects on load
- Parallax heroes
- Springy page enters that overshoot
- 3D tilt on cards
- Magnet/snap cursor effects
- Any "confetti" or particle systems
- Gradient-shifting backgrounds on the hero
- Animated SVG blobs

Every one of these has become a template signal and will undermine the "this was actually designed" feel.

---

## 9. Tech stack (locked)

- **Framework:** Next.js 15 (App Router) + TypeScript (strict mode)
- **Styling:** Tailwind CSS v4; CSS variables for theme tokens
- **Components:** shadcn/ui as an unstyled baseline — customize heavily, never ship defaults
- **Animation:** Framer Motion (primary); GSAP (for timeline/path work if skill is loaded)
- **Diagrams:** React Flow with fully custom node/edge components
- **MDX:** `@next/mdx` or `next-mdx-remote/rsc` with `rehype-pretty-code` (Shiki) for syntax highlighting, `remark-gfm`, `rehype-slug`, `rehype-autolink-headings`
- **Content:** files in `/content/**/*.mdx`
- **Hosting:** Vercel (frontend); Hetzner VPS or Fly.io (demo backends, when needed)
- **Rate limiting:** Upstash Redis + `@upstash/ratelimit` on API routes
- **Icons:** `lucide-react`
- **Fonts:** via `next/font`
- **Analytics:** Vercel Analytics (privacy-respecting, no cookie banner needed)

---

## 10. Live demo backend strategy

Each project's live demo is either:

**(a) Hosted on Vercel** — for demos that fit the serverless model (short-lived, stateless-ish). Redis queue demo can work this way if backed by Upstash Redis: a Route Handler enqueues, another streams status via Server-Sent Events. No VPS needed.

**(b) Hosted on a small VPS (Hetzner/Fly)** — for demos that need persistent processes: WebSocket pub/sub, blockchain mining with in-memory chain, etc. The Next.js `/api/demo/*` route handlers proxy to the VPS. The VPS URL never reaches the client.

**(c) Code-only** — for Shoppie (too big to run demo-scale) or anything not worth the hosting cost. Show a static preview + repo link. Mark status as `code-only`.

Rate-limit every demo endpoint: 10 requests per minute per IP via Upstash. Return 429 with a clean message when exceeded.

For streaming demos (worker logs, mining progress), use a `ReadableStream` from the Route Handler. Client consumes via `EventSource` or `fetch` + reader.

---

## 11. File structure

```
.
├── app/
│   ├── (marketing)/
│   │   └── page.tsx                 # Landing
│   ├── projects/
│   │   └── [slug]/
│   │       ├── page.tsx             # Shell + tab rendering
│   │       ├── opengraph-image.tsx
│   │       └── _components/
│   │           ├── architecture-tab.tsx
│   │           ├── demo-tab.tsx
│   │           └── about-tab.tsx
│   ├── notes/
│   │   ├── page.tsx                 # Index
│   │   └── [slug]/
│   │       └── page.tsx
│   ├── api/
│   │   └── demo/
│   │       └── [project]/
│   │           └── [...action]/
│   │               └── route.ts
│   ├── feed.xml/route.ts
│   ├── sitemap.ts
│   ├── layout.tsx                   # Root shell: rail + main
│   └── globals.css
├── components/
│   ├── shell/                       # Rail, main panel, tab bar
│   ├── architecture/                # React Flow custom nodes/edges
│   ├── demos/                       # One file per project's demo widget
│   ├── mdx/                         # Custom MDX components
│   └── ui/                          # shadcn primitives, customized
├── content/
│   ├── projects/*.mdx
│   └── notes/*.mdx
├── lib/
│   ├── content.ts                   # MDX loading + type-safe frontmatter
│   ├── rate-limit.ts
│   └── og-image.ts
├── public/
│   └── fonts/ (if self-hosting any)
├── next.config.js
├── tailwind.config.ts
├── tsconfig.json
└── package.json
```

---

## 12. Build sequence

Ship in this order. Don't try to do everything at once — one great project page beats six stubs.

1. **Repo + shell.** Next.js 15 project, Tailwind v4, fonts, theme tokens, root layout with left rail and main panel. Empty routes for `/`, `/projects/[slug]`, `/notes`. Deploy to Vercel. Verify theme toggle works.
2. **Content pipeline.** MDX loading for projects and notes. Type-safe frontmatter via zod schema. `generateStaticParams` hooked up.
3. **Landing page.** Boot-sequence intro, systems grid, manifesto. No animations yet — get layout right first.
4. **Project page shell.** Sidebar navigation with `layoutId` indicator, tabbed content area, URL search params for tabs. Render About tab from MDX.
5. **Architecture tab.** React Flow with custom nodes styled per the aesthetic. Load node/edge data from MDX frontmatter. Mount animation (stagger + edge draw).
6. **First live demo.** Start with Redis queue (simplest, fits Vercel-only hosting via Upstash). Build the streaming log viewer and the diagram-pulse sync.
7. **Polish animations.** Edge hover flow dots, demo→diagram sync, sidebar indicator. Test on slow devices.
8. **Notes.** Index + post pages. Syntax highlighting. RSS feed. Write 2 real posts — don't ship empty.
9. **Remaining projects.** One by one. Each gets architecture + about minimum. Add live demo only if it's worth it.
10. **SEO + metadata.** Per-route `generateMetadata`, OG images, sitemap, robots.txt, JSON-LD for the person schema on landing.
11. **Accessibility pass.** Keyboard nav through the rail, focus states on every interactive element, `prefers-reduced-motion` respected (disable non-essential animations), alt text on all images, semantic HTML throughout.
12. **Performance pass.** Lighthouse ≥ 95 on performance, a11y, best practices, SEO. Check bundle size; lazy-load React Flow and demo widgets.

---

## 13. Accessibility requirements (non-negotiable)

- Full keyboard navigability. Tab order follows visual order.
- Visible focus rings (use a consistent ring style via CSS variable; never `outline: none` without replacement).
- `prefers-reduced-motion`: disable stagger animations, edge draw animations, breathing dots, and hover flow dots. Keep essential feedback (tab swaps instant, no crossfade).
- Color contrast ≥ WCAG AA for body text, AAA where feasible.
- Semantic landmarks: `<nav>`, `<main>`, `<article>`, proper heading hierarchy.
- All diagram information must also be available as text — each project page has a prose description of the architecture, not just the visual.

---

## 14. Out of scope (explicitly)

- No login / auth.
- No comments system on notes. A mailto link is the reply channel.
- No newsletter signup unless Siddhant actually plans to write a newsletter.
- No search (Cmd+K palette) in v1. Add later if the site grows.
- No i18n.
- No analytics beyond Vercel Analytics.

---

## 15. Success criteria

A recruiter lands on the site, spends 30 seconds, and leaves thinking: "this person ships real backend systems and has taste." An engineer lands, spends 10 minutes, clicks a demo, and wants to talk to Siddhant. Both happen without compromise — because the site respects their different depths of attention.

Concrete checks before shipping:
- Lighthouse ≥ 95 across all four categories on `/` and a representative project page.
- Works fully with JS disabled except the demo tabs (content is readable, navigation works — thanks to SSG).
- Works on a throttled 3G connection (content readable within 3s).
- No broken links; no placeholder copy; no fake demo responses.
- At least 2 real notes posts published on launch.
- At least 3 projects with a working live demo at launch (Redis queue, WebSocket pub/sub, and one more).

---

## 16. Open decisions to make during build

Claude Code should make these decisions as it goes, using taste — but flag them in the PR description so Siddhant can review:

- Final accent color (warm amber vs. specific cyan vs. other).
- Final typography pair (after trying 2–3 combinations in a preview).
- Exact copy for the landing manifesto (draft 2–3 options).
- Whether the boot-sequence intro should animate on first visit only (localStorage flag) or every visit.
- Whether to include a small "now" widget on landing showing what Siddhant's currently working on (pulled from a pinned note tagged `now`).

When in doubt: choose the option that feels most like a piece of software and least like a website.