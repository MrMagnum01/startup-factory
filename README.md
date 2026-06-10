# Startup Factory

One config-driven factory that publishes **50 monetizable project pages and tools** from JSON configs. Astro static output, crafted editorial design system, Vercel-first deployment, legal free tiers only.

> **Reality check:** nothing here guarantees profit. The factory's job is to make shipping and *honest validation* cheap: every project carries a 14-day validation metric and explicit kill criteria. Expect most to make $0 — the goal is to find the 2–5 that don't.

## What's inside

| Path | What it is |
|---|---|
| `apps/web` | The Astro site — 50 project routes + hubs + `/dashboard` control tower |
| `packages/ui` | Shared components (hero/offer/directory/tool templates, pricing, FAQ, CTA, forms) |
| `packages/config` | Zod schema — the contract every project config satisfies |
| `packages/seo` · `analytics` · `payments` · `forms` | Head/JSON-LD builder, analytics resolver, CTA/link resolvers |
| `scripts/assessment.py` | Phase-1 engine: 100 ideas → scores → top-50 + Excel workbook |
| `scripts/generate-projects.mjs` | THE factory: ideas → 50 validated configs + status.json |
| `scripts/generate-og.py` | Branded 1200×630 OG cards for every project (Pillow) |
| `scripts/validate-configs.mjs` · `check-links.mjs` | Quality gates (CI) |
| `tests/` | Playwright smoke + SEO + functional tool tests |
| `docs/` | Assessment, growth pack, 14-day plan, deployment, QA/launch checklists, compliance |

## Quickstart

```bash
# prerequisites: Node 18.17+ (20 recommended), pnpm 9 (npm i -g pnpm), Python 3.10+
pnpm install

# 1. (re)build the assessment dataset + Excel workbook (optional — committed)
python3 scripts/assessment.py

# 2. generate the 50 project configs + dashboard status
node scripts/generate-projects.mjs
node scripts/validate-configs.mjs

# 3. OG images (optional locally — committed to the repo)
pip install pillow && python3 scripts/generate-og.py

# 4. run it
pnpm dev            # http://localhost:4321

# 5. production build + audits
pnpm build          # = generate + astro build → apps/web/dist
node scripts/check-links.mjs

# 6. tests (first time: pnpm test:install)
pnpm test
```

## Deploy (Vercel — primary)

```bash
npm i -g vercel
vercel login                # your account, interactive
vercel link                 # create/link project at repo root
vercel deploy --prod
```

`vercel.json` already sets: install `pnpm install`, build `node scripts/generate-projects.mjs && pnpm --filter web build`, output `apps/web/dist`, plus security & cache headers. Then set `SITE_URL` env var in Vercel to your real domain and redeploy. Alternates (Cloudflare Pages / Netlify / GitHub Pages) in `docs/DEPLOYMENT.md`.

## Before you announce anything

Run through `docs/LAUNCH-CHECKLIST.md` — fill the `TODO_REPLACE_ME` payment/form links (Stripe/Gumroad/Tally), set analytics, verify `/dashboard` shows zero TODOs, and read `docs/COMPLIANCE.md`.

## License

MIT for the factory code. Directory seed data points to third-party sites; verify entries before launch.
