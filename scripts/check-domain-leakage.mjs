import { readdir, readFile } from "node:fs/promises";
import { join } from "node:path";

const checks = [
  {
    root: "apps/determinant/src",
    forbidden: "laceplatform.com"
  },
  {
    root: "apps/lace/src",
    forbidden: "determinantsystems.com"
  }
];

const textExtensions = new Set([
  ".astro",
  ".css",
  ".js",
  ".json",
  ".md",
  ".mjs",
  ".ts",
  ".tsx",
  ".txt",
  ".yml",
  ".yaml"
]);

const extname = (filePath) => {
  const lastDot = filePath.lastIndexOf(".");
  return lastDot === -1 ? "" : filePath.slice(lastDot);
};

async function walk(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const entryPath = join(dir, entry.name);

    if (entry.isDirectory()) {
      files.push(...await walk(entryPath));
    } else if (textExtensions.has(extname(entry.name))) {
      files.push(entryPath);
    }
  }

  return files;
}

const failures = [];

for (const check of checks) {
  const files = await walk(check.root);

  for (const file of files) {
    const content = await readFile(file, "utf8");

    if (content.includes(check.forbidden)) {
      failures.push(`${file} contains ${check.forbidden}`);
    }
  }
}

if (failures.length > 0) {
  console.error("Domain leakage check failed:");
  for (const failure of failures) {
    console.error(`- ${failure}`);
  }
  process.exit(1);
}

console.log("Domain leakage check passed.");
