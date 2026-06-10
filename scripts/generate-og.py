#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
generate-og.py — pre-renders branded 1200x630 OpenGraph PNG cards for every project
into apps/web/public/og/<slug>.png (+ default.png). Pure Pillow, no services.
Design language matches the site: warm paper, ink, per-project accent, mono eyebrow,
big serif-ish display line, hairline rules, corner glyph.
Run AFTER scripts/generate-projects.mjs.
"""
import json, os, glob, re
from PIL import Image, ImageDraw, ImageFont

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC = os.path.join(ROOT, "apps", "web", "src", "data", "projects")
OUT = os.path.join(ROOT, "apps", "web", "public", "og")
os.makedirs(OUT, exist_ok=True)

W, H = 1200, 630
PAPER = (244, 241, 234)
INK = (22, 20, 15)
MUTED = (111, 104, 91)
LINE = (212, 203, 183)

def font(path_candidates, size):
    for p in path_candidates:
        try:
            return ImageFont.truetype(p, size)
        except Exception:
            continue
    return ImageFont.load_default()

SERIF = ["/usr/share/fonts/truetype/dejavu/DejaVuSerif.ttf",
         "/usr/share/fonts/truetype/liberation/LiberationSerif-Regular.ttf"]
SERIF_B = ["/usr/share/fonts/truetype/dejavu/DejaVuSerif-Bold.ttf",
           "/usr/share/fonts/truetype/liberation/LiberationSerif-Bold.ttf"]
MONO = ["/usr/share/fonts/truetype/dejavu/DejaVuSansMono.ttf",
        "/usr/share/fonts/truetype/liberation/LiberationMono-Regular.ttf"]
SANS = ["/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf",
        "/usr/share/fonts/truetype/liberation/LiberationSans-Regular.ttf"]

def hex_rgb(h, fallback=(21, 99, 76)):
    try:
        h = h.lstrip("#")
        return tuple(int(h[i:i+2], 16) for i in (0, 2, 4))
    except Exception:
        return fallback

def wrap(draw, text, fnt, max_w):
    words, lines, cur = text.split(), [], ""
    for w in words:
        t = (cur + " " + w).strip()
        if draw.textlength(t, font=fnt) <= max_w:
            cur = t
        else:
            if cur: lines.append(cur)
            cur = w
    if cur: lines.append(cur)
    return lines

def card(slug, name, headline, category, accent_hex, idnum):
    img = Image.new("RGB", (W, H), PAPER)
    d = ImageDraw.Draw(img)
    accent = hex_rgb(accent_hex)

    # faint grid
    for x in range(0, W, 60):
        d.line([(x, 0), (x, H)], fill=(236, 232, 222), width=1)
    for y in range(0, H, 60):
        d.line([(0, y), (W, y)], fill=(236, 232, 222), width=1)

    M = 70
    # top rule + eyebrow
    d.line([(M, 92), (M + 46, 92)], fill=accent, width=3)
    f_mono = font(MONO, 26)
    eyebrow = f"{str(idnum).zfill(3)}  ·  {category.upper()}"
    d.text((M + 62, 78), eyebrow, font=f_mono, fill=MUTED)

    # headline (max 3 lines)
    text = headline if len(headline) <= 110 else headline[:107].rsplit(" ", 1)[0] + "…"
    size = 84 if len(text) <= 46 else 68 if len(text) <= 72 else 56
    f_head = font(SERIF_B, size)
    lines = wrap(d, text, f_head, W - 2 * M)[:3]
    y = 158
    for ln in lines:
        d.text((M, y), ln, font=f_head, fill=INK)
        y += int(size * 1.18)

    # accent underline under headline block
    d.line([(M, y + 18), (M + 132, y + 18)], fill=accent, width=5)

    # bottom bar
    d.line([(M, H - 112), (W - M, H - 112)], fill=LINE, width=2)
    f_small = font(SANS, 27)
    d.text((M, H - 86), name, font=f_small, fill=INK)
    brand = "STARTUP FACTORY"
    f_brand = font(MONO, 24)
    bw = d.textlength(brand, font=f_brand)
    d.text((W - M - bw, H - 84), brand, font=f_brand, fill=MUTED)

    # corner glyph (three bars, brand mark)
    gx, gy = W - M - 78, 70
    d.rounded_rectangle([gx, gy, gx + 78, gy + 78], 16, fill=INK)
    d.rounded_rectangle([gx + 16, gy + 38, gx + 26, gy + 62], 4, fill=accent)
    d.rounded_rectangle([gx + 34, gy + 28, gx + 44, gy + 62], 4, fill=PAPER)
    d.rounded_rectangle([gx + 52, gy + 18, gx + 62, gy + 62], 4, fill=accent)

    img.save(os.path.join(OUT, f"{slug}.png"), "PNG", optimize=True)

count = 0
for f in sorted(glob.glob(os.path.join(SRC, "*.json"))):
    with open(f) as fh:
        p = json.load(fh)
    card(p["slug"], p["name"], p.get("headline", p["name"]), p.get("category", ""), p.get("accent", "#15634C"), p.get("id", 0))
    count += 1

# default card
img = Image.new("RGB", (W, H), INK)
d = ImageDraw.Draw(img)
f_head = font(SERIF_B, 86)
f_mono = font(MONO, 28)
d.text((70, 80), "050 PROJECTS · ONE FACTORY", font=f_mono, fill=(156, 148, 132))
for i, ln in enumerate(["Small bets,", "shipped properly."]):
    d.text((70, 170 + i * 104), ln, font=f_head, fill=PAPER)
d.line([(70, 420), (210, 420)], fill=(21, 99, 76), width=6)
d.text((70, 520), "STARTUP FACTORY", font=f_mono, fill=PAPER)
img.save(os.path.join(OUT, "default.png"), "PNG", optimize=True)

print(f"✓ {count} OG cards + default.png -> apps/web/public/og/")
