import { defineConfig } from "astro/config";

const repository = process.env.GITHUB_REPOSITORY;
const [owner, repo] = repository ? repository.split("/") : [];
const isUserOrOrgPages =
  Boolean(owner) &&
  Boolean(repo) &&
  repo.toLowerCase() === `${owner.toLowerCase()}.github.io`;

const base =
  process.env.BASE_PATH ||
  (process.env.GITHUB_ACTIONS === "true" && repo && !isUserOrOrgPages
    ? `/${repo}`
    : "/");

const site =
  process.env.SITE_URL ||
  (owner ? `https://${owner}.github.io` : "https://lace.local");

export default defineConfig({
  site,
  base,
  output: "static"
});
