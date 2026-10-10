# Quality review, 10 October 2026

Award-level craft is the target, not a certification. Technical passes do not establish that every Revolut evidence requirement is satisfied. See `REVOLUT-CHECKLIST.md` for the official brief and remaining factual gaps.

## Current verification

- Production build: eight routes.
- Astro check: 73 files, zero errors, warnings or hints.
- Playwright: 78 tests passed after the brand additions; final release CI remains required.
- Coverage includes all eight stages, keyboard and touch, fullscreen and Escape, accessibility at 390/820/1440px, overflow at 320/390/820/1440px, reduced motion, no JavaScript, print, navigation anchors, intrinsic image proportions and product playback.
- Lighthouse 12: local production preview, separate mobile and desktop runs, skipping only `is-crawlable` for this intentionally private/noindex site. These are laboratory results, not field measurements.

| Route | Mobile P / A / BP / SEO | Desktop P / A / BP / SEO | Mobile LCP | Mobile CLS |
|---|---|---|---|---|
| /panel | 99 / 100 / 100 / 100 | 100 / 100 / 100 / 100 | 2.106 s | 0.0190 |
| /fx | 97 / 100 / 100 / 100 | 99 / 100 / 100 / 100 | 2.562 s | 0.0037 |
| /fusion | 97 / 100 / 100 / 100 | 100 / 100 / 100 / 100 | 2.488 s | 0.0050 |
| /winking-star | 98 / 100 / 100 / 100 | 100 / 100 / 100 / 100 | 2.183 s | 0.0220 |
| /uoaui | 96 / 100 / 100 / 100 | 100 / 100 / 100 / 100 | 2.710 s | 0.0032 |

All ten runs meet the 95-point category budget. Raw summary: `quality-results.json`. Optional desktop scroll effects now load after scrolling begins; touch browsing and initial text do not need that animation framework.

## Visual review

Reviewed the home page, all four cases, build page, every playable stage and game map. Desktop review used 1440px; phone review used 390px, with automated narrow/tablet checks as above.

- Shared cream, peach, rose and sky palette; lighter Nunito headings, Inter body and small Pixelify labels; deliberate spacing between narrative, diagrams and full screens.
- All four work cards have equal prominence. Each case has its own illustrated setting, outfit/prop and sticky chapter index. The avatar follows scroll position and stays still under reduced motion.
- Real product screens keep source proportions and full-size links. Current tablet/phone captures describe actual support, including FX phone overflow.
- Journeys use connected task/friction/response lanes; decisions use branching SVG diagrams and readable linked steps on phones. A specificity conflict that displayed both layouts on desktop was fixed.
- Winking Star and uoaui show their original logos, verified current palettes, typography, system layers and end-to-end ownership. The uoaui house-system screenshot is current; third-party component authorship stays explicit.
- Eight detailed game backgrounds replace the cover/game mismatch. Kaohsiung no longer contains London landmarks. Generated scenery is stylized artwork, not a literal record of a campus or office. Original animated sprites and map remain deliberately simple.
- Fullscreen startup now uses the latest visibility event and recovers only from observer-caused pauses. Deliberate pauses are preserved.
- Product videos retain native controls and load on request. The game cover is a static matching scene; stage art loads after Play, per visited stage.

## Source integrity

All seven Figma pages were audited. `FIGMA-AUDIT.md`, `MEDIA-SOURCES.md` and `BRAND-SOURCES.md` record sources and exclusions. The shared Claude chat corroborated UITK work before Fusion and cross-team workshops. Shannon confirmed the accessibility specialist joined from the start; the contradictory reflection was removed.

Original case prose remains apart from logged, source-backed corrections and explicitly requested new sections. FX is beta with sample-data rebuilds; uoaui remains private alpha. Generated role art is labelled fictional, not research participants. No outcome metrics, participant counts or testing dates were invented.

## Remaining limits and next work

- Verified adoption/KPI evidence and research protocols are still incomplete. Fusion and uoaui need fuller edge/validation-state evidence before claiming complete Revolut coverage.
- FX and uoaui mobile LCP remain above the 2.5-second aspiration, while passing the required category budget.
- Physical Safari/iOS testing and an independent playtest remain useful external checks. Automated browser coverage here is Chromium.
- Fusion's public rebuild has an AG Grid trial watermark, preserved in real captures. Its license/configuration belongs to that source repository.
- Corporate Action Manager, Deal Model and Data Solution remain a separate content feature.
- Newly requested leaderboard: public scores with optional nicknames; detailed visit/play/level statistics private. Shared storage, server validation and private access are a separate change, not delivered by this visual release.
