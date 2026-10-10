# Quality bar: award level

The target is the standard of an Awwwards Site of the Day, an FWA of the Day and a Webby nominee. This file turns that into criteria I can check, scores the site against them with evidence, and lists what still stands between the site and the bar. Re-score after every PR.

## How the juries judge

- **Awwwards:** jurors score 1–10 on Design (40%), Usability (30%), Creativity (20%) and Content (10%). Site of the Day winners usually average above 7. The separate Developer Award checks semantics, animations, accessibility, performance (WPO), responsive design and markup.
- **FWA:** craft, innovation and the "wow" of the experience, judged by a jury of practitioners.
- **Webby:** for portfolio and personal sites, content, structure and navigation, visual design, functionality, interactivity and overall experience.

Here they are as checks this repo can be held to. Status as of the `quality/award-pass` branch.

## Engineering and usability: measured

| Check | Bar | Now | Evidence |
|---|---|---|---|
| Lighthouse mobile, Performance | ≥ 95 | 99–100 | Lighthouse 12, simulated slow 4G, 4× CPU |
| Lighthouse desktop, all four | ≥ 95 | 100 / 100 / 100 / 100 | Lighthouse 12 desktop preset |
| Lighthouse mobile, A11y, Best Practices, SEO | ≥ 95 | 100 / 100 / 100 | same |
| LCP mobile / CLS | < 2.5 s / < 0.1 | 1.8 s / 0 | same |
| Scroll smoothness | 60 fps | p95 frame 16.7 ms at 1× and 4× CPU throttle | rAF frame timing while scrolling |
| axe-core, WCAG 2.2 AA + best practice | 0 violations | 0 at 390 / 820 / 1440 | `tests/site.spec.ts` |
| No horizontal scroll | none at any width | none at 320 / 390 / 820 / 1440 | `tests/site.spec.ts` |
| JavaScript off | all content readable | yes, strip scrolls natively | `tests/site.spec.ts` |
| Reduced motion | nothing moves, nothing hidden | yes | `tests/site.spec.ts` |
| Moving content | real pause control (WCAG 2.2.2) | yes, both marquees | `tests/site.spec.ts` |
| Keyboard | hover feedback mirrored on focus | yes, index rows | `production.css` |
| Mobile nav | every section reachable and visible | yes, overflow edge and active link kept in view | `tests/site.spec.ts` |
| Print / PDF | complete and annotatable | yes, images load, nothing hidden, 33 pages A4 | `tests/site.spec.ts` + manual PDF check |
| Visual parity with signed-off v4 | same layout | section offsets match to the pixel, apart from 2 explained deltas | offset diff script |
| JS weight | small, deferred | 50 KB gz (GSAP + ScrollTrigger + Lenis) | build output |
| Security headers | present | HSTS, CSP, nosniff, frame-deny, referrer, permissions | `vercel.json` |
| Meta | OG, favicon, sitemap, robots, structured data | yes | `Base.astro` |

## Design, creativity, content: judged

Scored on the shipped line: `explore/multipage` → `art/ui-crops` → `feat/game-fx-concept`. Shannon delegated the art-direction and structure calls ("I trust your findings"); each one is listed in `BUILD.md`.

| Criterion (weight) | Score | Evidence | Still open |
|---|---|---|---|
| **Design (40%)** | 8 / 10 | One visual language end to end. The case slides are cropped to their UI (`scripts/crop-ui.py`), so no serif title blocks and no second brand; on a phone, the UI is the subject. Disciplined type scale, hairlines, air, the Winking Star sub-palette, Shannon's SH mark. | The player in the game is a stand-in shape until the sprite exists (needs `shannon-ref.jpg`). |
| **Usability (30%)** | 9 / 10 | Home is 7.2 screens, and each case has its own URL. Lighthouse 97–100 mobile and 100 desktop on all 5 pages. axe zero on 5 pages × 3 widths. Keyboard, print, no-JS and reduced motion are all covered by tests. Beat labels are headings, so screen-reader users can jump beat to beat. | Not yet tested on real Safari or iOS devices; the sandbox has Chromium only. |
| **Creativity (20%)** | 8.5 / 10 | A pixel-art platformer in three worlds, one per case, built from each case's own nouns: candlestick platforms and the moving FX rate line; data-table rows and sliding fixed templates; activity cards, the nag-loop cloud and a pet that hatches. Story cards between levels hand the reader back to the case. Case titles morph between index and page. | The hero sprite is a neutral stand-in until Shannon's photo arrives. Needs a human playtest. |
| **Content (10%)** | 8 / 10 | Every claim is real and checkable; there are no visible placeholders (a test enforces this). The empty downloads tile now shows the stated four releases, and the empty uoaui.ai boxes are now the flow as steps. | Measured downloads and rating; real uoaui.ai captures. |

Weighted: 0.4 × 8 + 0.3 × 9 + 0.2 × 8.5 + 0.1 × 8 = **8.4**. That clears the ≥ 8 bar this file set for comfortable Site of the Day territory.

**Honest caveat:** this is a self-assessment against published jury criteria, not a jury result. The open items above would move it further: the sprite, a Safari device pass, a human playtest, and real metrics.
