# LACE Website

Astro-based landing page mockup for LACE (Long-Form Artifact Construction Engine).

## Run locally

1. Install dependencies:
   - `npm install`
2. Start dev server:
   - `npm run dev`
3. Build production output:
   - `npm run build`

## Deploy to GitHub Pages

This repository includes a workflow at `.github/workflows/deploy.yml` that builds and deploys the Astro output to GitHub Pages.

1. Push this repo to GitHub.
2. In GitHub, open `Settings -> Pages`.
3. Set `Source` to `GitHub Actions`.
4. Push to `main` (or `master`) to trigger deployment.

### URL behavior

- During GitHub Actions deploy builds, the Astro `base` path is set to `/lace-com/`.
- During local development (`npm run dev`), the `base` path remains `/`.
- Override defaults with environment variables:
  - `SITE_URL` (example: `https://example.com`)
  - `BASE_PATH` (example: `/lace-com`)

