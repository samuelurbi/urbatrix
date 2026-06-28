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
- Selected analytics circle is gray with soft shadow; no green selected state remains.
- Analytics control is static: `.analytics-header` has `pointer-events: none` and no JS toggle.
- `.analytics-option` uses flex centering; `.ellipse-2` no longer uses offset positioning.
- Runtime debug logs with `__ANIMA_DBG__` were removed from `index.html`.

## 2026-06-23
- Analytics toggle control uses `.analytics-header` (button) + `.analytics-option` (span) with `selected` class.
- Selected UI state lives in `style.css` under `.analytics-option.selected`.
- Interaction/debug path in `index.html` logs with `__ANIMA_DBG__` on init, missing-element guard, and click toggle.
</coder>
