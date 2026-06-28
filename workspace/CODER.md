<instructions>
This file will be automatically added to your context. 
It serves multiple purposes:
  1. Storing frequently used tools so you can use them without searching each time
  2. Recording the user's code style preferences (naming conventions, preferred libraries, etc.)
  3. Maintaining useful information about the codebase structure and organization
  4. Remembering tricky quirks from this codebase

When you spend time searching for certain configuration files, tricky code coupled dependencies, or other codebase information, add that to this CODER.md file so you can remember it for next time.
Keep entries sorted in DESC order (newest first) so recent knowledge stays in prompt context if the file is truncated.
</instructions>

<coder>
## 2026-06-23
- Header móvil optimizado con menú hamburger accesible en `index.html` + `style.css`; se ocultó navegación saturada en <=767px y se habilitó panel compacto con foco por teclado (Enter/Espacio nativo, Escape para cerrar).
- No se detectaron logs runtime `__ANIMA_DBG__` en código fuente; solo registro histórico en workspace.
## 2026-06-22
- Step 4 (auditoría UI): en `style.css` se corrigieron micro-bugs de layout, reforzando alineación móvil del header, botones apilados a ancho completo y estabilidad visual de imagen CTA sin overflow.
- Step 3 (interacciones demo): en `style.css` se normalizó `hover/active/focus-visible` para `.a-link-demo`, `.demo` y `.demo-2`, preservando el outline de 6px y agregando ring accesible sin degradar la interacción.
- Step 2 (botones demo): en `style.css` se unificó `outline: 6px solid #ffffff29` para `.a-link-demo`, `.demo` y `.demo-2`, eliminando `border` en variantes demo para mantener consistencia visual.
- Responsive spacing pass done in `style.css` for `hero`, card groups (`.bento`/`.content-2`), `.CTA` and footer blocks across 1024/768/390 breakpoints to keep padding/gap rhythm consistent.
- `Mont-Regular` now uses the user-provided hosted font source: `https://c.animaapp.com/YRWwm3ms/img/mont-regular.woff` in `globals.css`.
- Font fallback strategy in `globals.css`: keep `Mont-*` families and include Montserrat import + fallback sources for 400/600/700.
- Runtime debug helper `__ANIMA_DBG__` was removed from `index.html` after visual fix confirmation.
- Visual QA quick wins in `style.css`: avoid negative margins on CTA/button pills (`.a-link-demo`, `.demo`, `.demo-2`) because they generate subtle overflow and clipped rings.
- Prefer `min-height` over fixed `height` on large sections like `.CTA` to prevent content clipping in localized text variants.
</coder>
