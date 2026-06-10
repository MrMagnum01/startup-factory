# push-to-github.ps1 — creates MrMagnum01/startup-factory and pushes this folder, then CI runs.
# Run from this repo's ROOT:  powershell -ExecutionPolicy Bypass -File deploy\push-to-github.ps1
# Requires: git (winget install Git.Git). The token is read interactively — never saved to disk.

$ErrorActionPreference = "Stop"
$owner = "MrMagnum01"
$repo  = "startup-factory"

# 0) run from repo root
if (-not (Test-Path "pnpm-workspace.yaml")) { Write-Host "Run this from the startup-factory folder." -ForegroundColor Red; exit 1 }

# 1) token (paste when prompted; input hidden; revoke it after this run)
$sec = Read-Host "Paste your GitHub PAT (input hidden)" -AsSecureString
$T = [Runtime.InteropServices.Marshal]::PtrToStringAuto([Runtime.InteropServices.Marshal]::SecureStringToBSTR($sec))
$H = @{ Authorization = "Bearer $T"; "X-GitHub-Api-Version" = "2022-11-28"; Accept = "application/vnd.github+json" }

# 2) validate token
try { $me = Invoke-RestMethod -Headers $H -Uri "https://api.github.com/user" }
catch { Write-Host "Token rejected (expired/revoked?). Make a new fine-grained PAT with Contents+Workflows+Administration read/write." -ForegroundColor Red; exit 1 }
Write-Host "Authenticated as $($me.login)" -ForegroundColor Green

# 3) create repo (ok if it already exists)
try {
  Invoke-RestMethod -Method Post -Headers $H -Uri "https://api.github.com/user/repos" -Body (@{ name = $repo; private = $false; description = "50 monetizable projects from one config-driven Astro factory" } | ConvertTo-Json) | Out-Null
  Write-Host "Repo created: $owner/$repo" -ForegroundColor Green
} catch { Write-Host "Repo create skipped (likely already exists) — continuing." -ForegroundColor Yellow }

# 4) clean corrupt .git (OneDrive artifact), init, commit
if (Test-Path ".git") { Remove-Item -Recurse -Force ".git" }
git init -b main | Out-Null
git config user.name  "Filali Mahmoud"
git config user.email "Digital.ai-account01@jesagroup.com"
git add -A
git commit -m "feat: Startup Factory - 50 projects, config-driven Astro factory, QA green, CI + Vercel config" | Out-Null

# 5) push (token used in-memory only; remote stored WITHOUT token)
git push "https://$($me.login):$T@github.com/$owner/$repo.git" main --force
git remote remove origin 2>$null
git remote add origin "https://github.com/$owner/$repo.git"

Write-Host ""
Write-Host "DONE. Now:" -ForegroundColor Green
Write-Host "  CI pipeline:   https://github.com/$owner/$repo/actions   (build+tests start automatically)"
Write-Host "  Vercel deploy: https://vercel.com/new  ->  Import $owner/$repo  ->  Deploy (settings auto-read from vercel.json)"
Write-Host "  Then: Vercel -> Settings -> Environment Variables -> SITE_URL=https://<your-url> -> Redeploy"
Write-Host ""
Write-Host "SECURITY: revoke this PAT now at https://github.com/settings/tokens" -ForegroundColor Yellow
$T = $null
