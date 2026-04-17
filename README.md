# bmcandr.github.io

Personal website for Brendan McAndrew, built with [Astro 4](https://astro.build) and deployed to GitHub Pages.

## Development

```bash
npm install
npm run dev       # dev server at http://localhost:4321 (hot reload)
npm run build     # production build → dist/
npm run preview   # serve dist/ locally to verify before deploying
npm test          # run tests
```

## Deployment

Deployment is automatic via GitHub Actions on every push to `main`. See [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml).

To deploy:

1. Merge your branch to `main` (or push directly)
2. GitHub Actions builds and publishes to GitHub Pages
3. Live at [https://bmcandr.github.io](https://bmcandr.github.io)

## Adding Projects

Edit [`src/data/projects.js`](src/data/projects.js). Each entry follows this shape:

```js
{
  slug: "my-project",          // used for /projects/my-project URL (if write-up exists)
  title: "My Project",
  description: "One or two sentences about what it does.",
  tech: ["Python", "MapLibre", "STAC"],
  github: "https://github.com/bmcandr/my-project",  // or null
  demo: null,                  // live demo URL or null
  snippet: {                   // optional code sample shown on the card
    code: `import pystac_client\nclient = pystac_client.Client.open(...)`,
    lang: "python",
  },
}
```

Remove the placeholder entry before going live.

## Writing a Project Page

Project pages are MDX files that support inline interactive maps.

1. Create `src/pages/projects/my-project.mdx`
2. Write in Markdown, embed maps with the `Map` component:

```mdx
---
layout: ../../components/ProjectLayout.astro
title: My Project
---

import Map from '../../components/map/Map.tsx';

# My Project

Some context about the area of interest...

<Map client:load center={[-77.4, 38.9]} zoom={8} height="500px" />

Analysis continues here...
```

`Map` props: `center` (`[lng, lat]`), `zoom` (number), `height` (CSS string, default `"400px"`).

### Code snippets

Fenced code blocks are syntax-highlighted by Shiki automatically — no imports needed:

````mdx
Here's how to open a STAC catalog:

```python
import pystac_client

client = pystac_client.Client.open("https://earth-search.aws.element84.com/v1")
results = client.search(collections=["sentinel-2-l2a"], bbox=[-77.5, 38.8, -77.0, 39.0])
```
````

Supported language tags include `python`, `javascript`, `typescript`, `bash`, `json`, `sql`, and [many more](https://shiki.style/languages).

## Structure

```text
src/
├── components/
│   ├── Layout.astro       # HTML shell (title prop)
│   ├── Hero.astro         # Full-viewport satellite image section
│   ├── Nameplate.astro    # Name, tagline, social links, scroll indicator
│   ├── Projects.astro      # Project grid section
│   ├── ProjectLayout.astro # Layout for MDX project write-up pages
│   ├── ProjectCard.astro  # Individual project card (Shiki code highlighting)
│   └── map/
│       └── Map.tsx        # MapLibre GL map (React, use with client:load in MDX)
├── data/
│   └── projects.js        # Project data — edit this to add/update projects
├── pages/
│   ├── index.astro        # Homepage (Hero + Projects)
│   └── projects/
│       ├── [slug].astro   # Project page template
│       └── *.mdx          # Individual project write-ups (add here)
└── styles/
    └── global.css         # Font import + body reset
```
