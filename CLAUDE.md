# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # Start Eleventy dev server with live reload
npm run build    # Build static site to _site/
```

No linter or test runner is configured. Eleventy's output goes to `_site/` — never edit files there directly.

## Project Status

**Urbatrix** es la plataforma SaaS inmobiliaria todo-en-uno. Esta es la web pública de marketing/venta.

### Pages — Current & Planned

| File | Route | Status |
|------|-------|--------|
| `index.njk` | `/` | ✅ Complete — homepage with full animations |
| `producto.njk` | `/producto/` | ✅ Complete — product overview with 6 modules |
| `soluciones.njk` | `/soluciones/` | ⏳ Planned |
| `casos-exito.njk` | `/casos-exito/` | ⏳ Planned |
| `precios.njk` | `/precios/` | ⏳ Planned |
| `recursos.njk` | `/recursos/` | ⏳ Planned |

### Subpages (nested folders)

**Producto subpages** (`producto/`):
- `como-funciona.njk` → `/producto/como-funciona/`
- `captacion-crm.njk` → `/producto/captacion-crm/`
- `pago-reservas.njk` → `/producto/pago-reservas/`
- `capa-legal.njk` → `/producto/capa-legal/`
- `post-venta.njk` → `/producto/post-venta/`
- `portal-brokers.njk` → `/producto/portal-brokers/`

**Soluciones subpages** (`soluciones/`):
- `para-desarrolladores.njk` → `/soluciones/para-desarrolladores/`
- `para-compradores.njk` → `/soluciones/para-compradores/`

**Casos de éxito subpages** (`casos-exito/`) — plantilla reusable:
- `makai.njk` → `/casos-exito/makai/` (current)
- Future: `[case-name].njk` → `/casos-exito/[case-name]/`

## Product & Audience

**Who**: Real estate developers, brokers, and international buyers in Latin America (Caribbean focus).

**What**: All-in-one platform: lead capture & CRM, payment processing (Stripe + WhatsApp), bilingual legal layer (CONFOTUR, Fideicomiso Ley 189-11 for Dominican Republic), construction progress tracking, post-sale management.

**Tone**: Professional yet approachable. Focus on practical, frictionless solutions. Language is Spanish (Latin American). Examples from current copy:
- "Vende tu desarrollo inmobiliario al mundo entero, sin fricción"
- "Todo el ciclo de venta en una sola plataforma"
- "Deja de pegar con cinta adhesiva cinco herramientas distintas"

**Market context**: Primarily Caribbean (Dominican Republic emphasized with local legal references), expanding to broader Latin America. Supports international buyers (44+ countries).

## Architecture

**Static site generator:** Eleventy 3.0 with Nunjucks templates.

- Templates: `index.njk` (homepage, ~1,266 lines), `producto.njk` (product page, ~156 lines)
- Layout: `_includes/base.njk` wraps every page; partials in `_includes/partials/` (header, footer, cta-final, scripts)
- All content is in Spanish (Latin American audience)

### Creating a new page

Every `.njk` file at the root becomes a page. Frontmatter structure:

```yaml
---
layout: base.njk

# REQUIRED
title: "Título de la página — Urbatrix"
description: "Meta description (160 chars max)..."

# OPTIONAL — Open Graph overrides
ogTitle: "OG title (use if different from title)"
ogDescription: "OG description (use if different from description)"

# OPTIONAL — Footer CTA customization
ctaTitle: "¿Quieres verlo con tu propio proyecto?"
ctaText: "Subtexto opcional bajo el título."
ctaSecondaryLabel: "Ver planes y precios"       # default
ctaSecondaryHref: "/precios/"
ctaPrimaryLabel: "Solicitar Demo"               # default
ctaPrimaryHref: "https://calendly.com/..."
---
```

**Notes:**
- `canonical` and `og:url` are **generated automatically** from the page's URL path. No need to set them.
- Content goes directly inside `<main class="body">` — no extra wrapper needed.
- Always end with `{% include "partials/cta-final.njk" %}`.

### Subpage hero pattern

`producto.njk` establishes the standard hero for non-home pages. Use `.product-top` as the outer wrapper (applies `hero.png` background). Structure:

```html
<div class="product-top">
  <section class="product-hero" aria-labelledby="page-title">
    <div class="product-hero__inner">
      <span class="product-eyebrow">Nombre sección</span>
      <h1 id="page-title" class="product-hero__title">Título principal</h1>
      <p class="product-hero__desc">Descripción introductoria.</p>
    </div>
  </section>
  <!-- rest of page content -->
</div>
```

On mobile: `bg-size: 300% / position: top`; on desktop: `cover / 50%`. Do not place content outside `.product-top` before the footer.

### CSS Files

| File | Purpose | Size |
|------|---------|------|
| `globals.css` | Font-face declarations (Mont 400/600/700), reset import | ~76 lines |
| `styleguide.css` | Design tokens (CSS custom properties) | ~500+ lines |
| `style.css` | Main layout, header, sections, responsive breakpoints | ~4,200 lines |
| `cards.css` | Hand-crafted CSS illustrations for bento cards 2-5 | ~2,400 lines |
| `illustrations.css` | Animated SVG illustrations with clip-paths | ~21KB |

**Design tokens** (in `styleguide.css`):
- Colors: `--c-green: #00b481` (primary), `--c-ink: #171717`, `--c-text-sub`, `--c-bg-weak`
- Spacing: `--space-1` → `--space-10` (4 px → 120 px), `--gutter` (fluid clamp)
- Type: `--fs-h1` → `--fs-base` all using `clamp()` for fluid scaling
- Layout: `--content-max: 87.5rem` (1400 px)
- Radius: `--radius-sm` → `--radius-xl`, `--radius-pill`

### JavaScript

`script.js` (~1,206 lines) uses GSAP 3.12.5 + ScrollTrigger (loaded from CDN in `base.njk`):

**Homepage-only animations** (silently skip if elements don't exist — do NOT reproduce on subpages):
- Entry cascade: `.hero`, `.content-text`, `.dashboard` fade/slide in
- Marquee loop: `.features` inside `.hero` (mobile-only infinite scroll)
- Bento reveal: `.container-card-bento` removes `.reveal-hidden` on scroll

**Universal animations** (work on any page):
- Header fade-in on page load (targets `.header`)
- IntersectionObserver: adds `.in-view` to any `.ic-frame` when 15% visible — use this for scroll-triggered reveals on subpages
- Always guard with `prefers-reduced-motion`

**Mobile menu** (inline in `_includes/partials/scripts.njk`):
- Hamburger toggle, Escape-to-close, focus trap, accordion nav (Producto / Soluciones)
- Breakpoint: ≤ 767 px

## Reusable UI Components

### Content card (`.content-wrapper`)

Used in `client-types` (home) and product module grid. The full-area `.card-link` sits behind content (`aria-hidden + tabindex=-1`) so the card is clickable without nesting interactive elements inside links.

```html
<article class="content-wrapper">
  <a class="card-link" href="/ruta/" aria-hidden="true" tabindex="-1"></a>
  <div class="content-3">
    <div class="icon-2">
      <img loading="lazy" decoding="async" class="img-6"
           src="/assets/icon-name.svg" alt="" aria-hidden="true" />
    </div>
    <div class="text-3">
      <div class="content-4">
        <h3 class="text-wrapper-17">Título</h3>
        <p class="text-wrapper-18">Descripción breve.</p>
      </div>
      <a class="button" href="/ruta/">
        <span class="text-wrapper-19">Ver solución</span>
        <img loading="lazy" decoding="async" class="img-7"
             src="/assets/arrow-right-up-long-line-4.svg" alt="" aria-hidden="true" />
      </a>
    </div>
  </div>
</article>
```

Cards stack via `.content-2` (home) or `.product-grid` (product). Both use identical markup.

### Section eyebrow + title (`.badge-2`)

Standard section header in `bento-features`, `client-types`, `stats-metrics`, `stats-metrics-2`:

```html
<div class="title">
  <div class="badge-2">
    <img loading="lazy" decoding="async" class="stackshare-line"
         src="/assets/stackshare-line-3.svg" alt="" aria-hidden="true" />
    <p class="text-wrapper-7">Etiqueta eyebrow</p>
  </div>
  <h2 class="p">Título de la sección</h2>
  <p class="text-wrapper-8">Subtítulo opcional.</p>
</div>
```

Variants: `.badge-4` uses `.dot` element (in `.CTA` "CASO DE ÉXITO"). `.badge-3` is horizontal trust-badge row (Stripe, Confotur, etc.) — different structure, not interchangeable.

### Feature step list (`.features-step`)

For product capabilities with left-column step indicator. Reusable on about/how-it-works pages:

```html
<article class="div-inner-section" aria-labelledby="feature-X-title">
  <div class="div-left-feature">
    <div class="features-step">
      <span class="features-step__dot" aria-hidden="true"></span>
      <div class="features-step__body">
        <p class="features-step__label">ETIQUETA EN MAYÚSCULAS</p>
        <h3 class="features-step__title" id="feature-X-title">Título del paso</h3>
        <p class="features-step__desc">Descripción del beneficio.</p>
      </div>
    </div>
  </div>
</article>
```

## Key Conventions

- **Images:** all use `loading="lazy" decoding="async"`. Decorative images always have `alt="" aria-hidden="true"`. Content images carry descriptive `alt`.
- **`aria-labelledby`:** every `<section>` must reference its heading. Always add `id` to the `<h2>` and reference it: `aria-labelledby="section-id"`.
- **`aria-current="page"`:** hardcoded to "Inicio" in `header.njk`. Update manually when building new site nav with active states.
- **Responsive breakpoints:** 390 px (small mobile), 768 px (tablet), 1024 px (desktop). Styles use desktop-down (max-width media queries).
- **Negative margins on buttons break focus rings** — use `min-height` and padding instead. See CODER.md 2026-06-22.
- **Demo button variants** (`.a-link-demo`, `.demo`, `.demo-2`): all must share `outline: 6px solid #ffffff29` with no `border`.
- **Large sections** (`.CTA`, `.hero`): use `min-height` not fixed `height` to prevent text clipping in locales.
- **Bento card illustrations:** `cards.css` uses prefixes (`.r2-`, `.r3-`, `.r4-`, `.r5-`, `.e5-`) to isolate from layout styles.
- **Canonical & og:url:** auto-generated from page path. If you need to override, add `canonical` to frontmatter (rare).
- **SVG icons:** use the exported names from Figma as-is (e.g., `megaphone-line-1.svg`). No semantic meaning to extract.
- **Figma design file:** `Wf0fqbGTmUbNJmXfWPL0nP`

## Known Issues & Quirks

These are recent fixes to avoid re-introducing bugs:

**2026-06-23**: Header mobile menu optimized with accessible hamburger toggle. No residual debug logs (`__ANIMA_DBG__`) in codebase.

**2026-06-22**:
- Responsive spacing pass across 390/768/1024 breakpoints (hero, bento, CTA, footer) — keep spacing rhythm consistent
- Button outlines: `.a-link-demo`, `.demo`, `.demo-2` all use `outline: 6px solid #ffffff29` with NO `border` property
- Font fallback: Mont families + Montserrat import for 400/600/700 weights. Mont files hosted at `https://c.animaapp.com/YRWwm3ms/img/mont-regular.woff`
- Avoid negative margins on button pills — they clip focus rings. Use `min-height` and padding instead.
- Prefer `min-height` on large sections to prevent content clipping in text-heavy locales.

## How This Project Is Worked On

These rules are derived from session history — they prevent the most common expensive mistakes.

### Scope of changes

**Always confirm mobile/desktop scope before editing CSS.** The single most repeated correction is "eso solo en mobile, en desktop está bien."

- If a request doesn't specify scope → assume it applies to **both**. Check both breakpoints before finishing.
- If the request says "solo en mobile" or "solo en móvil" → add styles only inside `@media (max-width: 767px)`. Never touch rules outside that block.

### Micro-adjustments

When the user says "me gusta, pero [X]" or sends a one-liner like "que rote más" / "bajalo más" / "ponle 34px":
- Change **only** the one thing mentioned. Do not refactor, reorganize, or improve anything else in that pass.
- Confirm the exact value you set (e.g. "Puse `rotate(12deg)`, antes era `8deg`") so the next iteration has a baseline.

### Animation iteration

GSAP and CSS animations go through 5–15 micro-iterations per feature. **Before implementing any new animation, extract all timing values into named constants** — either JS variables at the top of the animation block or CSS custom properties on the section. This makes "hazlo más lento" a one-line change instead of a file hunt.

### Context resets

When a session continues after a context summary or the user types "sigue" / "Continue from where you left off":
- **Re-read the actual current state of the files** (`script.js`, `style.css`, the relevant `.njk`) before acting. Do not rely on what the summary says.
- Summarize what you observe in 2–3 lines before continuing.

### Never roll back silently

The user frequently types "vuelve a la versión anterior" after a failed attempt. Before making a destructive CSS/JS change, preserve the current value in a comment: `/* was: X */`. This makes manual rollback possible without re-reading files.

## Custom Command Patterns

These are documented patterns you recognize and apply when the user requests:

| Pattern | When to use | Do this |
|---------|-----------|---------|
| `/mobile-only [cambio]` | Apply change only in ≤767px, preserve desktop | Edit only inside `@media (max-width: 767px)` |
| `/responsive-pass` | Audit all breakpoints for visual/layout issues | Check 390/768/1024 and list problems per breakpoint |
| `/new-page [slug]` | Scaffold a new subpage complete | Use the hero pattern + frontmatter template + cta-final |
| `/anim-vars [sección]` | Refactor animation values to constants before iteration | Extract duration/ease/offset to named variables |

## Project Memory

Ongoing dev notes live in `workspace/CODER.md` (newest-first). Consult it when diagnosing visual quirks — past fixes are recorded there with dates.
