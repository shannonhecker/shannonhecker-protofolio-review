# Portfolio delivery tracker

Updated 10 October 2026. Project manager: Codex project-manager agent.
Implementation owner: main Codex agent.

The four-case implementation was merged in PR 23 at `cee7789` and locally verified.
Its GitHub CI failed after merge; the next pass must resolve that failure.
Active branch: `design/game-waterfront-worlds`. Award quality is a review target, not a jury result or self-assigned
score. The three additional intro-deck projects remain the next separate feature.

## Scope and source rules

This pass covers FX, Fusion, uoaui.ai and Winking Star: breathing room, current
product media, readable UX artifacts, supplied avatars, original game craft and
Higgsfield supporting cover artwork. Existing narrative is retained except for
the source corrections recorded below. No research, identities, metrics or
shipped status were invented.

Shannon designated these live products as the latest UI source and explicitly
requested replacing old screenshots and videos:

- FX: `https://shannonhecker.github.io/fx-execution-analytics/`
- Fusion: `https://jpm-analytics-dashboard-shannon-h.vercel.app/`
- uoaui.ai: `https://uoaui.ai/` and its linked builder

Current media takes precedence over old deck screens. Figma supports historical
context, process and decisions. FX remains beta; uoaui remains private alpha.
Barclays NDA, approved dates, original game IP, noindex and private-share rules
remain in force. Generated graphics are supporting artwork, never product or
research evidence.

## Delivery board

| ID | Task | State | Evidence |
|---|---|---|---|
| P01 | Read repo rules and handoff | Complete | `AGENTS.md`, `HANDOFF.md`, `BUILD.md`; branch `design/breathing-room-game-craft` |
| P02 | Breathing room and readable evidence | Complete | Full-width uncropped images, shorter reading measures, spaced beats and responsive diagrams; desktop/mobile reviewed |
| P03 | Preserve words and correct source conflicts | Complete | One sentence in the AI decision paragraph now describes Shannon's compare/tune practice; FX iteration heading/paragraph and matrix caption distinguish schematic refinements from current live behavior; other existing narrative retained |
| P04 | Replace obsolete product media | Complete | Current screenshots, index thumbnails, full-size links and recordings; uoaui 21.57s, FX 15.48s, Fusion 13.72s; provenance in `MEDIA-SOURCES.md` |
| P05 | Higgsfield supporting art and motion | Complete | Cover image and four-second preview; static fallback, no initial video request, reduced-motion behavior and provenance recorded |
| P06 | Working Order craft and controls | Complete | Cover, map and Kaohsiung art refined; all eight stages, missions, keyboard, touch, fullscreen, Escape, picker and Sound regression checks passed |
| P07 | UX artifacts for all current cases | Complete | Discoverable problem, users/personas, journey, flow and decision views; source-backed role summaries and explicit AI working assumptions |
| P08 | Winking Star co-parent flow | Complete | Shared board and approved offline behavior; no invented conflict-resolution rule; unconfirmed and superseded deck claims excluded |
| P09 | Corporate Action Manager, Deal Model, Data Solution | Next separate feature | Exact source notes located in `FIGMA-AUDIT.md`; historical public-image selection and new case implementation remain future work |
| P10 | Iterative visual self-inspection | Complete for this pass | Main reviewed home, four cases, build page, map and Kaohsiung; 1440px desktop and 390px mobile screenshots, automated 320/820 checks; fixes recorded in `QUALITY.md` |
| P11 | Fresh local validation | Passed | Build eight routes; Astro 63 files, zero errors/warnings/hints; 78 Playwright tests passed. All ten Lighthouse runs passed; final seven-test media rerun passed after the Winking opacity adjustment |
| P12 | Quality, source and build records | Complete | `QUALITY.md` removes stale self-scores; `MEDIA-SOURCES.md`, `FIGMA-AUDIT.md`, handoff and `BUILD.md` reflect this pass |
| P13 | PR, CI, merge and deployment | PR open; release checks running | [PR #23](https://github.com/shannonhecker/shannonhecker-protofolio-review/pull/23), Vercel preview ready and link check passed; merge after required CI, then verify production |
| P14 | Supplied avatars and playful accents | Complete | Original standing/laptop avatars integrated unchanged; restrained peach/rose accents preserve case readability |
| P15 | All-page Figma source review | Complete | Seven pages, 327 top-level nodes, 2,433 text nodes screened; key frames read fully; exact sources/exclusions in `FIGMA-AUDIT.md`; no Figma edits |

## Current-case coverage

| Project | Problem | Persona / users | Journey | Flow | Decisions | Source qualification |
|---|---|---|---|---|---|---|
| FX | Present | HTML role summaries | HTML journey | HTML steps and current interaction captures | HTML decision map and trade-offs | Enhanced is Shannon's rebuild; state lane and clusters are schematic refinements |
| Fusion | Present | HTML role summaries | HTML journey | Analyst workflow and current configuration recording | HTML decision map | Public rebuild captures preserve the source app's trial watermark |
| uoaui.ai | Present | Labelled working assumptions | Intended alpha journey | Builder flow and current source recording | HTML decision map | Comparison/tuning is Shannon's review practice, not an enforced export gate |
| Winking Star | Present | Existing three personas | Existing six-stage journey | Daily/weekly loops and co-parent flow | HTML decision map | Approved Sample Family, Monday and iOS story wins over older deck drafts |

## Validation evidence

PM independently read `/private/tmp/portfolio-review/build-final.log`,
`check-final.log` and `tests-final.log`: eight routes built, 63 files checked
without errors/warnings/hints, and **78 tests passed**. No competing test or
build process was run by the PM.

Fresh Lighthouse 12 results read from `final-lh-*.json` on 10 October:

| Route | Mobile performance | Mobile LCP | Desktop performance | Other categories |
|---|---:|---:|---:|---|
| `/panel` | 97 | 2417ms | 100 | All 100 |
| `/fx` | 96 | 2709ms | 100 | All 100 |
| `/fusion` | 97 | 2482ms | 100 | All 100 |
| `/winking-star` | 98 | 2267ms | 100 | All 100 |
| `/uoaui` | 95 | 2784ms | 100 | All 100 |

These are local laboratory measurements, not real-device or field guarantees.
FX and uoaui mobile LCP exceed the earlier aspirational 2.5s target; their
performance scores pass the 95 release gate. Do not claim universal sub-2.5s LCP.
The final score table in `QUALITY.md` and `quality-results.json` record all ten
completed runs.

## Review findings closed

- Pre-play world selection and Sound remain available; only Full screen hides
  before play. The initial hiding regression was corrected and tested.
- Game-preview intent guarding avoids revealing a stale preview after stop.
- The first full-width decision map clears its desktop section label.
- Winking Star hero art and phone screens retain full proportions; inherited
  mobile illustration fading was removed.
- All old FX/Fusion/AI product media references, including index previews, were
  replaced. Historical files may remain stored but are not current evidence.
- Current videos use native controls, no autoplay, no loop and on-request load.
- Authenticated builder capture preserves the existing sample canvas without
  submitting a prompt or editing the saved work.
- Source-copy corrections are limited to the AI comparison practice and FX
  current-versus-refinement distinction. Captions/alt text follow new media.
- Seven-page Figma audit excludes all `[Confirm]`, date, tester-count and outcome
  placeholders. Older Sunday/setup/web claims do not override approved app copy.

## Remaining release gates and limits

1. Final local media rerun: seven tests passed after the Winking opacity adjustment.
   The fresh build passed. No source or implementation issue is pending from this PM review.
2. PR #23 merged and deployed; its subsequent CI failure requires the follow-up fix and a green GitHub run.
3. Physical Safari/iOS checks and an independent game playtest remain external
   validation, accurately disclosed in `QUALITY.md`.
4. Fusion's source watermark is preserved. Its licensing/configuration belongs
   to that product repository, not screenshot retouching.
5. No award jury or independently supplied official Revolut checklist has
   approved this work. The repository panel brief supplies the review scope.

See [Figma audit](FIGMA-AUDIT.md), [media sources](MEDIA-SOURCES.md) and
[quality review](QUALITY.md) for detailed evidence and source limitations.


## Active follow-up: site system and game cohesion

User feedback reopens visual quality: the softer detailed game cover does not
match the sparse playable art; the mixed-city cover must not be represented as
Kaohsiung. The user also explicitly permits layout redesign and requests a
whole-site UI/UX review for inconsistent padding, gaps and typography. Existing
copy/source/NDA/media rules above remain active. Questions are sequential, one
at a time, as `AGENTS.md` requires. Main is using the 12ui-design skill to explore
concepts before implementation. Shannon selected an immersive pixel world
throughout the site, superseding the prior mostly-white editorial visual
restriction. Confirmed decisions are recorded in `ADVENTURE-DIRECTION.md`.
Shannon subsequently authorized the external 12ui transfer after the automatic
approval block. Seven-route capture settled at
`/private/tmp/portfolio-uiux-adventure`; Shannon chose local design review instead of connecting 12ui. External generation
is no longer a blocker. The active UI and scene assets have been implemented
locally but await validation; no 12ui-generated candidate is claimed.

| ID | Task | State | Acceptance |
|---|---|---|---|
| N01 | Diagnose merged CI failure | Cause fixed locally; CI pending | Transient fullscreen intersection false and false/true batches: latest observer entry, observer-only restore and explicit touch resume; 18 focused checks passed across three repeats; GitHub CI still required |
| N02 | Agree site visual direction | Decisions recorded; local review selected | Soft illustrated scrolling adventure; optional game; readable friendly type with pixel labels; equal four-case prominence, distinct project accents and sticky case index |
| N03 | Audit all-route spacing and typography | Initial CSS audit complete | Shared spacing/type roles across home, panel, four cases, build and 404; Winking brand differences intentional |
| N04 | Implement coherent layout system | Implemented locally; unvalidated | Common page gutter, section rhythm, reading width, heading/body/caption roles and responsive breakpoints |
| N05 | Cohere cover, map and playable art | Assets implemented locally; unvalidated | Same-size contact sheet at 1440 and 390; shared lighting, palette, texture and appropriate detail density |
| N06 | Make Kaohsiung recognizable and truthful | Researched | Correct landmark silhouettes; no London objects or unsupported historical scenery; geography stylized explicitly |
| N07 | Verify redesign and gameplay | Fix passed 78 tests; final rerun ongoing | Fresh build/check/test; all eight stages and touch/keyboard/fullscreen/escape; reduced motion; screenshots at 320/390/820/1440 |
| N08 | Record and release follow-up | Pending | BUILD entry, quality/source records, PR and successful CI before merge, deployment review |

### Initial layout audit, based on current CSS

These are concrete review targets, not claims from new screenshots:

1. Three cascading style layers (`prototype.css`, `production.css`,
   `editorial.css`) repeatedly redefine the same roles. Hero intro uses 14px on
   mobile while ordinary body remains 17px; captions vary 12–14px and process
   prose 15–16px. Define semantic sizes instead of per-component exceptions.
2. Section padding can be 110–260px (`.band`), case beats 64px mobile or
   80–144px desktop, with another 88–168px chapter margin. Check compounded
   gaps at chapter-to-first-beat boundaries rather than adding space globally.
3. Full-width case evidence shares the first grid row with a label; decision
   maps receive a special 64px first-child patch. Give labels and full-width
   evidence explicit layout areas so the fix applies to every artifact type.
4. Diagram styles use 18/20/24/28px padding and 14px/16px/24px text roles;
   persona/journey/decision content differs from older flow/matrix components.
   Align analogous headings, labels, card interiors and caption spacing.
5. At 1100px the hero and case content flatten, while several other elements
   wait until 760px. Review 820px composition deliberately: short reading
   measures and narrow hero media can leave unexplained unused width.
6. Build and 404 pages use local type/margin styles outside the case system.
   Include them, header/footer and case-contents navigation in the same audit.

### Game visual and factual acceptance

- Compare cover, map and the first ten seconds at the same rendered size.
  Share warm peach/cream/teal light and richer layered scenery; preserve clear
  player, enemy, pickup and collision-surface silhouettes.
- Inspect start, middle and end of a stage. The repeating far layer must not
  create repeated landmark towers or obvious water/sky seams.
- Keep Taiwan/London map positions and its not-to-scale qualification. Improve
  terrain/water/detail rendering without inventing geography.
- Use an identifiable 85 Tower silhouette rather than the current gate-like
  form. If the finish represents Cihou Lighthouse, use its white octagonal body
  and black dome/balcony, not generic red stripes.
- Stage 1 says “Growing up.” Kaohsiung Music Center opened in 2021; a modern
  waterfront montage must not imply a literal childhood view. Either use
  period-compatible scenery or clearly qualify contemporary stylization.
- The cover combines the career journey and must not claim a single actual
  Kaohsiung viewpoint. No London wheel/clock in the Kaohsiung stage.
- Asset loading/fallback, reduced motion and all controls remain functional.

Official scenery references:
[85 Tower](https://eng.taiwan.net.tw/m1.aspx?id=5355&sno=0002016),
[Cihou Lighthouse](https://khh.travel/en/attractions/detail/410/),
[Music Center](https://khh.travel/en/attractions/detail/1180/),
[Music Center 2021 opening](https://kpmc.com.tw/newslist/1026/),
[Great Harbor Bridge](https://eng.taiwan.net.tw/m1.aspx?id=A12-00465&sNo=0002121).
These support original stylized art, not a claim that a composite is a
photographically exact waterfront view.

### PR 23 release finding

Read directly from GitHub on 10 October: PR 23 merged at 14:13:50 UTC with
commit `cee77890674a98ceb06070893aa309275784c0d1`. Vercel status and links passed;
`build-test` failed at 14:17:32 UTC, after merge. Run
[38058770961](https://github.com/shannonhecker/shannonhecker-protofolio-review/actions/runs/38058770961)
reported **75 passed, 2 failed, 1 flaky**. Failures: touch buttons leave the game
paused (`controls.spec.ts:65`); every-world mission setup never becomes grounded
(`game.spec.ts:143`). Enemy landing was flaky at the same grounded setup.
Main subsequently identified and fixed transient fullscreen intersection
observations, including false/true batches. The observer now uses the latest
entry and restores only its own pause; touch explicitly resumes. Eighteen
focused checks passed across three repeats and the full 78 passed locally.
A final full rerun is ongoing after a minor image CSS correction. These local
results must not be presented as successful GitHub CI. A successful Vercel status alone does not prove a
fresh production route-by-route inspection.


### Confirmed adventure direction and production status

- Scroll through soft illustrated chapters in cream, peach, rose and sky blue.
  The game remains optional, with clear navigation.
- Use friendly readable headings/body; pixel lettering only for small labels.
  Current type feels too heavy and tight: lighten hierarchy, loosen tracking
  and provide comfortable leading without adding bulk.
- One shared world, distinct project settings/accents, all four equally prominent.
  Each case stays a readable continuous page with a sticky chapter index.
- The supplied avatar travels with scroll and changes outfits/props by chapter,
  preserving identity. Gentle ambient scenery and short interaction feedback
  complement her; reduced motion uses static placements.
- Image containers follow intrinsic proportions. No fixed-ratio boxes,
  accidental empty bands, inherited zoom or cropping.
- Higgsfield Kaohsiung job `24a07ecc-0765-488d-8789-7a547bcf854a` produced
  `/private/tmp/portfolio-review/kaohsiung-adventure.png`. The active UI/assets are now implemented locally but unvalidated. Review
  geographic truthfulness and cover/map/gameplay cohesion and final provenance.
- External 12ui transfer is authorized; seven-route captures are settled.
  Shannon chose local review, so account connection is no longer a blocker.
  Active UI/assets are implemented but not yet validated; do not claim a
  completed or approved redesign.


### Official Revolut brief, all four cases

Shannon supplied Glenn's official brief and requires every point on every
product page. `REVOLUT-CHECKLIST.md` records the faithful requirements, current
per-case evidence, factual gaps and final submission gates. This supersedes the
previous limitation that no official brief was supplied. Personas/journeys are
helpful but cannot substitute for tested alternatives, complete UI states and
measured product impact. Alpha/beta/rebuild qualifications remain mandatory.

| ID | Task | State | Acceptance |
|---|---|---|---|
| N09 | Official brief coverage on every case | Matrix complete; gaps open | Each requirement discoverable on every page, with factual limitations retained |
| N10 | Source missing test/outcome evidence | User evidence needed | Fusion audit/impact, FX/Fusion test details, Winking usage, uoaui alpha validation; no invented KPIs |
| N11 | Validate active adventure UI/assets | Full 78 passed; performance/release pending | Full responsive visual, accessibility and game checks plus fresh build/tests/CI |


Source recovery update: authorized saved-chat audit screened original user
assertions in portfolio/FX Claude logs and project-relevant Codex messages.
It found FX discovery reasoning and additional Figma source pointers, but no
new measured KPI/test participant evidence. Fresh Figma corroboration and exact
conversation provenance are in `REVOLUT-CHECKLIST.md`. N10 remains open; do not
reuse Data Manager's two-analyst study for Fusion Analytics.


Latest verification update: active UI/assets and expanded case navigation are
implemented. Astro check reports 69 files and zero diagnostics. First current
suite: 73 passed, five failed (four navigation-distance expectations and 320px
hero overflow); fixes are building and final validation is pending. uoaui now
has an explicit outcome/validation section without metrics; Fusion adds sourced
pre-Fusion UITK context. No follow-up release has occurred.


Latest game integration update: all eight illustrated stage WebPs are active in
`public/game`, lazy-loaded per stage. Seven new job IDs and the reused Kaohsiung
source are recorded in `MEDIA-SOURCES.md`. Main viewed all images; settings are
stylized rather than literal historical campus/office records. Rendering now
uses a 960px backing canvas with 480px logical HUD, non-repeated scenery and
lighter ground; physics is unchanged.

Fresh build: eight routes. Astro check: 70 files, zero diagnostics. Latest full
suite: **77 passed, one enemy-landing timing failure**. All layout and axe checks
passed, resolving the earlier five-failure run. Main is investigating the enemy
check. Final game validation and release CI remain open; no release is claimed.


Current release checkpoint: the enemy-landing check now waits for the approach
and makes a deliberate jump, using read-only enemy positions. Three targeted
repeats passed; physics is unchanged. The full suite then passed **78/78 in
42.4 seconds** (`/private/tmp/portfolio-review/adventure-release-tests.log`).
Build remains eight routes and check 70 files with zero diagnostics. Layout and
axe checks pass. Performance review and release CI are the remaining technical
gates; no deployment of this follow-up is claimed.

Shannon reconfirmed that Fusion's accessibility specialist joined from the
start; the contradictory reflection was removed. Four-case labelling is
corrected. BUILD entry 26 now describes the complete adventure direction,
source-backed content and validation, rather than only the startup hotfix.


Performance checkpoint: the first adventure Lighthouse pass scored FX and
uoaui mobile performance at 94, below the 95 gate; all their other categories
were 100. Optional desktop GSAP scroll effects are being deferred until first
scroll to reduce startup JavaScript. A new Lighthouse run is active. The latest
full suite remains 78 passed, but performance changes require appropriate
verification before release. Do not treat the earlier pass's 95–98 scores as
measurements of the current redesign.


Brand scope update: Shannon requests explicit end-to-end brand/logo/design-system
ownership for Winking Star and uoaui.ai. `BRAND-SOURCES.md` records the old-site
public/local source audit, reusable original artifacts, palette/typography
context and contradictions. Main is inspecting current product tokens and
implementing brand sections. Five-family research, old exact contrast ratios,
web parity and uoaui three-day/five-phase claims remain unverified and must not
be imported as new facts. Validation of the new sections remains pending.


Brand implementation checkpoint: BrandSystem and BrandMark are present on both
cases/work entries. Original uoaui lockup and 1024px Winking icon are sourced;
current palettes/type/spacing tokens and the fresh 1600×1100 uoaui house-system
capture are recorded in MEDIA-SOURCES and BRAND-SOURCES. The previous 78-test
result predates these newest additions; final validation remains pending.


## Release checkpoint, 10 October 16:35

The complete visual/brand pass builds eight routes, checks 73 files with zero
diagnostics, and passes all 78 tests in 42.0 seconds. Ten current Lighthouse
runs meet the 95-point gate; see QUALITY.md and quality-results.json. Local
visual inspection includes all eight game stages and both brand sections.
PR/CI/deployment verification is next. Earlier pending-test notes above are
historical checkpoints, superseded by this one.

Next requested feature, after this release: public end-of-game scores with
optional nicknames; detailed visit, play and per-level statistics private to
Shannon. No database or environment variables are connected to this portfolio
project yet. Shared storage and secure private access must be implemented and
verified; browser-local counters must not be presented as global visitors.
