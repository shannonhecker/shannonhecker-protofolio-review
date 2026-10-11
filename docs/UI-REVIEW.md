# Independent UI review · 12 October 2026

Reviewed local `http://127.0.0.1:4341` through CUA Chrome using the frontend-design skill. This is a focused visual checkpoint, not an award or exhaustive accessibility certification. Root changed the persona template during this review; findings below refer to the new template.

## Defects

### P1 · Deal Model hero disappeared on desktop — corrected and verified

`src/components/CaseDeal.astro:43`: the absolutely positioned hero figures had a parent with automatic inline margins, no explicit width and no in-flow content. At a 1440 × 960 viewport the parent and both loaded images measured **0 × 0**; the right half of the hero was empty. The mobile grid declaration was also overridden by a later `display:block!important` base declaration.

Reported to root, who added width:100% and moved the base display rule before the mobile override. Rechecked in CUA: desktop hero **801.6 × 612.3**, both original screenshots visible; mobile **350px** container, computed `display:grid`, **24px** gap, no document-level horizontal overflow.

Proof: `/private/tmp/portfolio-ui-review/deal-hero-fixed-desktop.jpg`, `/private/tmp/portfolio-ui-review/deal-hero-fixed-mobile.jpg`.

### P2 · Dense product screenshots have no direct full-size interaction

`src/components/ProductCapture.astro:15` renders a plain image in a figure. The Fusion and uoaui product screenshots become approximately 350px wide on a phone, so their fine interface text cannot be read. Deal hero figures in `src/components/CaseDeal.astro:20` and `:21` similarly render plain `Pic` images. These images have no tap target to open the exact source, unlike the decision-option artwork.

Suggested correction: make the image itself an accessible full-size link or a zoom target. Keep the removed metadata/caption toolbar absent. Do not upscale, redraw or add a frame. Browser pinch zoom exists, but an explicit image target is more discoverable and avoids zooming the entire long case page.

### P3 · uoaui hero introduces the product below a large decorative avatar

At 1440px the laptop avatar occupies most of the narrow left content column between metadata and the explanatory paragraph. The actual product explanation starts near the bottom of the first viewport, while the screenshot has no nearby short introduction. This is weaker than the other case heroes, where the problem is immediately legible. Consider placing the introductory paragraph before the avatar or reducing that avatar to a secondary identity accent. Source: `src/components/CaseAi.astro` hero avatar placement. This is a hierarchy improvement, not a rendering failure.

## New persona-template checkpoint

Desktop visual checks: Fusion, uoaui, Winking Star, Deal Model and FX. Cards at roughly 983px content width remain legible, with portrait heads visible, readable two-column goals/pain points, and a coherent context/response distinction. No blocker found in the shared new template. Phone visual checks include Fusion, uoaui, Winking Star and Deal Model; the identity row and single-column content fit the 350px content area. FX phone section was inspected, but its first full card was not captured cleanly before handoff; finish that specific check in the parent verification pass.

Evidence: `/private/tmp/portfolio-ui-review/fusion-persona-desktop.jpg`, `ai-persona-desktop.jpg`, `ai-persona-mobile.jpg`, `winking-persona-mobile.jpg`, `deal-persona-mobile.jpg`, `fx-persona-desktop.jpg` in the same directory. Some early viewport captures were scaled incorrectly by the browser screenshot tool; do not use the earlier Winking desktop or FX mobile capture as final proof. Resetting viewport, observing it, then applying the requested size produced accurate captures.

## Requested layout checks

- FX desktop full-flow section retains the left section label/right content alignment; screenshots fit the content column without document overflow at 1440px.
- Flow rules are above each item: computed border-top 2px, border-bottom 0px. Desktop arrows are on the title pseudo-element with top:0; the old item-center pseudo-element has content:none. Mobile uses downward connecting arrows.
- No `details` elements in inspected FX, Fusion and Deal pages. Section navigation is a jump menu, not hidden case content.
- The Fusion journey introduction and scenario copy are readable in stacked mobile layout. Project-specific journey and decision implementations were previously source reviewed, but this pass did not visually inspect every branch of every long page.
- Home hero was inspected at the normal desktop viewport. Final mobile-home/game and every-page full scroll still belong to the parent release verification; do not mark them complete on this report alone.

No app code was edited by this review. Root applied the Deal fix after receiving the independently observed defect.

## Final portrait and game checkpoint · 12 October, after alpha cutouts

The final shared card uses white identity, portrait and content areas with one accent hue. CUA inspection confirms the former opaque rectangles are absent on the Deal owner, approver and legal reviewer portraits. The FX phone card is legible with the portrait contained and its complete identity visible. New proof is in `/private/tmp/portfolio-final-review/`: `deal-persona-desktop.jpg`, `deal-legal-product-desktop.jpg`, `deal-persona-phone.jpg`, `fx-persona-phone.jpg`.

The apparent FX phone gap before personas is partly the original diagram's retained height: its convergence node lies outside the initial horizontal window. Measured spacing from the figure bottom to the persona section is 80px (persona margin 48px plus preceding layout gap). This is not a collapsed persona or missing image. Source: `CaseFx.astro:192` preserves a minimum 900px-wide original diagram inside horizontal scrolling. A smaller 48px inter-section separation could tighten the mobile rhythm, but cropping or shrinking the diagram would lose readable source detail.

### Full-screen phone map

Opened Start adventure at a 390 × 844 viewport and used the horizontal pan. The map occupies a roughly 356 × 538 window; the canvas renders at approximately 956 × 538 from its 480 × 270 pixel-art coordinate space. Labels and stage icons are readable and the map pans to London/other worlds. It is not the small letterboxed map described in the earlier user report. Exit full screen returns to the page. Evidence: `game-map-phone.jpg`. Rules are in `src/styles/type-rhythm.css:94–108`; this review exercised portrait emulation, not a physical iPhone/Safari.

### Scroll-lag audit: no proven timing regression

Normal CUA scrolling and navigation completed without stuck content during these checks. Static screenshots and automation round-trip duration cannot establish frame pacing, so this is not a 60fps certification. Source inspection confirms native scrolling with passive/rAF-coalesced chrome updates (`src/scripts/motion.ts:115`), no Lenis wheel interception, and game map rendering stops when hidden/offscreen (`src/game/main.ts:245–255,850–868`).

Two plausible profiling targets remain if physical-device lag persists: `motion.ts:33–38` measures all unrevealed `.rv.pre,.split.pre` elements each scroll update; `scroll-effects.ts:46–48` animates clip paths on individual heading words with scrub smoothing. They are hypotheses, not measured root causes. Do not remove motion or claim a performance fix solely from this source review.

For the user's narrower complaint that the **images feel laggy**, a targeted change is justified without claiming a frame-rate diagnosis: remove only the product-capture and project-hero scroll tweens in `scroll-effects.ts:56–63`. Their `scrub:.7` deliberately makes screenshots catch up after native scrolling, and `scale:.975` resamples fine UI text during that motion. Keeping screenshots stationary would remove that designed trailing sensation while retaining the text motion. This is an interaction-quality recommendation; no measured CPU/GPU performance gain is asserted.
