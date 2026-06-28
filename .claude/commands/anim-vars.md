Before implementing or iterating on a GSAP or CSS animation, extract all timing, easing, and transform values into named CSS custom properties or JS constants at the top of the block. Example:

```js
const FEAT = {
  duration: 0.6,
  ease: 'power3.out',
  yOffset: 26,
  stagger: 0.08,
};
```

Or in CSS:
```css
.section {
  --anim-duration: 0.6s;
  --anim-ease: cubic-bezier(0.16, 1, 0.3, 1);
  --anim-y: 24px;
}
```

This way future micro-adjustments ("hazlo más lento", "que se vaya más a la derecha") require changing one value, not hunting through the code.

Apply this pattern to: $ARGUMENTS
