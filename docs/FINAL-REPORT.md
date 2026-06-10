# Final Verification Report — template

> Fill this after each deploy wave. The live `/dashboard` page is the always-current version of this table; this file is the point-in-time record you keep in git.

**Date:** YYYY-MM-DD · **Deploy:** `<vercel deployment URL>` · **Commit:** `<sha>` · **CI:** pass/fail

## Global status

| Gate | Status | Evidence |
|---|---|---|
| Build (astro, static) | ☐ pass | CI run link |
| Config validation (50/50) | ☐ pass | `validate-configs.mjs` output |
| Link & SEO audit | ☐ pass | `check-links.mjs` output |
| Playwright smoke+SEO+tools | ☐ pass | report artifact |
| Lighthouse (perf/a11y/SEO) | ☐ ≥ .90/.92/.95 | LHCI link |
| Sitemap submitted to GSC | ☐ done | GSC screenshot |
| Monitors live (UptimeRobot) | ☐ done | monitor list |
| Analytics receiving data | ☐ done | first pageview seen |

## Per-project verification (one row each — export from /dashboard)

| # | Project | Live URL | Build | Tests | Payment | Form | SEO | Analytics | Known issues | Next action |
|---|---|---|---|---|---|---|---|---|---|---|
| 001 | … | … | ☐ | ☐ | ☐ live / ☐ TODO / n/a | ☐ live / ☐ TODO / n/a | ☐ | ☐ | … | … |

## Wave summary

- Projects fully launched (URL + offer + CTA + live money/capture path): **N / 50**
- Projects live but with placeholder links (visible, not announced): **N**
- Projects killed (criteria hit): **N** — list + one-line lesson each
- First revenue events: list (project, amount, channel) — *no revenue yet is a normal early state; the 14-day plan is the instrument, not a promise*

## Risks & honest notes

- Biggest current risk:
- What we'd cut next:
- What's showing real pull (double-down candidates):
