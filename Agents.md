# Determinant Sites

One npm-workspace repo for two static Astro sites:

- `apps/determinant` -> `determinantsystems.com`
- `apps/lace` -> `laceplatform.com`
- `packages/site-kit` -> shared Astro layout, styles, components, assets, and interaction code

## Local Development

Install from the repo root:

```sh
npm ci
```

Run either site:

```sh
npm run dev:determinant
npm run dev:lace
```

Build and verify:

```sh
npm run check:domains
npm run build:determinant
npm run build:lace
npm run build
```

## Cloudflare Pages

Use two Cloudflare Pages projects connected to the same GitHub repo. Leave each Pages project's root directory blank so Cloudflare installs from the repo root and uses the workspace-aware `package-lock.json`.

### determinant-systems

- Framework preset: Astro
- Production branch: `main`
- Root directory: leave blank
- Build command: `npm run build:determinant`
- Build output directory: `apps/determinant/dist`
- Custom domains: `determinantsystems.com`, optionally `www.determinantsystems.com`
- Build watch include paths:
  - `apps/determinant/*`
  - `packages/site-kit/*`
  - `package.json`
  - `package-lock.json`
  - `.node-version`
  - `.github/workflows/*`

### lace-platform

- Framework preset: Astro
- Production branch: `main`
- Root directory: leave blank
- Build command: `npm run build:lace`
- Build output directory: `apps/lace/dist`
- Custom domains: `laceplatform.com`, optionally `www.laceplatform.com`
- Build watch include paths:
  - `apps/lace/*`
  - `packages/site-kit/*`
  - `package.json`
  - `package-lock.json`
  - `.node-version`
  - `.github/workflows/*`

Build watch paths reduce unnecessary builds in the monorepo, but they are not a correctness boundary. Cloudflare may still build on very large pushes.

## Domain Setup

For apex domains, add each domain as a Cloudflare zone and point the registrar nameservers to Cloudflare before attaching it to Pages. Attach domains through each Pages project's Custom domains flow. For `www`, attach the hostname as an additional custom domain or add a Cloudflare Bulk Redirect to the apex.

## Notes

Both Astro apps are static builds and intentionally do not use `@astrojs/cloudflare`. Add the Cloudflare adapter only if a site later needs on-demand rendering, Pages Functions, bindings, or API routes.

Cloudflare references: [Astro guide](https://developers.cloudflare.com/pages/framework-guides/deploy-an-astro-site/), [build configuration](https://developers.cloudflare.com/pages/configuration/build-configuration/), [monorepos](https://developers.cloudflare.com/pages/configuration/monorepos/), [build watch paths](https://developers.cloudflare.com/pages/configuration/build-watch-paths/), [custom domains](https://developers.cloudflare.com/pages/configuration/custom-domains/), [preview deployments](https://developers.cloudflare.com/pages/configuration/preview-deployments/), [GitHub integration](https://developers.cloudflare.com/pages/configuration/git-integration/github-integration/), and [www redirects](https://developers.cloudflare.com/pages/how-to/www-redirect/).
