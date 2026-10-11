# Portfolio completion checklist

Current audit: 11 October 2026. This is the active checklist; older TASKS.md and
QUALITY.md entries describe historical releases, not proof of current completion.

Status definitions: **Live, recheck** means the build log records delivery but a
fresh final audit is still required. **Local** is not deployed. **Open** requires
work. Completion requires the source, rendered result and deployed result to agree.

## Shared layout and interaction

| Request | Status | Evidence / remaining check |
|---|---|---|
| Keep case sections visible; remove content accordions, including Read the flow and data layers | Live, recheck | Shared authored components; verify all five routes, keyboard and no-JS |
| Maintain consistent two-column case layout | Live, recheck | Case templates; inspect nested rows and product sections at 1440/820/390/320px |
| Reduce oversized or blurry screenshots; preserve full content | Live, recheck | Pic/ProductCapture, Figma source mappings; compare source and rendered dimensions |
| Remove redundant capture metadata, View full size and live-link caption bars | Live, recheck | ProductCapture; audit every case for remaining unwanted caption bars |
| Align Project status with surrounding content | Live, recheck | FX status row; inspect desktop and mobile |
| Put workflow rules above steps; align arrows with title row | Live, recheck | Flow and shared CSS; verify all variants |
| Remove vertical colour bars from journey phases; increase separation | Live, recheck | AuthoredJourney and FxOriginalJourney; recheck after new journey work |
| Tighten all persona typography to match site, keep updated colours/art | Local | PersonaCard and AuthoredPersonas; desktop/mobile reviewed, publish pending |
| Match latest supplied persona template across all 15 web personas and 30 Figma cards | New local implementation; review open | Latest user reference supersedes prior persona-layout completion. Preserve supplied image priorities and project colour variants; do not invent technical ratings, research attributes or participant facts. Web revision is uncommitted; rendered review and Figma mirroring underway. |
| One accent per persona, white base, clean portrait cutouts | New local implementation; assets pending | Latest direction replaces mixed pastel surfaces: white identity/content, one accent hue with a 12% derived portrait tint. Remove baked image backgrounds, do not use multiply blending to disguise them. Four opaque Deal portraits require cutouts; inspect all 15 portraits and 30 Figma cards before release. |
| Self-inspect craft to the requested awards-level benchmark | Open | No external award claim; complete visual, responsive, accessibility, motion and source audit |

## Assets and project content

| Request | Status | Evidence / remaining check |
|---|---|---|
| FX exact supplied data-layer SVG, no recreation | Live, recheck | public/art/fx-data-layers.svg and original source node 305:336356 |
| FX exact journey artwork, readable persona/scenario/stage text | Live; revision open | Original SVG retained; new product-specific journey research requested |
| FX decision loop transparent surrounding background | Live, recheck | Inspect source/export and rendered surface |
| FX comparison cards: remove extra image padding/background | Live, recheck | AuthoredDecisions and figma-sync browser checks |
| FX latest screenshots, comparison graphics and persona backgrounds | Live, recheck | docs/figma-fx-screenshot-sync.json; compare current Figma fills |
| FX screenshots without hard outlines/duplicate shadows; remove video top line | Live, recheck | ProductCapture and video styles, inspect all lower captures |
| FX overlap chart/compare/ticket with transparent foreground SVG panels | Live, recheck | Original exported vectors; keep real vectors, do not wrap raster for false sharpness |
| FX responsive screenshot padding | Live, recheck | Responsive capture group |
| Home latest Figma images/graphics | Live, recheck | Compare current home Figma to deployed gallery |
| Fusion updated screen graphics, M3/M1 originals | Partly live, local remainder | Five vector exports live; opening Performance selection and portraits local |
| uoaui.ai latest images/graphics | Live, recheck | Prior PR48 and source mapping; preserve current art |
| Winking Star current web/app screens and original artwork | Local | Original web components with fictional sample data; Figma iPhone screens, source asset inventory |
| Winking Star rethink workflow and product content; compare web/app | Local | CaseWinking and WinkingScreens; further journey revision requested |
| Find original code for Winking images | Located | weekly-superstar-tracker, weekly-superstar-ios, weekly-superstar-shared; 339 image inventory entries |
| Deal Model newly updated portfolio images | Open | Portfolio file frame 233:460, page 230:592; newly supplied on this turn |
| Deal Model original project review | Open | MhZ5D5sh8DZgOTYdLXX8It, node 0:1; inspect stages and image evidence |
| Deal Model repair broken Figma graphics using live site | Earlier repair, recheck | Six pairs repaired previously; compare new art before any edits |

## Source-to-claim and graphic audit: required for every project

Map each material claim and graphic to its original source, the relevant current
implementation state and the rendered case. Record source revision/node,
implemented behavior, differences, and the resulting correction or **unverified**
status. Figma depicts design intent; a public rebuild does not independently
prove the original production implementation. Visual consistency alone is not
completion of this audit.

| Project | Required cross-reference | Current status / evidence limits |
|---|---|---|
| FX | Original Figma UI/journey/data-layer nodes, current public rebuild code and UI, case narrative and graphics | Open final audit. NDA prohibits real internal screens. Confirm beta status and label rebuilds; do not infer internal usage/KPIs from a public rebuild. |
| Fusion | Original Fusion design and portfolio nodes, current dashboard rebuild/source, historical production narrative and exact graphics | Open final audit. Screen-sync mappings do not validate every production claim. Preserve original versus rebuild distinctions and specialist-from-start chronology. |
| uoaui.ai | Current builder/UI Kit implementation, original design/brand sources, portfolio mappings and claimed generation/inspection workflow | Open final audit. Private alpha; proposed validation and desired outcomes are not measured adoption or shipped client outcomes. |
| Winking Star | Web/iOS revisions, shared domain/tokens, platform flows, Figma screens, assets and case statements | Partial source audit in `WINKING-SOURCES.md`; full claim/graphic reconciliation open. Component captures with sample data do not prove live sync; web setup differs from iPhone Sample Family entry. |
| Deal Model | Updated portfolio frame `233:460`, original file `MhZ5D5sh8DZgOTYdLXX8It` node `0:1`, actual implementation/public source where available, case claims/graphics | Root inspecting original source. Claims not yet traced remain unverified; previously repaired images do not complete this audit. |

Close each row only when discrepancies are resolved or explicitly labelled,
including unsupported research counts, behavior, statuses, dates and impact
claims. Keep private source details in audit notes rather than public case copy.

## Distinct journeys: latest direction

Shared type and spacing remain consistent. The five journeys must communicate
different work, not repeat one emotion chart and phase-card template. Keep exact
original graphics as source material. Do not invent observations or measured emotions.

| Project | Proposed structure grounded in existing case | Status |
|---|---|---|
| FX | Order lifecycle with monitor/intervene/return loop and post-trade evidence | Research started; implementation open |
| Fusion | Data selection, analysis/refinement, presentation and reuse | Research started; implementation open |
| uoaui.ai | Designer/system exchanges with correction and inspection loops | Research started; implementation open |
| Winking Star | Parent/child/caregiver handoffs across first use, daily and weekly loops | Source reviewed; implementation open |
| Deal Model | Shared deal object, pricing iterations, approval gate and return path | Original-source inspection underway |

Latest checkpoint: journey agent reports distinct layouts implemented locally;
root visual/source inspection is pending. This is not yet acceptance or release
of the five journey rows above.

## Decision maps: additional required detail

All five projects need substantive, project-specific decision maps. The current
maps do not yet satisfy the user's request for detail. The voice-review agent
owns `AuthoredDecisions`, `decision-evidence.json` and `DECISION-AUDIT` work.

For each decision, identify the actual problem/constraint, alternatives,
supporting source or testing, choice and rationale, consequences/tradeoff, and
implementation status. Show real branches and return paths where supported.
Mark absent evidence unverified; do not turn plausible alternatives into
historical claims. Root review, responsive rendering and release remain open.

Specific source correction: Deal Model's original source describes an
owner-written description. An automatic summary is not supported by that source;
verify implementation separately before retaining any auto-summary claim.

Root source checkpoint: Deal pricing nodes `1:19575` and `1:19659` support
iteration-creation success/error, an empty iteration and SK/TXN rate mismatch.
Local edge/validation copy now removes unsupported 15%-Tier-B legal routing,
missing-rate-card blocking and unmapped-column blocking. CaseDeal labels the
explanatory text as a summary rather than claiming a same-words redraw. Broader
authored-content/source-art reconciliation and final rendered checks remain open.

## Figma, game and voice

| Request | Status | Evidence / remaining check |
|---|---|---|
| Fix Figma padding and gaps after content sync, preserve updated graphics | Open final pass | uoaui spacing previously repaired; audit all desktop/mobile frames and exact asset fills |
| Sync readable journey treatment across projects in Figma | Earlier pass live; new revision open | Latest distinct-journey brief supersedes generic shared presentation |
| Mobile fullscreen game map fills available space with readable details | Live, recheck | Re-run real fullscreen/map interaction at phone sizes; source/test evidence required |
| Interview voice/content review from eight LSEG prep files | Reviewed; correction verification open | `VOICE-REVIEW.md` records scoped findings; root applying corrections. Private reference only, never publish prep text wholesale |
| Verify entire site after edits | Open | Production build, Astro check, full browser suite, desktop/mobile inspection, links/assets and current release gates |
| Publish and verify live | Open | Current branch design/winking-product-refresh is not deployed |

## Current verification

**Hold PR #49 merge:** the latest user-supplied persona template adds a new
revision after `2a2988d`. Test and push it, then verify that exact head's checks
before merging. Existing CI success, if obtained, will cover only the earlier
head until the persona changes are included. Fifteen website personas and thirty
desktop/mobile Figma cards need explicit template/overflow/source review.
The hold includes the latest single-accent treatment and four Deal portrait
cutouts now in progress. The Deal journey return label is locally corrected to
TXN/SK rate review, matching the original source rather than a generic tolerance
gate; include that revision in the final source/render check.

Persona/cutout checkpoint: root reports the final production build and **149
browser tests passed in 58.2s**. BUILD entry is updated. All thirty Figma cards,
their final upload/manifest and the independent visual check are still pending
before committing/pushing this revision. New-head CI remains required. Keep
authenticity/source-art reconciliation, raster/zoom readability, and real scroll
performance open until their final evidence is recorded.

Later checkpoint: all thirty Figma portraits are uploaded with the single-accent
white-base treatment, visually checked and recorded in the final manifest.
Independent review confirms FX phone composition and mobile fullscreen map
readability. Root removed 0.7s trailing parallax from product captures/hero media
while keeping text motion. A later full run had 148 passes and one responsive
image-decoding test race; the test now polls the current decoded source and the
full suite is rerunning. Five Deal raster source-art corrections remain queued.
This supersedes the earlier pending Figma upload status, but not the release hold.

Latest root release candidate: `2a2988d` created and being pushed to PR #49.
Local Astro check: 0 errors, 0 warnings, 4 unused-symbol hints. Production build
passes; full browser suite **149 passed in 59.9s**, including the new exports.
A subsequent small AI eyebrow simplification has a passing rebuild. New-head CI
and deployed review are not yet complete. Figma whole-page gaps, remaining Deal
illustrative baked-in claims, final sitewide craft and scroll performance remain
open; this checkpoint does not close the overall task.

GitHub verification: CI
[38184120959](https://github.com/shannonhecker/shannonhecker-protofolio-review/actions/runs/38184120959)
at exact head `2a2988d71e91b23c9c5003cb248b9afa5896d9a5` completed **success**,
including browser tests and all configured Lighthouse gates. Log saved to
`/private/tmp/pr49-2a2988d-ci.log`. This supersedes the older failed performance
checkpoint for this head, but does not validate the subsequent persona/cutout
revision or close the final manual craft/scroll/deployed reviews.

- Local branch: `design/winking-product-refresh`, based on `982ff55` (PR #48).
  Root reports commit `7d6c6bc` includes only the tested asset/persona changes.
  New journey and decision scope remains local and under review.
  [PR #49](https://github.com/shannonhecker/shannonhecker-protofolio-review/pull/49)
  covers the tested asset/persona checkpoint at `7d6c6bc`. Its CI run
  [38182499828](https://github.com/shannonhecker/shannonhecker-protofolio-review/actions/runs/38182499828)
  completed with build/check/API/browser/link gates passing, but FX mobile
  Lighthouse still **84**, LCP **4.510s**, TBT **0ms**. Other categories are 100.
  Root/Panel performance scores were 96–99; later cases were not measured because
  the gate stopped at FX. Artifact:
  `/private/tmp/portfolio-ci-pr49-38182499828/lh.json`.
  Later local changes are not included in that exact head yet.
- Astro check: root reports 0 errors, 0 warnings, 4 unused-symbol hints.
  Production build passes according to the root's current run.
- Previous browser run: 148 passed, 1 failed on a removed Winking carousel.
  The test now checks the visible iPhone flow and four screen figures with
  JavaScript disabled. The replacement run completed: **149 passed in 57.7s**,
  verified from `/private/tmp/portfolio-release-tests.log`. Later implementation
  changes require their own current checks.
- GitHub confirms PR #48 merged on 11 October at 22:25 UTC. Its main-branch
  CI run [38180336042](https://github.com/shannonhecker/shannonhecker-protofolio-review/actions/runs/38180336042)
  failed the Lighthouse gate: `/fx` mobile performance **84**, with the other
  three categories at 100. The required minimum is 95 per category. Root and
  Panel passed before the run stopped; later routes were not measured by that
  run. Merged is not proof of passing release gates or a verified deployment.
- Latest source audit confirms ten route files, including Deal Model. Final
  manual review must cover all ten; Lighthouse CI covers the seven main routes
  at both device presets. Check remaining utility routes manually.
- Release checks also include compiled API runtime, link CI and manual checks
  for bot-excluded App Store/LinkedIn links. Do not substitute browser test
  totals for these independent gates.

## PM completion blockers and closure evidence

1. Finish distinct product journeys and record source-to-diagram mappings for
   all five cases. Existing shared presentation is not acceptance of this new
   direction. Avoid inferred research participants, emotions or measured results.
2. Inspect the updated Deal Model portfolio frame `233:460` on page `230:592`
   and original file `MhZ5D5sh8DZgOTYdLXX8It`, node `0:1`, before deciding what
   artwork or narrative changes are needed. Prior repaired pairs are not proof
   that the newly supplied source has been incorporated.
3. Complete the eight-file private voice review below. All eight files were
   confirmed present locally; `VOICE-REVIEW.md` now contains the review.
   Verify each resulting correction against current source before closure. Publish only
   approved case corrections, never private prep files or interview transcripts.
4. Reconcile final Figma layout/asset states after content changes. Preserve
   independently updated original artwork; no blanket replacement of frames.
5. Finish the sitewide design review at the **back of the queue**, resolve its
   findings, then record final commit, checks, PR, deployment URL and production
   spot checks. The failed FX performance gate must be resolved, not waived by
   an earlier score or a merge.

Current evidence limits remain explicit: FX is beta and its screens are public
rebuilds; uoaui.ai is private alpha; Fusion production work is distinguished from
its public rebuild; Winking web component captures use fictional sample data
and do not prove backend sync. Keep unsupported KPI/testing counts open in the
Revolut evidence audit rather than inventing values to fill the checklist.

Local audit drafts now available: `JOURNEY-RESEARCH.md`, `DECISION-AUDIT.md` and
`VOICE-REVIEW.md`. Decision coverage is 21 choices (3 FX, 3 Fusion, 3 uoaui.ai,
6 Winking, 6 Deal). These documents explicitly require rendered/source/release
verification. Original image text still needs reconciliation where it claims
automatic Deal summaries, enforced AI export review, unmeasured timing or broad
behavioral conclusions; adjacent caveats do not make the source graphic verified.

Latest root checkpoint: 15 source-graphic exports corrected locally; actual Deal
owner/approver captures are being integrated. Root's latest browser run passed
149 tests in 57.1s before those final art changes. Rebuild/rerun after the new
assets remains required. No new commit or production result is implied here.

## Private voice-review queue

All located in `/Users/shannonhecker/Downloads/`:

- lseg-round-5-sai-speaker-notes.md
- lseg-round-5-sai-potukuchi-prep.md
- lseg-round-4-speaker-notes.md
- lseg-round-4-frank-higgs-prep.md
- lseg-round-3-speaker-notes.md
- lseg-round-3-jamie-coulson-prep.md
- lseg-round-2-paul-moreira-prep.md
- lseg-round-2-spoken-script.md

Check first-person tone, concrete design decisions, personal contribution,
collaboration, project chronology, shipped/beta/alpha status, and measured versus
estimated outcomes. Capture corrections without revealing private interview material.

## Final queue item: whole-site UI/UX design review

Added explicitly at Shannon's request, after asset sync, distinct journeys,
interview voice/content review and Figma repairs. Review every route as a designer,
not only as a test runner. Iterate on findings before closing delivery.

- Home/panel, FX, Fusion, uoaui.ai, Winking Star, Deal Model, build, privacy and 404.
- Shared type hierarchy, line lengths, spacing rhythm, section alignment and navigation.
- Individual project identity and appropriate journey structures within the shared system.
- Original media fidelity, useful image scale, transparent surrounds and consistent edges.
- Desktop, tablet and phone composition; no clipped content or unintended overflow.
- Light/dark themes, keyboard focus, contrast, reduced motion and no-JavaScript content.
- Mobile fullscreen game map readability and touch interaction.
- Real production routes and assets after deployment, plus current release checks.

Awwwards, Webby and FWA are the requested craft benchmark. No award, jury approval
or external validation is claimed. Keep this item open until recorded visual
inspection and release evidence cover all requirements and remaining defects.

## Final performance review: after content and design

Explicit latest feedback: images visibly lag while scrolling. Review actual
desktop and mobile scroll sessions across all product pages after the content
and design pass. Inspect image request timing, lazy-load distance, decoding,
SVG complexity, effects/shadows and scroll animation together. Preserve original
source quality, aspect ratios and required vector fidelity; do not hide the lag
by removing meaningful content or substituting blurry captures.

- Record visible late paints or blank media, request/decoding evidence and the
  before/after result at normal scrolling speeds and through section jumps.
- Check resource dependency/network queues, not just aggregate Lighthouse scores.
  Root's local FX baseline also scores 84 (LCP about 4.5s), but its simulated
  render-delay attribution differs markedly from the real trace (about 165ms).
  `/private/tmp/fx-current-lh.json` is the diagnostic reference. Filters and
  entrance effects are hypotheses, not an established root cause.
- Confirm the final commit meets the existing 95-category CI budget and retains
  responsive images, accessibility and reduced-motion behavior. Record deployed
  desktop/mobile spot checks separately from local results.

Status: **Open**. This sits after content/source corrections and the design review;
it must be completed before final release acceptance.

Local optimization checkpoint: exact-source hero dimensions/decoding and low
priority for secondary hero artwork improved FX mobile from 84 to 86 and LCP
from about 4.5s to 4.1s. This remains below the 95 gate; it is progress, not
acceptance or justification to weaken the budget.

Subsequent root checkpoint: SVG compaction at eight-decimal precision improved
FX mobile to 92, LCP about 3.2s. Hero compressed transfer fell from about 391KB
to 191KB; high-resolution render comparison mean difference was at most
0.00055/255. Data-layer SVG was separately compacted from about 125KB to 48KB
with zero pixel difference in the root's comparison. These retain vectors and
original geometry; no rasterization or redraw.

Latest local FX result: **95 mobile performance, LCP 2.7s** in
`/private/tmp/fx-final-vectors-lh.json`. Hero precision-three compaction retains
SVG, with root's high-resolution render mean channel difference below
0.005/255 at density 192; data-layer precision-eight output is pixel-identical.
The full batch check/build/browser rerun is active in
`/private/tmp/portfolio-final-*.log`. Updated PR CI and production verification
remain pending. The separate real desktop/mobile **scroll-performance review
remains open**; this local page-load result does not close it.
