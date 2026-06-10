# Launch Audit — startup-factory-web-five.vercel.app

Audited against the live deployment. Status as of this pass.

## ✅ Fixed / passing (verified on the live site)

| Area | Result |
|---|---|
| Build & CI | Green — build + config validation + link/SEO audit + 146 Playwright tests + Lighthouse |
| Security headers | HSTS (preload), X-Frame-Options DENY, X-Content-Type-Options, Referrer-Policy, Permissions-Policy — all present |
| SEO | Per-page `<title>`/description, canonical, OG **PNG** + Twitter cards, JSON-LD, one H1/page; `sitemap.xml` + `robots.txt` live |
| Dashboard exposure | **Now gated** with an access key, removed from public header/footer/home, `noindex` + robots-disallowed |
| Dead links | **Zero** — every unconfigured payment/form CTA renders "Coming soon" instead of a broken `TODO` link. Public-safe before all links are filled. |
| Tools (10) | All compute client-side (rate, SaaS, mortgage, quote, invoice, meta, UTM, résumé, policy, cold-email) |
| Directories (7) | Render with real seeded entries + search/filter |
| Mobile / a11y | Responsive header (hamburger on mobile), skip link, focus rings, dark mode |

## ⚠️ Needs YOU before/at launch (account-gated — I can't do these)

1. **Revoke the GitHub PAT** you pasted — github.com/settings/tokens. Still in chat history. (I used it only to create/push the repo; never stored.)
2. **Turn on analytics** — none is collecting yet. Easiest: Vercel → project → Analytics → Enable (free, no code). Or set `PUBLIC_UMAMI_ID` / `PUBLIC_PLAUSIBLE_DOMAIN` / `PUBLIC_GA_ID` in Vercel env vars.
3. **Fill real links for the projects you'll actively sell** (wave 1 = ResumeRev, GBP, ShopSpeed). Create the Stripe Payment Link / Tally form, paste into `apps/web/src/data/projects/project-00X-*.json` (replace `TODO_REPLACE_ME` in `paymentLinkPlaceholder` / `emailCapturePlaceholder` / `cta.href`), push. The "Coming soon" button auto-flips to live. See `docs/WAVE-1-ACTIVATION.md`.
4. **Submit `sitemap.xml` to Google Search Console** (indexing takes days — do it now).
5. **Add UptimeRobot monitors** (free) for `/` + 3–4 key pages.

## Dashboard access

- URL: `/dashboard` (not linked anywhere public, noindexed, robots-disallowed).
- Default access key: **`factory-2026`** — change it by setting `PUBLIC_DASHBOARD_KEY` in Vercel env vars and redeploying.
- ⚠️ This is a **soft gate** (client-side) — it stops casual/public visitors but the HTML is in page source, so it's not cryptographic. For real protection, enable **Vercel Password Protection** (Pro) or move the dashboard out of the public build. The dashboard shows build/SEO/link status + the public repo link — no secrets.

## Honest gaps / known limitations

- **Most projects are "Coming soon"** until you wire their links — that's the intended wave-launch posture, not a bug. Tools + directories are fully live now.
- **Directory data is seeded** — verify each entry (URL live, blurb accurate) before promoting a directory; some generic directories use placeholder rows.
- **Vercel Hobby is non-commercial** — once revenue flows, upgrade to Pro ($20/mo) or move to Cloudflare Pages (free, commercial-OK). Deploys to either unchanged.
- **No CSP header** yet (low priority for a static marketing site; add later if embedding third-party widgets).

## Go / no-go for a public soft-launch

**GO** for: the homepage, all 10 tools, the 7 directories, and any project whose links you've filled. These have no dead ends and work end-to-end.

**HOLD** announcing a project until its `/dashboard` row is green (payment + form live) and you've test-purchased once.
