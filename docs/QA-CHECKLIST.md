# QA Checklist

Automated gates (run all):

```bash
node scripts/generate-projects.mjs   # regenerate configs
node scripts/validate-configs.mjs    # schema + factory rules → must exit 0
pnpm build                           # static build → must succeed
node scripts/check-links.mjs         # dist link/SEO audit → must exit 0 (placeholders = warnings)
pnpm test                            # Playwright: smoke + SEO + tools, desktop & mobile
```

## What the suites cover

- **smoke.spec.ts** — home/hubs/dashboard render; all 50 project routes load with an `h1`, the right CTA contract (payment/waitlist/leadform/download/tool), zero page JS errors; directories show ≥8 entries + search; 404 works.
- **seo.spec.ts** — per category: title ≤70, description 30–170, canonical, og:title/og:image (PNG), twitter:card, JSON-LD present, exactly one `h1`; robots.txt + sitemap exist.
- **tools.spec.ts** — each of the 10 client-side tools actually computes (rates, payoff, LTV, UTM, meta tags, invoice totals, sequences, policies, bullets, quotes).
- **check-links.mjs** — every internal href/src in `dist/` resolves; counts `TODO_REPLACE_ME` per page and feeds `/dashboard`.
- **Lighthouse CI** — perf ≥0.90 (warn), a11y ≥0.92 (error), SEO ≥0.95 (error) on 5 representative pages.

## Manual pass (15 minutes, before announcing)

1. Phone in hand (real device): open 5 random projects — no horizontal scroll, tap targets comfortable, hero readable without zoom.
2. Dark mode toggle: text stays readable on all 3 template types.
3. Click a payment CTA → lands on YOUR Stripe/Gumroad page (not a TODO).
4. Submit each live form once with a test email → arrives in your inbox/Tally.
5. Share one URL into a private Slack/WhatsApp → OG card renders (title + branded image).
6. `/dashboard` → zero amber "TODO" chips on anything you're announcing.
7. Keyboard-only: tab through home + one offer page — focus ring visible everywhere, skip-link works.
8. View-source one project page: title/description/canonical/JSON-LD present and correct.

## Known acceptable limitations (v1)

- Placeholder links remain on projects you haven't activated yet — they're tracked on /dashboard, fill them per launch wave.
- Directory seed datasets are starter data: verify each entry (URL live, blurb accurate) before promoting that directory.
- The UTM tool's QR rendering needs network once (CDN lib) — link building itself is offline-capable.
