# Deploy NOW — three paths, fastest first

`site-dist.zip` (in this folder) is the complete built site: all 50 projects, hubs, dashboard, OG images, sitemap. It needs **no build step** — any static host serves it as-is.

## Path A — Netlify Drop (≈2 minutes, no CLI, no git)

1. Unzip `site-dist.zip` into a folder (right-click → Extract All) — you get `index.html`, `_astro/`, etc.
2. Go to **app.netlify.com/drop** (sign in/up free — your own single account).
3. Drag the extracted FOLDER onto the page.
4. Live URL appears immediately (`something.netlify.app`). Rename it: Site settings → Change site name.

Caveat: canonical/OG URLs inside this zip point at `startup-factory.vercel.app` (build-time default). Fine for previewing and sharing; before real launch, set the final URL and rebuild (Path C or `SITE_URL=https://your-url pnpm build`, re-zip).

## Path B — Cloudflare Pages direct upload (≈3 minutes, commercial-friendly free tier)

1. dash.cloudflare.com → Workers & Pages → Create → Pages → **Upload assets**.
2. Name the project, drag the extracted folder (or the zip), deploy.
3. Live at `project.pages.dev`. Unlimited static bandwidth, free.

## Path C — Vercel via GitHub (the production setup, ~10 minutes)

This is the one to end on: every future edit auto-deploys, CI runs, preview URLs per change.

```powershell
cd "C:\Users\filma\OneDrive\Documents\Claude\Projects\n@#\startup-factory"
# clean the corrupt .git left by the sandbox attempt (OneDrive locked it):
Remove-Item -Recurse -Force .git
git init -b main
git add -A
git commit -m "feat: startup factory - 50 projects, QA green"
# install GitHub CLI if needed: winget install GitHub.cli
gh auth login        # browser device-flow, NO pasted tokens
gh repo create startup-factory --public --source . --push
```

Then vercel.com → Add New → Project → import `MrMagnum01/startup-factory` → Deploy (settings auto-read from `vercel.json`). Finally set `SITE_URL` env var to the real URL and redeploy.

> Note: OneDrive and git can fight (file locks). If `git init` misbehaves, move the folder out of OneDrive (e.g. `C:\dev\startup-factory`) — recommended for any active repo.

## After it's live (whichever path)

1. Open `/dashboard` on the live site — your control tower.
2. Add the URL to Google Search Console, submit `/sitemap.xml`.
3. Add UptimeRobot monitors (free) for `/` and 3-4 key pages.
4. Start `WAVE-1-ACTIVATION.md` — payment links for the top 3, then outreach.
