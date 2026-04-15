# Site Redesign: Gatsby → Astro

**Date:** 2026-04-15
**Status:** Approved

## Overview

Migrate `bmcandr.github.io` from Gatsby 5 to Astro 4, fix existing code quality issues, and add a project showcase section. The STAC map page is removed entirely. Visual aesthetic (dark/moody, satellite imagery hero, muted green accents, Rajdhani font) is preserved.

## Goals

- Replace unmaintained Gatsby with Astro (static output, GitHub Pages deployment)
- Fix HTML validity issues, CSS leakage, and other bugs in current code
- Add a projects section below the hero on the homepage (single-page, scroll-based)
- Enable MDX with React interactivity (MapLibre GL) for future geospatial project write-ups
- Keep the implementation simple — no over-engineering for speculative future needs

## Non-Goals

- Blog, contact form, or other new pages (can be added later)
- Navigation header (not needed for single-page structure)
- Dark/light mode toggle
- Any TypeScript migration of existing patterns

## Architecture

**Framework:** Astro 4.x, `output: "static"`, deployed to GitHub Pages via the existing `gh-pages` script.

**Integrations:**

- `@astrojs/react` — enables `.tsx` components and MapLibre interactivity in MDX
- `@astrojs/mdx` — enables MDX pages; unused initially but ready for project write-ups
- `@fontsource/rajdhani` — self-hosted font, replaces `gatsby-plugin-google-fonts`

**Code highlighting:** Shiki (built into Astro, zero config). Used for optional code snippets in project cards and in future MDX write-ups.

**Removed dependencies:** `gatsby`, `gatsby-*`, `@loadable/component`, `react-code-blocks`, `gh-pages` (Astro has its own static adapter).

**Kept dependencies:** `maplibre-gl`, `react`, `react-dom`, `react-icons`.

## File Structure

```text
src/
├── components/
│   ├── Layout.astro        # <html>, <head>, meta tags, font import
│   ├── Hero.astro          # full-viewport background image + overlay
│   ├── Nameplate.astro     # name, divider, tagline + slot for social icons
│   ├── SocialLinks.astro   # <ul> of GitHub + LinkedIn icon links
│   ├── Attribution.astro   # image credit (bottom-left)
│   ├── Projects.astro      # section wrapper + card grid
│   ├── ProjectCard.astro   # individual project card
│   └── map/
│       └── Map.tsx         # reusable MapLibre React component (client:load)
├── data/
│   └── projects.js         # project data array (source of truth for cards)
├── images/
│   └── hero.jpg            # Landsat-8 image (moved from src/images/)
├── pages/
│   ├── index.astro         # homepage: <Hero> + <Projects>
│   └── projects/
│       └── [slug].astro    # MDX project page template (scaffold only)
└── styles/
    └── global.css          # body reset, font-face declaration
```

## Pages

### Homepage (`/`)

Single scrollable page, two sections:

**Hero section** (full viewport)

- Landsat-8 satellite image background, grayscale, dark overlay
- Centered nameplate: name → `<hr>` divider → tagline → social icons
- Social icons: GitHub, LinkedIn (map/globe link removed — STAC page gone)
- Scroll indicator at bottom center (chevron) pointing to projects section
- Image attribution fixed at bottom-left

**Projects section** (below the fold)

- Dark background consistent with hero
- Section heading with muted green accent
- Responsive grid of `ProjectCard` components driven by `src/data/projects.js`
- Each card: title, description, tech stack tags, GitHub/demo links, optional Shiki-highlighted code snippet
- Cards link to `/projects/[slug]` when a write-up exists; otherwise card is standalone

### Project pages (`/projects/[slug]`)

Scaffold only — no content initially. When populated, these will be MDX files that can embed `<Map client:load />` components inline for geospatial write-ups.

## Component Details

### `Layout.astro`

Wraps every page. Renders a valid `<html>` document with `<head>` (title, meta charset/viewport, font import) and `<body>`. Accepts a `title` prop.

### `Hero.astro`

Full-viewport `<section>` with the Landsat-8 image rendered via Astro's `<Image>` component (`object-fit: cover`, `height: 100vh`). Dark overlay via an absolutely-positioned `<div>`. Renders `<Nameplate>` and `<Attribution>` as children.

### `Nameplate.astro`

Absolutely centered within the hero. Name `<h1>`, `<hr>` divider, tagline `<p>`, `<SocialLinks>` below. Font sizes in `rem`, not `vh`.

### `SocialLinks.astro`

A valid `<ul>` (fixes current bare `<li>` bug). Two items: GitHub (`FaSquareGithub`) and LinkedIn (`FaLinkedin`). Styles scoped to this component.

### `Projects.astro`

Iterates `src/data/projects.js` and renders a `<ProjectCard>` for each. Section has an `id="projects"` anchor for the scroll indicator link.

### `ProjectCard.astro`

Accepts a single project object as a prop. Renders title, description, tech tags, links, and optionally a Shiki-highlighted code block if `snippet` is provided.

### `Map.tsx`

A reusable MapLibre GL React component. Accepts `center` and `zoom` props. Used in MDX pages via `<Map client:load center={[lng, lat]} zoom={n} />`. No global styles leaked — MapLibre CSS imported within the component.

## Data Model

```js
// src/data/projects.js
export const projects = [
  {
    slug: "my-project",           // used for /projects/[slug] URL
    title: "My Project",
    description: "One or two sentences.",
    tech: ["Python", "MapLibre", "STAC"],
    github: "https://github.com/bmcandr/...",  // null if not public
    demo: null,                   // URL or null
    snippet: {                    // optional
      code: "print('hello')",
      lang: "python",
    },
  },
];
```

## Bug Fixes from Current Code

| Issue | Fix |
| --- | --- |
| `<li>` without parent `<ul>` in `SocialLayout` | Wrap in `<ul>` in `SocialLinks.astro` |
| `<title>` inside `<div>` in `Layout` | Moved into `<head>` in `Layout.astro` |
| Global `li` and `a` selectors in CSS Module | Scoped to `.socialLinks li` and `.socialLinks a` |
| Font sizes in `vh` units (`2.5vh`) | Replaced with `rem` |
| `alignText` (invalid CSS-in-JS) | Removed (was a no-op) |
| `awake()` called outside `useEffect` | N/A — STAC map removed entirely |
| Vendor prefixes on transitions | Removed; use standard `transition` only |

## Deployment

Unchanged — `npm run build` produces a `dist/` directory, `gh-pages` publishes it to the `gh-pages` branch. Astro's static adapter outputs to `dist/` by default.
