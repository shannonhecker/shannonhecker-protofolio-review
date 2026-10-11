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

## Current release candidate: game identity, themes and evidence

This later review supersedes the cream-scene layout described above. Case heroes
now show product screens; pages are white by default and FX starts dark. Visitors
can choose a saved light/dark/system/project preference. Game scenery stays in the
game. The SH mark, small objects, controllable blinking/smiling avatar and detailed
map/character/obstacle atlas provide the shared identity.

Self-inspection found and corrected: Contact wrapping onto a second nav row;
light journey numbers on a pale dark-theme accent; pale video captions inherited
from the old Winking demo card; Winking dark-mode chips; twelve-column header gaps
forcing overflow at 320px; and `display:contents` making Winking's three hero
screens overflow at tablet sizes. These were layout defects, not image cropping
solutions. The final images keep their full source proportions.

Verified locally on 10 October 2026:

- Build: nine routes; Astro check: 88 files without diagnostics.
- 94 browser tests, including all eight game stages, complete-page dark-theme
  contrast under reduced motion, system/persisted theme selection, avatar bounds,
  score validation, consent and sanitized Analytics URLs.
- 320/390/820/1440px: home, four cases, build and privacy pages have no document
  overflow. Product images do not use `object-fit:cover`.
- All ten Lighthouse runs meet the 95-point category requirement. Mobile
  performance: home 99, FX 99, Fusion 99, Winking 97, uoaui 96. Desktop performance
  100 throughout; accessibility, best practices and SEO 100 throughout. The
  intentional noindex crawlability audit remains excluded.
- Visual inspection includes project heroes, real screens, personas, journeys,
  decision maps, compact game preview, map and gameplay. Current App Store iPhone,
  iPad and localized artwork is explicitly distinguished from direct native UI.
- Game stage and reading-depth custom dimensions are saved in Analytics.
  Production delivery and deployed API behavior remain release checks.

The quality target is award-calibre craft, not a claim of an award or an external
judging result. The source-evidence limits above still apply. Published artwork
and illustrations cannot fill missing research protocols or measured outcomes.

### Release verification, PR #25

The release is tracked at https://github.com/shannonhecker/shannonhecker-protofolio-review/pull/25.
Preview verification on commit `e0fa8aa` confirmed a signed run receipt, saved
score, repeat-safe submission and a public response containing only nickname
and score. The isolated preview score was removed after the check. This caught
and corrected a Vercel emitted-module path issue, now covered by a compiled API
runtime CI gate. Merge/production status is recorded on the PR, rather than
inferred from these local results. The final Winking theme artwork is a static
four-banner gallery, with no automatic scrolling or duplicated images.

The root-URL mobile audit now scores 99/100/100/100 after the landing row-order
correction (LCP 2.3s). This route is checked separately from `/panel`; the earlier
CI failure was useful evidence of a real composition error, not a lowered budget.

## Latest reference-led revision · 10 October, 19:05 BST

The current source changes pass a nine-page build, Astro check across 90 files
with zero diagnostics, and all 95 browser tests (51.8 seconds). New regression
coverage checks removal of avatar movement buttons, bounded pointer response,
normal page arrow-key behaviour, and centred project icon/number/reading links.
The original FX Figma flow is included in the uncropped-image checks.

Desktop, 390px and 320px inspections confirm the wider image-led gallery and new
type system remain within the viewport. Blink, half-blink and smile parts were
reviewed as registered composites and in the actual browser at display size.
The expression changes no longer replace the whole body. Existing evidence
limits in REVOLUT-CHECKLIST remain unchanged. Latest CI/deployment are pending.

### Final source and stability correction

The FX loop now uses a fresh 3057×2667 export from the original Figma vector
frame, rather than the older 860×720 JPEG. Desktop and phone review confirms
complete proportions and a full-size source link. The latest homepage mobile
Lighthouse check scores 100 in performance, accessibility, best practices and
SEO (LCP 1.8s; intentional noindex audit excluded).

CI on `a0a7118` exposed a real native-anchor layout shift in Chromium 156.
The image CSS overrode intrinsic aspect ratios, leaving deferred screenshots
at zero height; loading them moved the uoaui chapter heading by 2834px.
Explicit source ratios now reserve the correct space before decoding. A held-
image regression checks the reserved size and stable chapter position. Failure
screenshots and traces are retained for future diagnosis. Final CI and production
results are recorded on PR #25, separately from these local checks.

The custom theme menu revision passes 98 browser tests (41.1s), a nine-page build
and 91-file Astro check with zero diagnostics. Open-menu contrast, mobile bounds,
keyboard selection, focus restoration, Tab/Escape/outside dismissal and saved
preferences are checked. After deprioritising optional first-load game artwork,
the local root mobile audit scores 100/100/100/100 with LCP 1.9s. Remote CI remains
the release gate; these local results do not imply a production deployment.

### 10 October, 20:17 BST · final functional review

The game art is now rendered on a coherent 480×270 pixel grid. Native game
screenshots reviewed the new world map, Kaohsiung scene and sprite integration;
all eight levels pass the completion controller. New interaction checks confirm
a star requires collection, protects against an enemy and expires, and music
stops when leaving both map and gameplay. Fullscreen requests are serialized to
prevent a rapid exit/re-entry race. Banner and diagram connector overflow found
at 320/390/820px were corrected. All 101 browser tests pass (36.0 seconds).

Decorative process sheets have been removed. Responsive, selectable-text diagrams
now explain the actual tasks, frictions, responses and decision alternatives.
The exact source FX flow remains primary. Diagrams are schematic explanations,
not invented production screens or new research evidence. Original wording stays.

The root mobile Lighthouse check is 97/100/100/100, LCP 2.5s, negligible CLS and
zero blocking time locally. The prior remote audit had 240ms blocking time;
scroll-reveal measurements now batch reads before writes to avoid layout thrashing.
Final remote CI and production verification still need to be recorded.

### 10 October, 22:10 BST · editorial layout and motion release

All 108 browser tests pass locally (38.8s). Nine routes build; Astro checks 99
files with zero errors and warnings, plus one pre-existing unused-parameter hint.
The greeting test found an entrance animation overriding horizontal centering;
the animation now retains the -50% anchor, and visual review confirms alignment.
New checks cover adjacent hover/focus arrows, page-specific avatar cursors, saved
cursor preference, native keyboard/reduced-motion behaviour, page transition
completion/history and greeting interruption. Cursor assets load on first mouse
use; both arm pose images total about 156KB. Motion stops offscreen or hidden.

The editable Figma working file now contains all eighteen desktop/mobile route
layouts. Twelve product/home layouts received the latest editorial refresh;
Build, Privacy and 404 retain their exports. Text, image fills and vectors remain
editable. Inter is the documented Figma-only fallback; motion remains in code.
Exact-head CI and production verification are recorded on PR #25.

### 10 October, 22:31 BST · delayed entrance and recurring greeting

The headline fades/rises after 250ms, supporting text and links follow, and the
avatar enters after two seconds. Separate wrist movement makes the greeting
visible; it repeats after ten seconds of rest and on a fresh pointer/touch visit.
Offscreen, hidden, paused and reduced-motion states stop the loop. All 109 browser
tests pass (40.5s). The local root mobile Lighthouse audit is 99/100/100/100.
The three greeting assets total about 56KB after high-quality WebP compression;
critical Inter weights preload and consent visibility is resolved before paint.
The latest build covers nine routes and Astro reports no errors or warnings.
The exact previous commit ea36914 passed remote CI, including all ten Lighthouse
runs; this timing revision receives its own exact-head gate before release.

### 10 October, 22:55 BST · Figma home sync and responsive repair

The Home desktop/mobile frames on Figma page 32:2 now supply all four authored
cover compositions and the revised home typography. The two landing URLs share
these covers; case-page evidence is unchanged. Gallery assets are local and
responsive AVIF/WebP variants are generated by Astro. The title screen and
rainy London umbrella were visually inspected on desktop, and the home/title
screen/gallery were inspected at 390px. A case-title animation's incorrect
negative horizontal offset is fixed; automated checks cover all four headings
at 320, 390, 768, 1024, 1280, 1440 and 1920px with motion enabled.

All 114 browser tests pass in 41.5s. Nine routes build. Astro checks 102 files
with zero errors/warnings and one existing unused-parameter hint. The updated
home mobile audit is 96/100/100/100, TBT 0ms and CLS 0 locally. The preceding
remote run failed mobile performance with TBT 540ms despite passing browser
checks; remote CI on this revision remains required before publication. The
arch and objects now enter after copy and before the character. Title-screen
ambient motion pauses offscreen/hidden, and the avatar waits until meaningfully
visible. Full-screen play hides site navigation and decorative cursor while
preserving the map's native pointer affordance.

### 10 October, late review · combined release candidate

Nine routes build. Astro checks 110 files with zero errors/warnings and one existing unused-parameter hint. All 120 Playwright tests pass (43.9s), including eight complete levels, final villain/flag, source-linked timeline, pause/resume, death/mute, eight distinct music themes, travel sequence and persistent completion markers. Title HUD/plaque/start spacing passes at 320–1920px; home images cover the authored frame at mobile and desktop sizes with no exposed wrapper colour. Section drawer keyboard focus, close/Escape/backdrop and 390px layout pass. Existing accessibility, full image aspect ratio, privacy/consent and navigation checks stay green. FX personas/journey and game timeline inspected in Chrome; exact-head CI remains the release gate.

Follow-up FX artwork and finale-lock verification: Astro checks 111 files, zero errors/warnings, one existing hint. Focused 28 game/audio checks pass in 37.1s, including locked direct entry, incomplete progress, full progress unlock and all eight playable stages. Figma mobile artwork/persona and both journey layouts visually checked; website FX desktop/mobile composition inspected. Final combined suite and exact-head remote release gates follow.

11 October release candidate: nine routes build; Astro checks 111 files (0 errors, 0 warnings, one existing unused-variable hint); all 123 Playwright checks pass in 45.2s. Full finale playthrough defeats Scrollkeeper with exactly three ranged wand hits, then raises flag. Touch cast, cooldown, pause and earlier-stage exclusion verified. Local root mobile Lighthouse: performance 96, accessibility/best practices/SEO 100. Exact-head CI and production verification remain separate gates.

Motion pass: all 125 browser checks pass (45.5s), including new forward/reverse scroll masks, live reduced-motion cleanup and phone-width bounds. CUA review confirmed paired project entrances and reverse scroll in the local home gallery. Exact-head CI is being rerun after the avatar-loading performance correction; the previous candidate's browser suite passed but root Lighthouse performance was 93.

Final local motion candidate: Astro checks 112 files (0 errors, 0 warnings, one existing hint); production build succeeds; 125 tests pass in 44.0s; root mobile Lighthouse performance 96 with other categories 100. Avatar poses load eagerly and the visible wave has high priority; the home page no longer preloads an unused display face. Navigation size comes from ResizeObserver and startup progress measurement runs on the next frame.

Final song and date revision: 125 browser tests pass (46.5s), including actual oscillator note scheduling and old-voice shutdown across all eight stages. Timeline assertions use 2018/2021. Astro checks 114 files with zero errors/warnings and one existing hint. FX mobile Lighthouse improves from 93 to 97 (other categories 100) after embedding the original small journey vectors and natively lazy-loading offscreen video posters; LCP 2.4s. Final remote CI and production are still pending.

Mobile startup follow-up: home now uses one 48KB local Inter variable file instead of three 24KB static body-font weights. Supported weights and family names stay unchanged. Phone intro uses composited opacity/transform and a shorter avatar arrival. Nine routes build, Astro has zero errors/warnings, all 125 tests pass (44.8s), local home Lighthouse is 97/100/100/100 with TBT 0ms and CLS 0. Remote exact-head checks still apply.
