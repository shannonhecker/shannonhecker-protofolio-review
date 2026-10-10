# Quality review, 10 October 2026

The target is award-caliber visual craft and a portfolio that answers the Revolut panel brief. This record distinguishes measured checks, visual inspection and unverified claims. It does not assign itself an award score or claim approval from Awwwards, FWA, the Webbys or Revolut.

## Review criteria

The repository's `prototype/BRIEF.md` asks for a clear problem, constraints, decisions and trade-offs, complete flows, edge states, outcomes, recency and visible UI craft. All four current cases now link directly to the relevant evidence, with additional personas, journeys and decision maps. Working assumptions remain labelled; no interview participants, product metrics or shipped status were invented.

The [Webby judging criteria](https://www.webbyawards.com/judging-criteria/) include content, structure/navigation, visual design, functionality, interactivity, innovation and overall experience. These are useful review lenses, not a substitute for external judging. Current detailed Awwwards and FWA criteria were not reliably retrieved in this session; older numerical claims in this document have been removed.

## Verification

- `npm run build`: eight routes built successfully.
- `npm run check`: 63 files, zero errors, warnings or hints.
- `PW_CHROMIUM_PATH='/Applications/Google Chrome.app/Contents/MacOS/Google Chrome' npx playwright test --workers=4`: **78 passed**.
- Regression coverage includes all eight playable stages; keyboard/touch controls; fullscreen and Escape; accessibility at 390, 820 and 1440px; page overflow at 320, 390, 820 and 1440px; no-JS and reduced-motion content; print visibility; case navigation anchors; full image proportions; current video playback and full-size capture links.
- Current product videos use native controls, no autoplay and `preload="none"`. The decorative game preview makes no video request under reduced motion and starts only on hover/focus on pointer devices.
- Lighthouse 12 runs against the local production preview, separately on mobile and desktop, skipping only `is-crawlable` because the site is intentionally private/noindex. Scores below are laboratory measurements, not field performance or real-device guarantees.

| Route | Mobile P / A / BP / SEO | Desktop P / A / BP / SEO | Mobile LCP | Mobile CLS |
|---|---|---|---|---|
| /panel | 97 / 100 / 100 / 100 | 100 / 100 / 100 / 100 | 2.417 s | 0 |
| /fx | 96 / 100 / 100 / 100 | 100 / 100 / 100 / 100 | 2.709 s | 0 |
| /fusion | 97 / 100 / 100 / 100 | 100 / 100 / 100 / 100 | 2.482 s | 0 |
| /winking-star | 98 / 100 / 100 / 100 | 100 / 100 / 100 / 100 | 2.267 s | 0.0005 |
| /uoaui | 95 / 100 / 100 / 100 | 100 / 100 / 100 / 100 | 2.784 s | 0 |

P = Performance; A = Accessibility; BP = Best Practices. All ten runs meet the 95-point category budget. Raw summary: `quality-results.json`.

## Visual inspection and fixes

Reviewed the home page, each case, the build page, game map and playable Kaohsiung stage. Desktop screenshots used 1440px; mobile screenshots used 390px, with responsive/overflow checks at 320 and 820px. Actual videos were sampled at 5 and 12 seconds, with their natural dimensions checked during playback.

- Wider vertical gaps and shorter text measures separate case beats; full-width evidence no longer competes with a floating beat label.
- Visible index thumbnails replace the hidden cursor-following preview. The old preview assets and old uoaui clip are no longer referenced.
- All product stills retain their source proportions, with full-size links for dense screens. Screenshots were recaptured at sufficient height to include lower charts. Source application scrolling inside tables remains part of the real interface.
- Winking Star's hero illustration and phone images are no longer cover-cropped. The mobile illustration's inherited opacity was removed so the supplied art stays clear.
- A first-child decision map no longer overlaps its desktop section label. Diagrams stack without clipped labels on phones.
- The first game-toolbar pass accidentally hid Sound; this was fixed, with the expanded game regression suite passing.
- Game-preview playback uses an intent counter to avoid revealing a video after pointer exit or Play. The generated clip is four seconds, with a static fallback.
- Supplied avatar originals remain unchanged. Their peach/rose/cream palette informs small site accents and the original game art.
- Product media is real. Higgsfield was used only for the game cover and its motion; see `MEDIA-SOURCES.md`.

## Source integrity

All seven Figma pages were inventoried and screened. `FIGMA-AUDIT.md` records exact nodes, context conflicts and excluded placeholders. Current screenshots and recordings come from Shannon's three designated live products; old slide evidence was replaced by current screens or sharp HTML/SVG process diagrams.

Two case-copy corrections follow the latest source: uoaui's compare/tune step is Shannon's review practice rather than a forced export gate; FX's separate state lane and counted clusters are refinements shown in schematics, not features visible in the current public rebuild. Classic is the Barclays design; Enhanced is Shannon's public rebuild. FX stays beta and uoaui stays private alpha.

## Remaining limits

- No award jury or independent design panel has reviewed this pass. Winning an award cannot be established by a self-assigned score.
- FX and uoaui mobile LCP measured 2.709 s and 2.784 s, above the 2.5 s aspiration even though their category scores pass the 95-point gate.
- Physical Safari/iOS device checks and an independent human game playtest remain useful external validation. This session's automated browser checks used Chrome.
- Fusion's public rebuild visibly carries an AG Grid trial watermark. Captures preserve it; fixing its license/configuration is work in that source repository.
- User research and outcomes for the private alpha remain assumptions or unmeasured where the source says so. No numbers were added to fill gaps.
- Corporate Action Manager, Deal Model and Data Solution are the next separate handoff feature, not new cases delivered by this four-case pass. Their source locations are recorded in the Figma audit.
