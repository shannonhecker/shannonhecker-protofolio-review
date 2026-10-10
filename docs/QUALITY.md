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

## Design, creativity, content: judged, with the honest gaps

| Criterion (weight) | Self-score | What carries it | What holds it back |
|---|---|---|---|
| **Design (40%)** | 7 / 10 | Disciplined type scale, a lot of air, hairlines, consistent composition, the Winking Star sub-palette, the SH mark | **The case images are dark presentation slides with serif titles.** They read as a different brand from the white grotesk page, and their small text can't be read at 390 px. This is the largest single gap. |
| **Usability (30%)** | 8 / 10 | Fast, accessible, keyboard and print ready, deep links on every beat | About 43 screens of scroll at 1440 px for a panel that skims. Fixing this means splitting into an index plus one page per case, which is Shannon's decision. |
| **Creativity (20%)** | 5 / 10 | Directed motion, the playable tick demo, hover peek | No signature moment yet. The game (planned) and cross-page image transitions (if the site splits into pages) are the two candidates. |
| **Content (10%)** | 8 / 10 | Real, verifiable, honest claims. Decisions with trade-offs. Edge states. | Visible placeholders: the Winking Star downloads tile (`__`) and the five empty uoaui.ai screens. |

Weighted now: about **7.0**. That's at the Site of the Day threshold, not yet comfortably above it.

## What gets it to the bar, in order of impact

1. **Re-export the case images as clean UI crops with no slide titles** (Shannon, assets). Design +1 to +1.5.
2. **Split into an index plus one page per case, with shared-element transitions** (Shannon decides, then build). Usability +0.5, Creativity +1.
3. **Ship the game as an optional, polished epilogue** (Shannon picks the concept, then build). Creativity +1 to +2.
4. **Fill the placeholders** (Shannon, content). Content +1.

Items 2 and 3 together take the weighted score to about 8, which is where Sites of the Day sit comfortably.
