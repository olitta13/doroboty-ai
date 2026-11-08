# Homepage hero motion

## Intent

Give the homepage hero (`/#/`) a polished entrance in the Poster People style:
animate the H1 and, required, the people illustration. Copy, routes and data
stay unchanged.

## Acceptance criteria

- H1 words rise from a mask in sequence; „dowożą z AI.” receives a pink
  (`--gui-color-1`) marker sweep that wraps correctly across lines.
- The illustration is split into layers (seated person, standing person with
  the card, three spark clusters) on the original 1536×1024 canvas, so the
  final frame matches `people.png`. The kit asset stays untouched; layers live
  in `src/assets/hero` (WebP, ~180 kB total instead of the 1.5 MB PNG).
- Entrance: seated person rises, standing person walks in with the card,
  sparks pop; then a slow idle (breathing, floating, twinkling).
- On narrow screens the illustration entrance starts when it scrolls into view.
- Accessible name of the heading is unchanged; the art is one `role="img"`
  with the previous alternative text, layers are `aria-hidden`.
- `prefers-reduced-motion: reduce` shows the static final state with no
  running animations.
- No horizontal overflow at 1280, 390 and 320 px; no console errors.

## Verification

Playwright frame captures at 1280/390/320 px, reduced-motion run
(`document.getAnimations().length === 0`), scroll-triggered entrance check,
then `npm run check`.
