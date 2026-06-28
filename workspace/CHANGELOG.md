<instructions>
## 🚨 MANDATORY: CHANGELOG TRACKING 🚨

You MUST maintain this file to track your work across messages. This is NON-NEGOTIABLE.

---

## INSTRUCTIONS

- **MAX 5 lines** per entry - be concise but informative
- **Include file paths** of key files modified or discovered
- **Note patterns/conventions** found in the codebase
- **Sort entries by date** in DESCENDING order (most recent first)
- If this file gets corrupted, messy, or unsorted -> re-create it. 
- CRITICAL: Updating this file at the END of EVERY response is MANDATORY.
- CRITICAL: Keep this file under 300 lines. You are allowed to summarize, change the format, delete entries, etc., in order to keep it under the limit.

</instructions>

<changelog>
2026-06-23 | Added accessible mobile hamburger nav for header and reduced clutter at 375px.
- Updated: index.html, style.css
- Workspace: workspace/CODER.md, workspace/TODO.md, workspace/CHANGELOG.md
- Pattern: hide desktop nav/actions on <=767px and expose keyboard-friendly toggle + mobile panel.
2026-06-22 | Step 4 applied: visual audit and micro layout fixes for mobile alignment and CTA stability.
- Updated: style.css
- Workspace: workspace/CODER.md, workspace/TODO.md, workspace/CHANGELOG.md
- Pattern: keep targeted CSS-only fixes (no DOM rewrite) for header/button stacking and image overflow control.
2026-06-22 | Step 3 applied: normalized demo button interactions and accessible focus without losing 6px outline.
- Updated: style.css
- Workspace: workspace/CODER.md, workspace/TODO.md, workspace/CHANGELOG.md
- Pattern: keep `.a-link-demo/.demo/.demo-2` with base `outline: 6px solid #ffffff29`; add dedicated `:focus-visible` ring + explicit `:active`.
2026-06-22 | Step 2 applied: demo buttons now use unified outline instead of border.
- Updated: style.css
- Workspace: workspace/CODER.md, workspace/CHANGELOG.md
- Pattern: enforce `outline: 6px solid #ffffff29` on `.a-link-demo`, `.demo`, `.demo-2`.
2026-06-22 | Responsive visual pass for 1366/1024/768/375 focused on hero, CTA, cards and footer spacing.
- Updated: style.css
- Workspace: workspace/TODO.md, workspace/CODER.md, workspace/CHANGELOG.md
- Pattern: enforce consistent padding/gap rhythm with layered breakpoints (1024, 768, 390) without changing DOM.
2026-06-22 | Pointed Mont-Regular to provided MONT-REGULAR.woff source.
- Updated: globals.css
- Workspace: workspace/CODER.md, workspace/CHANGELOG.md
- Pattern: keep Mont-Regular alias stable; swap only font file URL.
2026-06-22 | Added Montserrat fallback for Mont fonts and removed runtime debug script.
- Updated: globals.css, index.html
- Workspace: workspace/CODER.md, workspace/TODO.md, workspace/CHANGELOG.md
- Pattern: keep Mont-* families with Montserrat fallback sources/import.
2026-06-22 | Fixed layout spacing inconsistencies and added runtime visual debug logs.
- Updated: style.css, index.html
- Workspace: workspace/CODER.md, workspace/TODO.md
- Pattern: avoid negative margin pills; use min-height for elastic sections.
2026-06-22 | Replaced Caros references with Mont-Regular for label typography.
- Updated: globals.css, styleguide.css
- Pattern: keep typography tokens aligned to Mont-* family names.
<!-- NEXT_ENTRY_HERE -->
</changelog>
