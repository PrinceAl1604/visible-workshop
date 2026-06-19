# Style Guide — Landing VISIBLE Workshop

> Système de design utilisé sur la landing page du Workshop VISIBLE.
> Direction : **light editorial inspiré Supabase** — borders-only, cream substrate, brand teal pour les accents, italique Garamond pour l'emphase typographique.

---

## 1. Tokens couleur (`:root`)

```css
/* Surfaces — cream paper substrate */
--background:      oklch(0.98 0.004 80);   /* page bg, warm off-white */
--background-alt:  oklch(0.96 0.006 80);   /* alt sections, footer */
--card:            oklch(1 0 0);            /* pure white card */
--card-2:          oklch(0.99 0.003 80);   /* almost-white warm */
--muted:           oklch(0.94 0.005 80);   /* subtle fill */

/* Type colors */
--foreground:        oklch(0.18 0 0);   /* primary text — near-black */
--foreground-soft:   oklch(0.30 0 0);   /* secondary body text */
--muted-foreground:  oklch(0.45 0 0);   /* tertiary, caption */
--tertiary:          oklch(0.62 0 0);   /* placeholder labels */

/* Brand teal (Visible #1A6C60 darkened for light-bg AA) */
--primary:            oklch(0.50 0.10 175);     /* CTAs, accent text */
--primary-strong:     oklch(0.42 0.10 175);     /* hover, deeper */
--primary-soft:       oklch(0.50 0.10 175 / 9%);
--primary-foreground: oklch(1 0 0);             /* white on teal */

/* Borders — dark with low alpha */
--border:         oklch(0 0 0 / 8%);    /* hairline standard */
--border-strong:  oklch(0 0 0 / 14%);   /* card weight */
--border-dashed:  oklch(0 0 0 / 16%);

--ring:           oklch(0.50 0.10 175 / 50%);
--destructive:    oklch(0.55 0.22 25);
```

### Hex equivalents pour référence brand

| Token | Hex approx |
|---|---|
| `--background` | `#f7f4ec` |
| `--background-alt` | `#f1ebdf` |
| `--card` | `#ffffff` |
| `--foreground` | `#1a1a1a` |
| `--primary` | `#1A6C60` (= `#1B6C5F`) |
| `--primary-strong` | `#155A50` |
| Logo couleurs natives | `#1a6c60` (V), `#0a2621` (ISIBLE) |
| Favicon couleurs natives | `#13453e` (bg), `#ffffff` (V) |

---

## 2. Typographie

```css
--font-sans:  -apple-system, BlinkMacSystemFont, "SF Pro Display",
              "SF Pro Text", "Helvetica Neue", "Segoe UI",
              system-ui, sans-serif;
--font-mono:  ui-monospace, "SF Mono", SFMono-Regular,
              "Menlo", "Monaco", "Consolas", monospace;
--font-serif: "Adobe Garamond Pro", "EB Garamond", "Garamond",
              "Apple Garamond", "Hoefler Text", "Iowan Old Style",
              Georgia, "Times New Roman", serif;
```

### Règles globales

| Élément | Famille | Poids | Notes |
|---|---|---|---|
| `body` | sans (SF) | 400 | line-height 1.5 |
| `h1, h2, h3, h4` | sans (SF) | **600** | letter-spacing `-0.022em` |
| `em` (partout) | **serif (Garamond)** | **400 italic** | accent éditorial sur les phrases-clés |
| Mono labels (preheader, badges) | mono (SF Mono) | 400/500 | `text-transform: uppercase`, `letter-spacing: 0.18–0.22em` |

### Échelle des titres (clamp responsive)

| Usage | Taille | line-height |
|---|---|---|
| H1 hero (img logo) | `clamp(3.5rem, 13vw, 8rem)` height | 1 |
| H2 section title | `clamp(2rem, 5vw, 3rem)` | 1.05–1.1 |
| H2 modal/preheader | `clamp(1.5rem, 3vw, 1.9rem)` | 1.15 |
| H3 card title (3-blocs, bonus) | `1.1–1.25rem` | 1.2 |
| Stat big number | `clamp(1.5rem, 3.5vw, 2.25rem)` mono | 1 |
| Body text | `1rem` | 1.5 |
| Mono preheader | `11px` | tracking 0.22em |

---

## 3. Espacements, radii, grille

```css
--radius:      0.5rem;    /* boutons, chips */
--radius-md:   0.8rem;    /* inputs, small cards */
--radius-lg:   1.1rem;
--radius-2xl:  1.5rem;    /* major cards (stack, blueprint, ticket) */

--max-w:  72rem;          /* container max */
--gutter: 1.25rem (mobile) → 1.5rem (sm) → 2rem (lg);
```

### Padding card par tier

| Tier | Padding |
|---|---|
| T3 (list items) | `1.1rem 1.25rem` |
| T2 (content cards) | `1.75rem` |
| T1 (premium: stack, blueprint, final-cta) | `2rem` → `2.5rem` sur md+ |
| Ticket | `2rem` → `2.75rem` sm+ |

---

## 4. Système de surfaces — 3 tiers

**Principe Supabase** : *borders not shadows*. La hiérarchie vient du **poids de la bordure** et de **l'alternance bg cream/white**, pas de l'élévation.

```css
/* TIER 3 — list items (TL;DR, FAQ, stats, tz rows, blueprint quads) */
background: var(--card);
border: 1px solid var(--border-strong);
box-shadow: none;

/* TIER 2 — content cards (3 blocs, testimonials, audience) */
background: var(--card);
border: 1px solid var(--border-strong);
box-shadow: none;

/* TIER 1 — premium (value stack, brand blueprint, final-cta) */
background:
  radial-gradient(ellipse 90% 70% at 50% 0%,
    oklch(0.5 0.10 175 / 6%), transparent 75%),
  var(--card);
border: 1px solid oklch(0 0 0 / 16%);   /* +2% vs T2 */
box-shadow: none;

/* Bonus card (T2 spécial — seul à avoir une bordure brandée) */
background:
  radial-gradient(ellipse 90% 80% at 100% 0%,
    oklch(0.5 0.10 175 / 6%), transparent 65%),
  var(--card);
border: 1px solid oklch(0.5 0.10 175 / 32%);   /* teal hairline */
```

### Hover : transform + border-color shift uniquement

```css
.card:hover, .case:hover, .bonus-card:hover {
  transform: translateY(-2px);
  border-color: oklch(0.5 0.10 175 / 40%);
  box-shadow: none;
}
```

---

## 5. Texture grain (signature du système)

Deux SVG noise inlinés en data-URI, appliqués via `::before` :

```css
--noise-on-dark:  url("data:image/svg+xml,...<feTurbulence baseFrequency='0.9' .../>");
--noise-on-light: url("data:image/svg+xml,...<feTurbulence baseFrequency='0.75' .../>");
```

| Surface | Blend mode | Opacity |
|---|---|---|
| Cards (T2) sur cream | `multiply` | `0.3` |
| Cards (T1) sur cream | `multiply` | `0.35` |
| Photos placeholders | `multiply` | `0.12` (sur photo de personne) |
| Hero countdown (teal foncé filled) | `soft-light` | `0.55` (white-noise) |
| Blueprint preview cream | `multiply` | `0.45` |

---

## 6. Composants

### Boutons

```css
/* Primary — teal solide, inset shadow subtil */
.btn-primary {
  background: var(--primary);
  color: var(--primary-foreground);
  box-shadow: inset 0 -1px 0 0 oklch(0 0 0 / 18%);
}

/* Outline — white card + hairline */
.btn-outline {
  background: var(--card);
  border: 1px solid var(--border-strong);
}

/* Cream (CTA dans la countdown card teal) */
.btn-cream {
  background: oklch(0.94 0.03 80);
  color: oklch(0.25 0.06 175);
}

/* Sizes */
.btn-sm { padding: 0.5rem 0.85rem; font-size: 0.85rem; }
.btn    { padding: 0.75rem 1.1rem; font-size: 0.95rem; }
.btn-lg { padding: 1rem 1.4rem; font-size: 1rem; border-radius: var(--radius-md); }
```

### Mono preheader (signature visuelle)

```css
.preheader {
  font-family: var(--font-mono);
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 0.22em;
  color: var(--muted-foreground);
}
.preheader .slash { color: var(--primary); opacity: 0.7; }
```

Format : `/ NOM DE LA SECTION` (slash + space + label).

### Badges status

| Badge | Bg | Text | Usage |
|---|---|---|---|
| `★ LIVRABLE PHARE` | `oklch(0.5 0.10 175 / 12%)` | `var(--primary)` | Brand Blueprint dans value stack |
| `EN DIRECT` (bonus pill) | `var(--primary)` solid | white | Bonus cards live-only |
| `BONUS EN DIRECT` | `var(--primary-soft)` | `var(--primary)` | Stack rows live |
| `RECOMMANDÉ AFRIQUE` | `var(--primary-soft)` | `var(--primary)` | Card Chariow dans modal |

---

## 7. Animations & micro-interactions

```css
/* Reveal on scroll — fade-up via IntersectionObserver */
.reveal {
  opacity: 0;
  transform: translateY(24px);
  transition: opacity 700ms ease-out, transform 700ms ease-out;
}
.reveal.is-visible { opacity: 1; transform: translateY(0); }

/* Staggering : transition-delay inline (60ms/100ms/120ms…) */

/* Live dot pulse (countdown card head) */
@keyframes live-pulse {
  0%, 100% { opacity: 1; box-shadow: 0 0 0 4px oklch(0.92 0.04 80 / 18%); }
  50%      { opacity: 0.6; box-shadow: 0 0 0 8px oklch(0.92 0.04 80 / 8%); }
}

/* Hero backdrop glow pulse (subtle teal at top) */
@keyframes glow-pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.55; }
}

/* Reduced motion */
@media (prefers-reduced-motion: reduce) {
  * { animation-duration: 0.001ms !important;
      transition-duration: 0.001ms !important; }
}
```

---

## 8. Patterns visuels signatures

1. **`/ LABEL` mono preheader** au-dessus de chaque section
2. **Italique Garamond** sur tous les `<em>` (accents éditoriaux)
3. **Wordmark VISIBLE comme image** dans nav + hero + ticket (jamais retypé)
4. **Cream warm bg + pure white cards** (jamais de gris froid)
5. **Border-only chrome** partout (zero box-shadow sauf inset 1px sur btn-primary)
6. **Multiply noise grain** sur les cards T1/T2 (texture papier subtile)
7. **Countdown card filled teal foncé** comme ancre visuelle du hero (la seule surface non-blanche au-dessus du fold)
8. **Ticket avec perforations** (cercles cut-out cream sur les côtés gauche/droite via `::before` / `::after`)
9. **Hover lift de 2px** + border-color shift teal (zero shadow)
10. **Staggered fade-up reveal** (80–120ms entre éléments)

---

## 9. Assets brand fournis

| Fichier | Format | Couleurs natives |
|---|---|---|
| `logo.svg` | SVG wordmark | `#1a6c60`, `#0a2621` |
| `favicon.svg` | SVG rounded square | `#13453e`, `#ffffff` |
| `alex.jpg` | JPG ~150KB | photo podcast (credibility) |
| `alex-prof.jpg` | JPG ~150KB | photo studio teal (prof bio) |
| `chariow.png` | PNG ~4KB | logo officiel |
| `stripe.png` | PNG ~4KB | logo officiel |

---

## 10. Stack technique

- **HTML mono-page statique** (1 fichier)
- **CSS dans `<style>` inline** (0 round-trip)
- **JS dans `<script>` inline** (0 round-trip)
- **1 webfont externe** : EB Garamond Italic via Google Fonts (SF + SF Mono = system natifs)
- **2 PNG icônes** (~8KB total)
- **2 JPG photos** (~300KB total)
- **2 SVG logo/favicon** (~5KB total)

**Poids total page** : ~50KB HTML/CSS/JS + ~300KB images + 1 webfont ≈ **< 500KB** total → charge instantanée même en 3G afrique.

---

*Style guide v1 — généré pour le Workshop VISIBLE (15 juillet 2026).*
