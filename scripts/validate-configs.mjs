#!/usr/bin/env node
/**
 * validate-configs.mjs — re-validates every generated project config against
 * the @factory/config schema and enforces factory quality rules:
 *  - unique slugs & routes; route group matches renderAs/category
 *  - SEO title ≤70 chars, description ≤165
 *  - every project has a working CTA contract (payment|waitlist|leadform|download|tool)
 *  - tool configs point at an existing src/tools/<tool>.astro
 *  - directory configs carry ≥8 items
 * Exit 1 on any violation. Run in CI before build.
 */
import { readFileSync, readdirSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { ProjectConfigSchema } from "../packages/config/index.mjs";

const ROOT = dirname(dirname(fileURLToPath(import.meta.url)));
const DIR = join(ROOT, "apps", "web", "src", "data", "projects");
const TOOLS = join(ROOT, "apps", "web", "src", "tools");

if (!existsSync(DIR)) { console.error("✗ no generated configs. Run: pnpm generate"); process.exit(1); }
const files = readdirSync(DIR).filter((f) => f.endsWith(".json"));
const seenSlug = new Set(), seenRoute = new Set();
let errs = 0;
const bad = (f, msg) => { console.error(`  ✗ ${f}: ${msg}`); errs++; };

for (const f of files) {
  const cfg = JSON.parse(readFileSync(join(DIR, f), "utf8"));
  const parsed = ProjectConfigSchema.safeParse(cfg);
  if (!parsed.success) { bad(f, parsed.error.issues.map((i) => `${i.path.join(".")}: ${i.message}`).join(" | ")); continue; }
  if (seenSlug.has(cfg.slug)) bad(f, `duplicate slug ${cfg.slug}`); seenSlug.add(cfg.slug);
  if (seenRoute.has(cfg.route)) bad(f, `duplicate route ${cfg.route}`); seenRoute.add(cfg.route);
  const group = cfg.route.split("/")[1];
  if (cfg.renderAs === "tool" && group !== "tools") bad(f, `tool not under /tools (${cfg.route})`);
  if (cfg.renderAs === "directory" && group !== "directories") bad(f, `directory not under /directories (${cfg.route})`);
  if (cfg.seoTitle.length > 70) bad(f, `seoTitle ${cfg.seoTitle.length} chars`);
  if (cfg.seoDescription.length > 165) bad(f, `seoDescription ${cfg.seoDescription.length} chars`);
  if (cfg.renderAs === "tool") {
    if (!cfg.tool) bad(f, "renderAs tool but no tool key");
    else if (!existsSync(join(TOOLS, `${cfg.tool}.astro`))) bad(f, `missing tool module src/tools/${cfg.tool}.astro`);
  }
  if (cfg.renderAs === "directory" && (cfg.directory?.items?.length ?? 0) < 8) bad(f, `directory has only ${cfg.directory?.items?.length ?? 0} items (<8)`);
  if (!["payment", "waitlist", "leadform", "download", "tool"].includes(cfg.cta?.type)) bad(f, "invalid cta.type");
}

console.log(`${files.length} configs checked — ${errs === 0 ? "✓ all valid" : errs + " problem(s)"}`);
process.exit(errs ? 1 : 0);
