Create a new Eleventy subpage for this project. Page name/slug: $ARGUMENTS

Steps:
1. Create `$ARGUMENTS.njk` at the project root with the correct frontmatter (layout: base.njk, title, description, ogTitle, ogDescription, and any ctaTitle override)
2. Open the content with the standard subpage hero pattern: `.product-top > .product-hero > .product-hero__inner` with `.product-eyebrow`, `h1.product-hero__title`, and `p.product-hero__desc`
3. Add placeholder sections using the reusable components documented in CLAUDE.md (`.badge-2` eyebrows, `.content-wrapper` cards, `.features-step` lists as appropriate)
4. Close with `{% include "partials/cta-final.njk" %}`
5. Use only tokens from `styleguide.css` — no hardcoded colors, sizes, or spacing values

Ask me for the page content/brief before writing if it wasn't provided with the command.
