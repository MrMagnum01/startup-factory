# Deployment Guide

Primary target: **Vercel** (static output — fits comfortably in the free Hobby tier for this workload). Alternates documented below. One deployment serves all 50 projects as routes of one site — no duplicate accounts, no limit games.

## 0. Prerequisites

Node 20, pnpm 9, a GitHub account (repo: github.com/MrMagnum01), a Vercel account (sign in with GitHub).

> Security note: never paste tokens into chats, docs or code. Use `gh auth login` / `vercel login` device flows. If a token was ever exposed, revoke it at github.com/settings/tokens immediately.

## 1. Push the repo to GitHub

```bash
cd startup-factory
git init -b main
git add -A
git commit -m "feat: startup factory — 50 projects, factory core, QA, CI"
# Create the repo without pasting tokens (device-flow login):
gh auth login            # choose GitHub.com → HTTPS → Login with web browser
gh repo create startup-factory --public --source . --push
# (or create it in the GitHub UI and: git remote add origin <url> && git push -u origin main)
```

## 2. Deploy on Vercel (recommended: Git integration)

1. vercel.com → Add New → Project → Import `MrMagnum01/startup-factory`.
2. Vercel reads `vercel.json` — no settings needed (install `pnpm install`, build `node scripts/generate-projects.mjs && pnpm --filter web build`, output `apps/web/dist`).
3. Deploy. Every push to `main` now auto-deploys; PRs get preview URLs.
4. Project → Settings → Environment Variables: set `SITE_URL=https://<your-project>.vercel.app` (or your custom domain) → redeploy. This fixes canonical URLs, sitemap and OG absolute URLs.
5. Optional: enable **Vercel Web Analytics** (project → Analytics → Enable; free tier) — no code change needed, or set Umami/GA vars per `.env.example`.

CLI alternative:

```bash
npm i -g vercel && vercel login
vercel link && vercel deploy --prod
```

## 3. Custom domain (optional)

Vercel → Project → Settings → Domains → add `yourdomain.com` (DNS: CNAME `cname.vercel-dns.com`). Then update `SITE_URL` and redeploy. Subprojects stay as paths (`/tools/...`) — better for SEO authority pooling than 50 subdomains.

## 4. Alternates (all free-tier, all static)

| Platform | How |
|---|---|
| Cloudflare Pages | Connect repo → build cmd `node scripts/generate-projects.mjs && pnpm --filter web build`, output `apps/web/dist`, env `SITE_URL`. Generous unlimited static bandwidth. |
| Netlify | Same build cmd/output via `netlify.toml` or UI. 100GB/mo free. |
| GitHub Pages | Add an Actions job: build then `actions/deploy-pages` with `apps/web/dist`. Set `SITE_URL=https://<user>.github.io/startup-factory` and Astro `base` accordingly. |

Rule: pick ONE platform per site. Do not create multiple accounts to multiply free quotas — it violates ToS and risks losing everything at once.

## 5. CI/CD

`.github/workflows/ci.yml` runs on every push: generate → validate configs → build → link/SEO audit → Playwright smoke/SEO/tool tests → Lighthouse (soft gate). Vercel deploys independently of CI; treat red CI as "don't announce".

## 6. Monitoring (free)

1. **UptimeRobot** (free: 50 monitors @ 5-min): add monitors for `/`, `/tools/rate-calculator/`, `/services/resume-rewrite/`, `/directories/free-tier-dev/`, `/dashboard`. Alert → your email.
2. **Better Stack free tier** (10 monitors @ 3-min + status page) — optional second opinion.
3. Vercel → Notifications: enable deploy-failure emails.
4. Google Search Console: add the domain, submit `sitemap-index.xml` (day 1 — indexing takes days, start early).

## 7. Costs — honest table

| Thing | Free tier reality | When you'd pay |
|---|---|---|
| Vercel Hobby | Fine for 50 static pages + this traffic | Commercial usage at scale → Pro $20/mo (Hobby is for personal/non-commercial use — review Vercel's fair-use terms once revenue starts; Cloudflare Pages is the $0 commercial-friendly fallback) |
| Domain | none needed (vercel.app) | ~$10/yr for a custom domain (recommended for trust/SEO) |
| Stripe/Gumroad/LS | No monthly fee | Per-transaction fees only |
| Tally/Formspree | Free tiers cap submissions/mo | Only if a form gets real volume |
| Umami Cloud / GA4 | Free | Plausible if you prefer it: paid after trial |

The only genuinely recommended spend: **a custom domain (~$10/yr)** once anything shows traction.
