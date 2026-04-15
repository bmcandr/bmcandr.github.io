# Site Redesign: Gatsby → Astro Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Migrate `bmcandr.github.io` from Gatsby to Astro 4, rebuild the homepage with a hero + projects section, and scaffold MDX project pages with MapLibre support.

**Architecture:** Single-page Astro 4 static site. Hero section (full viewport, satellite imagery, dark overlay) plus a projects section below the fold, both on `index.astro`. Components are `.astro` files with scoped `<style>` blocks; the Map component is `.tsx` (React) for MapLibre interactivity. MDX integration is installed but unpopulated.

**Tech Stack:** Astro 4, `@astrojs/react`, `@astrojs/mdx`, `@fontsource/rajdhani`, `maplibre-gl`, `react-icons`, `gh-pages`, Vitest + React Testing Library (tests), Shiki (built-in, code highlighting)

---

## File Map

| File | Action | Responsibility |
| --- | --- | --- |
| `package.json` | Replace | Astro scripts + dependencies |
| `astro.config.mjs` | Create | Astro config: react + mdx integrations, static output |
| `vitest.config.ts` | Create | Vitest + jsdom + React plugin |
| `src/styles/global.css` | Create | Body reset + Rajdhani font import |
| `src/components/Layout.astro` | Create | `<html>/<head>/<body>` shell, title prop |
| `src/components/Hero.astro` | Create | Full-viewport image, overlay, attribution inline |
| `src/components/Nameplate.astro` | Create | Name, divider, tagline, social icon links inline |
| `src/components/Projects.astro` | Create | Section wrapper, iterates projects data |
| `src/components/ProjectCard.astro` | Create | Single card: title, description, tags, links, optional code |
| `src/components/map/Map.tsx` | Create | Reusable MapLibre GL React component |
| `src/data/projects.js` | Create | Project data array |
| `src/pages/index.astro` | Create | Homepage: `<Hero>` + `<Projects>` |
| `src/pages/projects/[slug].astro` | Create | Project page scaffold with `getStaticPaths` |
| `src/images/hero.jpg` | Rename | Landsat-8 hero image (rename from long filename) |
| `gatsby-config.js` | Delete | Gatsby-specific, no longer needed |
| `src/pages/index.js` | Delete | Old Gatsby homepage |
| `src/pages/map.js` | Delete | Old STAC map page |
| `src/components/*.js` (old) | Delete | Old Gatsby components |
| `src/components/map/STACMap.js` | Delete | Old STAC map component |
| `src/components/map/stac-info.js` | Delete | Old STAC info component |

---

## Task 1: Bootstrap Astro

**Files:**
- Replace: `package.json`
- Create: `astro.config.mjs`, `vitest.config.ts`, `src/styles/global.css`
- Delete: `gatsby-config.js`, all old `src/` files (see File Map)
- Rename: `src/images/LC08_L1TP_036033_20180913_20180928_01_T1.jpg` → `src/images/hero.jpg`

- [ ] **Step 1: Remove old Gatsby files**

```bash
rm gatsby-config.js
rm src/pages/index.js src/pages/map.js
rm src/components/hero.js src/components/hero.module.css
rm src/components/nameplate.js src/components/nameplate.module.css
rm src/components/social-layout.js src/components/social-layout.module.css
rm src/components/attribution.js src/components/attribution.module.css
rm src/components/layout.js
rm src/components/map/STACMap.js src/components/map/stac-info.js
```

- [ ] **Step 2: Rename hero image**

```bash
mv "src/images/LC08_L1TP_036033_20180913_20180928_01_T1.jpg" src/images/hero.jpg
```

- [ ] **Step 3: Replace `package.json`**

```json
{
  "scripts": {
    "dev": "astro dev",
    "build": "astro build",
    "preview": "astro preview",
    "deploy": "npm run build && gh-pages -d dist",
    "test": "vitest run"
  },
  "dependencies": {
    "astro": "^4.0.0",
    "@astrojs/mdx": "^3.0.0",
    "@astrojs/react": "^3.0.0",
    "@fontsource/rajdhani": "^5.0.0",
    "maplibre-gl": "^3.2.0",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-icons": "^4.10.1"
  },
  "devDependencies": {
    "@testing-library/jest-dom": "^6.0.0",
    "@testing-library/react": "^14.0.0",
    "@vitejs/plugin-react": "^4.0.0",
    "gh-pages": "^5.0.0",
    "jsdom": "^24.0.0",
    "vitest": "^1.0.0"
  }
}
```

- [ ] **Step 4: Install dependencies**

```bash
npm install
```

Expected: no errors, `node_modules` populated with astro and all listed packages.

- [ ] **Step 5: Create `astro.config.mjs`**

```js
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import mdx from '@astrojs/mdx';

export default defineConfig({
  integrations: [react(), mdx()],
  output: 'static',
});
```

- [ ] **Step 6: Create `vitest.config.ts`**

```ts
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./vitest.setup.ts'],
  },
});
```

- [ ] **Step 7: Create `vitest.setup.ts`**

```ts
import '@testing-library/jest-dom';
```

- [ ] **Step 8: Create `src/styles/global.css`**

```css
@import '@fontsource/rajdhani/300.css';

*,
*::before,
*::after {
  box-sizing: border-box;
}

body {
  margin: 0;
  font-family: 'Rajdhani', sans-serif;
}
```

- [ ] **Step 9: Verify Astro starts**

```bash
npm run dev
```

Expected: Astro dev server starts on `http://localhost:4321`. The page will be empty/404 — that's fine, no pages exist yet.

- [ ] **Step 10: Commit**

```bash
git add -A
git commit -m "chore: bootstrap Astro, remove Gatsby"
```

---

## Task 2: Layout Component

**Files:**
- Create: `src/components/Layout.astro`

- [ ] **Step 1: Create `src/components/Layout.astro`**

```astro
---
interface Props {
  title?: string;
}
const { title = 'Brendan McAndrew' } = Astro.props;
---
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>{title}</title>
  </head>
  <body>
    <slot />
  </body>
</html>

<style is:global>
  @import '../styles/global.css';
</style>
```

- [ ] **Step 2: Create a smoke-test page to verify Layout renders**

Create `src/pages/index.astro` temporarily:

```astro
---
import Layout from '../components/Layout.astro';
---
<Layout title="Test">
  <p>hello</p>
</Layout>
```

- [ ] **Step 3: Run dev server and verify**

```bash
npm run dev
```

Open `http://localhost:4321`. Expected: page renders with "hello", browser tab title shows "Test", no console errors.

- [ ] **Step 4: Commit**

```bash
git add src/components/Layout.astro src/pages/index.astro
git commit -m "feat: add Layout component"
```

---

## Task 3: Hero Component

**Files:**
- Create: `src/components/Hero.astro`

- [ ] **Step 1: Create `src/components/Hero.astro`**

```astro
---
import { Image } from 'astro:assets';
import heroImage from '../images/hero.jpg';
---
<section class="hero">
  <Image
    src={heroImage}
    alt=""
    class="hero-image"
    quality={90}
  />
  <div class="overlay"></div>
  <slot />
  <div class="attribution">
    <b>image:</b> Landsat-8 courtesy of the U.S. Geological Survey
  </div>
</section>

<style>
  .hero {
    position: relative;
    height: 100vh;
    overflow: hidden;
  }

  .hero-image {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    filter: grayscale(100%);
  }

  .overlay {
    position: absolute;
    inset: 0;
    background-color: rgba(0, 0, 0, 0.6);
    z-index: 1;
  }

  .attribution {
    position: absolute;
    bottom: 0.5rem;
    left: 0.25rem;
    font-size: 0.75rem;
    color: rgb(176, 183, 174);
    z-index: 2;
  }
</style>
```

- [ ] **Step 2: Update `src/pages/index.astro` to use Hero**

```astro
---
import Layout from '../components/Layout.astro';
import Hero from '../components/Hero.astro';
---
<Layout title="Brendan McAndrew">
  <Hero />
</Layout>
```

- [ ] **Step 3: Run dev server and verify**

```bash
npm run dev
```

Open `http://localhost:4321`. Expected: full-viewport grayscale satellite image with dark overlay and attribution text at bottom-left.

- [ ] **Step 4: Commit**

```bash
git add src/components/Hero.astro src/pages/index.astro
git commit -m "feat: add Hero component"
```

---

## Task 4: Nameplate Component

**Files:**
- Create: `src/components/Nameplate.astro`

- [ ] **Step 1: Create `src/components/Nameplate.astro`**

```astro
---
import { FaSquareGithub, FaLinkedin, FaChevronDown } from 'react-icons/fa6';
---
<div class="nameplate">
  <h1 class="name">brendan mcandrew</h1>
  <hr class="divider" />
  <p class="tagline">geospatial software engineer</p>
  <ul class="social-links">
    <li>
      <a href="https://github.com/bmcandr" target="_blank" rel="noopener noreferrer">
        <FaSquareGithub />
      </a>
    </li>
    <li>
      <a href="https://linkedin.com/in/brendanbmcandrew" target="_blank" rel="noopener noreferrer">
        <FaLinkedin />
      </a>
    </li>
  </ul>
</div>
<a href="#projects" class="scroll-indicator" aria-label="Scroll to projects">
  <FaChevronDown />
</a>

<style>
  .nameplate {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    text-align: center;
    z-index: 2;
    white-space: nowrap;
  }

  .name {
    font-size: 2.5rem;
    color: white;
    margin: 0;
    font-weight: 300;
    letter-spacing: 0.1em;
    text-transform: lowercase;
  }

  .divider {
    margin: 1em auto;
    max-width: 95%;
    border: none;
    border-top: 1px solid rgba(147, 164, 144, 1);
  }

  .tagline {
    font-size: 1.1rem;
    color: white;
    margin: 0;
    letter-spacing: 0.05em;
  }

  .social-links {
    list-style: none;
    padding: 0;
    margin: 1rem 0 0;
  }

  .social-links li {
    display: inline-block;
    padding: 5px;
    font-size: 3rem;
  }

  .social-links a {
    color: rgba(147, 164, 144, 0.65);
    transition: color 0.5s ease-in-out;
    display: block;
    line-height: 1;
  }

  .social-links a:hover {
    color: rgba(255, 255, 255, 0.65);
  }

  .scroll-indicator {
    position: absolute;
    bottom: 1.5rem;
    left: 50%;
    transform: translateX(-50%);
    color: rgba(147, 164, 144, 0.65);
    font-size: 1.5rem;
    z-index: 2;
    transition: color 0.5s ease-in-out;
    animation: bounce 2s infinite;
  }

  .scroll-indicator:hover {
    color: rgba(255, 255, 255, 0.65);
  }

  @keyframes bounce {
    0%, 100% { transform: translateX(-50%) translateY(0); }
    50% { transform: translateX(-50%) translateY(6px); }
  }
</style>
```

- [ ] **Step 2: Update `src/components/Hero.astro` to include Nameplate**

```astro
---
import { Image } from 'astro:assets';
import heroImage from '../images/hero.jpg';
import Nameplate from './Nameplate.astro';
---
<section class="hero">
  <Image
    src={heroImage}
    alt=""
    class="hero-image"
    quality={90}
  />
  <div class="overlay"></div>
  <Nameplate />
  <div class="attribution">
    <b>image:</b> Landsat-8 courtesy of the U.S. Geological Survey
  </div>
</section>

<style>
  .hero {
    position: relative;
    height: 100vh;
    overflow: hidden;
  }

  .hero-image {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    filter: grayscale(100%);
  }

  .overlay {
    position: absolute;
    inset: 0;
    background-color: rgba(0, 0, 0, 0.6);
    z-index: 1;
  }

  .attribution {
    position: absolute;
    bottom: 0.5rem;
    left: 0.25rem;
    font-size: 0.75rem;
    color: rgb(176, 183, 174);
    z-index: 2;
  }
</style>
```

- [ ] **Step 3: Run dev server and verify**

```bash
npm run dev
```

Open `http://localhost:4321`. Expected: name, divider, tagline, and two social icons centered over the hero image. Animated chevron at the bottom center. Social icons show muted green, turn white on hover.

- [ ] **Step 4: Commit**

```bash
git add src/components/Nameplate.astro src/components/Hero.astro
git commit -m "feat: add Nameplate with social links and scroll indicator"
```

---

## Task 5: Project Data

**Files:**
- Create: `src/data/projects.js`, `src/data/__tests__/projects.test.js`

- [ ] **Step 1: Write the failing test**

Create `src/data/__tests__/projects.test.js`:

```js
import { describe, test, expect } from 'vitest';
import { projects } from '../projects.js';

describe('projects data', () => {
  test('is an array', () => {
    expect(Array.isArray(projects)).toBe(true);
  });

  test('each project has required fields', () => {
    projects.forEach((p) => {
      expect(p).toHaveProperty('slug');
      expect(typeof p.slug).toBe('string');
      expect(p).toHaveProperty('title');
      expect(typeof p.title).toBe('string');
      expect(p).toHaveProperty('description');
      expect(typeof p.description).toBe('string');
      expect(p).toHaveProperty('tech');
      expect(Array.isArray(p.tech)).toBe(true);
    });
  });

  test('optional snippet has code and lang if present', () => {
    projects.forEach((p) => {
      if (p.snippet) {
        expect(p.snippet).toHaveProperty('code');
        expect(p.snippet).toHaveProperty('lang');
      }
    });
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

```bash
npm test
```

Expected: FAIL — `Cannot find module '../projects.js'`

- [ ] **Step 3: Create `src/data/projects.js`**

```js
export const projects = [
  {
    slug: "example-project",
    title: "Example Project",
    description: "A placeholder. Replace with your real projects.",
    tech: ["Python", "Astro"],
    github: null,
    demo: null,
    snippet: null,
  },
];
```

- [ ] **Step 4: Run tests to verify they pass**

```bash
npm test
```

Expected: PASS — 3 tests passing.

- [ ] **Step 5: Commit**

```bash
git add src/data/projects.js src/data/__tests__/projects.test.js
git commit -m "feat: add project data file with shape tests"
```

---

## Task 6: ProjectCard Component

**Files:**
- Create: `src/components/ProjectCard.astro`

- [ ] **Step 1: Create `src/components/ProjectCard.astro`**

```astro
---
import { Code } from 'astro:components';

const { project } = Astro.props;
const { title, description, tech, github, demo, snippet, slug } = project;
---
<div class="card">
  <h3 class="title">
    {github
      ? <a href={github} target="_blank" rel="noopener noreferrer">{title}</a>
      : title}
  </h3>
  <p class="description">{description}</p>
  <ul class="tags">
    {tech.map((t) => <li class="tag">{t}</li>)}
  </ul>
  {(github || demo) && (
    <div class="links">
      {github && <a href={github} target="_blank" rel="noopener noreferrer">GitHub →</a>}
      {demo && <a href={demo} target="_blank" rel="noopener noreferrer">Demo →</a>}
    </div>
  )}
  {snippet && (
    <div class="snippet">
      <Code code={snippet.code} lang={snippet.lang} theme="dracula" />
    </div>
  )}
</div>

<style>
  .card {
    background-color: rgba(255, 255, 255, 0.04);
    border: 1px solid rgba(147, 164, 144, 0.25);
    border-radius: 4px;
    padding: 1.5rem;
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }

  .title {
    margin: 0;
    font-size: 1.25rem;
    color: white;
  }

  .title a {
    color: white;
    text-decoration: none;
    transition: color 0.3s ease;
  }

  .title a:hover {
    color: rgba(147, 164, 144, 1);
  }

  .description {
    margin: 0;
    color: rgba(255, 255, 255, 0.75);
    font-size: 0.95rem;
    line-height: 1.5;
  }

  .tags {
    list-style: none;
    padding: 0;
    margin: 0;
    display: flex;
    flex-wrap: wrap;
    gap: 0.4rem;
  }

  .tag {
    font-size: 0.75rem;
    padding: 0.2rem 0.6rem;
    border: 1px solid rgba(147, 164, 144, 0.5);
    border-radius: 2px;
    color: rgba(147, 164, 144, 0.9);
  }

  .links {
    display: flex;
    gap: 1rem;
  }

  .links a {
    font-size: 0.875rem;
    color: rgba(147, 164, 144, 0.75);
    text-decoration: none;
    transition: color 0.3s ease;
  }

  .links a:hover {
    color: rgba(147, 164, 144, 1);
  }

  .snippet {
    border-radius: 4px;
    overflow: hidden;
    font-size: 0.8rem;
  }
</style>
```

- [ ] **Step 2: Commit**

```bash
git add src/components/ProjectCard.astro
git commit -m "feat: add ProjectCard component"
```

---

## Task 7: Projects Section

**Files:**
- Create: `src/components/Projects.astro`
- Modify: `src/pages/index.astro`

- [ ] **Step 1: Create `src/components/Projects.astro`**

```astro
---
import { projects } from '../data/projects.js';
import ProjectCard from './ProjectCard.astro';
---
<section id="projects" class="projects">
  <h2 class="heading">Projects</h2>
  <div class="grid">
    {projects.map((project) => (
      <ProjectCard project={project} />
    ))}
  </div>
</section>

<style>
  .projects {
    background-color: #0d0d0d;
    padding: 4rem 2rem;
    min-height: 100vh;
  }

  .heading {
    font-size: 1.5rem;
    font-weight: 300;
    letter-spacing: 0.15em;
    text-transform: uppercase;
    color: rgba(147, 164, 144, 1);
    margin: 0 0 2rem;
    text-align: center;
  }

  .grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
    gap: 1.5rem;
    max-width: 1100px;
    margin: 0 auto;
  }
</style>
```

- [ ] **Step 2: Update `src/pages/index.astro`**

```astro
---
import Layout from '../components/Layout.astro';
import Hero from '../components/Hero.astro';
import Projects from '../components/Projects.astro';
---
<Layout title="Brendan McAndrew">
  <Hero />
  <Projects />
</Layout>
```

- [ ] **Step 3: Run dev server and verify**

```bash
npm run dev
```

Open `http://localhost:4321`. Expected:
- Hero section fills the viewport
- Scrolling down (or clicking the chevron) reveals the dark projects section
- The placeholder project card renders with title, description, and tech tag

- [ ] **Step 4: Run full build to verify no errors**

```bash
npm run build
```

Expected: build succeeds, `dist/` is populated, no TypeScript or Astro errors.

- [ ] **Step 5: Commit**

```bash
git add src/components/Projects.astro src/pages/index.astro
git commit -m "feat: add Projects section to homepage"
```

---

## Task 8: Map Component

**Files:**
- Create: `src/components/map/Map.tsx`, `src/components/map/__tests__/Map.test.tsx`

- [ ] **Step 1: Write the failing test**

Create `src/components/map/__tests__/Map.test.tsx`:

```tsx
import { describe, test, expect, vi } from 'vitest';
import { render } from '@testing-library/react';
import Map from '../Map';

vi.mock('maplibre-gl', () => ({
  default: {
    Map: vi.fn().mockImplementation(() => ({
      remove: vi.fn(),
    })),
  },
}));

describe('Map', () => {
  test('renders a container div', () => {
    const { container } = render(<Map center={[0, 0]} zoom={2} />);
    expect(container.querySelector('div')).toBeTruthy();
  });

  test('applies default height of 400px', () => {
    const { container } = render(<Map center={[0, 0]} zoom={2} />);
    const div = container.querySelector('div') as HTMLDivElement;
    expect(div.style.height).toBe('400px');
  });

  test('applies custom height', () => {
    const { container } = render(<Map center={[0, 0]} zoom={2} height="600px" />);
    const div = container.querySelector('div') as HTMLDivElement;
    expect(div.style.height).toBe('600px');
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

```bash
npm test
```

Expected: FAIL — `Cannot find module '../Map'`

- [ ] **Step 3: Create `src/components/map/Map.tsx`**

```tsx
import React, { useEffect, useRef } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';

interface Props {
  center: [number, number];
  zoom: number;
  height?: string;
}

const Map: React.FC<Props> = ({ center, zoom, height = '400px' }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const map = new maplibregl.Map({
      container: containerRef.current,
      style: {
        version: 8,
        sources: {
          osm: {
            type: 'raster',
            tiles: ['https://a.tile.openstreetmap.org/{z}/{x}/{y}.png'],
            tileSize: 256,
            attribution: '&copy; OpenStreetMap Contributors',
            maxzoom: 19,
          },
        },
        layers: [{ id: 'osm', type: 'raster', source: 'osm' }],
      },
      center,
      zoom,
    });

    return () => map.remove();
  }, []);

  return <div ref={containerRef} style={{ width: '100%', height }} />;
};

export default Map;
```

- [ ] **Step 4: Run tests to verify they pass**

```bash
npm test
```

Expected: all tests pass (3 Map tests + 3 projects data tests = 6 total).

- [ ] **Step 5: Commit**

```bash
git add src/components/map/Map.tsx src/components/map/__tests__/Map.test.tsx
git commit -m "feat: add reusable MapLibre Map component"
```

---

## Task 9: Project Page Scaffold

**Files:**
- Create: `src/pages/projects/[slug].astro`

- [ ] **Step 1: Create `src/pages/projects/[slug].astro`**

```astro
---
import Layout from '../../components/Layout.astro';

export function getStaticPaths() {
  // No project pages yet. Add entries here as MDX write-ups are created.
  // Example when ready:
  // import { projects } from '../../data/projects.js';
  // return projects
  //   .filter(p => p.slug)
  //   .map(p => ({ params: { slug: p.slug } }));
  return [];
}

const { slug } = Astro.params;
---
<Layout title={`Project | Brendan McAndrew`}>
  <p>Project page for {slug} — coming soon.</p>
</Layout>
```

- [ ] **Step 2: Run full build to verify scaffold doesn't break anything**

```bash
npm run build
```

Expected: build succeeds with no errors. No project pages are generated (empty `getStaticPaths`).

- [ ] **Step 3: Commit**

```bash
git add src/pages/projects/[slug].astro
git commit -m "feat: scaffold project page with getStaticPaths"
```

---

## Task 10: Final Verification and Deploy Config

**Files:**
- Verify: `package.json` deploy script works

- [ ] **Step 1: Run full test suite**

```bash
npm test
```

Expected: all 6 tests pass.

- [ ] **Step 2: Run production build**

```bash
npm run build
```

Expected: `dist/` directory created, build completes with no errors or warnings. Key output files: `dist/index.html`, `dist/_astro/` (optimized assets).

- [ ] **Step 3: Preview the production build locally**

```bash
npm run preview
```

Open `http://localhost:4321`. Verify:
- Hero image loads, grayscale + dark overlay applied
- Name, divider, tagline, and social icons render centered
- Chevron animates, clicking it scrolls to the projects section
- Projects section renders with the placeholder card
- Attribution text visible at bottom-left of hero
- No console errors

- [ ] **Step 4: Commit any final tweaks, then tag the migration complete**

```bash
git add -A
git commit -m "feat: complete Gatsby → Astro migration"
```

---

## Usage: Adding a Real Project

Once the site is live, update `src/data/projects.js` to add real projects:

```js
export const projects = [
  {
    slug: "my-real-project",
    title: "My Real Project",
    description: "What it does, in one or two sentences.",
    tech: ["Python", "MapLibre", "STAC"],
    github: "https://github.com/bmcandr/my-real-project",
    demo: null,
    snippet: {
      code: `import pystac_client\n\nclient = pystac_client.Client.open("https://earth-search.aws.element84.com/v1")`,
      lang: "python",
    },
  },
];
```

## Usage: Adding an MDX Project Write-up with a Map

1. Create `src/pages/projects/my-project.mdx`
2. Add a `getStaticPaths` entry in `[slug].astro` (or migrate to a content collection later)
3. In the MDX file:

```mdx
import Map from '../../components/map/Map.tsx';

# My Project

Some context...

<Map client:load center={[-77.4, 38.9]} zoom={8} height="500px" />

Analysis continues here...
```
